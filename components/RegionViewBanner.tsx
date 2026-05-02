"use client";

import { useTheme } from "../core/theme";
import { useRegion } from "../core/geo/RegionContext";
import { getMarketConfig, getSelectableRegionMarkets } from "../config/markets";

interface RegionViewBannerProps {
  audience: "content" | "legal";
}

export function RegionViewBanner({ audience }: RegionViewBannerProps) {
  const { tokens } = useTheme();
  const { region, setRegion, detectedRegion, isOverridden, isLoading } = useRegion();

  if (isLoading) return null;

  const selectableRegions = getSelectableRegionMarkets();
  const currentMarket = getMarketConfig(region);
  const label = audience === "legal"
    ? `Showing ${currentMarket.legalViewLabel}`
    : `Showing ${currentMarket.contentViewLabel}`;
  const detail = isOverridden
    ? "You changed this region manually."
    : detectedRegion
      ? "Picked automatically from your location."
      : "";

  function handleSelect(nextRegion: string) {
    if (!selectableRegions.includes(nextRegion as typeof selectableRegions[number])) return;
    setRegion(nextRegion as "UK" | "US");
  }

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 10,
        flexWrap: "wrap",
        marginBottom: 18,
        background: tokens.surfaceAlt,
        border: `1px solid ${tokens.border}`,
        borderRadius: 10,
        padding: "10px 12px",
      }}
    >
      <div style={{ fontSize: 12, color: tokens.textSecondary }}>
        <strong style={{ color: tokens.textPrimary }}>{label}</strong>
        {detail ? <span>{` ${detail}`}</span> : null}
      </div>
      <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, color: tokens.textSecondary }}>
        <span>Switch region</span>
        <select
          value={region}
          onChange={(e) => handleSelect(e.target.value)}
          style={{
            background: tokens.surface,
            border: `1px solid ${tokens.border}`,
            borderRadius: 6,
            padding: "4px 8px",
            fontSize: 12,
            fontWeight: 600,
            color: tokens.textPrimary,
          }}
        >
          {selectableRegions.map((code) => {
            const market = getMarketConfig(code);
            return (
              <option key={code} value={code}>
                {market.label}
              </option>
            );
          })}
        </select>
      </label>
    </div>
  );
}
