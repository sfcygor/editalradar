"use server";

import { db } from "@/lib/db";
import { questionAttempts, studySessions, flashcardReviews, goals } from "@/lib/db/schema";
import { requireAuth } from "@/lib/session";
import { eq, sum, sql, and, gte, count } from "drizzle-orm";
import { getEvolutionData } from "./analytics";
import { getGoalsWithProgress } from "./goals";
import { getEditalItems } from "./edital";
import { getSimulados } from "./simulados";

export async function getDashboardData() {
  const session = await requireAuth();

  // Basic totals
  const [questionsCount] = await db().select({ c: count() }).from(questionAttempts).where(eq(questionAttempts.userId, session.userId));
  const [correctCount] = await db().select({ c: count() }).from(questionAttempts).where(and(eq(questionAttempts.userId, session.userId), eq(questionAttempts.isCorrect, true)));
  const [studyMins] = await db().select({ m: sum(studySessions.durationSeconds) }).from(studySessions).where(eq(studySessions.userId, session.userId));
  const [flashcardsCount] = await db().select({ c: count() }).from(flashcardReviews).where(eq(flashcardReviews.userId, session.userId));

  const totalQuestions = Number(questionsCount.c) || 0;
  const correctQuestions = Number(correctCount.c) || 0;
  const accuracy = totalQuestions > 0 ? Math.round((correctQuestions / totalQuestions) * 100) : 0;
  const totalMinutes = Math.floor((Number(studyMins.m) || 0) / 60);

  const evolution = await getEvolutionData();
  const allGoals = await getGoalsWithProgress();
  const dailyGoals = allGoals.filter(g => g.period === "daily");
  
  const editalItems = await getEditalItems();
  const editalDone = editalItems.filter(i => i.done).length;
  const editalProgress = editalItems.length > 0 ? Math.round((editalDone / editalItems.length) * 100) : 0;

  const simulados = await getSimulados();

  const flashcardsCountVal = Number(flashcardsCount.c) || 0;
  
  return {
    totalQuestions,
    accuracy,
    totalMinutes,
    flashcardsCount: flashcardsCountVal,
    evolution,
    dailyGoals,
    editalProgress,
    editalTotal: editalItems.length,
    editalDone,
    simulados,
  };
}
