import type { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';
import { themeNames } from '../../core/theme/tokens';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  const { theme, category } = req.body as { theme?: unknown; category?: unknown };
  if (!theme || typeof theme !== 'string') {
    return res.status(400).json({ error: 'theme is required' });
  }
  // Guard against unknown theme names being written to disk.
  if (!(themeNames as readonly string[]).includes(theme)) {
    return res.status(400).json({ error: `Unknown theme "${theme}". Valid options: ${themeNames.join(', ')}` });
  }
  // category is optional — if provided it must be a non-empty string.
  if (category !== undefined && (typeof category !== 'string' || !category.trim())) {
    return res.status(400).json({ error: 'category must be a non-empty string when provided' });
  }
  try {
    const configPath = path.resolve(process.cwd(), 'config/global-theme.json');
    const existing = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
    const updated = {
      themes: {
        ...(existing.themes ?? {}),
        // Always update the default to keep everything consistent.
        default: theme,
        // If a category is provided, also save it under that key.
        ...(typeof category === 'string' ? { [category]: theme } : {}),
      },
    };
    fs.writeFileSync(configPath, JSON.stringify(updated, null, 2));
    return res.status(200).json({ success: true });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to save theme' });
  }
}

