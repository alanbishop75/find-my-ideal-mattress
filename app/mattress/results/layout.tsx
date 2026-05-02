import type { Metadata } from 'next';

// Results are session-specific (generated from user quiz answers) and
// must not be indexed. Each user gets a different result set.
export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  robots: { index: false, follow: true },
};

export default function MattressResultsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
