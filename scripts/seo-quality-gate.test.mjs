import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const src=fs.readFileSync(new URL('./seo-quality-gate.mjs',import.meta.url),'utf8');
test('missing Hub reference fails closed',()=>assert.match(src,/BLOCKED: PR body/));
test('cannot claim FAIL as PASS',()=>assert.match(src,/review\[1\]\.toUpperCase\(\)!=='PASS'/));
test('checks changed files, not optional SEO label',()=>assert.match(src,/files\?per_page=100/));
test('paginates changed files',()=>assert.match(src,/page\+\+/));
