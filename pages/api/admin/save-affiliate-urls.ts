/**
 * pages/api/admin/save-affiliate-urls.ts
 *
 * Writes SiteStripe-tagged affiliate URLs directly into
 * config/pillow/buy-links.ts — replacing ukLink("ASIN") entries with
 * affiliateLink("URL", "ASIN") for each product ID supplied.
 *
 * Protected automatically by middleware (all /api/admin/* routes require
 * the fmi_admin cookie).
 */
import type { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import path from "path";

function escapeRegex(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end();

  const { urls } = req.body as { urls?: unknown };

  if (
    !urls ||
    typeof urls !== "object" ||
    Array.isArray(urls)
  ) {
    return res.status(400).json({ error: "urls must be a non-empty object" });
  }

  const urlMap = urls as Record<string, string>;

  // Validate that all values are strings and look like URLs
  for (const [id, url] of Object.entries(urlMap)) {
    if (typeof url !== "string") {
      return res.status(400).json({ error: `Value for "${id}" must be a string` });
    }
    if (url.trim().length > 0 && !url.startsWith("https://")) {
      return res.status(400).json({ error: `URL for "${id}" must start with https://` });
    }
  }

  const filePath = path.resolve(process.cwd(), "config/pillow/buy-links.ts");
  let source: string;

  try {
    source = fs.readFileSync(filePath, "utf8");
  } catch {
    return res.status(500).json({ error: "Could not read buy-links.ts" });
  }

  const updated: string[] = [];
  const skipped: string[] = [];
  const alreadyAffiliate: string[] = [];

  for (const [productId, rawUrl] of Object.entries(urlMap)) {
    const url = rawUrl.trim();
    if (!url) continue;

    const escapedId = escapeRegex(productId);

    // Match: "product-id": ukLink("ASIN"),
    const ukLinkRegex = new RegExp(
      `("${escapedId}":\\s*)ukLink\\("([^"]+)"\\)`,
      "g"
    );

    // Already converted to affiliateLink — skip silently
    const alreadyRegex = new RegExp(
      `"${escapedId}":\\s*affiliateLink\\(`,
      "g"
    );

    if (alreadyRegex.test(source)) {
      alreadyAffiliate.push(productId);
      continue;
    }

    if (!ukLinkRegex.test(source)) {
      skipped.push(productId);
      continue;
    }

    // Reset lastIndex after test()
    ukLinkRegex.lastIndex = 0;

    source = source.replace(ukLinkRegex, (_match, prefix, asin) => {
      return `${prefix}affiliateLink("${url}", "${asin}")`;
    });

    updated.push(productId);
  }

  if (updated.length === 0) {
    // Nothing to write — return early without touching the file
    return res.status(200).json({ ok: true, updated, skipped, alreadyAffiliate, message: "No changes made" });
  }

  try {
    fs.writeFileSync(filePath, source, "utf8");
  } catch {
    return res.status(500).json({ error: "Could not write buy-links.ts" });
  }

  return res.status(200).json({ ok: true, updated, skipped, alreadyAffiliate });
}
