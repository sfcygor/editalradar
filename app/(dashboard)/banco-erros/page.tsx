import { getErrorBank } from "@/lib/actions/questions";
import BancoErrosClient from "./BancoErrosClient";

export default async function BancoErrosPage() {
  const errors = await getErrorBank();
  return <BancoErrosClient initialErrors={errors} />;
}
