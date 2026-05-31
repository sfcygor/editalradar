import { getDecksWithStats } from "@/lib/actions/flashcards";
import { getSubjects } from "@/lib/actions/subjects";
import FlashcardsClient from "./FlashcardsClient";
import { requireAuth } from "@/lib/session";

export default async function FlashcardsPage() {
  await requireAuth();
  const decks = await getDecksWithStats();
  const { subjects = [] } = await getSubjects();
  
  return <FlashcardsClient initialDecks={decks} globalSubjects={subjects} />;
}
