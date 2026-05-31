import { db } from "@/lib/db";
import { flashcards, flashcardDecks } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import { requireAuth } from "@/lib/session";
import { redirect } from "next/navigation";
import DeckCardsClient from "./DeckCardsClient";

export default async function DeckCardsPage({ params }: { params: Promise<{ deckId: string }> }) {
  const { deckId } = await params;
  const session = await requireAuth();

  const [deck] = await db()
    .select()
    .from(flashcardDecks)
    .where(and(eq(flashcardDecks.id, deckId), eq(flashcardDecks.userId, session.userId)))
    .limit(1);

  if (!deck) {
    redirect("/flashcards");
  }

  const cards = await db()
    .select()
    .from(flashcards)
    .where(and(eq(flashcards.deckId, deckId), eq(flashcards.userId, session.userId)));

  return <DeckCardsClient deck={deck} initialCards={cards} />;
}
