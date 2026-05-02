"use client";
import { Providers } from "./client-providers";
import { ErrorBoundary } from "../components/ErrorBoundary";
import React from "react";

export default function ClientRoot({ children }: { children: React.ReactNode }) {
  return (
    <ErrorBoundary>
      <Providers>{children}</Providers>
    </ErrorBoundary>
  );
}
