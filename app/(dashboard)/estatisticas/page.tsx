import EstatisticasClient from "./EstatisticasClient";
import { requireFeatureAccess } from "@/lib/permissions";
import BlockedFeature from "@/components/shared/BlockedFeature";
import { getUserStatistics } from "@/lib/actions/estatisticas";

export default async function EstatisticasPage() {
  const { hasAccess, requiredPlan } = await requireFeatureAccess("estatisticas");
  if (!hasAccess) {
    return <BlockedFeature featureName="Estatísticas Avançadas" requiredPlan={requiredPlan} />;
  }

  const initialData = await getUserStatistics();

  return <EstatisticasClient initialData={initialData} />;
}
