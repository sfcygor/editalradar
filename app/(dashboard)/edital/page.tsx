import { getEditalItems } from "@/lib/actions/edital";
import EditalClient from "./EditalClient";

export default async function EditalPage() {
  const items = await getEditalItems();
  return <EditalClient initialItems={items} />;
}
