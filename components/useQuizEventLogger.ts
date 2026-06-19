import { useCallback } from "react";

export function useQuizEventLogger() {
  const log = useCallback(async (event: {
    event: string;
    quizId?: string;
    questionId?: string;
    answerId?: string;
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