"use client";

import { useState } from "react";
import { QuizAbandonContext } from "./QuizAbandonContext";

export function QuizAbandonProvider({ children }: { children: React.ReactNode }) {
  const [abandonQuiz, setAbandonQuiz] = useState<(() => void) | null>(null);

  return (
    <QuizAbandonContext.Provider value={{ abandonQuiz, setAbandonQuiz }}>
      {children}
    </QuizAbandonContext.Provider>
  );
}