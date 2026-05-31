"use server";

import { db } from "@/lib/db";
import { studySessions } from "@/lib/db/schema";
import { requireAuth } from "@/lib/session";
import { eq, gte, and, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";

// ─── Save Study Session ───────────────────────────────────────

export async function saveStudySessionAction(
  subject: string,
  topic: string,
  durationSeconds: number,
  startedAt: string // ISO string from client
): Promise<{ success: boolean }> {
  const session = await requireAuth();

  if (durationSeconds < 10) return { success: false }; // ignore tiny sessions

  const startDate = new Date(startedAt);
  const endDate = new Date(startDate.getTime() + durationSeconds * 1000);

  await db().insert(studySessions).values({
    userId: session.userId,
    subject,
    topic: topic || null,
    durationSeconds,
    startedAt: startDate,
    endedAt: endDate,
  });

  revalidatePath("/cronometro");
  revalidatePath("/heatmap");
  revalidatePath("/estatisticas");
  revalidatePath("/dashboard");
  return { success: true };
}

// ─── Get Recent Sessions ──────────────────────────────────────

export async function getRecentSessions(limit = 10) {
  const session = await requireAuth();

  return db()
    .select()
    .from(studySessions)
    .where(eq(studySessions.userId, session.userId))
    .orderBy(sql`${studySessions.endedAt} DESC`)
    .limit(limit);
}

// ─── Get Weekly Stats ─────────────────────────────────────────

export async function getWeeklyStats() {
  const session = await requireAuth();

  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const rows = await db()
    .select({
      date: sql<string>`DATE(${studySessions.endedAt})`,
      totalSeconds: sql<number>`SUM(${studySessions.durationSeconds})`,
    })
    .from(studySessions)
    .where(
      and(
        eq(studySessions.userId, session.userId),
        gte(studySessions.endedAt, sevenDaysAgo)
      )
    )
    .groupBy(sql`DATE(${studySessions.endedAt})`)
    .orderBy(sql`DATE(${studySessions.endedAt})`);

  // Build 7-day array with zeros for missing days
  const days = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
  const result = [];

  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split("T")[0];
    const dayName = days[d.getDay()];
    const row = rows.find((r) => r.date === dateStr);
    result.push({
      day: dayName,
      minutes: row ? Math.round(row.totalSeconds / 60) : 0,
      date: dateStr,
    });
  }

  return result;
}

// ─── Get Today's Study Time ───────────────────────────────────

export async function getTodayStudySeconds() {
  const session = await requireAuth();

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [result] = await db()
    .select({ total: sql<number>`COALESCE(SUM(${studySessions.durationSeconds}), 0)` })
    .from(studySessions)
    .where(
      and(
        eq(studySessions.userId, session.userId),
        gte(studySessions.endedAt, today)
      )
    );

  return Number(result?.total ?? 0);
}

// ─── Get Heatmap Data (365 days) ─────────────────────────────

export async function getHeatmapData() {
  const session = await requireAuth();

  const oneYearAgo = new Date();
  oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

  const rows = await db()
    .select({
      date: sql<string>`DATE(${studySessions.endedAt})`,
      totalMinutes: sql<number>`ROUND(SUM(${studySessions.durationSeconds}) / 60)`,
    })
    .from(studySessions)
    .where(
      and(
        eq(studySessions.userId, session.userId),
        gte(studySessions.endedAt, oneYearAgo)
      )
    )
    .groupBy(sql`DATE(${studySessions.endedAt})`);

  // Map date → minutes
  const minutesByDate = new Map(rows.map((r) => [r.date, Number(r.totalMinutes)]));

  // Build full 365-day array
  const data = [];
  const today = new Date();
  for (let i = 364; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split("T")[0];
    const minutes = minutesByDate.get(dateStr) ?? 0;

    // Level: 0=none, 1=<30min, 2=30-60, 3=60-120, 4=>120
    let level = 0;
    if (minutes > 0 && minutes < 30) level = 1;
    else if (minutes < 60) level = 2;
    else if (minutes < 120) level = 3;
    else if (minutes >= 120) level = 4;

    data.push({ date: dateStr, level, minutes });
  }

  return data;
}

// ─── Get Streak ───────────────────────────────────────────────

export async function getStreak() {
  const data = await getHeatmapData();

  let current = 0;
  let longest = 0;
  let running = 0;

  for (let i = data.length - 1; i >= 0; i--) {
    if (data[i].level > 0) {
      if (i === data.length - 1 || current > 0) current++;
      running++;
      longest = Math.max(longest, running);
    } else {
      if (i === data.length - 1) current = 0;
      running = 0;
    }
  }

  return { current, longest, studiedDays: data.filter((d) => d.level > 0).length };
}
