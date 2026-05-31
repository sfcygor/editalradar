"use server";

import { db } from "@/lib/db";
import { flashcards, flashcardDecks, flashcardReviews } from "@/lib/db/schema";
import { requireAuth } from "@/lib/session";
import { eq, and, lte, desc } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { sm2 } from "@/lib/utils";
import { z } from "zod";

// ─── Create Deck ─────────────────────────────────────────────

export async function createDeckAction(formData: FormData) {
  const session = await requireAuth();

  const name = formData.get("name") as string;
  const subject = formData.get("subject") as string;
  const description = (formData.get("description") as string) || null;

  if (!name || !subject) return { error: "Nome e matéria são obrigatórios" };

  const [deck] = await db()
    .insert(flashcardDecks)
    .values({ userId: session.userId, name, subject, description })
    .returning();

  revalidatePath("/flashcards");
  return { success: true, deck };
}

export async function updateDeckAction(formData: FormData) {
  const session = await requireAuth();

  const id = formData.get("id") as string;
  const name = formData.get("name") as string;
  const subject = formData.get("subject") as string;
  const description = (formData.get("description") as string) || null;

  if (!id || !name || !subject) return { error: "ID, nome e matéria são obrigatórios" };

  await db()
    .update(flashcardDecks)
    .set({ name, subject, description })
    .where(and(eq(flashcardDecks.id, id), eq(flashcardDecks.userId, session.userId)));

  revalidatePath("/flashcards");
  return { success: true };
}

export async function deleteDeckAction(id: string) {
  const session = await requireAuth();

  await db()
    .delete(flashcardDecks)
    .where(and(eq(flashcardDecks.id, id), eq(flashcardDecks.userId, session.userId)));

  revalidatePath("/flashcards");
  return { success: true };
}


// ─── Create Flashcard ────────────────────────────────────────

export async function createFlashcardAction(formData: FormData) {
  const session = await requireAuth();

  const deckId = formData.get("deckId") as string;
  const front = formData.get("front") as string;
  const back = formData.get("back") as string;

  if (!deckId || !front || !back) {
    return { error: "Deck, frente e verso são obrigatórios" };
  }

  // Verify deck belongs to user
  const [deck] = await db()
    .select()
    .from(flashcardDecks)
    .where(and(eq(flashcardDecks.id, deckId), eq(flashcardDecks.userId, session.userId)))
    .limit(1);

  if (!deck) return { error: "Deck não encontrado" };

  const [card] = await db()
    .insert(flashcards)
    .values({ deckId, userId: session.userId, front, back })
    .returning();

  // Initialize SM-2 review record (due today)
  await db().insert(flashcardReviews).values({
    userId: session.userId,
    flashcardId: card.id,
    easiness: 2.5,
    interval: 1,
    repetitions: 0,
    nextReview: new Date(),
  });

  revalidatePath("/flashcards");
  return { success: true, cardId: card.id };
}

export async function updateFlashcardAction(formData: FormData) {
  const session = await requireAuth();

  const id = formData.get("id") as string;
  const front = formData.get("front") as string;
  const back = formData.get("back") as string;
  const tagsString = formData.get("tags") as string || "";

  const tags = tagsString
    .split(",")
    .map(t => t.trim())
    .filter(t => t.length > 0);

  if (!id || !front || !back) return { error: "ID, frente e verso são obrigatórios" };

  await db()
    .update(flashcards)
    .set({ front, back, tags })
    .where(and(eq(flashcards.id, id), eq(flashcards.userId, session.userId)));

  revalidatePath("/flashcards");
  return { success: true };
}

export async function deleteFlashcardAction(id: string) {
  const session = await requireAuth();

  await db()
    .delete(flashcards)
    .where(and(eq(flashcards.id, id), eq(flashcards.userId, session.userId)));

  revalidatePath("/flashcards");
  return { success: true };
}

// ─── Create Flashcard from Error Bank ────────────────────────

export async function createFlashcardFromQuestionAction(
  questionId: string,
  deckId: string
): Promise<{ success: boolean; error?: string }> {
  const session = await requireAuth();

  // Get the question data
  const { questions } = await import("@/lib/db/schema");
  const { eq: drizzleEq } = await import("drizzle-orm");

  const [question] = await db()
    .select()
    .from(questions)
    .where(drizzleEq(questions.id, questionId))
    .limit(1);

  if (!question) return { success: false, error: "Questão não encontrada" };

  const front = question.text;
  const optionsText = (question.options as { letter: string; text: string }[])
    .map((o) => `${o.letter}) ${o.text}`)
    .join("\n");
  const back = `Resposta: ${question.answer}\n\n${optionsText}${question.explanation ? "\n\n" + question.explanation : ""}`;

  const [card] = await db()
    .insert(flashcards)
    .values({ deckId, userId: session.userId, front, back })
    .returning();

  await db().insert(flashcardReviews).values({
    userId: session.userId,
    flashcardId: card.id,
    easiness: 2.5,
    interval: 1,
    repetitions: 0,
    nextReview: new Date(),
  });

  revalidatePath("/flashcards");
  revalidatePath("/banco-erros");
  return { success: true };
}

// ─── Review Flashcard (SM-2) ─────────────────────────────────

// quality: 0=blackout, 1=wrong, 2=wrong+easy, 3=correct+hard, 4=correct, 5=perfect
export async function reviewFlashcardAction(
  flashcardId: string,
  quality: 0 | 1 | 2 | 3 | 4 | 5
): Promise<{ nextReview: Date; easiness: number }> {
  const session = await requireAuth();

  const [existing] = await db()
    .select()
    .from(flashcardReviews)
    .where(
      and(
        eq(flashcardReviews.flashcardId, flashcardId),
        eq(flashcardReviews.userId, session.userId)
      )
    )
    .limit(1);

  const current = existing || { easiness: 2.5, interval: 1, repetitions: 0 };
  const result = sm2(quality, current.easiness, current.interval, current.repetitions);

  if (existing) {
    await db()
      .update(flashcardReviews)
      .set({
        easiness: result.easiness,
        interval: result.interval,
        repetitions: result.repetitions,
        nextReview: result.nextDate,
        lastReview: new Date(),
      })
      .where(eq(flashcardReviews.id, existing.id));
  } else {
    await db().insert(flashcardReviews).values({
      userId: session.userId,
      flashcardId,
      easiness: result.easiness,
      interval: result.interval,
      repetitions: result.repetitions,
      nextReview: result.nextDate,
      lastReview: new Date(),
    });
  }

  revalidatePath("/flashcards");
  revalidatePath("/revisoes");
  return { nextReview: result.nextDate, easiness: result.easiness };
}

// ─── Toggle Favorite ─────────────────────────────────────────

export async function toggleFavoriteFlashcardAction(flashcardId: string) {
  const session = await requireAuth();

  const [card] = await db()
    .select({ isFavorite: flashcards.isFavorite })
    .from(flashcards)
    .where(and(eq(flashcards.id, flashcardId), eq(flashcards.userId, session.userId)))
    .limit(1);

  if (!card) return;

  await db()
    .update(flashcards)
    .set({ isFavorite: !card.isFavorite })
    .where(eq(flashcards.id, flashcardId));

  revalidatePath("/flashcards");
}

// ─── Get Decks with Stats ────────────────────────────────────

export async function getDecksWithStats() {
  const session = await requireAuth();

  const decks = await db()
    .select()
    .from(flashcardDecks)
    .where(eq(flashcardDecks.userId, session.userId))
    .orderBy(desc(flashcardDecks.createdAt));

  const allCards = await db()
    .select()
    .from(flashcards)
    .where(eq(flashcards.userId, session.userId));

  const allReviews = await db()
    .select()
    .from(flashcardReviews)
    .where(eq(flashcardReviews.userId, session.userId));

  const now = new Date();

  return decks.map((deck) => {
    const deckCards = allCards.filter((c) => c.deckId === deck.id);
    const cardIds = new Set(deckCards.map((c) => c.id));
    const deckReviews = allReviews.filter((r) => cardIds.has(r.flashcardId));

    const dueCount = deckReviews.filter((r) => r.nextReview <= now).length;
    const masteredCount = deckReviews.filter((r) => r.repetitions >= 3 && r.easiness >= 2.0).length;
    const masteryPct =
      deckCards.length > 0 ? Math.round((masteredCount / deckCards.length) * 100) : 0;

    const lastReview = deckReviews
      .filter((r) => r.lastReview)
      .sort((a, b) => (b.lastReview!.getTime() - a.lastReview!.getTime()))
      .at(0)?.lastReview;

    return {
      ...deck,
      cardCount: deckCards.length,
      dueCount,
      masteryPct,
      lastStudied: lastReview ?? null,
    };
  });
}

// ─── Get Due Flashcards for Session ─────────────────────────

export async function getDueFlashcards(deckId?: string) {
  const session = await requireAuth();
  const now = new Date();

  const conditions = [
    eq(flashcardReviews.userId, session.userId),
    lte(flashcardReviews.nextReview, now),
  ];

  const reviews = await db()
    .select({ review: flashcardReviews, card: flashcards })
    .from(flashcardReviews)
    .innerJoin(flashcards, eq(flashcardReviews.flashcardId, flashcards.id))
    .where(and(...conditions))
    .orderBy(flashcardReviews.nextReview);

  if (deckId) {
    return reviews.filter((r) => r.card.deckId === deckId);
  }
  return reviews;
}
