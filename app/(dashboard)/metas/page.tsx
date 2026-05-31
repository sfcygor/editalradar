import { getGoalsWithProgress } from "@/lib/actions/goals";
import MetasClient from "./MetasClient";

export default async function MetasPage() {
  const goals = await getGoalsWithProgress();
  return <MetasClient initialGoals={goals} />;
}
