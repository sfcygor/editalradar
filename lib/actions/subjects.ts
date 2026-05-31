"use server";

import { db } from "@/lib/db";
import {
  subjects,
  questions,
  flashcardDecks,
  studySessions,
  editalItems,
} from "@/lib/db/schema";
import { eq, and, sql } from "drizzle-orm";
import { requireAuth } from "@/lib/session";
import { revalidatePath } from "next/cache";

export async function getSubjects() {
  const session = await requireAuth();
  if (!session) return { error: "Não autorizado" };

  try {
    const userSubjects = await db()
      .select()
      .from(subjects)
      .where(eq(subjects.userId, session.userId))
      .orderBy(subjects.name);

    return { subjects: userSubjects };
  } catch (error) {
    console.error("Erro ao buscar matérias:", error);
    return { error: "Erro ao buscar matérias" };
  }
}

export async function createSubjectAction(formData: FormData) {
  const session = await requireAuth();
  if (!session) return { error: "Não autorizado" };

  const name = formData.get("name")?.toString().trim();
  const color = formData.get("color")?.toString() || "gray";

  if (!name) return { error: "Nome da matéria é obrigatório" };

  try {
    await db().insert(subjects).values({
      userId: session.userId,
      name,
      color,
    });

    revalidatePath("/cronometro");
    return { success: true };
  } catch (error) {
    console.error("Erro ao criar matéria:", error);
    return { error: "Erro ao criar matéria" };
  }
}

export async function updateSubjectAction(formData: FormData) {
  const session = await requireAuth();
  if (!session) return { error: "Não autorizado" };

  const id = formData.get("id")?.toString();
  const newName = formData.get("name")?.toString().trim();
  const color = formData.get("color")?.toString() || "gray";

  if (!id || !newName) return { error: "ID e Nome são obrigatórios" };

  try {
    // Pegar o nome antigo antes de atualizar
    const [oldSubject] = await db()
      .select()
      .from(subjects)
      .where(and(eq(subjects.id, id), eq(subjects.userId, session.userId)));

    if (!oldSubject) return { error: "Matéria não encontrada" };

    const oldName = oldSubject.name;

    // Atualizar tabela subjects
    await db()
      .update(subjects)
      .set({ name: newName, color })
      .where(and(eq(subjects.id, id), eq(subjects.userId, session.userId)));

    // Se o nome mudou, atualizar em cascata as outras tabelas
    if (oldName !== newName) {
      await db()
        .update(questions)
        .set({ subject: newName })
        .where(and(eq(questions.subject, oldName), eq(questions.userId, session.userId)));

      await db()
        .update(flashcardDecks)
        .set({ subject: newName })
        .where(and(eq(flashcardDecks.subject, oldName), eq(flashcardDecks.userId, session.userId)));

      await db()
        .update(studySessions)
        .set({ subject: newName })
        .where(and(eq(studySessions.subject, oldName), eq(studySessions.userId, session.userId)));

      await db()
        .update(editalItems)
        .set({ subject: newName })
        .where(and(eq(editalItems.subject, oldName), eq(editalItems.userId, session.userId)));
    }

    revalidatePath("/cronometro");
    revalidatePath("/dashboard");
    revalidatePath("/questoes");
    revalidatePath("/flashcards");
    revalidatePath("/edital");
    return { success: true };
  } catch (error) {
    console.error("Erro ao atualizar matéria:", error);
    return { error: "Erro ao atualizar matéria" };
  }
}

export async function deleteSubjectAction(formData: FormData) {
  const session = await requireAuth();
  if (!session) return { error: "Não autorizado" };

  const id = formData.get("id")?.toString();
  if (!id) return { error: "ID obrigatório" };

  try {
    await db()
      .delete(subjects)
      .where(and(eq(subjects.id, id), eq(subjects.userId, session.userId)));

    revalidatePath("/cronometro");
    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    console.error("Erro ao excluir matéria:", error);
    return { error: "Erro ao excluir matéria" };
  }
}
