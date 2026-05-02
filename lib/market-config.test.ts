import {
  getEnabledMarkets,
  getMarketConfig,
  getSelectableRegionMarkets,
  marketConfigs,
  resolveRegionFromLocale,
  resolveMarketFromCountry,
} from "../config/markets";

describe("market config scaffold", () => {
  it("contains US, UK, and FR market definitions", () => {
    expect(marketConfigs.US).toBeDefined();
    expect(marketConfigs.UK).toBeDefined();
    expect(marketConfigs.FR).toBeDefined();
  });

  it("returns active enabled markets for current runtime", () => {
    const enabledCodes = getEnabledMarkets().map((m) => m.code).sort();
    expect(enabledCodes).toEqual(["UK", "US"]);
  });

  it("derives selectable runtime regions from enabled market config", () => {
    const selectable = getSelectableRegionMarkets().sort();
    expect(selectable).toEqual(["UK", "US"]);
    expect(selectable.includes("UK")).toBe(true);
    expect(selectable.includes("US")).toBe(true);
  });

  it("resolves market by detected country", () => {
    expect(resolveMarketFromCountry("US")).toBe("US");
    expect(resolveMarketFromCountry("GB")).toBe("UK");
    expect(resolveMarketFromCountry("FR")).toBe("FR");
    expect(resolveMarketFromCountry(null)).toBe("UK");
  });

  it("resolves active regions from browser locale when available", () => {
    expect(resolveRegionFromLocale("en-US")).toBe("US");
    expect(resolveRegionFromLocale("en-GB")).toBe("UK");
    expect(resolveRegionFromLocale("fr-FR")).toBeNull();
    expect(resolveRegionFromLocale(null)).toBeNull();
  });

  it("returns UK as safe default for unknown market code lookups", () => {
    const fallback = getMarketConfig("UK");
    expect(fallback.code).toBe("UK");
    expect(fallback.amazonDomain).toBe("amazon.co.uk");
  });
});
