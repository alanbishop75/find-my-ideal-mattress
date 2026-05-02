import fs from "fs";
const html = fs.readFileSync("scripts/debug-search.html", "utf8");
const parts = html.split(/data-component-type="s-search-result"/);
for (const idx of [1, 7, 14]) {
  const card = parts[idx]?.slice(0, 10000);
  if (!card) continue;
  console.log(`\n=== card slot ${idx} ===`);
  const h2s = [...card.matchAll(/<h2[^>]*>([\s\S]*?)<\/h2>/g)];
  console.log("H2 count:", h2s.length);
  h2s.forEach((m, i) => {
    const text = m[1].replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
    console.log(`  H2[${i}]:`, text.slice(0, 150));
  });
  // Look for <a class="...a-link-normal..."><span>full title</span></a> pattern
  const linkMatches = [...card.matchAll(/<a class="[^"]*a-link-normal[^"]*s-line-clamp[^"]*"[^>]*>([\s\S]*?)<\/a>/g)];
  console.log("a.s-line-clamp count:", linkMatches.length);
  linkMatches.slice(0, 2).forEach((m, i) => {
    console.log(`  link[${i}]:`, m[1].replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim().slice(0, 150));
  });
  // Look for aria-label on product link
  const aria = card.match(/<a[^>]*aria-label="([^"]+)"[^>]*href="\/[^"]*\/dp\//);
  if (aria) console.log("  aria-label:", aria[1].slice(0, 150));
}

