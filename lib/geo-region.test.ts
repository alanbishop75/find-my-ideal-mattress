import { resolveRegionFromCountry } from "../pages/api/geo-region";

describe("resolveRegionFromCountry", () => {
  it("maps US to US region", () => {
    expect(resolveRegionFromCountry("US")).toBe("US");
  });

  it("maps GB and UK to UK region", () => {
    expect(resolveRegionFromCountry("GB")).toBe("UK");
    expect(resolveRegionFromCountry("UK")).toBe("UK");
  });

  it("falls back to UK for unknown or missing countries", () => {
    expect(resolveRegionFromCountry("CA")).toBe("UK");
    expect(resolveRegionFromCountry(null)).toBe("UK");
  });
});
