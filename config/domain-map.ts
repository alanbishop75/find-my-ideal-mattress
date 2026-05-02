/**
 * Maps production hostnames to the product ID for this site.
 * This is a single-product site — only mattress domains are mapped here.
 */
export const domainCategoryMap: Record<string, string> = {
  'findmyidealmattress.com':     'mattress',
  'www.findmyidealmattress.com': 'mattress',
};

export const defaultCategoryId = 'mattress';

/** Returns true for local/dev hosts — URL rewrites are skipped in dev. */
export function isLocalHost(host: string): boolean {
  return (
    host.startsWith('localhost') ||
    host.startsWith('127.0.0.1') ||
    host.startsWith('0.0.0.0')
  );
}

/** Resolve a category ID from a Host header value. Falls back to the default. */
export function categoryFromHost(host: string | null): string {
  if (!host) return defaultCategoryId;
  return domainCategoryMap[host] ?? defaultCategoryId;
}
