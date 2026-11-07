/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require("fs");
const path = require("path");
const { ACTION_LABELS, assertMattressProperty, classifyAction } = require("./mattress-seo-policy.cjs");
const { calculateGscWindows } = require("./mattress-seo-windows.cjs");

describe("Mattress SEO agent policy", () => {
  const root = process.cwd();

  it("isolates the exact Mattress property and rejects cross-product evidence", () => {
    expect(assertMattressProperty("sc-domain:findyouridealmattress.com")).toBe("sc-domain:findyouridealmattress.com");
    ["sc-domain:findyouridealpillow.com", "sc-domain:findyouridealgolfball.com", "sc-domain:findyouridealcoffee.com", "sc-domain:solar.example"].forEach((property) => expect(() => assertMattressProperty(property)).toThrow());
  });

  it("uses complete, non-overlapping evidence windows", () => {
    expect(calculateGscWindows("2026-09-07")).toMatchObject({
      excludedNewestDays: 3,
      latest: { startDate: "2026-08-08", endDate: "2026-09-04" },
      previous: { startDate: "2026-07-11", endDate: "2026-08-07" },
      discovery: { startDate: "2026-06-07", endDate: "2026-09-04" },
    });
  });

  it("allows distinct action labels without treating monitoring as implementation", () => {
    ACTION_LABELS.forEach(classifyAction);
    expect(() => classifyAction("Wait for data")).toThrow();
  });

  it("documents scoped protection and approval boundaries once the agent exists", () => {
    const agentPath = path.join(root, ".github", "agents", "mattress-seo.agent.md");
    if (!fs.existsSync(agentPath)) return;
    const agent = fs.readFileSync(agentPath, "utf8");
    ["must not freeze useful work elsewhere", "Five monitoring entries are not five opportunities", "Stop for approval before changing content", "affiliate destinations"].forEach((phrase) => expect(agent).toContain(phrase));
  });
});