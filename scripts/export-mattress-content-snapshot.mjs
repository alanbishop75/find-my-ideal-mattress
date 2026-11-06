import fs from 'node:fs';
import path from 'node:path';
import { buildInventory } from './mattress-seo-inventory.cjs';
const snapshot = buildInventory();
const directory = path.join(process.cwd(), 'seo-results/content-snapshot');
fs.mkdirSync(directory, { recursive: true });
fs.writeFileSync(path.join(directory, 'mattress.snapshot.json'), `${JSON.stringify(snapshot, null, 2)}\n`);
console.log(JSON.stringify({ pages: snapshot.pages.length, sitemapSource: snapshot.sitemapSource, limitations: snapshot.limitations }, null, 2));
