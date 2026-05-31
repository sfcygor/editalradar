"use server";

import { db } from "@/lib/db";
import { goals, questionAttempts, studySessions, flashcardReviews } from "@/lib/db/schema";
import { requireAuth } from "@/lib/session";
import { eq, and, gte, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";

// ─── Create Goal ──────────────────────────────────────────────

export async function createGoalAction(formData: FormData) {
  const session = await requireAuth();

  const label = formData.get("label") as string;
  const targetType = formData.get("targetType") as string;
  const targetValueStr = formData.get("targetValue") as string;
  const period = formData.get("period") as string;

  const targetValue = parseInt(targetValueStr, 10);
  if (!label || !targetType || isNaN(targetValue) || !period) {
    return { error: "Todos os campos são obrigatórios." };
  }

  await db().insert(goals).values({
    userId: session.userId,
    label,
    targetType,
    targetValue,
    period,
  });

  revalidatePath("/metas");
  return { success: true };
}

// ─── Delete Goal ──────────────────────────────────────────────

export async function deleteGoalAction(goalId: string) {
  const session = await requireAuth();

  await db()
    .delete(goals)
    .where(and(eq(goals.id, goalId), eq(goals.userId, session.userId)));

  revalidatePath("/metas");
}

// ─── Get Goals With Progress ──────────────────────────────────

export async function getGoalsWithProgress() {
  const session = await requireAuth();

  const userGoals = await db()
    .select()
    .from(goals)
    .where(eq(goals.userId, session.userId))
    .orderBy(goals.createdAt);

  if (userGoals.length === 0) return [];

  // Determine start of day and start of week
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const startOfWeek = new Date(today);
  startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay()); // Sunday

  // Get aggregated stats for today
  const [todaySessions] = await db()
    .select({ minutes: sql<number>`COALESCE(SUM(${studySessions.durationSeconds}), 0) / 60` })
    .from(studySessions)
    .where(and(eq(studySessions.userId, session.userId), gte(studySessions.endedAt, today)));

  const [todayQuestions] = await db()
    .select({ count: sql<number>`COUNT(*)` })
    .from(questionAttempts)
    .where(and(eq(questionAttempts.userId, session.userId), gte(questionAttempts.attemptedAt, today)));

  const [todayFlashcards] = await db()
    .select({ count: sql<number>`COUNT(*)` })
    .from(flashcardReviews)
    .where(and(eq(flashcardReviews.userId, session.userId), gte(flashcardReviews.lastReview, today)));

  // Get aggregated stats for this week
  const [weekSessions] = await db()
    .select({ minutes: sql<number>`COALESCE(SUM(${studySessions.durationSeconds}), 0) / 60` })
    .from(studySessions)
    .where(and(eq(studySessions.userId, session.userId), gte(studySessions.endedAt, startOfWeek)));

  const [weekQuestions] = await db()
    .select({ count: sql<number>`COUNT(*)` })
    .from(questionAttempts)
    .where(and(eq(questionAttempts.userId, session.userId), gte(questionAttempts.attemptedAt, startOfWeek)));

  const [weekFlashcards] = await db()
    .select({ count: sql<number>`COUNT(*)` })
    .from(flashcardReviews)
    .where(and(eq(flashcardReviews.userId, session.userId), gte(flashcardReviews.lastReview, startOfWeek)));

  // Get all-time (forever)
  const [allTimeSessions] = await db()
    .select({ minutes: sql<number>`COALESCE(SUM(${studySessions.durationSeconds}), 0) / 60` })
    .from(studySessions)
    .where(eq(studySessions.userId, session.userId));

  const [allTimeQuestions] = await db()
    .select({ count: sql<number>`COUNT(*)` })
    .from(questionAttempts)
    .where(eq(questionAttempts.userId, session.userId));

  const [allTimeFlashcards] = await db()
    .select({ count: sql<number>`COUNT(*)` })
    .from(flashcardReviews)
    .where(eq(flashcardReviews.userId, session.userId));

  return userGoals.map((g) => {
    let current = 0;

    if (g.period === "daily") {
      if (g.targetType === "time_minutes") current = Number(todaySessions.minutes);
      else if (g.targetType === "questions") current = Number(todayQuestions.count);
      else if (g.targetType === "flashcards") current = Number(todayFlashcards.count);
    } else if (g.period === "weekly") {
      if (g.targetType === "time_minutes") current = Number(weekSessions.minutes);
      else if (g.targetType === "questions") current = Number(weekQuestions.count);
      else if (g.targetType === "flashcards") current = Number(weekFlashcards.count);
    } else if (g.period === "forever") {
      if (g.targetType === "time_minutes") current = Number(allTimeSessions.minutes);
      else if (g.targetType === "questions") current = Number(allTimeQuestions.count);
      else if (g.targetType === "flashcards") current = Number(allTimeFlashcards.count);
    }

    current = Math.floor(current);

    return {
      ...g,
      currentValue: current,
      progressPct: Math.min(100, Math.round((current / g.targetValue) * 100)),
      isCompleted: current >= g.targetValue,
    };
  });
}
