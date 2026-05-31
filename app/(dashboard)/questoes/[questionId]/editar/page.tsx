import { getQuestionById } from "@/lib/actions/questions";
import { getSubjects } from "@/lib/actions/subjects";
import { redirect } from "next/navigation";
import EditarQuestaoClient from "./EditarQuestaoClient";

export default async function EditarQuestaoPage({ params }: { params: Promise<{ questionId: string }> }) {
  const { questionId } = await params;
  const question = await getQuestionById(questionId);

  if (!question) {
    redirect("/questoes");
  }

  const { subjects = [] } = await getSubjects();

  return <EditarQuestaoClient question={question} globalSubjects={subjects} />;
}
