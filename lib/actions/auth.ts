"use server";

import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { createSession, deleteSession } from "@/lib/session";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { generateShareCode } from "@/lib/utils";

// ─── Zod Schemas ─────────────────────────────────────────────

const RegisterSchema = z.object({
  name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres").trim(),
  email: z.string().email("Email inválido").trim().toLowerCase(),
  password: z
    .string()
    .min(8, "Senha deve ter pelo menos 8 caracteres"),
  confirmPassword: z.string(),
});

const LoginSchema = z.object({
  email: z.string().email("Email inválido").trim().toLowerCase(),
  password: z.string().min(1, "Senha é obrigatória"),
});

export type AuthState = {
  success?: boolean;
  errors?: Record<string, string[]>;
  message?: string;
} | undefined;

// ─── Register ────────────────────────────────────────────────

export async function registerAction(
  state: AuthState,
  formData: FormData
): Promise<AuthState> {
  const parsed = RegisterSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
  });

  if (!parsed.success) {
    return { errors: parsed.error.flatten().fieldErrors };
  }

  const { name, email, password, confirmPassword } = parsed.data;

  if (password !== confirmPassword) {
    return { errors: { confirmPassword: ["As senhas não coincidem"] } };
  }

  // Check duplicate email
  const existing = await db()
    .select({ id: users.id })
    .from(users)
    .where(eq(users.email, email))
    .limit(1);

  if (existing.length > 0) {
    return { errors: { email: ["Este email já está cadastrado"] } };
  }

  const passwordHash = await bcrypt.hash(password, 12);
  const shareCode = generateShareCode();

  const [user] = await db()
    .insert(users)
    .values({ name, email, passwordHash, shareCode })
    .returning({ id: users.id, name: users.name, email: users.email });

  if (!user) {
    return { message: "Erro ao criar conta. Tente novamente." };
  }

  await createSession({ userId: user.id, name: user.name, email: user.email });
  revalidatePath("/", "layout");
  return { success: true };
}

// ─── Login ───────────────────────────────────────────────────

export async function loginAction(
  state: AuthState,
  formData: FormData
): Promise<AuthState> {
  const parsed = LoginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return { errors: parsed.error.flatten().fieldErrors };
  }

  const { email, password } = parsed.data;

  const [user] = await db()
    .select()
    .from(users)
    .where(eq(users.email, email))
    .limit(1);

  if (!user) {
    return { message: "Email ou senha incorretos" };
  }

  const passwordMatch = await bcrypt.compare(password, user.passwordHash);
  if (!passwordMatch) {
    return { message: "Email ou senha incorretos" };
  }

  try {
    await createSession({ userId: user.id, name: user.name, email: user.email });
  } catch (error) {
    console.error("LOGIN: Failed to create session:", error);
    return { message: "Erro ao criar sessão" };
  }

  revalidatePath("/", "layout");
  return { success: true };
}

// ─── Logout ──────────────────────────────────────────────────

export async function logoutAction() {
  await deleteSession();
  revalidatePath("/", "layout");
  // Don't redirect, just let the UI update where it is
}
