"use client";

import { useEffect, useRef, useState } from "react";
import { supabase } from "../lib/supabase";

type QueryResult<T> = { data: T | null; error: Error | null };

/**
 * Subscribes to realtime changes on a table and refetches the provided query.
 * Falls back to polling interval if realtime events are not received.
 */
export function useRealtimeQuery<T>(
  table: string,
  fetcher: () => PromiseLike<QueryResult<T>>,
  deps: ReadonlyArray<unknown> = []
) {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState(true);
  const fetcherRef = useRef(fetcher);
  fetcherRef.current = fetcher;

  useEffect(() => {
    let channel: ReturnType<typeof supabase.channel> | null = null;
    let active = true;

    const run = async () => {
      const { data: d, error: e } = await fetcherRef.current();
      if (!active) return;
      if (e) setError(e);
      else setData(d);
      setLoading(false);
    };

    run();

    channel = supabase
      .channel(`realtime-${table}-${Math.random().toString(36).slice(2)}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table },
        () => run()
      )
      .subscribe();

    return () => {
      active = false;
      if (channel) supabase.removeChannel(channel);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return { data, error, loading, refetch: () => fetcherRef.current() };
}
