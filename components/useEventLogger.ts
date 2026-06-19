import { useCallback } from "react";

export function useEventLogger() {
  const log = useCallback(async (event: {
    event: string;
    creativeId?: string;
    hookId?: string;
    campaignId?: string;
    source?: string;
    meta?: Record<string, unknown>;
  }) => {
    try {
      await fetch("/api/event", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(event),
      });
    } catch {
      // Best-effort logging only.
    }
  }, []);

  return { log };
}