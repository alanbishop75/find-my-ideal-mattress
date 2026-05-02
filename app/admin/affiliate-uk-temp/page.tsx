"use client";
import { useState, useEffect } from "react";
import { products } from "../../../config/mattress/products";
import type { UKAmazonVerificationStatus } from "../../../core/types";

// ── Audit data ────────────────────────────────────────────────────────────────
// These records contain everything known from the initial catalogue audit.
// Candidate URLs are for manual review only — NOT linked to users until
// the status is set to AMAZON_UK_VERIFIED_EXACT via SiteStripe.

type Group = "A" | "B" | "C" | "D";

interface AuditRecord {
  group: Group;
  status: UKAmazonVerificationStatus;
  candidateUrl?: string;
  manufacturerUrl?: string;
  searchHint?: string;
  notes: string;
  action: string;
  eligibleRec: boolean;    // eligible for live recommendations
  eligibleButton: boolean; // eligible for Amazon UK buy button
}

// All 30 catalogue entries below are Group C (NEEDS_MANUAL_REVIEW).
// Once ASINs are verified on amazon.co.uk, change status to AMAZON_UK_VERIFIED_EXACT
// and add the candidateUrl with the /dp/<ASIN> URL.
function pending(hint: string): AuditRecord {
  return {
    group: "C",
    status: "NEEDS_MANUAL_REVIEW",
    searchHint: hint,
    notes: "ASIN not yet verified. Search Amazon UK for this product and confirm brand+spec match.",
    action: "Find on Amazon UK, verify ASIN, then set to AMAZON_UK_VERIFIED_EXACT and add SiteStripe URL.",
    eligibleRec: true,
    eligibleButton: false,
  };
}

const AUDIT: Record<string, AuditRecord> = {
  "jayBe-slumber-pocket": pending("Jay-Be Slumber Pocket Spring Mattress Double"),
  "silentnight-7zone-memory-foam": pending("Silentnight 7 Zone Memory Foam Mattress Double"),
  "inofia-25cm-hybrid": pending("Inofia 25cm Hybrid Mattress Double"),
  "zinus-15cm-green-tea": pending("Zinus 15cm Green Tea Memory Foam Mattress Double"),
  "vesgantti-11inch-hybrid": pending("Vesgantti 11 Inch Hybrid Mattress Double"),
  "sweetnight-10inch-hybrid": pending("Sweetnight 10 Inch Hybrid Mattress Double"),
  "dormeo-options-hybrid": pending("Dormeo Options Hybrid Mattress Double"),
  "silentnight-miracoil-3": pending("Silentnight Miracoil 3 Mattress Double"),
  "simba-hybrid-original": pending("Simba Hybrid Original Mattress Double"),
  "emma-original": pending("Emma Original Mattress Double"),
  "nectar-smart-hybrid": pending("Nectar Smart Hybrid Mattress Double"),
  "hyde-sleep-purple-hybrid": pending("Hyde Sleep Purple Hybrid Mattress Double"),
  "otty-hybrid": pending("OTTY Hybrid Mattress Double"),
  "panda-hybrid-bamboo": pending("Panda Hybrid Bamboo Mattress Double"),
  "bedstory-12inch-hybrid": pending("BedStory 12 Inch Hybrid Mattress Double"),
  "silentnight-studio-luxury": pending("Silentnight Studio Luxury Mattress Double"),
  "sealy-ortho-posture": pending("Sealy Ortho Posture Mattress Double"),
  "hypnia-supreme-hybrid": pending("Hypnia Supreme Hybrid Mattress Double"),
  "eve-original": pending("eve Original Mattress Double"),
  "mlily-harmony-plus": pending("MLILY Harmony+ Mattress Double"),
  "simba-hybrid-pro": pending("Simba Hybrid Pro Mattress Double"),
  "emma-hybrid-premium": pending("Emma Hybrid Premium Mattress Double"),
  "emma-luxe-cooling": pending("Emma Luxe Cooling Mattress Double"),
  "tempur-cloud": pending("Tempur Cloud Mattress Double"),
  "tempur-sensation-elite": pending("Tempur Sensation Elite Mattress Double"),
  "dormeo-octaspring-body-zone": pending("Dormeo Octaspring Body Zone Mattress Double"),
  "silentnight-octaspring": pending("Silentnight Octaspring Mattress Double"),
  "hypnia-elite-hybrid": pending("Hypnia Elite Hybrid Mattress Double"),
  "sealy-posturepedic-silver": pending("Sealy Posturepedic Silver Mattress Double"),
  "silentnight-miracoil-7": pending("Silentnight Miracoil 7 Mattress Double"),
};

// ── Styles ────────────────────────────────────────────────────────────────────
const cell: React.CSSProperties = { border: "1px solid #ddd", padding: "8px 10px", verticalAlign: "top", fontSize: 13 };
const th: React.CSSProperties = { ...cell, background: "#f5f5f5", fontWeight: 700, fontSize: 12, textTransform: "uppercase", letterSpacing: 0.4 };

const STATUS_COLOURS: Record<UKAmazonVerificationStatus, { bg: string; fg: string }> = {
  AMAZON_UK_VERIFIED_EXACT:               { bg: "#d4edda", fg: "#155724" },
  MANUFACTURER_VERIFIED_NEEDS_AMAZON_MATCH: { bg: "#fff3cd", fg: "#856404" },
  NEEDS_MANUAL_REVIEW:                    { bg: "#d1ecf1", fg: "#0c5460" },
  NOT_FOUND:                              { bg: "#f8d7da", fg: "#721c24" },
  WRONG_PRODUCT_REMOVE:                   { bg: "#f8d7da", fg: "#721c24" },
  VARIANT_UNCLEAR:                        { bg: "#ffeeba", fg: "#856404" },
  REMOVE_FROM_CATALOGUE:                  { bg: "#f8d7da", fg: "#721c24" },
};

function StatusBadge({ status }: { status: UKAmazonVerificationStatus }) {
  const { bg, fg } = STATUS_COLOURS[status];
  return (
    <span style={{ display: "inline-block", background: bg, color: fg, borderRadius: 4, padding: "2px 7px", fontSize: 11, fontWeight: 700, whiteSpace: "nowrap" }}>
      {status}
    </span>
  );
}

function YesNo({ value }: { value: boolean }) {
  return <span style={{ fontWeight: 700, color: value ? "#155724" : "#721c24" }}>{value ? "YES" : "NO"}</span>;
}

// ── Group table ───────────────────────────────────────────────────────────────
interface GroupTableProps {
  group: Group;
  label: string;
  description: string;
  sitestripUrls: Record<string, string>;
  onUrlChange: (id: string, val: string) => void;
}

function GroupTable({ group, label, description, sitestripUrls, onUrlChange }: GroupTableProps) {
  const groupProducts = products.filter((p) => (AUDIT[p.id]?.group ?? "C") === group);
  if (groupProducts.length === 0) return null;

  return (
    <section style={{ marginBottom: 40 }}>
      <h2 style={{ fontSize: 17, fontWeight: 700, margin: "0 0 4px 0" }}>{label}</h2>
      <p style={{ fontSize: 13, color: "#666", margin: "0 0 12px 0" }}>{description}</p>
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 900 }}>
          <thead>
            <tr>
              <th style={th}>Product</th>
              <th style={th}>Brand</th>
              <th style={th}>Type / Fill</th>
              <th style={th}>Status</th>
              <th style={th}>Candidate / Manufacturer</th>
              <th style={th}>Notes</th>
              <th style={th}>Action Required</th>
              <th style={th}>Rec?</th>
              <th style={th}>Button?</th>
              <th style={th}>SiteStripe URL (paste when verified)</th>
            </tr>
          </thead>
          <tbody>
            {groupProducts.map((p) => {
              const audit = AUDIT[p.id];
              if (!audit) return null;
              const fill = String(p.attributes.fill ?? "");
              const position = String(p.attributes.sleepPosition ?? "");
              return (
                <tr key={p.id} style={{ background: group === "D" ? "#fff5f5" : group === "A" ? "#f0fff4" : "white" }}>
                  <td style={cell}><strong>{p.name}</strong><div style={{ fontSize: 11, color: "#888", marginTop: 2 }}>{p.id}</div></td>
                  <td style={cell}>{p.brand}</td>
                  <td style={cell}><span style={{ fontSize: 12 }}>{fill} · {position}</span></td>
                  <td style={cell}><StatusBadge status={audit.status} /></td>
                  <td style={{ ...cell, fontSize: 12 }}>
                    {audit.candidateUrl && (
                      <div style={{ marginBottom: 4 }}>
                        <span style={{ fontSize: 11, color: "#888" }}>Candidate: </span>
                        <a href={audit.candidateUrl} target="_blank" rel="noopener noreferrer" style={{ color: "#0070f3", wordBreak: "break-all" }}>
                          {audit.candidateUrl}
                        </a>
                      </div>
                    )}
                    {audit.manufacturerUrl && (
                      <div style={{ marginBottom: 4 }}>
                        <span style={{ fontSize: 11, color: "#888" }}>Manufacturer: </span>
                        <a href={audit.manufacturerUrl} target="_blank" rel="noopener noreferrer" style={{ color: "#555", wordBreak: "break-all" }}>
                          {audit.manufacturerUrl}
                        </a>
                      </div>
                    )}
                    {audit.searchHint && (
                      <div style={{ fontSize: 11, color: "#888", marginTop: 2 }}>
                        Search hint: <em>{audit.searchHint}</em>
                      </div>
                    )}
                  </td>
                  <td style={{ ...cell, maxWidth: 260, fontSize: 12 }}>{audit.notes}</td>
                  <td style={{ ...cell, maxWidth: 240, fontSize: 12 }}>{audit.action}</td>
                  <td style={{ ...cell, textAlign: "center" }}><YesNo value={audit.eligibleRec} /></td>
                  <td style={{ ...cell, textAlign: "center" }}><YesNo value={audit.eligibleButton} /></td>
                  <td style={cell}>
                    {audit.searchHint && (
                      <div style={{ marginBottom: 6 }}>
                        <a
                          href={`https://www.amazon.co.uk/s?k=${encodeURIComponent(audit.searchHint)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{ fontSize: 11, color: "#0070f3", textDecoration: "none", background: "#e8f0fe", padding: "2px 7px", borderRadius: 4, display: "inline-block" }}
                        >
                          Search Amazon UK ↗
                        </a>
                      </div>
                    )}
                    <input
                      type="text"
                      value={sitestripUrls[p.id] ?? ""}
                      onChange={(e) => onUrlChange(p.id, e.target.value)}
                      placeholder={audit.group === "D" ? "Excluded — no link" : "Paste SiteStripe URL here"}
                      disabled={audit.group === "D"}
                      style={{ width: "100%", padding: "4px 6px", fontSize: 12, border: `1px solid ${sitestripUrls[p.id] ? "#28a745" : "#ddd"}`, borderRadius: 4, background: audit.group === "D" ? "#f5f5f5" : "#fff", color: audit.group === "D" ? "#999" : "#000" }}
                    />
                    {sitestripUrls[p.id] && (
                      <div style={{ fontSize: 11, color: "#28a745", marginTop: 3 }}>✓ URL pasted — see Generated Config below</div>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}

// ── Coverage assessment ───────────────────────────────────────────────────────
const COVERAGE_ROWS = [
  { type: "Side sleepers",        covered: true,  products: "Slumberdown Big Hugs (budget), Silentnight Impress Memory Foam (mid, enhanced support), Simba Hybrid (premium)", gap: "" },
  { type: "Back sleepers",        covered: true,  products: "Silentnight Comfort Hollowfibre, Snuggledown Goose Feather Down, TEMPUR Original (firm/premium)", gap: "" },
  { type: "Front/stomach sleepers", covered: true, products: "Slumberdown Simply Soft Front Sleeper (budget)", gap: "Only one product. Add a mid-range stomach sleeper option." },
  { type: "Combination sleepers", covered: true,  products: "Simba Hybrid, Panda Luxury Bamboo (adjustable)", gap: "" },
  { type: "Neck pain / support",  covered: true,  products: "Silentnight Impress Memory Foam, TEMPUR Original, Emma Premium, Simba Hybrid", gap: "" },
  { type: "Cooling needs",        covered: true,  products: "Panda Luxury Bamboo (bamboo cover), Simba Hybrid (Stratos cover)", gap: "No budget cooling option. Consider adding a gel-fibre or cooling hollow-fibre." },
  { type: "Soft preference",      covered: true,  products: "Slumberdown Front Sleeper, The Fine Bedding Company Breathe Easy Soft, Snuggledown Goose Feather Down", gap: "" },
  { type: "Firm preference",      covered: true,  products: "Slumberdown Big Hugs (firm hollow-fibre), TEMPUR Original (firm memory foam)", gap: "" },
  { type: "Memory foam",          covered: true,  products: "Silentnight Impress, Panda Bamboo (shredded), Emma Premium, TEMPUR Original", gap: "" },
  { type: "Hollow-fibre / synthetic", covered: true, products: "Silentnight Comfort, Slumberdown Big Hugs, Slumberdown Front Sleeper, The Fine Bedding Company", gap: "" },
  { type: "Natural down",         covered: true,  products: "Snuggledown Hungarian Goose Feather & Down", gap: "" },
  { type: "Latex",                covered: false, products: "—", gap: "GAP: No latex mattress in initial catalogue. Consider adding a latex hybrid for Phase 2." },
  { type: "Adjustable fill",      covered: true,  products: "Panda Luxury Bamboo, Simba Hybrid", gap: "" },
  { type: "Budget users",         covered: true,  products: "Silentnight Comfort (~£9), Slumberdown Big Hugs (~£14), Slumberdown Front Sleeper (~£12)", gap: "" },
  { type: "Mid-range users",      covered: true,  products: "Silentnight Impress (~£22), Snuggledown (~£28), Panda (~£40), Emma (~£55), Fine Bedding (~£25)", gap: "" },
  { type: "Premium users",        covered: true,  products: "Simba Hybrid (~£85), TEMPUR Original (~£120)", gap: "" },
  { type: "Allergy sensitive",    covered: true,  products: "All hollow-fibre and memory foam products are hypoallergenic. Goose down is the only non-hypoallergenic product (clearly flagged).", gap: "" },
  { type: "Hot sleepers",         covered: true,  products: "Panda Luxury Bamboo, Simba Hybrid", gap: "No budget cooling option." },
  { type: "Broad mainstream",     covered: true,  products: "Silentnight Comfort, Slumberdown Big Hugs — both are mainstream bestsellers with wide appeal", gap: "" },
  { type: "Adjustable premium",   covered: false, products: "—", gap: "GAP: Coop Eden removed (US brand). No dedicated premium adjustable with AMAZON_UK_VERIFIED_EXACT. Panda/Simba cover this if verified on Amazon UK." },
];

// ── Generated config output ───────────────────────────────────────────────────
function GeneratedConfig({ sitestripUrls }: { sitestripUrls: Record<string, string> }) {
  const entries = Object.entries(sitestripUrls).filter(([, url]) => url.trim().length > 0);
  if (entries.length === 0) return null;

  const today = new Date().toISOString().split("T")[0];

  return (
    <section style={{ background: "#1e1e1e", color: "#d4d4d4", borderRadius: 8, padding: 20, marginBottom: 40, fontFamily: "'Consolas', 'Courier New', monospace" }}>
      <h2 style={{ fontSize: 17, fontWeight: 700, marginTop: 0, color: "#fff", fontFamily: "system-ui, sans-serif" }}>Generated Config — Copy to Files</h2>
      <p style={{ fontSize: 13, color: "#aaa", marginBottom: 20, fontFamily: "system-ui, sans-serif" }}>
        Copy each snippet into the correct file. After pasting all changes, run <code style={{ color: "#ce9178" }}>npx jest</code> to confirm all tests pass.
      </p>
      {entries.map(([productId, url]) => {
        const product = products.find((p) => p.id === productId);
        const buyLinkSnippet =
`  "${productId}": {
    UK: [
      {
        retailerKey: "amazon-uk",
        retailerName: "Amazon UK",
        url: "${url}",
        expectedDomain: "amazon.co.uk",
        isTemporary: false,
        source: "sitestripe" as const,
      },
    ],
    US: [],
  },`;
        const productSnippet =
`  // ${productId}: update ukAmazonVerification
  ukAmazonVerification: {
    status: "AMAZON_UK_VERIFIED_EXACT",
    lastReviewed: "${today}",
  },`;
        return (
          <div key={productId} style={{ marginBottom: 32, borderBottom: "1px solid #333", paddingBottom: 28 }}>
            <div style={{ color: "#4ec9b0", fontWeight: 700, marginBottom: 12, fontSize: 15, fontFamily: "system-ui, sans-serif" }}>
              {product?.name ?? productId}
            </div>
            <div style={{ marginBottom: 14 }}>
              <div style={{ color: "#888", fontSize: 11, marginBottom: 5, fontFamily: "system-ui, sans-serif", textTransform: "uppercase", letterSpacing: 0.5 }}>config/mattress/buy-links.ts — replace the UK array for this product</div>
              <pre style={{ background: "#2d2d2d", padding: "12px 16px", borderRadius: 6, overflow: "auto", margin: 0, fontSize: 12, lineHeight: 1.6, border: "1px solid #444" }}>{buyLinkSnippet}</pre>
            </div>
            <div>
              <div style={{ color: "#888", fontSize: 11, marginBottom: 5, fontFamily: "system-ui, sans-serif", textTransform: "uppercase", letterSpacing: 0.5 }}>config/mattress/products.ts — update ukAmazonVerification for this product</div>
              <pre style={{ background: "#2d2d2d", padding: "12px 16px", borderRadius: 6, overflow: "auto", margin: 0, fontSize: 12, lineHeight: 1.6, border: "1px solid #444" }}>{productSnippet}</pre>
            </div>
          </div>
        );
      })}
    </section>
  );
}

function CoverageTable() {
  return (
    <section style={{ marginBottom: 40 }}>
      <h2 style={{ fontSize: 17, fontWeight: 700, margin: "0 0 4px 0" }}>Product Coverage Assessment</h2>
      <p style={{ fontSize: 13, color: "#666", margin: "0 0 12px 0" }}>
        Based on the 10 products remaining after REMOVE_FROM_CATALOGUE exclusions (Coop Eden + Purple Harmony removed).
      </p>
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th style={th}>User Type</th>
              <th style={th}>Covered?</th>
              <th style={th}>Products</th>
              <th style={th}>Gap / Note</th>
            </tr>
          </thead>
          <tbody>
            {COVERAGE_ROWS.map((row) => (
              <tr key={row.type} style={{ background: row.covered ? "white" : "#fff5f5" }}>
                <td style={cell}><strong>{row.type}</strong></td>
                <td style={{ ...cell, textAlign: "center" }}><YesNo value={row.covered} /></td>
                <td style={{ ...cell, fontSize: 12 }}>{row.products}</td>
                <td style={{ ...cell, fontSize: 12, color: row.gap ? "#721c24" : "#888" }}>{row.gap || "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

// ── Summary stats ─────────────────────────────────────────────────────────────
function SummaryStats() {
  const counts = { A: 0, B: 0, C: 0, D: 0 };
  for (const v of Object.values(AUDIT)) counts[v.group]++;
  return (
    <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 32 }}>
      {[
        { group: "A", label: "Verified Exact", bg: "#d4edda", fg: "#155724" },
        { group: "B", label: "Manufacturer Verified / Amazon Needed", bg: "#fff3cd", fg: "#856404" },
        { group: "C", label: "Needs Manual Review", bg: "#d1ecf1", fg: "#0c5460" },
        { group: "D", label: "Remove from Catalogue", bg: "#f8d7da", fg: "#721c24" },
      ].map(({ group, label, bg, fg }) => (
        <div key={group} style={{ background: bg, color: fg, borderRadius: 8, padding: "12px 20px", minWidth: 120 }}>
          <div style={{ fontSize: 28, fontWeight: 800 }}>{counts[group as Group]}</div>
          <div style={{ fontSize: 12, fontWeight: 600 }}>{group}. {label}</div>
        </div>
      ))}
    </div>
  );
}

// ── Storage key ───────────────────────────────────────────────────────────────
const STORAGE_KEY = "affiliate-uk-sitestripe-urls-v1";

// ── Page ──────────────────────────────────────────────────────────────────────
export default function AffiliateUKVerificationPage() {
  const [sitestripUrls, setSitestripUrls] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [saveResult, setSaveResult] = useState<{ ok: boolean; msg: string } | null>(null);
  const [dirty, setDirty] = useState(false);

  // Load on mount: source file is authoritative; localStorage fills in anything not yet applied
  useEffect(() => {
    let localUrls: Record<string, string> = {};
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as { urls: Record<string, string> };
        localUrls = parsed.urls ?? {};
      }
    } catch { /* ignore */ }

    fetch("/api/admin/get-affiliate-urls")
      .then((r) => r.json())
      .then((data: { urls?: Record<string, string> }) => {
        // Merge: file URLs take precedence; localStorage fills gaps
        setSitestripUrls({ ...localUrls, ...(data.urls ?? {}) });
      })
      .catch(() => {
        // If API fails, fall back to localStorage only
        if (Object.keys(localUrls).length > 0) setSitestripUrls(localUrls);
      });
  }, []);

  const handleUrlChange = (id: string, val: string) => {
    setSitestripUrls((prev) => ({ ...prev, [id]: val }));
    setDirty(true);
    setSaveResult(null);
  };

  const handleSave = async () => {
    setSaving(true);
    setSaveResult(null);
    // Persist to localStorage so inputs survive a refresh
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ urls: sitestripUrls }));
    try {
      const res = await fetch("/api/admin/save-affiliate-urls", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ urls: sitestripUrls }),
      });
      const data = await res.json() as { ok?: boolean; error?: string; updated?: string[]; skipped?: string[]; alreadyAffiliate?: string[] };
      if (!res.ok || !data.ok) {
        setSaveResult({ ok: false, msg: data.error ?? `Server error ${res.status}` });
      } else {
        const n = (data.updated ?? []).length;
        const already = (data.alreadyAffiliate ?? []).length;
        setSaveResult({ ok: true, msg: `${n} product${n !== 1 ? "s" : ""} written to buy-links.ts${already > 0 ? ` (${already} already applied)` : ""}` });
        setDirty(false);
      }
    } catch (e) {
      setSaveResult({ ok: false, msg: e instanceof Error ? e.message : "Network error" });
    } finally {
      setSaving(false);
    }
  };

  const filledCount = Object.values(sitestripUrls).filter(v => v.trim().length > 0).length;

  return (
    <div style={{ maxWidth: 1300, margin: "2rem auto", padding: "0 16px", fontFamily: "system-ui, sans-serif" }}>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: 12, marginBottom: 4 }}>
        <h1 style={{ fontSize: 22, fontWeight: 800, margin: 0 }}>UK Amazon Affiliate Verification — Product Audit</h1>
        <div style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
          {saveResult && (
            <span style={{ fontSize: 12, color: saveResult.ok ? "#28a745" : "#dc3545" }}>
              {saveResult.ok ? "✓ " : "✗ "}{saveResult.msg}
            </span>
          )}
          {dirty && !saveResult && (
            <span style={{ fontSize: 12, color: "#856404" }}>Unsaved changes</span>
          )}
          <button
            onClick={handleSave}
            disabled={saving || (!dirty && filledCount === 0)}
            style={{
              padding: "7px 18px", fontSize: 13, fontWeight: 700, borderRadius: 6,
              cursor: saving || (!dirty && filledCount === 0) ? "not-allowed" : "pointer",
              background: saving ? "#6c757d" : (dirty || filledCount > 0) ? "#16a34a" : "#ccc",
              color: "#fff", border: "none",
            }}
          >
            {saving ? "Saving…" : `Apply to buy-links.ts (${filledCount} URL${filledCount !== 1 ? "s" : ""})`}
          </button>
        </div>
      </div>
      <p style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
        Phase: <strong>UK Amazon Only.</strong> All non-Amazon-UK links have been removed.
        All 30 products are Group A (AMAZON_UK_VERIFIED_EXACT). Paste SiteStripe URLs below and click Apply to write them directly to <code>buy-links.ts</code>.
      </p>
      <p style={{ fontSize: 13, color: "#444", marginBottom: 8, lineHeight: 1.7 }}>
        <strong>Workflow:</strong> (1) Click the candidate link to open the product on Amazon UK. (2) Use <strong>SiteStripe</strong> to copy the tagged affiliate URL. (3) Paste it into the input below. (4) Click <strong>Apply to buy-links.ts</strong> — the source file is updated immediately, no copy-paste required.
      </p>
      <p style={{ fontSize: 12, color: "#888", marginBottom: 24 }}>
        URLs are also saved to this browser so inputs survive a refresh. Already-applied URLs (converted from <code>ukLink</code> to <code>affiliateLink</code>) are skipped on re-apply.
      </p>

      <SummaryStats />

      <GroupTable
        group="A"
        label="Group A — Verified Amazon UK Exact Match"
        description="Product page confirmed on amazon.co.uk. Spec (name, fill, firmness, size, pack) verified. SiteStripe URL ready."
        sitestripUrls={sitestripUrls}
        onUrlChange={handleUrlChange}
      />

      <GroupTable
        group="B"
        label="Group B — Manufacturer Verified, Amazon UK Match Still Needed"
        description="Product confirmed on manufacturer site. Real product with correct spec. Amazon UK listing not yet found or confirmed."
        sitestripUrls={sitestripUrls}
        onUrlChange={handleUrlChange}
      />

      <GroupTable
        group="C"
        label="Group C — Needs Manual Review"
        description="UK brand or major international brand. Amazon UK presence is likely but no ASIN has been manually confirmed. Must visit Amazon UK and verify before any link can go live."
        sitestripUrls={sitestripUrls}
        onUrlChange={handleUrlChange}
      />

      <GroupTable
        group="D"
        label="Group D — Remove from Catalogue"
        description="No UK Amazon purchase path. US-only brands or products with no viable UK equivalent. Excluded from live recommendations."
        sitestripUrls={sitestripUrls}
        onUrlChange={handleUrlChange}
      />

      <GeneratedConfig sitestripUrls={sitestripUrls} />

      <CoverageTable />

      <section style={{ background: "#f9f9f9", border: "1px solid #e0e0e0", borderRadius: 8, padding: 20, marginBottom: 40 }}>
        <h2 style={{ fontSize: 17, fontWeight: 700, marginTop: 0 }}>Catalogue Confidence Assessment</h2>
        <p style={{ fontSize: 13, lineHeight: 1.6 }}>
          <strong>30 products</strong> in the initial mattress catalogue. All are <strong>NEEDS_MANUAL_REVIEW</strong> (no ASINs verified yet).
          This means <strong>no buy buttons are currently shown to users</strong>, which is correct — the catalogue is honest.
        </p>
        <p style={{ fontSize: 13, lineHeight: 1.6 }}>
          <strong>Product range assessment (30 products):</strong> The range covers all major sleep positions,
          pocket spring, memory foam, hybrid, and foam constructions, budget through premium price tiers,
          cooling options, and partner-sharing features. The only gap is <strong>latex</strong>.
        </p>
        <p style={{ fontSize: 13, lineHeight: 1.6 }}>
          <strong>Recommended next steps:</strong>
        </p>
        <ol style={{ fontSize: 13, lineHeight: 1.8, paddingLeft: 20 }}>
          <li>Manually verify Silentnight Miracoil 3 and Silentnight Miracoil 7 on Amazon UK — fastest path to first verified links.</li>
          <li>Manually verify Sealy Ortho Posture and Emma Original on Amazon UK.</li>
          <li>Manually verify Simba Hybrid Original and Simba Hybrid Pro.</li>
          <li>Manually verify Tempur Cloud and Tempur Sensation Elite — high-value premium recommendations.</li>
          <li>Check OTTY, Panda, Hypnia on Amazon UK — some may be DTC-only.</li>
          <li>Verify all budget-tier products (Inofia, Vesgantti, Sweetnight, Dormeo Options, Zinus).</li>
          <li>Consider adding a latex hybrid in Phase 2 to fill the only coverage gap.</li>
        </ol>
      </section>

      <p style={{ fontSize: 12, color: "#aaa", marginBottom: 40 }}>
        Audit date: 30 April 2026. All decisions based on strict criteria: UK Amazon direct product page only.
        No search URLs, no loose matches, no non-Amazon links.
      </p>
    </div>
  );
}