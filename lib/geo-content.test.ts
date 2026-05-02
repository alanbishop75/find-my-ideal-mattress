import {
  getHomepageIntro,
  getOptionLabelForRegion,
  getQuestionTextForRegion,
} from "../core/geo/content";

describe("geo content helpers", () => {
  it("returns US homepage wording for US users", () => {
    expect(getHomepageIntro("US")).toContain("personalized");
    expect(getHomepageIntro("US")).toContain("no hassle");
  });

  it("returns UK homepage wording for UK users", () => {
    expect(getHomepageIntro("UK")).toContain("personalised");
    expect(getHomepageIntro("UK")).toContain("no faff");
  });

  it("returns fallback text unchanged when no US override exists", () => {
    const fallback = "What is your primary sleep position?";
    expect(getQuestionTextForRegion("sleep-position", fallback, "US")).toBe(fallback);
    expect(getQuestionTextForRegion("sleep-position", fallback, "UK")).toBe(fallback);
  });

  it("returns fallback option label unchanged when no US override exists", () => {
    const fallback = "Side sleeper";
    expect(getOptionLabelForRegion("sleep-position", "side", fallback, "US")).toBe(fallback);
    expect(getOptionLabelForRegion("sleep-position", "side", fallback, "UK")).toBe(fallback);
  });
});
