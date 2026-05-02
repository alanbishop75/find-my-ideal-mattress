/**
 * pages/api/admin/get-affiliate-urls.ts
 *
 * Returns a map of { productId: affiliateUrl } for every entry in
 * config/pillow/buy-links.ts that has already been converted to
 * affiliateLink(...).  Used by the admin audit page to pre-populate
 * inputs from the source file rather than relying on localStorage.
 */
import type { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import path from "path";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") return res.status(405).end();

  const filePath = path.resolve(process.cwd(), "config/pillow/buy-links.ts");
  let source: string;

  try {
    source = fs.readFileSync(filePath, "utf8");
  } catch {
    return res.status(500).json({ error: "Could not read buy-links.ts" });
  }

  // Match:  "product-id": affiliateLink("https://...", "ASIN"),
  const re = /"([^"]+)":\s*affiliateLink\("([^"]+)",\s*"([^"]+)"\)/g;
  const urls: Record<string, string> = {};

  let m: RegExpExecArray | null;
  while ((m = re.exec(source)) !== null) {
    const [, productId, url] = m;
    urls[productId] = url;
  }

  return res.status(200).json({ urls });
}
