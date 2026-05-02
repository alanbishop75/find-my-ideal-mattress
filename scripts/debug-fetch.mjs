// Quick debug — dump one search HTML to disk
import fs from "fs";

const HEADERS = {
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
  "Accept":
    "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8",
  "Accept-Language": "en-GB,en;q=0.9",
  "Sec-Ch-Ua": '"Chromium";v="124", "Google Chrome";v="124", "Not-A.Brand";v="99"',
  "Sec-Ch-Ua-Mobile": "?0",
  "Sec-Ch-Ua-Platform": '"Windows"',
  "Sec-Fetch-Dest": "document",
  "Sec-Fetch-Mode": "navigate",
  "Sec-Fetch-Site": "none",
  "Sec-Fetch-User": "?1",
  "Upgrade-Insecure-Requests": "1",
  "Cookie": "i18n-prefs=GBP; lc-acbuk=en_GB",
};

const url = "https://www.amazon.co.uk/s?k=" + encodeURIComponent("Silentnight 7 zone memory foam double mattress");
const res = await fetch(url, { headers: HEADERS, signal: AbortSignal.timeout(15_000), redirect: "follow" });
const html = await res.text();
fs.writeFileSync("scripts/debug-search.html", html);
console.log(`Status: ${res.status}, length: ${html.length}`);
console.log(`Has 's-search-result': ${html.includes("s-search-result")}`);
console.log(`Has 'data-asin=': ${html.includes("data-asin=")}`);
console.log(`Has 'Sorry': ${html.includes("Sorry, we just need")}`);

// Find the first 3 data-asin instances and a chunk around them
const matches = [...html.matchAll(/data-asin="([A-Z0-9]{10})"/g)].slice(0, 5);
for (const mm of matches) {
  const start = Math.max(0, mm.index - 100);
  console.log("---");
  console.log(html.slice(start, mm.index + 200).replace(/\s+/g, " "));
}
