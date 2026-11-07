import fs from 'node:fs';
import { validateInventory } from './mattress-seo-inventory.cjs';
const snapshot = JSON.parse(fs.readFileSync('seo-results/content-snapshot/mattress.snapshot.json', 'utf8'));
console.log(JSON.stringify(validateInventory(snapshot), null, 2));
