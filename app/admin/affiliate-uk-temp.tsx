"use client";
import { useState } from "react";
import { products } from "../../config/mattress/products";

// MVP: Hardcoded initial status for demo. In real use, fetch from config or DB.
const initialStatus: Record<string, {
  matchStatus: string;
  notes: string;
  url: string;
}> = {
  "silentnight-comfort-hollowfibre": {
    matchStatus: "VERIFIED_EXACT_MATCH",
    notes: "Brand, fill, firmness, size, pack, and features all match the catalogue.",
    url: "",
  },
  // ...add other products as you process them
};

export default function AffiliateUKAdmin() {
  const [affiliateLinks, setAffiliateLinks] = useState(initialStatus);

  const handleUrlChange = (id: string, value: string) => {
    setAffiliateLinks((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        url: value,
      },
    }));
  };

  return (
    <div style={{ maxWidth: 900, margin: "2rem auto", fontFamily: "sans-serif" }}>
      <h1>Amazon UK Affiliate Link Admin (MVP)</h1>
      <p>Paste your final SiteStripe affiliate URL for each product below. Only VERIFIED_EXACT_MATCH or VERIFIED_EQUIVALENT_MATCH should be used. If no match, leave blank and flag for review.</p>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th style={{ border: "1px solid #ccc", padding: 6 }}>Product</th>
            <th style={{ border: "1px solid #ccc", padding: 6 }}>Brand</th>
            <th style={{ border: "1px solid #ccc", padding: 6 }}>Match Status</th>
            <th style={{ border: "1px solid #ccc", padding: 6 }}>Notes</th>
            <th style={{ border: "1px solid #ccc", padding: 6 }}>Amazon UK Affiliate URL</th>
          </tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <tr key={p.id}>
              <td style={{ border: "1px solid #ccc", padding: 6 }}>{p.name}</td>
              <td style={{ border: "1px solid #ccc", padding: 6 }}>{p.brand}</td>
              <td style={{ border: "1px solid #ccc", padding: 6 }}>{affiliateLinks[p.id]?.matchStatus || "NOT_FOUND"}</td>
              <td style={{ border: "1px solid #ccc", padding: 6 }}>{affiliateLinks[p.id]?.notes || "No match found. Needs review."}</td>
              <td style={{ border: "1px solid #ccc", padding: 6 }}>
                <input
                  type="text"
                  value={affiliateLinks[p.id]?.url || ""}
                  onChange={(e) => handleUrlChange(p.id, e.target.value)}
                  style={{ width: "100%" }}
                  placeholder="Paste SiteStripe URL here"
                  disabled={affiliateLinks[p.id]?.matchStatus !== "VERIFIED_EXACT_MATCH" && affiliateLinks[p.id]?.matchStatus !== "VERIFIED_EQUIVALENT_MATCH"}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <p style={{ marginTop: 24, color: '#888' }}>
        <b>Note:</b> This is a temporary MVP admin page. Data is not persisted. Copy/paste your final URLs elsewhere as needed.
      </p>
    </div>
  );
}
