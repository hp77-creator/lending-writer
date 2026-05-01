import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const appId = searchParams.get('appId');

  if (!appId) {
    return NextResponse.json({ error: "appId is required" }, { status: 400 });
  }

  try {
    const stmt = db.prepare('SELECT * FROM decisions WHERE app_id = ?');
    const decision = stmt.get(appId);
    
    return NextResponse.json({ decision: decision || null });
  } catch (error) {
    console.error("Error fetching decision:", error);
    return NextResponse.json({ error: "Failed to fetch decision" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { appId, decision, timeSpentSeconds } = await request.json();

    if (!appId || !decision || typeof timeSpentSeconds !== 'number') {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const stmt = db.prepare(`
      INSERT INTO decisions (app_id, decision, time_spent_seconds)
      VALUES (?, ?, ?)
      ON CONFLICT(app_id) DO UPDATE SET 
        decision = excluded.decision,
        time_spent_seconds = excluded.time_spent_seconds,
        created_at = CURRENT_TIMESTAMP
    `);
    
    stmt.run(appId, decision, timeSpentSeconds);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error saving decision:", error);
    return NextResponse.json({ error: "Failed to save decision" }, { status: 500 });
  }
}
