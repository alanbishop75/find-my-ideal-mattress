"use client";
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { useTheme } from '../core/theme';
import globalThemeConfig from '../config/global-theme.json';
import { RegionProvider } from '../core/geo/RegionContext';

export type Answers = Record<string, string>;

interface AppState {
  answers: Answers;
  setAnswer: (questionId: string, answerId: string) => void;
  reset: () => void;
  theme: string;
  questionnaireVersion: string;
  setQuestionnaireVersion: (version: string) => void;
}

const AppContext = createContext<AppState | undefined>(undefined);

export function useAppState() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useAppState must be used within AppProvider');
  return ctx;
}

function ThemeWrapper({ children }: { children: ReactNode }) {
  const { tokens } = useTheme();
  return (
    <div style={{
      background: tokens.background,
      color: tokens.textPrimary,
      width: '100%',
      transition: 'background 0.2s, color 0.2s',
    }}>
      {children}
    </div>
  );
}

export function Providers({ children }: { children: ReactNode }) {
  const [answers, setAnswers] = useState<Answers>({});
  const [questionnaireVersion, setQuestionnaireVersion] = useState('1.0');

  // Support both old { "theme": "..." } and new { "themes": { "default": "..." } } formats
  const config = globalThemeConfig as { themes?: Record<string, string>; theme?: string };
  const theme = config.themes?.default ?? config.theme ?? 'white';

  const setAnswer = (questionId: string, answerId: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: answerId }));
  };
  const reset = () => setAnswers({});

  return (
    <RegionProvider>
      <AppContext.Provider value={{ answers, setAnswer, reset, theme, questionnaireVersion, setQuestionnaireVersion }}>
        <ThemeWrapper>{children}</ThemeWrapper>
      </AppContext.Provider>
    </RegionProvider>
  );
}

