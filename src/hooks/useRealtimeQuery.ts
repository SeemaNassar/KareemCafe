"use client";

import { useEffect, useRef, useState } from "react";
import type { RealtimeChannel } from "@supabase/supabase-js";
import { supabase } from "../lib/supabase-browser";
import type { QueryResult } from "../types";

/**
 * Per-table in-memory cache shared across hook instances in the same tab.
 * Avoids redundant initial fetches when multiple components query the same
 * table and lets realtime updates hydrate all subscribers at once.
 */
type CacheEntry<T> = { data: T | null; ts: number };
const cache = new Map<string, CacheEntry<unknown>>();
const subscribers = new Map<string, Set<() => void>>();

/**
 * Per-table realtime channels, created once and shared across all hook
 * instances. A single channel per table avoids the Supabase error
 * "cannot add postgres_changes callbacks after subscribe()" that occurs when
 * a cached channel is re-subscribed during React's Strict Mode remount cycle.
 */
const channels = new Map<string, RealtimeChannel>();
const channelRefCount = new Map<string, number>();

const CACHE_TTL_MS = 60_000;

function notify(table: string) {
  subscribers.get(table)?.forEach((cb) => cb());
}

function subscribe(table: string, cb: () => void) {
  if (!subscribers.has(table)) subscribers.set(table, new Set());
  subscribers.get(table)!.add(cb);
  return () => subscribers.get(table)?.delete(cb);
}

/**
 * Acquire the single shared realtime channel for a table. The channel is
 * created with .on() BEFORE .subscribe() (required by Supabase), and kept
 * alive via refcount so it is only removed when the last subscriber leaves.
 */
function acquireChannel(
  table: string,
  onInvalidation: () => void
): RealtimeChannel {
  let channel = channels.get(table);
  if (!channel) {
    channel = supabase
      .channel(`realtime-${table}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table },
        () => onInvalidation()
      )
      .subscribe();
    channels.set(table, channel);
  }
  channelRefCount.set(table, (channelRefCount.get(table) ?? 0) + 1);
  return channel;
}

function releaseChannel(table: string) {
  const next = (channelRefCount.get(table) ?? 1) - 1;
  channelRefCount.set(table, next);
  if (next <= 0) {
    const channel = channels.get(table);
    if (channel) {
      supabase.removeChannel(channel);
      channels.delete(table);
    }
    channelRefCount.delete(table);
  }
}

export function useRealtimeQuery<T>(
  table: string,
  fetcher: () => PromiseLike<QueryResult<T>>,
  deps: ReadonlyArray<unknown> = []
) {
  const [data, setData] = useState<T | null>(() => {
    const cached = cache.get(table) as CacheEntry<T> | undefined;
    return cached?.data ?? null;
  });
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState<boolean>(() => !cache.has(table));

  const fetcherRef = useRef(fetcher);
  fetcherRef.current = fetcher;

  const tableRef = useRef(table);
  tableRef.current = table;

  useEffect(() => {
    let cancelled = false;
    const now = Date.now();
    const cached = cache.get(table) as CacheEntry<T> | undefined;
    const fresh = cached && now - cached.ts < CACHE_TTL_MS;

    const run = async () => {
      const { data: d, error: e } = await fetcherRef.current();
      if (cancelled) return;
      cache.set(table, { data: d, ts: Date.now() });
      setData(d);
      setError(e ?? null);
      setLoading(false);
      notify(table);
    };

    if (!fresh) void run();

    const unsubscribe = subscribe(table, () => {
      const entry = cache.get(table) as CacheEntry<T> | undefined;
      if (entry) {
        setData(entry.data);
        setLoading(false);
      }
    });

    // Acquire the shared per-table channel. Its onInvalidation callback
    // refetches to pick up the change; the shared cache + notify() then
    // hydrate every other component instance subscribed to this table.
    const channel = acquireChannel(tableRef.current, () => void run());

    return () => {
      cancelled = true;
      unsubscribe();
      releaseChannel(tableRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return { data, error, loading };
}
