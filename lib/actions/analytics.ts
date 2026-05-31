"use server";

import { db } from "@/lib/db";
import { questionAttempts, questions, flashcardReviews, flashcards, flashcardDecks } from "@/lib/db/schema";
import { requireAuth } from "@/lib/session";
import { eq, and, sql, gte } from "drizzle-orm";

export async function getPerformanceBySubject() {
  const session = await requireAuth();

  const attempts = await db()
    .select({
      subject: questions.subject,
      isCorrect: questionAttempts.isCorrect,
    })
    .from(questionAttempts)
    .innerJoin(questions, eq(questionAttempts.questionId, questions.id))
    .where(eq(questionAttempts.userId, session.userId));

  const statsMap = new Map<string, { total: number; correct: number }>();

  for (const a of attempts) {
    const s = statsMap.get(a.subject) || { total: 0, correct: 0 };
    s.total++;
    if (a.isCorrect) s.correct++;
    statsMap.set(a.subject, s);
  }

  return Array.from(statsMap.entries()).map(([subject, stats]) => ({
    subject,
    accuracy: Math.round((stats.correct / stats.total) * 100),
    total: stats.total,
  }));
}

export async function getRetentionData() {
  const session = await requireAuth();

  // For real retention, we'll calculate the % of flashcards with easiness >= 2.0 (mastered)
  const reviews = await db()
    .select({
      subject: flashcardDecks.subject,
      easiness: flashcardReviews.easiness,
    })
    .from(flashcardReviews)
    .innerJoin(flashcards, eq(flashcardReviews.flashcardId, flashcards.id))
    .innerJoin(
      // We need to import flashcardDecks here to avoid circular dep issues at top level
      require("@/lib/db/schema").flashcardDecks,
      eq(flashcards.deckId, require("@/lib/db/schema").flashcardDecks.id)
    )
    .where(eq(flashcardReviews.userId, session.userId));

  const statsMap = new Map<string, { total: number; mastered: number }>();

  for (const r of reviews) {
    const s = statsMap.get(r.subject) || { total: 0, mastered: 0 };
    s.total++;
    if (r.easiness >= 2.0) s.mastered++;
    statsMap.set(r.subject, s);
  }

  return Array.from(statsMap.entries()).map(([subject, stats]) => ({
    subject,
    retention: Math.round((stats.mastered / stats.total) * 100),
  }));
}

export async function getEvolutionData() {
  const session = await requireAuth();

  // Return accuracy per month for the last 6 months
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
  sixMonthsAgo.setDate(1);

  const rows = await db()
    .select({
      monthStr: sql<string>`TO_CHAR(${questionAttempts.attemptedAt}, 'MM')`,
      yearStr: sql<string>`TO_CHAR(${questionAttempts.attemptedAt}, 'YYYY')`,
      total: sql<number>`COUNT(*)`,
      correct: sql<number>`SUM(CASE WHEN ${questionAttempts.isCorrect} THEN 1 ELSE 0 END)`,
    })
    .from(questionAttempts)
    .where(
      and(
        eq(questionAttempts.userId, session.userId),
        gte(questionAttempts.attemptedAt, sixMonthsAgo)
      )
    )
    .groupBy(
      sql`TO_CHAR(${questionAttempts.attemptedAt}, 'YYYY')`,
      sql`TO_CHAR(${questionAttempts.attemptedAt}, 'MM')`
    )
    .orderBy(
      sql`TO_CHAR(${questionAttempts.attemptedAt}, 'YYYY')`,
      sql`TO_CHAR(${questionAttempts.attemptedAt}, 'MM')`
    );

  const monthNames = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];

  return rows.map((r) => ({
    month: `${monthNames[Number(r.monthStr) - 1]}`,
    accuracy: Math.round((Number(r.correct) / Number(r.total)) * 100),
  }));
}
