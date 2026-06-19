import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const dir = path.join(process.cwd(), ".event-data");
    const logPath = path.join(dir, "event-log.csv");
    fs.mkdirSync(dir, { recursive: true });

    const row = [
      new Date().toISOString(),
      body.event ?? "",
      body.quizId ?? "",
      body.questionId ?? "",
      body.answerId ?? "",
      body.creativeId ?? "",
      body.hookId ?? "",
      body.campaignId ?? "",
      body.source ?? "",
      JSON.stringify(body.meta ?? {}),
    ]
      .map((v) => String(v).replace(/\n|\r|,/g, " "))
      .join(",") + "\n";

    fs.appendFileSync(logPath, row, "utf8");
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json({ ok: false, error: String(error) }, { status: 400 });
  }
}