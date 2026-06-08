import { getSimulados } from "@/lib/actions/simulados";
import SimuladosClient from "./SimuladosClient";
import { requireFeatureAccess } from "@/lib/permissions";
import BlockedFeature from "@/components/shared/BlockedFeature";

export default async function SimuladosPage() {
  const { hasAccess, requiredPlan } = await requireFeatureAccess("simulados");
  if (!hasAccess) {
    return <BlockedFeature featureName="Simulados Inteligentes" requiredPlan={requiredPlan} />;
  }

  const simulados = await getSimulados();
  return <SimuladosClient initialSimulados={simulados} />;
}
