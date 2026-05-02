import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import { themeNames } from "../../../../core/theme/tokens";

export const runtime = "nodejs";

type SetThemeBody = {
  theme?: unknown;
  category?: unknown;
};

export async function POST(request: Request) {
  let body: SetThemeBody;
  try {
    body = (await request.json()) as SetThemeBody;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { theme, category } = body;

  if (!theme || typeof theme !== "string") {
    return NextResponse.json({ error: "theme is required" }, { status: 400 });
  }

  if (!(themeNames as readonly string[]).includes(theme)) {
    return NextResponse.json(
      { error: `Unknown theme \"${theme}\". Valid options: ${themeNames.join(", ")}` },
      { status: 400 }
    );
  }

  if (category !== undefined && (typeof category !== "string" || !category.trim())) {
    return NextResponse.json({ error: "category must be a non-empty string when provided" }, { status: 400 });
  }

  try {
    const configPath = path.resolve(process.cwd(), "config/global-theme.json");
    let existing: { themes?: Record<string, string> } = {};
    try {
      const raw = await fs.readFile(configPath, "utf-8");
      existing = JSON.parse(raw) as { themes?: Record<string, string> };
    } catch {
      // If config is missing/corrupt, recreate it below.
      existing = {};
    }

    const updated = {
      themes: {
        ...(existing.themes ?? {}),
        default: theme,
        ...(typeof category === "string" ? { [category]: theme } : {}),
      },
    };

    await fs.writeFile(configPath, JSON.stringify(updated, null, 2), "utf-8");
    return NextResponse.json({ success: true, theme, category: category ?? null });
  } catch {
    return NextResponse.json({ error: "Failed to save theme" }, { status: 500 });
  }
}
