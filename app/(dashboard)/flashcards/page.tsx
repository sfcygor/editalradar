import { getDecksWithStats } from "@/lib/actions/flashcards";
import { getSubjects } from "@/lib/actions/subjects";
import FlashcardsClient from "./FlashcardsClient";
import { requireAuth } from "@/lib/session";
import { requireFeatureAccess } from "@/lib/permissions";
import BlockedFeature from "@/components/shared/BlockedFeature";

export default async function FlashcardsPage() {
  await requireAuth();
  
  const { hasAccess, requiredPlan } = await requireFeatureAccess("flashcards");
  if (!hasAccess) {
    return <BlockedFeature featureName="Flashcards Inteligentes" requiredPlan={requiredPlan} />;
  }

  const decks = await getDecksWithStats();
  const { subjects = [] } = await getSubjects();
  
  return <FlashcardsClient initialDecks={decks} globalSubjects={subjects} />;
}
