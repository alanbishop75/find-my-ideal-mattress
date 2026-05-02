import type { Region } from "../core/geo/types";

export type MarketCode = Region | "FR";

export type MarketCurrency = "USD" | "GBP" | "EUR";

export type MarketLocale = "en-US" | "en-GB" | "fr-FR";

export interface MarketConfig {
  code: MarketCode;
  label: string;
  enabled: boolean;
  currency: MarketCurrency;
  locale: MarketLocale;
  legalViewLabel: string;
  contentViewLabel: string;
  affiliateDisclosureText: string;
  amazonDomain: string;
  amazonAssociatesReady: boolean;
}

export const marketConfigs: Record<MarketCode, MarketConfig> = {
  US: {
    code: "US",
    label: "United States",
    enabled: true,
    currency: "USD",
    locale: "en-US",
    legalViewLabel: "legal details for the United States",
    contentViewLabel: "information for the United States",
    affiliateDisclosureText:
      "Some links on this site are affiliate links. We may earn a commission on qualifying purchases.",
    amazonDomain: "amazon.com",
    amazonAssociatesReady: true,
  },
  UK: {
    code: "UK",
    label: "United Kingdom",
    enabled: true,
    currency: "GBP",
    locale: "en-GB",
    legalViewLabel: "legal details for the United Kingdom",
    contentViewLabel: "information for the United Kingdom",
    affiliateDisclosureText:
      "Some links on this site are affiliate links. We may earn a commission on qualifying purchases.",
    amazonDomain: "amazon.co.uk",
    amazonAssociatesReady: true,
  },
  FR: {
    code: "FR",
    label: "France",
    enabled: false,
    currency: "EUR",
    locale: "fr-FR",
    legalViewLabel: "legal details for France",
    contentViewLabel: "information for France",
    affiliateDisclosureText:
      "Certains liens de ce site sont des liens d'affiliation. Nous pouvons recevoir une commission sur les achats eligibles.",
    amazonDomain: "amazon.fr",
    amazonAssociatesReady: false,
  },
};

export const defaultMarketCode: MarketCode = "UK";

export const activeRegionMarkets: Region[] = ["US", "UK"];

export function getMarketConfig(code: MarketCode): MarketConfig {
  return marketConfigs[code] ?? marketConfigs[defaultMarketCode];
}

export function getEnabledMarkets(): MarketConfig[] {
  return Object.values(marketConfigs).filter((m) => m.enabled);
}

export function getSelectableRegionMarkets(): Region[] {
  const enabledCodes = new Set(getEnabledMarkets().map((m) => m.code));
  return activeRegionMarkets.filter((code) => enabledCodes.has(code));
}

export function resolveMarketFromCountry(country: string | null): MarketCode {
  if (country === "US") return "US";
  if (country === "GB" || country === "UK") return "UK";
  if (country === "FR") return "FR";
  return defaultMarketCode;
}

export function resolveRegionFromLocale(locale: string | null): Region | null {
  if (!locale) return null;

  const normalized = locale.toLowerCase();
  if (normalized === "en-us" || normalized.startsWith("en-us,")) return "US";
  if (normalized === "en-gb" || normalized.startsWith("en-gb,")) return "UK";

  return null;
}
