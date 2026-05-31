"use server";

import { db } from "@/lib/db";
import { questions, questionAttempts } from "@/lib/db/schema";
import { requireAuth } from "@/lib/session";
import { eq, and, desc, ilike, or } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const QuestionSchema = z.object({
  type: z.enum(["multiple_choice", "true_false"]).default("multiple_choice"),
  text: z.string().min(10, "Questão muito curta"),
  subject: z.string().min(1, "Selecione uma matéria"),
  topic: z.string().optional(),
  difficulty: z.enum(["Fácil", "Médio", "Difícil"]).default("Médio"),
  answer: z.string().min(1, "Selecione o gabarito"),
  explanation: z.string().optional(),
  source: z.string().optional(),
  optionA: z.string().optional(),
  optionB: z.string().optional(),
  optionC: z.string().optional(),
  optionD: z.string().optional(),
  optionE: z.string().optional(),
}).superRefine((data, ctx) => {
  if (data.type === "multiple_choice") {
    if (!data.optionA || data.optionA.trim() === "") {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Opção A é obrigatória", path: ["optionA"] });
    }
    if (!data.optionB || data.optionB.trim() === "") {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Opção B é obrigatória", path: ["optionB"] });
    }
  }
});

export type QuestionState = {
  errors?: Record<string, string[]>;
  message?: string;
  success?: boolean;
} | undefined;

// ─── Create Question ─────────────────────────────────────────

export async function createQuestionAction(
  state: QuestionState,
  formData: FormData
): Promise<QuestionState> {
  const session = await requireAuth();

  const parsed = QuestionSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { errors: parsed.error.flatten().fieldErrors };
  }

  const { type, text, subject, topic, difficulty, answer, explanation, source,
          optionA, optionB, optionC, optionD, optionE } = parsed.data;

  let options: { letter: string; text: string }[] = [];
  
  if (type === "true_false") {
    options = [
      { letter: "C", text: "Certo" },
      { letter: "E", text: "Errado" }
    ];
  } else {
    options = [
      { letter: "A", text: optionA! },
      { letter: "B", text: optionB! },
      ...(optionC ? [{ letter: "C", text: optionC }] : []),
      ...(optionD ? [{ letter: "D", text: optionD }] : []),
      ...(optionE ? [{ letter: "E", text: optionE }] : []),
    ];
  }

  await db().insert(questions).values({
    userId: session.userId,
    type,
    text,
    subject,
    topic: topic || null,
    difficulty,
    options,
    answer,
    explanation: explanation || null,
    source: source || null,
  });

  revalidatePath("/questoes");
  return { success: true, message: "Questão criada com sucesso!" };
}

// ─── Update Question ─────────────────────────────────────────

export async function updateQuestionAction(
  questionId: string,
  state: QuestionState,
  formData: FormData
): Promise<QuestionState> {
  const session = await requireAuth();

  const parsed = QuestionSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { errors: parsed.error.flatten().fieldErrors };
  }

  const { type, text, subject, topic, difficulty, answer, explanation, source,
          optionA, optionB, optionC, optionD, optionE } = parsed.data;

  let options: { letter: string; text: string }[] = [];
  
  if (type === "true_false") {
    options = [
      { letter: "C", text: "Certo" },
      { letter: "E", text: "Errado" }
    ];
  } else {
    options = [
      { letter: "A", text: optionA! },
      { letter: "B", text: optionB! },
      ...(optionC ? [{ letter: "C", text: optionC }] : []),
      ...(optionD ? [{ letter: "D", text: optionD }] : []),
      ...(optionE ? [{ letter: "E", text: optionE }] : []),
    ];
  }

  await db()
    .update(questions)
    .set({
      type,
      text,
      subject,
      topic: topic || null,
      difficulty,
      options,
      answer,
      explanation: explanation || null,
      source: source || null,
    })
    .where(and(eq(questions.id, questionId), eq(questions.userId, session.userId)));

  revalidatePath("/questoes");
  return { success: true, message: "Questão atualizada com sucesso!" };
}

// ─── Get Question By ID ──────────────────────────────────────

export async function getQuestionById(questionId: string) {
  const session = await requireAuth();

  const [q] = await db()
    .select()
    .from(questions)
    .where(and(eq(questions.id, questionId), eq(questions.userId, session.userId)))
    .limit(1);

  return q;
}

// ─── Answer Question ─────────────────────────────────────────

export async function answerQuestionAction(
  questionId: string,
  selectedAnswer: string
): Promise<{ isCorrect: boolean; correctAnswer: string; explanation: string | null }> {
  const session = await requireAuth();

  const [question] = await db()
    .select()
    .from(questions)
    .where(eq(questions.id, questionId))
    .limit(1);

  if (!question) throw new Error("Questão não encontrada");

  const isCorrect = selectedAnswer === question.answer;

  // Record the attempt (auto-populates banco de erros if wrong)
  await db().insert(questionAttempts).values({
    userId: session.userId,
    questionId,
    selectedAnswer,
    isCorrect,
  });

  revalidatePath("/questoes");
  revalidatePath("/banco-erros");
  revalidatePath("/desempenho");

  return {
    isCorrect,
    correctAnswer: question.answer,
    explanation: question.explanation,
  };
}

// ─── Delete Question ─────────────────────────────────────────

export async function deleteQuestionAction(questionId: string): Promise<void> {
  const session = await requireAuth();

  await db()
    .delete(questions)
    .where(and(eq(questions.id, questionId), eq(questions.userId, session.userId)));

  revalidatePath("/questoes");
  revalidatePath("/banco-erros");
}

// ─── Toggle Favorite ─────────────────────────────────────────

export async function toggleFavoriteQuestionAction(questionId: string): Promise<void> {
  const session = await requireAuth();

  const [q] = await db()
    .select({ isFavorite: questions.isFavorite })
    .from(questions)
    .where(and(eq(questions.id, questionId), eq(questions.userId, session.userId)))
    .limit(1);

  if (!q) return;

  await db()
    .update(questions)
    .set({ isFavorite: !q.isFavorite })
    .where(eq(questions.id, questionId));

  revalidatePath("/questoes");
}

// ─── Get Questions (server-side) ─────────────────────────────

export async function getQuestions(filters?: {
  subject?: string;
  search?: string;
  status?: string;
}) {
  const session = await requireAuth();

  const conditions = [eq(questions.userId, session.userId)];

  if (filters?.subject && filters.subject !== "Todos") {
    conditions.push(eq(questions.subject, filters.subject));
  }

  const rows = await db()
    .select()
    .from(questions)
    .where(and(...conditions))
    .orderBy(desc(questions.createdAt));

  // Enrich with attempt stats
  const attempts = await db()
    .select()
    .from(questionAttempts)
    .where(eq(questionAttempts.userId, session.userId));

  const attemptMap = new Map<string, { lastAnswer: string; isCorrect: boolean }>();
  for (const a of attempts) {
    attemptMap.set(a.questionId, {
      lastAnswer: a.selectedAnswer,
      isCorrect: a.isCorrect,
    });
  }

  return rows.map((q) => {
    const attempt = attemptMap.get(q.id);
    return {
      ...q,
      status: !attempt
        ? "nao-respondida"
        : attempt.isCorrect
        ? "acerto"
        : "erro",
      lastAnswer: attempt?.lastAnswer ?? null,
    };
  });
}

// ─── Get Error Bank ──────────────────────────────────────────

export async function getErrorBank() {
  const session = await requireAuth();

  // Get latest wrong attempt per question
  const rows = await db()
    .select({
      attempt: questionAttempts,
      question: questions,
    })
    .from(questionAttempts)
    .innerJoin(questions, eq(questionAttempts.questionId, questions.id))
    .where(
      and(
        eq(questionAttempts.userId, session.userId),
        eq(questionAttempts.isCorrect, false)
      )
    )
    .orderBy(desc(questionAttempts.attemptedAt));

  // Deduplicate: only latest attempt per question
  const seen = new Set<string>();
  const unique = rows.filter((r) => {
    if (seen.has(r.attempt.questionId)) return false;
    seen.add(r.attempt.questionId);
    return true;
  });

  return unique.map((r) => ({
    ...r.question,
    lastAnswer: r.attempt.selectedAnswer,
    attemptedAt: r.attempt.attemptedAt,
  }));
}
