import type { NextApiRequest, NextApiResponse } from "next";
import type { Region } from "../../core/geo/types";

export function resolveRegionFromCountry(rawCountry: string | null): Region {
  if (rawCountry === "US") return "US";
  if (rawCountry === "GB" || rawCountry === "UK") return "UK";
  return "UK";
}

interface GeoRegionResponse {
  region: Region;
  /** ISO 3166-1 alpha-2 country code detected from the request, or null if unavailable. */
  detectedCountry: string | null;
}

/**
 * GET /api/geo-region
 *
 * Returns the resolved display region (UK or US) for the requesting visitor.
 *
 * On Vercel, the `x-vercel-ip-country` header contains the ISO 3166-1
 * alpha-2 country code injected at the edge.  On other platforms (local dev,
 * non-Vercel hosts) the header will be absent and the response will fall back
 * to "UK".
 *
 * Region resolution rules:
 *   US        → US
 *   GB        → UK
 *   anything else (or missing header) → UK  (safe default for this site)
 *
 * This endpoint is intentionally GET-only and cache-friendly.
 */
export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<GeoRegionResponse>
) {
  if (req.method !== "GET") {
    res.status(405).end();
    return;
  }

  const countryHeader = req.headers["x-vercel-ip-country"];
  const rawCountry =
    typeof countryHeader === "string" ? countryHeader.toUpperCase() : null;

  const region = resolveRegionFromCountry(rawCountry);

  // Cache at the CDN edge for 1 hour — the country changes only on new
  // requests from different IPs, so this is safe and avoids per-request cost.
  res.setHeader("Cache-Control", "public, max-age=3600, s-maxage=3600");
  res.setHeader("Vary", "x-vercel-ip-country");
  res.status(200).json({ region, detectedCountry: rawCountry });
}
