import type { Metadata } from 'next';
import { categoryRegistry } from '../../../config/registry';

interface Props {
  params: Promise<{ category: string }>;
  children: React.ReactNode;
}

export async function generateMetadata({ params }: { params: Promise<{ category: string }> }): Promise<Metadata> {
  const { category } = await params;
  const config = categoryRegistry[category];
  if (!config) return {};
  return {
    title: config.meta.title,
    description: config.meta.description,
  };
}

export default async function ResultsLayout({ children }: Props) {
  return <>{children}</>;
}
