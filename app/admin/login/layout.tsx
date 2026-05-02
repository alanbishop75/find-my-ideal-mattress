import type { Metadata } from 'next';

export const metadata: Metadata = {
  robots: { index: false, follow: false },
  alternates: {
    canonical: '/admin/login',
  },
};

export default function AdminLoginLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
