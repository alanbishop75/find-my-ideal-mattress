export function getRequiredSiteUrl(): string {
  const configuredUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (!configuredUrl) {
    throw new Error(
      "Missing NEXT_PUBLIC_SITE_URL. Configure it in your environment before running this app.",
    );
  }
  return configuredUrl.replace(/\/$/, "");
}
