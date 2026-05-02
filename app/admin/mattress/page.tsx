"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "../../../core/theme";
import { products } from "../../../config/mattress/products";
import { mattressBuyLinks } from "../../../config/mattress/buy-links";
import { mattressQuestionnaire } from "../../../config/mattress/questionnaire";
import { themeNames } from "../../../core/theme/tokens";
import globalThemeConfig from "../../../config/global-theme.json";

// ── Types ──────────────────────────────────────────────────────────────────────

type Tab = "overview" | "seo" | "questions" | "questionnaire" | "products" | "affiliate" | "theme";

// ── Static SEO page registry ───────────────────────────────────────────────────

import { mattressSeoPages } from "../../../config/mattress/seo-pages";

const CORE_PAGES = [
  {
    url: "/",
    title: "FindMyIdeal — Personalised Product Recommendations",
    description: "Answer a few quick questions and get a free, personalised product recommendation.",
    robots: "index, follow",
    updated: "Apr 2026",
    notes: "Homepage / CTA",
    kind: "core" as const,
  },
  {
    url: "/mattress/questionnaire",
    title: "Mattress Finder — FindMyIdealMattress",
    description: "Answer a few quick questions to find your ideal mattress.",
    robots: "index, follow",
    updated: "May 2026",
    notes: "Entry point",
    kind: "core" as const,
  },
  {
    url: "/mattress/results",
    title: "Your Mattress Recommendations — FindMyIdealMattress",
    description: "Your personalised mattress recommendations based on how you sleep.",
    robots: "noindex, follow",
    updated: "May 2026",
    notes: "noindex — session-specific",
    kind: "core" as const,
  },
  {
    url: "/about",
    title: "About FindMyIdeal",
    description: "FindMyIdeal helps you find the right product through a personalised quiz.",
    robots: "index, follow",
    updated: "Apr 2026",
    notes: "Static page",
    kind: "core" as const,
  },
  {
    url: "/privacy-policy",
    title: "Privacy Policy — FindMyIdeal",
    description: "How FindMyIdeal collects, uses and protects your personal information.",
    robots: "index, follow",
    updated: "Apr 2026",
    notes: "UK GDPR",
    kind: "core" as const,
  },
  {
    url: "/admin",
    title: "Theme Admin — FindMyIdeal",
    description: "",
    robots: "noindex, nofollow",
    updated: "Apr 2026",
    notes: "Admin only",
    kind: "core" as const,
  },
];

const SEO_PAGES = [
  ...CORE_PAGES,
  ...mattressSeoPages.map(p => ({
    url: `/mattress/${p.slug}`,
    title: p.metaTitle,
    description: p.metaDescription,
    robots: "index, follow",
    updated: "Apr 2026",
    notes: `SEO landing — ${p.h1}`,
    kind: "seo-landing" as const,
  })),
];

// ── GA4 event reference ────────────────────────────────────────────────────────

const GA4_EVENTS = [
  { event: "quiz_start", trigger: "Questionnaire mounts", params: "quiz_id" },
  { event: "question_answered", trigger: "Each option tap", params: "quiz_id, question_id, answer, question_index" },
  { event: "quiz_complete", trigger: "Final answer given", params: "quiz_id" },
  { event: "quiz_abandoned", trigger: "Unmount before complete", params: "quiz_id, question_index" },
  { event: "results_viewed", trigger: "Results page mount", params: "best_match" },
  { event: "affiliate_click", trigger: "Amazon CTA clicked", params: "product_id, slot, position" },
];

// ── Sub-components ─────────────────────────────────────────────────────────────

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h3 style={{ fontSize: 16, fontWeight: 700, margin: "0 0 12px 0" }}>{children}</h3>
  );
}

function Pill({ color, children }: { color: string; children: React.ReactNode }) {
  return (
    <span style={{
      display: "inline-block",
      background: color,
      color: "#fff",
      borderRadius: 5,
      fontSize: 11,
      fontWeight: 700,
      padding: "2px 8px",
      letterSpacing: 0.5,
    }}>
      {children}
    </span>
  );
}

function TableWrap({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ overflowX: "auto", scrollbarGutter: "stable both-edges", borderRadius: 10, border: "1px solid #e5e7eb" }}>
      <table style={{ width: "max-content", minWidth: "100%", borderCollapse: "collapse", fontSize: 13 }}>
        {children}
      </table>
    </div>
  );
}

function Th({ children }: { children: React.ReactNode }) {
  return (
    <th style={{
      background: "#f9fafb",
      borderBottom: "1px solid #e5e7eb",
      padding: "8px 12px",
      textAlign: "left",
      fontWeight: 600,
      color: "#374151",
      whiteSpace: "nowrap",
    }}>
      {children}
    </th>
  );
}

function Td({ children, mono }: { children: React.ReactNode; mono?: boolean }) {
  return (
    <td style={{
      padding: "8px 12px",
      borderBottom: "1px solid #f3f4f6",
      fontFamily: mono ? "monospace" : undefined,
      fontSize: mono ? 12 : 13,
      color: "#1f2937",
      verticalAlign: "top",
    }}>
      {children}
    </td>
  );
}

function CopyIdCell({ value }: { value: string }) {
  const [copied, setCopied] = React.useState(false);

  async function copyValue() {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(value);
      } else {
        const textarea = document.createElement("textarea");
        textarea.value = value;
        textarea.setAttribute("readonly", "");
        textarea.style.position = "absolute";
        textarea.style.left = "-9999px";
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand("copy");
        document.body.removeChild(textarea);
      }
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1200);
    } catch {
      setCopied(false);
    }
  }

  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
      <code style={{ fontSize: 12 }}>{value}</code>
      <button
        type="button"
        onClick={copyValue}
        style={{
          fontSize: 11,
          fontWeight: 600,
          border: "1px solid #d1d5db",
          borderRadius: 6,
          background: copied ? "#dcfce7" : "#f9fafb",
          color: copied ? "#166534" : "#374151",
          padding: "2px 8px",
          cursor: "pointer",
          lineHeight: 1.4,
          whiteSpace: "nowrap",
        }}
        aria-label={`Copy ${value}`}
      >
        {copied ? "Copied" : "Copy"}
      </button>
    </span>
  );
}

// ── Tabs ───────────────────────────────────────────────────────────────────────

function OverviewTab() {
  const q = mattressQuestionnaire;
  const visibleQuestions = q.questions.filter(q => !q.branch).length;
  const branchedQuestions = q.questions.filter(q => q.branch).length;

  const stats = [
    { label: "Products", value: products.length, note: "in catalogue" },
    { label: "Questions", value: `${visibleQuestions} + ${branchedQuestions}`, note: "always shown + branched" },
    { label: "Quiz Version", value: q.version, note: q.id },
    { label: "Products with image", value: products.filter(p => p.imageUrl !== "/placeholder.png").length, note: `of ${products.length} (placeholder used for rest)` },
    { label: "Region-aware links", value: Object.keys(mattressBuyLinks).length, note: "products with UK buy links" },
    { label: "Has description", value: products.filter(p => p.description).length, note: "products with copy" },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <SectionHeading>Mattress — Overview</SectionHeading>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: 12 }}>
        {stats.map(s => (
          <div key={s.label} style={{ background: "#f9fafb", border: "1px solid #e5e7eb", borderRadius: 10, padding: "14px 16px" }}>
            <div style={{ fontSize: 24, fontWeight: 700, color: "#111827" }}>{s.value}</div>
            <div style={{ fontSize: 13, fontWeight: 600, color: "#374151" }}>{s.label}</div>
            <div style={{ fontSize: 11, color: "#9ca3af", marginTop: 2 }}>{s.note}</div>
          </div>
        ))}
      </div>

      <div>
        <SectionHeading>GA4 Events Wired</SectionHeading>
        <TableWrap>
          <thead>
            <tr>
              <Th>Event</Th>
              <Th>Trigger</Th>
              <Th>Parameters</Th>
            </tr>
          </thead>
          <tbody>
            {GA4_EVENTS.map(e => (
              <tr key={e.event}>
                <Td mono>{e.event}</Td>
                <Td>{e.trigger}</Td>
                <Td mono>{e.params}</Td>
              </tr>
            ))}
          </tbody>
        </TableWrap>
        <p style={{ fontSize: 12, color: "#9ca3af", marginTop: 8 }}>
          Connect GA4 Reporting API with your Measurement ID to surface live per-question drop-off data in the MI tab.
        </p>
      </div>
    </div>
  );
}

function PageTable({ pages }: { pages: typeof SEO_PAGES }) {
  return (
    <TableWrap>
      <thead>
        <tr>
          <Th>URL</Th>
          <Th>Title</Th>
          <Th>Description</Th>
          <Th>Robots</Th>
          <Th>Preview</Th>
          <Th>Notes</Th>
        </tr>
      </thead>
      <tbody>
        {pages.map(p => (
          <tr key={p.url}>
            <Td mono>
              <a
                href={p.url}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "#3b82f6", textDecoration: "none" }}
              >
                {p.url}
              </a>
            </Td>
            <Td>{p.title || <span style={{ color: "#ef4444" }}>MISSING</span>}</Td>
            <Td>{p.description || <span style={{ color: "#ef4444" }}>MISSING</span>}</Td>
            <Td>
              <Pill color={p.robots.startsWith("noindex") ? "#9ca3af" : "#22c55e"}>
                {p.robots}
              </Pill>
            </Td>
            <Td>
              <a
                href={p.url}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "#3b82f6", textDecoration: "none", fontSize: 12, whiteSpace: "nowrap" }}
              >
                Open →
              </a>
            </Td>
            <Td>{p.notes}</Td>
          </tr>
        ))}
      </tbody>
    </TableWrap>
  );
}

function SEOTab() {
  const corePages = SEO_PAGES.filter(p => p.kind === "core");
  const seoLandingPages = SEO_PAGES.filter(p => p.kind === "seo-landing");

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
      <div>
        <SectionHeading>Core Pages ({corePages.length})</SectionHeading>
        <PageTable pages={corePages} />
        <p style={{ fontSize: 12, color: "#9ca3af", marginTop: 8 }}>
          Results page is intentionally noindex — content is session-specific and not canonical.
        </p>
      </div>

      <div>
        <SectionHeading>SEO Landing Pages ({seoLandingPages.length})</SectionHeading>
        <p style={{ fontSize: 13, color: "#6b7280", margin: "0 0 12px 0" }}>
          Statically pre-rendered keyword landing pages. Each links to the fitting quiz via &quot;Find My Perfect Mattress&quot;.
        </p>
        <PageTable pages={seoLandingPages} />
      </div>
    </div>
  );
}

function MITab() {
  const questions = mattressQuestionnaire.questions;
  const [data, setData] = React.useState<import("../../../lib/analytics").FmiAnalytics | null>(null);

  React.useEffect(() => {
    import("../../../lib/analytics").then(({ getAnalytics }) => setData(getAnalytics()));
  }, []);

  function handleClear() {
    import("../../../lib/analytics").then(({ clearAnalytics, getAnalytics }) => {
      clearAnalytics();
      setData(getAnalytics());
    });
  }

  // ── derived values ──────────────────────────────────────────────────────────

  const allSources = data
    ? Array.from(new Set([...Object.keys(data.seo_starts), ...Object.keys(data.seo_completes)]))
        .sort((a, b) => (data.seo_starts[b] ?? 0) - (data.seo_starts[a] ?? 0))
    : [];

  const totalStarts = data ? Object.values(data.seo_starts).reduce((s, n) => s + n, 0) : 0;
  const totalCompletes = data ? Object.values(data.seo_completes).reduce((s, n) => s + n, 0) : 0;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>

      {/* Data source banner */}
      <div style={{ background: "#eff6ff", border: "1px solid #bfdbfe", borderRadius: 10, padding: "12px 16px", fontSize: 13, color: "#1e40af", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
        <span>
          <strong>Same-device sessions only.</strong>{" "}
          Data below is recorded in this browser&apos;s localStorage — useful for testing each SEO page and questionnaire flow.
          For all-user data, connect the GA4 Reporting API (events include <code>seo_source</code> param).
        </span>
        <button
          onClick={handleClear}
          style={{ fontSize: 12, fontWeight: 600, padding: "5px 12px", border: "1px solid #93c5fd", borderRadius: 6, background: "#fff", color: "#1e40af", cursor: "pointer", whiteSpace: "nowrap" }}
        >
          Clear local data
        </button>
      </div>

      {/* ── SEO Source Attribution ─────────────────────────────────────────── */}
      <div>
        <SectionHeading>SEO Source Attribution</SectionHeading>
        <div style={{ display: "flex", gap: 12, marginBottom: 16, flexWrap: "wrap" }}>
          {[
            { label: "Total Starts", value: totalStarts },
            { label: "Total Completes", value: totalCompletes },
            { label: "Overall Conversion", value: totalStarts > 0 ? `${Math.round((totalCompletes / totalStarts) * 100)}%` : "—" },
          ].map(s => (
            <div key={s.label} style={{ background: "#f9fafb", border: "1px solid #e5e7eb", borderRadius: 10, padding: "12px 16px", minWidth: 120 }}>
              <div style={{ fontSize: 22, fontWeight: 700, color: "#111827" }}>{s.value}</div>
              <div style={{ fontSize: 12, color: "#6b7280", marginTop: 2 }}>{s.label}</div>
            </div>
          ))}
        </div>

        {allSources.length === 0 ? (
          <div style={{ padding: "20px 16px", background: "#f9fafb", border: "1px solid #e5e7eb", borderRadius: 10, fontSize: 13, color: "#9ca3af", textAlign: "center" }}>
            No data yet — visit an SEO landing page and complete the quiz to populate this table.
          </div>
        ) : (
          <TableWrap>
            <thead>
              <tr>
                <Th>Source</Th>
                <Th>Starts</Th>
                <Th>Completes</Th>
                <Th>Conversion</Th>
                <Th>Preview</Th>
              </tr>
            </thead>
            <tbody>
              {allSources.map(src => {
                const starts = data?.seo_starts[src] ?? 0;
                const completes = data?.seo_completes[src] ?? 0;
                const conv = starts > 0 ? Math.round((completes / starts) * 100) : 0;
                const isDirectOrSeo = src === "direct";
                return (
                  <tr key={src}>
                    <Td mono>{src}</Td>
                    <Td>{starts}</Td>
                    <Td>{completes}</Td>
                    <Td>
                      <span style={{
                        fontWeight: 700,
                        color: conv >= 50 ? "#16a34a" : conv >= 25 ? "#d97706" : "#ef4444",
                      }}>
                        {starts > 0 ? `${conv}%` : "—"}
                      </span>
                    </Td>
                    <Td>
                      {isDirectOrSeo ? (
                        <span style={{ color: "#9ca3af", fontSize: 12 }}>—</span>
                      ) : (
                        <a
                          href={`/mattress/${src}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{ color: "#3b82f6", textDecoration: "none", fontSize: 12 }}
                        >
                          Open →
                        </a>
                      )}
                    </Td>
                  </tr>
                );
              })}
            </tbody>
          </TableWrap>
        )}
      </div>

      {/* ── Question Drop-off ─────────────────────────────────────────────── */}
      <div>
        <SectionHeading>Question Drop-off & Answer Breakdown</SectionHeading>
        <TableWrap>
          <thead>
            <tr>
              <Th>#</Th>
              <Th>Question ID</Th>
              <Th>Text</Th>
              <Th>Answers recorded</Th>
              <Th>Drop-off here</Th>
              <Th>Branch</Th>
              <Th>Answer breakdown</Th>
            </tr>
          </thead>
          <tbody>
            {questions.map((q, i) => {
              const answers = data?.question_answers?.[q.id] ?? {};
              const totalAnswered = Object.values(answers).reduce((s, n) => s + n, 0);
              const dropoff = data?.question_dropoffs?.[q.id] ?? 0;
              return (
                <tr key={q.id}>
                  <Td>{i + 1}</Td>
                  <Td mono><CopyIdCell value={q.id} /></Td>
                  <Td>{q.text}</Td>
                  <Td>{totalAnswered > 0 ? totalAnswered : <span style={{ color: "#9ca3af" }}>—</span>}</Td>
                  <Td>
                    {dropoff > 0
                      ? <span style={{ fontWeight: 700, color: "#ef4444" }}>{dropoff}</span>
                      : <span style={{ color: "#9ca3af" }}>—</span>
                    }
                  </Td>
                  <Td>
                    {q.branch
                      ? <Pill color="#6366f1">{q.branch.dependsOn}: {q.branch.values.join("|")}</Pill>
                      : <span style={{ color: "#9ca3af" }}>—</span>
                    }
                  </Td>
                  <Td>
                    {totalAnswered === 0 ? (
                      <span style={{ color: "#9ca3af", fontSize: 12 }}>no data</span>
                    ) : (
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                        {q.options
                          .filter(opt => (answers[opt.id] ?? 0) > 0)
                          .sort((a, b) => (answers[b.id] ?? 0) - (answers[a.id] ?? 0))
                          .map(opt => {
                            const count = answers[opt.id] ?? 0;
                            const pct = Math.round((count / totalAnswered) * 100);
                            return (
                              <span key={opt.id} style={{
                                background: "#f3f4f6",
                                border: "1px solid #e5e7eb",
                                borderRadius: 5,
                                padding: "2px 8px",
                                fontSize: 11,
                                color: "#374151",
                                whiteSpace: "nowrap",
                              }}>
                                <span style={{ color: "#6b7280", marginRight: 3 }}>{opt.label}:</span>
                                <strong>{count}</strong>
                                <span style={{ color: "#9ca3af", marginLeft: 2 }}>({pct}%)</span>
                              </span>
                            );
                          })
                        }
                      </div>
                    )}
                  </Td>
                </tr>
              );
            })}
          </tbody>
        </TableWrap>
      </div>

    </div>
  );
}

function QuestionnaireTab() {
  const questionnaire = mattressQuestionnaire;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <SectionHeading>Active Questionnaire</SectionHeading>

      <div style={{
        padding: "10px 16px",
        borderRadius: 8,
        fontSize: 13,
        fontWeight: 600,
        background: "#f0fdf4",
        border: "1px solid #bbf7d0",
        color: "#166534",
      }}>
        Version switching has been removed. Mattress uses a single questionnaire and scoring model.
      </div>

      <SectionHeading>Question Detail</SectionHeading>
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
        <div style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 8, padding: "10px 16px", fontSize: 13 }}>
          <strong>ID:</strong> {questionnaire.id}
        </div>
        <div style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 8, padding: "10px 16px", fontSize: 13 }}>
          <strong>Version:</strong> {questionnaire.version}
        </div>
        <div style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 8, padding: "10px 16px", fontSize: 13 }}>
          <strong>Questions:</strong> {questionnaire.questions.length} ({questionnaire.questions.filter(x => x.branch).length} branched)
        </div>
      </div>

      {questionnaire.questions.map((question, i) => (
        <div key={question.id} style={{ border: "1px solid #e5e7eb", borderRadius: 10, padding: 16 }}>
          <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 8, flexWrap: "wrap" }}>
            <span style={{ fontWeight: 700, fontSize: 13, color: "#6b7280" }}>Q{i + 1}</span>
            <code style={{ background: "#f3f4f6", borderRadius: 4, padding: "2px 8px", fontSize: 12 }}>{question.id}</code>
            {question.branch && (
              <Pill color="#6366f1">branch: {question.branch.dependsOn} = {question.branch.values.join(" | ")}</Pill>
            )}
          </div>
          <p style={{ margin: "0 0 10px 0", fontWeight: 600, fontSize: 14 }}>{question.text}</p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            {question.options.map(opt => (
              <span key={opt.id} style={{
                background: "#f9fafb",
                border: "1px solid #e5e7eb",
                borderRadius: 6,
                padding: "3px 10px",
                fontSize: 12,
                color: "#374151",
              }}>
                <code style={{ color: "#6366f1", marginRight: 4 }}>{opt.id}</code>{opt.label}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function ProductsTab() {
  const ATTR_KEYS = ["compression", "priceTier", "distance", "spin", "feel", "forgiveness", "straightFlight"];

  return (
    <div>
      <SectionHeading>Product Catalogue ({products.length} items)</SectionHeading>
      <TableWrap>
        <thead>
          <tr>
            <Th>ID</Th>
            <Th>Brand</Th>
            <Th>Name</Th>
            <Th>Tier</Th>
            <Th>Comp</Th>
            <Th>Dist</Th>
            <Th>Spin</Th>
            <Th>Feel</Th>
            <Th>Forg</Th>
            <Th>Straight</Th>
            <Th>Image</Th>
            <Th>Description</Th>
          </tr>
        </thead>
        <tbody>
          {products.map(p => {
            const a = p.attributes;
            const hasImage = p.imageUrl !== "/placeholder.png";
            return (
              <tr key={p.id}>
                <Td mono><CopyIdCell value={p.id} /></Td>
                <Td>{p.brand}</Td>
                <Td><strong>{p.name}</strong></Td>
                <Td>
                  <Pill color={
                    a.priceTier === "premium" ? "#a855f7"
                    : a.priceTier === "mid" ? "#3b82f6"
                    : "#22c55e"
                  }>
                    {String(a.priceTier)}
                  </Pill>
                </Td>
                <Td>
                  <Pill color={
                    a.compression === "high" ? "#ef4444"
                    : a.compression === "mid" ? "#f97316"
                    : "#22c55e"
                  }>
                    {String(a.compression)}
                  </Pill>
                </Td>
                <Td>{String(a.distance)}</Td>
                <Td>{String(a.spin)}</Td>
                <Td>{String(a.feel)}</Td>
                <Td>{String(a.forgiveness)}</Td>
                <Td>{a.straightFlight ? <Pill color="#0ea5e9">yes</Pill> : <span style={{ color: "#d1d5db" }}>—</span>}</Td>
                <Td>{hasImage ? <Pill color="#22c55e">real</Pill> : <Pill color="#9ca3af">placeholder</Pill>}</Td>
                <Td>{p.description ? "✓" : <span style={{ color: "#ef4444" }}>missing</span>}</Td>
              </tr>
            );
          })}
        </tbody>
      </TableWrap>
    </div>
  );
}

function AffiliateTab() {

  // Flatten all buy links into audit rows
  type AuditRow = {
    productId: string;
    productName: string;
    region: string;
    retailerKey: string;
    retailerName: string;
    url: string;
    expectedDomain: string;
    source: string;
    isTemporary: boolean;
    notes?: string;
    affiliateNetwork?: string;
    trackingMarker?: string;
    lastCheckedAt?: string;
    lastCheckStatus?: string;
  };

  const rows: AuditRow[] = [];
  for (const p of products) {
    const entry = mattressBuyLinks[p.id];
    if (!entry) {
      rows.push({
        productId: p.id, productName: `${p.brand} ${p.name}`,
        region: "—", retailerKey: "—", retailerName: "—",
        url: "", expectedDomain: "—", source: "missing",
        isTemporary: false, notes: "No buy-link entry found",
      });
      continue;
    }
    for (const region of ["UK", "US"] as const) {
      const links = entry[region] ?? [];
      if (links.length === 0) {
        rows.push({
          productId: p.id, productName: `${p.brand} ${p.name}`,
          region, retailerKey: "—", retailerName: "—",
          url: "", expectedDomain: "—", source: "missing",
          isTemporary: false, notes: `No ${region} links`,
        });
      } else {
        for (const link of links) {
          rows.push({
            productId: p.id, productName: `${p.brand} ${p.name}`,
            region: link.region,
            retailerKey: link.retailerKey,
            retailerName: link.retailerName,
            url: link.url,
            expectedDomain: link.expectedDomain,
            source: link.source,
            isTemporary: link.isTemporary,
            notes: link.notes,
            affiliateNetwork: link.affiliateNetwork,
            trackingMarker: link.trackingMarker,
            lastCheckedAt: link.lastCheckedAt,
            lastCheckStatus: link.lastCheckStatus,
          });
        }
      }
    }
  }

  const totalLinks = rows.filter(r => r.url);
  const ukLinks = rows.filter(r => r.region === "UK" && r.url);
  const usLinks = rows.filter(r => r.region === "US" && r.url);
  const generatedLinks = rows.filter(r => r.isTemporary);
  const missingRows = rows.filter(r => !r.url);

  const [filterRegion, setFilterRegion] = React.useState<"ALL" | "UK" | "US">("ALL");
  const [filterSource, setFilterSource] = React.useState<"ALL" | "existing" | "generated" | "missing">("ALL");
  const [filterRetailer, setFilterRetailer] = React.useState<"ALL" | "amazon" | "scottsdale" | "americanGolf">("ALL");

  const filtered = rows.filter(r => {
    if (filterRegion !== "ALL" && r.region !== filterRegion) return false;
    if (filterSource === "existing" && r.source !== "existing") return false;
    if (filterSource === "generated" && r.source !== "generated") return false;
    if (filterSource === "missing" && r.url) return false;
    if (filterRetailer !== "ALL" && r.retailerKey !== filterRetailer) return false;
    return true;
  });

  function sourcePill(source: string, isTemporary: boolean) {
    const color =
      source === "existing" ? "#22c55e" :
      source === "generated" || isTemporary ? "#f59e0b" :
      source === "missing" ? "#ef4444" : "#9ca3af";
    return <Pill color={color}>{isTemporary ? `${source} (temp)` : source}</Pill>;
  }

  function domainOk(url: string, expected: string) {
    if (!url) return false;
    try { return new URL(url).hostname.replace(/^www\./, "") === expected.replace(/^www\./, ""); }
    catch { return false; }
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <SectionHeading>Affiliate Links — Region-Aware Audit</SectionHeading>

      {/* Summary stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))", gap: 10 }}>
        {[
          { label: "Total links", value: totalLinks.length, note: `across ${products.length} products` },
          { label: "UK links", value: ukLinks.length, note: "amazon + scottsdale + amgolf" },
          { label: "US links", value: usLinks.length, note: "amazon.com" },
          { label: "Generated (temp)", value: generatedLinks.length, note: "need direct URLs" },
          { label: "Missing", value: missingRows.length, note: "no entry at all" },
        ].map(s => (
          <div key={s.label} style={{ background: "#f9fafb", border: "1px solid #e5e7eb", borderRadius: 10, padding: "12px 14px" }}>
            <div style={{ fontSize: 22, fontWeight: 700, color: s.label === "Missing" && s.value > 0 ? "#ef4444" : "#111827" }}>{s.value}</div>
            <div style={{ fontSize: 12, fontWeight: 600, color: "#374151" }}>{s.label}</div>
            <div style={{ fontSize: 11, color: "#9ca3af", marginTop: 2 }}>{s.note}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
        <span style={{ fontSize: 12, color: "#6b7280", fontWeight: 600 }}>Region:</span>
        {(["ALL", "UK", "US"] as const).map(r => (
          <button key={r} onClick={() => setFilterRegion(r)} style={{
            fontSize: 12, padding: "4px 12px", borderRadius: 6, cursor: "pointer", fontWeight: filterRegion === r ? 700 : 400,
            background: filterRegion === r ? "#111827" : "#f3f4f6",
            color: filterRegion === r ? "#fff" : "#374151",
            border: "1px solid #e5e7eb",
          }}>{r}</button>
        ))}
        <span style={{ fontSize: 12, color: "#6b7280", fontWeight: 600, marginLeft: 8 }}>Source:</span>
        {(["ALL", "existing", "generated", "missing"] as const).map(s => (
          <button key={s} onClick={() => setFilterSource(s)} style={{
            fontSize: 12, padding: "4px 12px", borderRadius: 6, cursor: "pointer", fontWeight: filterSource === s ? 700 : 400,
            background: filterSource === s ? "#111827" : "#f3f4f6",
            color: filterSource === s ? "#fff" : "#374151",
            border: "1px solid #e5e7eb",
          }}>{s}</button>
        ))}
        <span style={{ fontSize: 12, color: "#6b7280", fontWeight: 600, marginLeft: 8 }}>Retailer:</span>
        {([
          { key: "ALL", label: "ALL" },
          { key: "amazon", label: "Amazon" },
          { key: "scottsdale", label: "Scottsdale" },
          { key: "americanGolf", label: "American Golf" },
        ] as const).map(r => (
          <button key={r.key} onClick={() => setFilterRetailer(r.key)} style={{
            fontSize: 12,
            padding: "4px 12px",
            borderRadius: 6,
            cursor: "pointer",
            fontWeight: filterRetailer === r.key ? 700 : 400,
            background: filterRetailer === r.key ? "#111827" : "#f3f4f6",
            color: filterRetailer === r.key ? "#fff" : "#374151",
            border: "1px solid #e5e7eb",
          }}>{r.label}</button>
        ))}
      </div>

      {/* Audit table */}
      <TableWrap>
        <thead>
          <tr>
            <Th>Product</Th>
            <Th>ID</Th>
            <Th>Region</Th>
            <Th>Retailer</Th>
            <Th>Key</Th>
            <Th>Expected domain</Th>
            <Th>Domain OK</Th>
            <Th>Source</Th>
            <Th>Affiliate network</Th>
            <Th>Tag</Th>
            <Th>Notes</Th>
            <Th>Open</Th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((row, i) => {
            const ok = domainOk(row.url, row.expectedDomain);
            return (
              <tr key={`${row.productId}-${row.region}-${row.retailerKey}-${i}`}>
                <Td>
                  {row.url ? (
                    <a
                      href={row.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: "#2563eb", textDecoration: "underline", fontWeight: 700 }}
                      title={row.url}
                    >
                      {row.productName}
                    </a>
                  ) : (
                    <strong>{row.productName}</strong>
                  )}
                </Td>
                <Td mono><CopyIdCell value={row.productId} /></Td>
                <Td>
                  <Pill color={row.region === "UK" ? "#3b82f6" : row.region === "US" ? "#8b5cf6" : "#9ca3af"}>
                    {row.region}
                  </Pill>
                </Td>
                <Td>{row.retailerName}</Td>
                <Td mono>{row.retailerKey}</Td>
                <Td mono>{row.expectedDomain}</Td>
                <Td>
                  {row.url
                    ? <Pill color={ok ? "#22c55e" : "#ef4444"}>{ok ? "ok" : "mismatch"}</Pill>
                    : <span style={{ color: "#9ca3af" }}>—</span>
                  }
                </Td>
                <Td>{sourcePill(row.source, row.isTemporary)}</Td>
                <Td mono>{row.affiliateNetwork ?? "—"}</Td>
                <Td mono>{row.trackingMarker ?? "—"}</Td>
                <Td>{row.notes ?? "—"}</Td>
                <Td>
                  {row.url
                    ? <a href={row.url} target="_blank" rel="noopener noreferrer" style={{ color: "#3b82f6", textDecoration: "none", fontSize: 12 }}>Open →</a>
                    : "—"
                  }
                </Td>
              </tr>
            );
          })}
        </tbody>
      </TableWrap>

      <div style={{ fontSize: 12, color: "#9ca3af", display: "flex", flexDirection: "column", gap: 4 }}>
        <p style={{ margin: 0 }}>UK Amazon links use tag <code>findmyidealmattress-21</code> and <code>rel=&quot;sponsored&quot;</code> on rendered CTAs.</p>
        <p style={{ margin: 0 }}>US Amazon links are direct product URLs. Add the US Associates tag once the Amazon.com account is approved.</p>
        <p style={{ margin: 0 }}>John Lewis and Dunelm links are temporary search URLs. Add Awin IDs when those retailer accounts are registered.</p>
      </div>
    </div>
  );
}


function ThemeTab() {
  const router = useRouter();
  const { tokens } = useTheme();
  const config = globalThemeConfig as { themes?: Record<string, string>; theme?: string };
  const [liveTheme, setLiveTheme] = useState(config.themes?.["mattress"] ?? config.themes?.default ?? config.theme ?? "white");
  const [savingTheme, setSavingTheme] = useState<string | null>(null);
  const [saveError, setSaveError] = useState("");
  const [saveSuccess, setSaveSuccess] = useState("");

  const themeInfo: Record<string, { label: string; description: string }> = {
    "white":         { label: "White — Clean",        description: "Minimal SaaS look." },
    "light-green":   { label: "Light Green — Golf",    description: "Fresh outdoor feel. Recommended for this product." },
    "blue":          { label: "Blue — Tech",           description: "Modern digital feel." },
    "classic-navy":  { label: "Classic Navy — US Premium", description: "Deep navy. Trustworthy US-market feel." },
  };

  const handleMakeLive = async (newTheme: string) => {
    setSavingTheme(newTheme);
    setSaveError("");
    setSaveSuccess("");
    try {
      const res = await fetch("/api/admin/set-theme", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // Save under the "mattress" category key as well as the default.
        body: JSON.stringify({ theme: newTheme, category: "mattress" }),
      });
      if (!res.ok) throw new Error("Failed to save theme");
      setLiveTheme(newTheme);
      setSaveSuccess(`${themeInfo[newTheme]?.label ?? newTheme} is now live for mattress.`);
      router.refresh();
    } catch {
      setSaveError("Failed to save theme. Check the server logs.");
    } finally {
      setSavingTheme(null);
    }
  };

  return (
    <div style={{ maxWidth: 560 }}>
      <SectionHeading>Active Theme — Mattress</SectionHeading>
      <p style={{ fontSize: 13, color: "#6b7280", marginBottom: 14 }}>
        Make a theme live for this environment.
      </p>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {themeNames.map((t) => {
          const active = liveTheme === t;
          const info = themeInfo[t] ?? { label: t, description: "" };
          const isSaving = savingTheme === t;
          return (
            <div
              key={t}
              style={{
                padding: "12px 16px",
                border: `2px solid ${active ? tokens.accent : tokens.border}`,
                borderRadius: 10,
                background: active ? tokens.accentSoft : tokens.surface,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                opacity: isSaving ? 0.7 : 1,
                gap: 12,
              }}
            >
              <span style={{ display: "flex", flexDirection: "column", gap: 2, flex: 1 }}>
                <span style={{ color: active ? tokens.accent : tokens.textPrimary, fontWeight: 700 }}>{info.label}</span>
                {info.description && (
                  <span style={{ fontSize: 12, fontWeight: 400, color: active ? tokens.accent : "#9ca3af" }}>
                    {info.description}
                  </span>
                )}
              </span>
              <span style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 8 }}>
                {active && <span style={{ fontSize: 12, background: tokens.accent, color: tokens.accentForeground, borderRadius: 6, padding: "2px 10px" }}>Live</span>}
                <button
                  onClick={() => handleMakeLive(t)}
                  disabled={isSaving || active}
                  style={{
                    minWidth: 92,
                    height: 34,
                    borderRadius: 8,
                    border: `1px solid ${active ? tokens.border : tokens.accent}`,
                    background: active ? tokens.surfaceAlt : tokens.accent,
                    color: active ? tokens.textSecondary : tokens.accentForeground,
                    fontWeight: 700,
                    fontSize: 12,
                    cursor: isSaving || active ? "not-allowed" : "pointer",
                    padding: "0 10px",
                  }}
                >
                  {isSaving ? "Saving..." : active ? "Live" : "Make Live"}
                </button>
              </span>
            </div>
          );
        })}
      </div>
      {saveSuccess && <p style={{ fontSize: 13, color: tokens.success, marginTop: 14 }}>{saveSuccess}</p>}
      {saveError && <p style={{ fontSize: 13, color: "#ef4444", marginTop: 14 }}>{saveError}</p>}
    </div>
  );
}

// ── Main admin page ────────────────────────────────────────────────────────────

const TABS: { id: Tab; label: string }[] = [
  { id: "overview",      label: "Overview" },
  { id: "seo",           label: "SEO Pages" },
  { id: "questions",     label: "MI / Throughput" },
  { id: "questionnaire", label: "Questionnaire" },
  { id: "products",      label: "Products" },
  { id: "affiliate",     label: "Affiliate Links" },
  { id: "theme",         label: "Theme" },
];

export default function MattressAdminPage() {
  const { tokens } = useTheme();
  const [activeTab, setActiveTab] = useState<Tab>("overview");

  return (
    <div style={{ minHeight: "100vh", background: "#f9fafb", padding: "24px 16px" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>

        {/* Header */}
        <div style={{ marginBottom: 24, display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
              <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", color: "#9ca3af" }}>Admin</span>
              <span style={{ color: "#d1d5db" }}>/</span>
              <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", color: "#6366f1" }}>Golf Ball</span>
            </div>
            <h1 style={{ fontSize: 24, fontWeight: 700, color: "#111827", margin: 0 }}>Golf Ball Admin</h1>
            <p style={{ fontSize: 14, color: "#6b7280", margin: "4px 0 0 0" }}>
              Questionnaire v{mattressQuestionnaire.version} &middot; {products.length} products &middot; {mattressQuestionnaire.questions.length} questions
            </p>
          </div>
          <button
            onClick={() => { window.location.href = '/api/admin-logout'; }}
            style={{
              fontSize: 13,
              fontWeight: 600,
              color: "#6b7280",
              border: "1px solid #e5e7eb",
              borderRadius: 7,
              padding: "7px 14px",
              textDecoration: "none",
              background: "#fff",
              whiteSpace: "nowrap",
              cursor: "pointer",
            }}
          >
            Sign out
          </button>
        </div>

        {/* Tab bar */}
        <div style={{
          display: "flex",
          gap: 4,
          borderBottom: "2px solid #e5e7eb",
          marginBottom: 24,
          overflowX: "auto",
          paddingBottom: 0,
        }}>
          {TABS.map(tab => {
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  padding: "10px 16px",
                  border: "none",
                  borderBottom: active ? "2px solid #6366f1" : "2px solid transparent",
                  marginBottom: -2,
                  background: "none",
                  color: active ? "#6366f1" : "#6b7280",
                  fontWeight: active ? 700 : 400,
                  fontSize: 14,
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                }}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Tab content */}
        <div style={{
          background: "#fff",
          border: "1px solid #e5e7eb",
          borderRadius: 12,
          padding: "24px",
        }}>
          {activeTab === "overview"      && <OverviewTab />}
          {activeTab === "seo"           && <SEOTab />}
          {activeTab === "questions"     && <MITab />}
          {activeTab === "questionnaire" && <QuestionnaireTab />}
          {activeTab === "products"      && <ProductsTab />}
          {activeTab === "affiliate"     && <AffiliateTab />}
          {activeTab === "theme"         && <ThemeTab />}
        </div>

      </div>
    </div>
  );
}
