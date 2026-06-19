"use client";

import { createContext, useContext } from "react";

export interface QuizAbandonContextType {
  abandonQuiz: (() => void) | null;
  setAbandonQuiz: (fn: (() => void) | null) => void;
}

export const QuizAbandonContext = createContext<QuizAbandonContextType>({
  abandonQuiz: null,
  setAbandonQuiz: () => {},
});

export function useQuizAbandon() {
  return useContext(QuizAbandonContext);
}