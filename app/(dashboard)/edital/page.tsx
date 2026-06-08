import { getEditalItems } from "@/lib/actions/edital";
import EditalClient from "./EditalClient";
import { requireFeatureAccess } from "@/lib/permissions";
import BlockedFeature from "@/components/shared/BlockedFeature";

export default async function EditalPage() {
  const { hasAccess, requiredPlan } = await requireFeatureAccess("edital");
  if (!hasAccess) {
    return <BlockedFeature featureName="Edital Tracker" requiredPlan={requiredPlan} />;
  }

  const items = await getEditalItems();
  return <EditalClient initialItems={items} />;
}
