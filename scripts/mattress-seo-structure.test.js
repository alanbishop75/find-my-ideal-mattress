/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require("fs");
const path = require("path");

describe("Mattress SEO agent MVP structure", () => {
  const root = process.cwd();
  const read = (relativePath) => fs.readFileSync(path.join(root, relativePath), "utf8");

  it("ships one Mattress agent and four Mattress-owned operational skills", () => {
    expect(read(".github/agents/mattress-seo.agent.md")).toContain("Mattress SEO Agent");
    ["analyse-mattress-gsc-performance", "deep-dive-winning-mattress-seo-page", "compare-and-improve-mattress-seo-pages", "validate-and-measure-mattress-seo-changes"].forEach((skill) => expect(read(`.github/skills/${skill}/SKILL.md`)).toContain("Mattress"));
  });

  it("requires full inventory, UK/US separation, credible sitemap dates, rendered links, and approval", () => {
    const agent = read(".github/agents/mattress-seo.agent.md");
    ["zero-impression", "UK and US", "rendered internal links", "Stop for approval before", "must not freeze useful work elsewhere"].forEach((phrase) => expect(agent).toContain(phrase));
    expect(read("scripts/export-mattress-content-snapshot.mjs")).toContain("rendered-link-map");
    expect(read("scripts/run-mattress-seo-report.mjs")).toContain("credible page-level modification date");
  });
});