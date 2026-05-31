import { getPerformanceBySubject, getRetentionData, getEvolutionData } from "@/lib/actions/analytics";
import DesempenhoClient from "./DesempenhoClient";

export default async function DesempenhoPage() {
  const [performance, retention, evolution] = await Promise.all([
    getPerformanceBySubject(),
    getRetentionData(),
    getEvolutionData(),
  ]);

  return (
    <DesempenhoClient 
      performance={performance}
      retention={retention}
      evolution={evolution}
    />
  );
}
