import fs from 'node:fs';
import path from 'node:path';
import { calculateGscWindows } from './mattress-seo-windows.cjs';
import { buildReport } from './mattress-seo-evidence.cjs';
import { validateInventory } from './mattress-seo-inventory.cjs';
const inventory = JSON.parse(fs.readFileSync('seo-results/content-snapshot/mattress.snapshot.json', 'utf8'));
validateInventory(inventory);
const windows = calculateGscWindows();
const snapshots = {};
for (const name of ['latest', 'previous', 'discovery']) {
  const range = windows[name];
  const file = path.join('seo-results/gsc/direct', `mattress-gsc-${range.startDate}-to-${range.endDate}.json`);
  try { snapshots[name] = JSON.parse(fs.readFileSync(file, 'utf8')); }
  catch { snapshots[name] = null; }
}
const result = buildReport(inventory, snapshots, windows);
fs.writeFileSync('seo-results/mattress-seo-agent-report-latest.md', result.report);
console.log(JSON.stringify({ reportFile: 'seo-results/mattress-seo-agent-report-latest.md', inventoryPages: inventory.pages.length, directEvidence: result.evidenceAvailable, unavailable: result.unavailable, automaticContentAction: false }, null, 2));
