"use server";

import { db } from "@/lib/db";
import { editalItems } from "@/lib/db/schema";
import { requireAuth } from "@/lib/session";
import { eq, and, desc } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function createEditalItemAction(formData: FormData) {
  const session = await requireAuth();

  const subject = formData.get("subject") as string;
  const topic = formData.get("topic") as string;
  const weightStr = formData.get("weight") as string;
  const priority = formData.get("priority") as string;

  if (!subject || !topic) return { error: "Matéria e tópico são obrigatórios." };

  await db().insert(editalItems).values({
    userId: session.userId,
    subject,
    topic,
    weight: parseInt(weightStr, 10) || 0,
    priority: priority || "média",
  });

  revalidatePath("/edital");
  return { success: true };
}

export async function toggleEditalItemAction(itemId: string, done: boolean) {
  const session = await requireAuth();

  await db()
    .update(editalItems)
    .set({ done })
    .where(and(eq(editalItems.id, itemId), eq(editalItems.userId, session.userId)));

  revalidatePath("/edital");
}

export async function deleteEditalItemAction(itemId: string) {
  const session = await requireAuth();

  await db()
    .delete(editalItems)
    .where(and(eq(editalItems.id, itemId), eq(editalItems.userId, session.userId)));

  revalidatePath("/edital");
}

export async function getEditalItems() {
  const session = await requireAuth();

  return db()
    .select()
    .from(editalItems)
    .where(eq(editalItems.userId, session.userId))
    .orderBy(desc(editalItems.createdAt));
}
