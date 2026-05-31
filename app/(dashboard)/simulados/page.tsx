import { getSimulados } from "@/lib/actions/simulados";
import SimuladosClient from "./SimuladosClient";

export default async function SimuladosPage() {
  const simulados = await getSimulados();
  return <SimuladosClient initialSimulados={simulados} />;
}
