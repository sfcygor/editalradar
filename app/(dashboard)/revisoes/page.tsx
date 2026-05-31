import { getDueFlashcards } from "@/lib/actions/flashcards";
import RevisoesClient from "./RevisoesClient";
import { requireAuth } from "@/lib/session";

export default async function RevisoesPage() {
  await requireAuth();
  const dueCards = await getDueFlashcards();
  
  return <RevisoesClient initialDueCards={dueCards} />;
}
