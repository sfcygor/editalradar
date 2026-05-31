"use server";

import { db } from "@/lib/db";
import { simulados, simuladoQuestions, questions } from "@/lib/db/schema";
import { requireAuth } from "@/lib/session";
import { eq, sql, desc, and } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function createSimuladoAction(formData: FormData) {
  const session = await requireAuth();

  const name = formData.get("name") as string;
  const totalQuestions = parseInt(formData.get("totalQuestions") as string, 10);
  const durationMinutes = parseInt(formData.get("durationMinutes") as string, 10);
  const subject = formData.get("subject") as string;

  if (!name || isNaN(totalQuestions)) return { error: "Nome e total de questões são obrigatórios." };

  // Fetch N random questions
  const conditions = [eq(questions.userId, session.userId)];
  if (subject && subject !== "Todas as Matérias") {
    conditions.push(eq(questions.subject, subject));
  }

  const selectedQuestions = await db()
    .select({ id: questions.id })
    .from(questions)
    .where(and(...conditions))
    .orderBy(sql`RANDOM()`)
    .limit(totalQuestions);

  if (selectedQuestions.length === 0) {
    return { error: "Não há questões suficientes no banco para este simulado." };
  }

  const [sim] = await db()
    .insert(simulados)
    .values({
      userId: session.userId,
      name,
      totalQuestions: selectedQuestions.length, // actual limit
      durationMinutes: isNaN(durationMinutes) ? null : durationMinutes,
      subjects: subject !== "Todas as Matérias" ? [subject] : [],
    })
    .returning();

  const simQuestionsData = selectedQuestions.map((q) => ({
    simuladoId: sim.id,
    questionId: q.id,
  }));

  await db().insert(simuladoQuestions).values(simQuestionsData);

  revalidatePath("/simulados");
  return { success: true, simuladoId: sim.id };
}

export async function saveSimuladoAnswerAction(simuladoQuestionId: string, answer: string) {
  const session = await requireAuth();

  await db()
    .update(simuladoQuestions)
    .set({ selectedAnswer: answer, answeredAt: new Date() })
    .where(eq(simuladoQuestions.id, simuladoQuestionId));

  revalidatePath(`/simulados`);
}

export async function finishSimuladoAction(simuladoId: string) {
  const session = await requireAuth();

  const allSimQuestions = await db()
    .select({
      id: simuladoQuestions.id,
      selectedAnswer: simuladoQuestions.selectedAnswer,
      correctAnswer: questions.answer,
    })
    .from(simuladoQuestions)
    .innerJoin(questions, eq(simuladoQuestions.questionId, questions.id))
    .where(eq(simuladoQuestions.simuladoId, simuladoId));

  let correctCount = 0;
  for (const q of allSimQuestions) {
    const isCorrect = q.selectedAnswer === q.correctAnswer;
    if (isCorrect) correctCount++;

    await db()
      .update(simuladoQuestions)
      .set({ isCorrect })
      .where(eq(simuladoQuestions.id, q.id));
  }

  const score = Math.round((correctCount / allSimQuestions.length) * 100);

  await db()
    .update(simulados)
    .set({ score, correctAnswers: correctCount, completedAt: new Date() })
    .where(and(eq(simulados.id, simuladoId), eq(simulados.userId, session.userId)));

  revalidatePath("/simulados");
}

export async function getSimulados() {
  const session = await requireAuth();

  return db()
    .select()
    .from(simulados)
    .where(eq(simulados.userId, session.userId))
    .orderBy(desc(simulados.createdAt));
}
