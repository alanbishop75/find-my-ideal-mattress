"use client";
import { Providers } from '../client-providers';
import { ErrorBoundary } from '../../components/ErrorBoundary';

export default function WithProvidersLayout({ children }: { children: React.ReactNode }) {
  return (
    <ErrorBoundary>
      <Providers>{children}</Providers>
    </ErrorBoundary>
  );
}
