"use server";

import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { requireAuth, updateSession } from "@/lib/session";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";

export async function updateProfileInfoAction(formData: FormData) {
  const session = await requireAuth();

  const name = formData.get("name") as string;
  const email = formData.get("email") as string;

  if (!name || !email) return { error: "Nome e email são obrigatórios" };

  await db()
    .update(users)
    .set({ name, email })
    .where(eq(users.id, session.userId));

  // Must update session payload since name/email changed
  await updateSession({ name, email });

  revalidatePath("/perfil");
  revalidatePath("/dashboard");
  return { success: true };
}

export async function updateAvatarAction(avatarUrl: string | null) {
  const session = await requireAuth();
  
  await db()
    .update(users)
    .set({ avatarUrl })
    .where(eq(users.id, session.userId));

  // Remove updateSession({ avatarUrl }) because cookies cannot store large base64 strings!
  
  revalidatePath("/perfil");
  revalidatePath("/dashboard");
  return { success: true };
}

export async function changePasswordAction(formData: FormData) {
  const session = await requireAuth();

  const currentPassword = formData.get("currentPassword") as string;
  const newPassword = formData.get("newPassword") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  if (!currentPassword || !newPassword || !confirmPassword) {
    return { error: "Todos os campos são obrigatórios" };
  }

  if (newPassword !== confirmPassword) {
    return { error: "As novas senhas não coincidem" };
  }

  if (newPassword.length < 8) {
    return { error: "A nova senha deve ter pelo menos 8 caracteres" };
  }

  const [user] = await db()
    .select({ passwordHash: users.passwordHash })
    .from(users)
    .where(eq(users.id, session.userId))
    .limit(1);

  const match = await bcrypt.compare(currentPassword, user.passwordHash);
  if (!match) return { error: "Senha atual incorreta" };

  const passwordHash = await bcrypt.hash(newPassword, 12);
  await db().update(users).set({ passwordHash }).where(eq(users.id, session.userId));

  return { success: true };
}

export async function exportDataAction() {
  const session = await requireAuth();
  // Here you would fetch all data and return it as JSON string.
  // For brevity in the MVP, we just return a placeholder.
  return JSON.stringify({ userId: session.userId, status: "export_ready" });
}

export async function resetProgressAction() {
  const session = await requireAuth();
  // Wipe out study sessions, attempts, reviews
  const { questionAttempts, studySessions, flashcardReviews } = await import("@/lib/db/schema");

  await db().delete(questionAttempts).where(eq(questionAttempts.userId, session.userId));
  await db().delete(studySessions).where(eq(studySessions.userId, session.userId));
  await db().delete(flashcardReviews).where(eq(flashcardReviews.userId, session.userId));

  revalidatePath("/");
  return { success: true };
}

export async function deleteAccountAction() {
  const session = await requireAuth();
  await db().delete(users).where(eq(users.id, session.userId));
  const { deleteSession } = await import("@/lib/session");
  await deleteSession();
  return { success: true };
}
