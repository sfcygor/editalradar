import { getQuestions } from "@/lib/actions/questions";
import { getSubjects } from "@/lib/actions/subjects";
import QuestoesClient from "./QuestoesClient";
import { requireAuth } from "@/lib/session";

export default async function QuestoesPage() {
  await requireAuth();
  const initialQuestions = await getQuestions();
  const { subjects = [] } = await getSubjects();
  
  return <QuestoesClient initialQuestions={initialQuestions} globalSubjects={subjects} />;
}
