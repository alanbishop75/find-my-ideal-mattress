"use client";
import React from "react";
import Link from "next/link";
import { useTheme } from "../../core/theme";
import { FindMyIdealIcon } from "../../components/icons/FindMyIdealIcon";

interface AdminCardProps {
  href: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  tags: string[];
  accentColor: string;
}

function AdminCard({ href, icon, title, description, tags, accentColor }: AdminCardProps) {
  const { tokens } = useTheme();
  return (
    <Link
      href={href}
      style={{
        display: "block",
        background: tokens.surface,
        border: `1px solid ${tokens.border}`,
        borderRadius: 14,
        padding: "22px 24px",
        textDecoration: "none",
        color: "inherit",
        transition: "box-shadow 0.15s",
        boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
      }}
    >
      <div style={{ display: "flex", alignItems: "flex-start", gap: 16 }}>
        <div style={{
          width: 44, height: 44, borderRadius: 10,
          background: accentColor + "18",
          display: "flex", alignItems: "center", justifyContent: "center",
          flexShrink: 0,
        }}>
          {icon}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <h2 style={{ fontSize: 16, fontWeight: 700, color: tokens.textPrimary, margin: "0 0 4px 0" }}>
            {title}
          </h2>
          <p style={{ fontSize: 13, color: tokens.textSecondary, margin: "0 0 12px 0", lineHeight: 1.5 }}>
            {description}
          </p>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {tags.map(t => (
              <span key={t} style={{
                fontSize: 11, fontWeight: 600, padding: "2px 8px", borderRadius: 5,
                background: accentColor + "18", color: accentColor,
              }}>
                {t}
              </span>
            ))}
          </div>
        </div>
        <span style={{ fontSize: 18, color: tokens.textSecondary, flexShrink: 0, alignSelf: "center" }}>→</span>
      </div>
    </Link>
  );
}

export default function AdminHubPage() {
  const { tokens } = useTheme();

  return (
    <div style={{
      minHeight: "100vh",
      background: tokens.background,
      padding: "40px 16px",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
    }}>
      <div style={{ width: "100%", maxWidth: 560 }}>

        {/* Header */}
        <div style={{ marginBottom: 32 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
            <FindMyIdealIcon size={28} color={tokens.accent} />
            <h1 style={{ fontSize: 22, fontWeight: 700, color: tokens.textPrimary, margin: 0 }}>
              FindMyIdeal Admin
            </h1>
          </div>
          <p style={{ fontSize: 14, color: tokens.textSecondary, margin: 0 }}>
            Select a section below.
          </p>
        </div>

        {/* Cards */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>

          <AdminCard
            href="/admin/mattress"
            icon={<FindMyIdealIcon size={24} color="#2563eb" />}
            title="Mattress Admin"
            description="Overview, SEO pages, questionnaire, products catalogue, affiliate links, and theme."
            tags={["Overview", "SEO", "Questionnaire", "Products", "Affiliate", "Theme"]}
            accentColor="#2563eb"
          />

          <AdminCard
            href="/admin/affiliate-uk-temp"
            icon={<FindMyIdealIcon size={24} color="#16a34a" />}
            title="UK Affiliate Audit"
            description="All 30 UK catalogue entries with verified Amazon ASIN links. Paste SiteStripe-tagged URLs here before launch."
            tags={["30 products", "ASIN links", "SiteStripe", "Affiliate"]}
            accentColor="#16a34a"
          />

          <AdminCard
            href="/admin/theme"
            icon={<FindMyIdealIcon size={24} color={tokens.accent} />}
            title="Theme Settings"
            description="Change the active site theme. Applies globally across all pages."
            tags={["White", "Light Green", "Blue", "Classic Navy"]}
            accentColor={tokens.accent}
          />

        </div>

        {/* Footer */}
        <p style={{ fontSize: 12, color: tokens.textSecondary, marginTop: 32, textAlign: "center", opacity: 0.6 }}>
          <Link href="/" style={{ color: tokens.textSecondary }}>← Back to site</Link>
        </p>

      </div>
    </div>
  );
}

