import { getSubjects } from "@/lib/actions/subjects";
import NovaQuestaoClient from "./NovaQuestaoClient";

export default async function NovaQuestaoPage() {
  const { subjects = [] } = await getSubjects();
  return <NovaQuestaoClient subjects={subjects} />;
}
