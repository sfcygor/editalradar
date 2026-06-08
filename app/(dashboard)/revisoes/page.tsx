import { getDueFlashcards } from "@/lib/actions/flashcards";
import RevisoesClient from "./RevisoesClient";
import { requireAuth } from "@/lib/session";
import { requireFeatureAccess } from "@/lib/permissions";
import BlockedFeature from "@/components/shared/BlockedFeature";

export default async function RevisoesPage() {
  await requireAuth();
  
  const { hasAccess, requiredPlan } = await requireFeatureAccess("revisoes");
  if (!hasAccess) {
    return <BlockedFeature featureName="Revisões Automáticas" requiredPlan={requiredPlan} />;
  }

  const dueCards = await getDueFlashcards();
  
  return <RevisoesClient initialDueCards={dueCards} />;
}
