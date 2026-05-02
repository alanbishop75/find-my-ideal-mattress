"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { themeNames } from "../../core/theme";
import { useTheme } from "../../core/theme";
import { useCategoryContext } from "../../core/category-context";
import { ThemeName } from "../../core/theme/tokens";

type ThemeInfo = {
  label: string;
  description: string;
  fit: string;
  swatches: [string, string, string];
};

// Human-readable metadata. Add an entry whenever a theme is added.
const themeInfo: Record<string, ThemeInfo> = {
  "white": {
    label: "White — Clean",
    description: "Minimal SaaS look. Suits hub/generic product pages.",
    fit: "Hub / Generic",
    swatches: ["#ffffff", "#2563eb", "#18181b"],
  },
  "light-green": {
    label: "Light Green — Golf",
    description: "Fresh outdoor feel. Suits golf balls, sports accessories.",
    fit: "Golf / Sports",
    swatches: ["#f6fbf7", "#3bb273", "#1a3d2f"],
  },
  "blue": {
    label: "Blue — Tech",
    description: "Modern digital feel. Suits headphones, electronics, software.",
    fit: "Tech / Digital",
    swatches: ["#f7faff", "#2563eb", "#1a2340"],
  },
  "classic-navy": {
    label: "Classic Navy — US Premium",
    description: "Deep navy + clean white. Trustworthy, authoritative US-market feel.",
    fit: "US Premium / Trust",
    swatches: ["#f8f9fc", "#1b3a6e", "#1c2340"],
  },
};

function ThemeAdminInner() {
  const router = useRouter();
  const { tokens, themeName } = useTheme();
  const { categoryId } = useCategoryContext();
  const [liveTheme, setLiveTheme] = useState<ThemeName>(themeName);
  const [savingTheme, setSavingTheme] = useState<string | null>(null);
  const [saveError, setSaveError] = useState("");
  const [saveSuccess, setSaveSuccess] = useState("");

  const handleMakeLive = async (newTheme: string) => {
    setSavingTheme(newTheme);
    setSaveError("");
    setSaveSuccess("");
    try {
      const res = await fetch("/api/admin/set-theme", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ theme: newTheme, category: categoryId }),
      });
      if (!res.ok) throw new Error("Failed to save theme");
      setLiveTheme(newTheme as ThemeName);
      setSaveSuccess(`${themeInfo[newTheme]?.label ?? newTheme} is now live for ${categoryId}.`);
      router.refresh();
    } catch {
      setSaveError("Failed to save theme. Check the server logs.");
    } finally {
      setSavingTheme(null);
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: tokens.background, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <main style={{ width: "100%", maxWidth: 640 }}>
        <div style={{ background: tokens.surface, border: `1px solid ${tokens.border}`, borderRadius: 14, padding: 28, boxShadow: "0 2px 12px rgba(0,0,0,0.05)" }}>
          <h2 style={{ fontSize: 20, fontWeight: 700, color: tokens.textPrimary, marginBottom: 6 }}>Theme Settings</h2>
          <p style={{ fontSize: 14, color: tokens.textSecondary, marginBottom: 6 }}>
            Make a theme live for this environment.
          </p>
          <p style={{ fontSize: 12, color: tokens.textSecondary, margin: "0 0 20px 0", opacity: 0.8 }}>
            Environment category: <strong>{categoryId}</strong>. The admin page and public pages update after save.
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
                    gap: 12,
                    opacity: isSaving ? 0.7 : 1,
                  }}
                >
                  <span style={{ display: "flex", flexDirection: "column", gap: 4, flex: 1 }}>
                    <span style={{ color: active ? tokens.accent : tokens.textPrimary, fontWeight: 700, fontSize: 15 }}>{info.label}</span>
                    {info.description && (
                      <span style={{ fontSize: 12, fontWeight: 400, color: active ? tokens.accent : tokens.textSecondary, opacity: 0.9 }}>
                        {info.description}
                      </span>
                    )}
                    <span style={{ fontSize: 11, color: tokens.textSecondary, opacity: 0.85 }}>
                      Best fit: {info.fit}
                    </span>
                    <span style={{ display: "flex", gap: 6, marginTop: 2 }}>
                      {info.swatches.map((swatch) => (
                        <span
                          key={`${t}-${swatch}`}
                          style={{
                            width: 14,
                            height: 14,
                            borderRadius: 999,
                            border: `1px solid ${tokens.border}`,
                            background: swatch,
                            display: "inline-block",
                          }}
                        />
                      ))}
                    </span>
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
      </main>
    </div>
  );
}

export default function ThemeAdmin() {
  return <ThemeAdminInner />;
}
