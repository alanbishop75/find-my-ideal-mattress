/**
 * lib/buy-links.test.ts
 *
 * Mattress buy-links validation.
 *
 * Phase: 5 — direct-ASIN links live (isTemporary: false, source: manual).
 * Rules:
 *  - Every product has a buy-links map entry
 *  - All UK links are direct Amazon UK ASIN URLs (/dp/<ASIN>) with the
 *    correct associate tag
 *  - No US links yet
 *  - All present link URLs start with https://
 */

import { mattressBuyLinks, getRegionLinks } from "../config/mattress/buy-links";
import { products } from "../config/mattress/products";
import { scoreMattress } from "../config/mattress/scoring";

describe('mattress buy-links — phase 5 (direct ASIN links)', () => {

  it('mattressBuyLinks is importable and is an object', () => {
    expect(typeof mattressBuyLinks).toBe('object');
  });

  it('every product has a buy-links map entry', () => {
    for (const p of products) {
      expect(mattressBuyLinks[p.id]).toBeDefined();
    }
  });

  it('all UK links are amazon.co.uk direct ASIN URLs with correct associate tag', () => {
    for (const [, links] of Object.entries(mattressBuyLinks)) {
      for (const link of links.UK ?? []) {
        expect(link.url).toMatch(/^https:\/\/www\.amazon\.co\.uk\/dp\/[A-Z0-9]{10}\?tag=findyouridealmattress-21$/);
        expect(link.expectedDomain).toBe('amazon.co.uk');
      }
    }
  });

  it('all UK links are non-temporary in phase 5 (verified direct ASINs)', () => {
    for (const [, links] of Object.entries(mattressBuyLinks)) {
      for (const link of links.UK ?? []) {
        expect(link.isTemporary).toBe(false);
        expect(link.source).toBe('manual');
      }
    }
  });

  it('no US buy-links in this phase', () => {
    for (const [, links] of Object.entries(mattressBuyLinks)) {
      expect((links.US ?? []).length).toBe(0);
    }
  });

  it('all present link URLs start with https://', () => {
    for (const [, links] of Object.entries(mattressBuyLinks)) {
      for (const link of [...(links.UK ?? []), ...(links.US ?? [])]) {
        expect(link.url).toMatch(/^https:\/\//);
      }
    }
  });

  it('isTemporary links never have source=manual', () => {
    for (const [, links] of Object.entries(mattressBuyLinks)) {
      for (const link of [...(links.UK ?? []), ...(links.US ?? [])]) {
        if (link.isTemporary) {
          expect(link.source).not.toBe('manual');
        }
      }
    }
  });

  it('REMOVE_FROM_CATALOGUE products have empty UK arrays', () => {
    for (const p of products) {
      if (p.ukAmazonVerification?.status === 'REMOVE_FROM_CATALOGUE') {
        const ukLinks = mattressBuyLinks[p.id]?.UK ?? [];
        expect(ukLinks.length).toBe(0);
      }
    }
  });

  it('getRegionLinks returns empty array for unknown product', () => {
    expect(getRegionLinks('unknown-product', 'UK')).toEqual([]);
    expect(getRegionLinks('unknown-product', 'US')).toEqual([]);
  });

  it('scoring engine is importable', () => {
    expect(typeof scoreMattress).toBe('function');
  });

  it('product catalogue has at least 15 products (Amazon-UK-only verified)', () => {
    expect(products.length).toBeGreaterThanOrEqual(15);
  });

  it('all products have a ukAmazonVerification status', () => {
    for (const p of products) {
      expect(p.ukAmazonVerification).toBeDefined();
      expect(p.ukAmazonVerification?.status).toBeTruthy();
    }
  });
});
