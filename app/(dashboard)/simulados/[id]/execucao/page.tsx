import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { simulados, simuladoQuestions, questions } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import { requireAuth } from "@/lib/session";
import SimuladoExecutionClient from "./SimuladoExecutionClient";

export default async function SimuladoExecucaoPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await requireAuth();

  const [sim] = await db()
    .select()
    .from(simulados)
    .where(and(eq(simulados.id, id), eq(simulados.userId, session.userId)))
    .limit(1);

  if (!sim) {
    redirect("/simulados");
  }

  // Se já tem nota, tá finalizado, não pode executar de novo
  if (sim.score !== null) {
    redirect("/simulados");
  }

  const dbQuestions = await db()
    .select({
      id: simuladoQuestions.id,
      selectedAnswer: simuladoQuestions.selectedAnswer,
      question: questions,
    })
    .from(simuladoQuestions)
    .innerJoin(questions, eq(simuladoQuestions.questionId, questions.id))
    .where(eq(simuladoQuestions.simuladoId, id));

  return (
    <SimuladoExecutionClient 
      simuladoId={id} 
      initialQuestions={dbQuestions} 
    />
  );
}
