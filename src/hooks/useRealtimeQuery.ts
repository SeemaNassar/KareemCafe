"use client";

import { useEffect, useRef, useState } from "react";
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

const CACHE_TTL_MS = 60_000;

function notify(table: string) {
  subscribers.get(table)?.forEach((cb) => cb());
}

function subscribe(table: string, cb: () => void) {
  if (!subscribers.has(table)) subscribers.set(table, new Set());
  subscribers.get(table)!.add(cb);
  return () => subscribers.get(table)?.delete(cb);
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
  const [loading, setLoading] = useState<boolean>(
    () => !cache.has(table)
  );

  const fetcherRef = useRef(fetcher);
  fetcherRef.current = fetcher;

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

    const channel = supabase
      .channel(`realtime-${table}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table },
        () => void run()
      )
      .subscribe();

    return () => {
      cancelled = true;
      unsubscribe();
      supabase.removeChannel(channel);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return { data, error, loading };
}
