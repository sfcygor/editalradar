import "server-only";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

export type SessionPayload = {
  userId: string;
  name: string;
  email: string;
  avatarUrl?: string | null;
  expiresAt: Date;
};

function getSecretKey() {
  const secret = process.env.SESSION_SECRET;
  if (!secret) {
    console.warn("⚠️ AVISO: A variável SESSION_SECRET não foi encontrada no .env.local. Usando uma chave de fallback temporária. Isso não deve ir para produção.");
  }
  const finalSecret = secret || "default_fallback_secret_for_local_development_only";
  return new TextEncoder().encode(finalSecret);
}

const COOKIE_NAME = "session";
const SESSION_DURATION_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

// ─────────────────────────────────────────────────────────────
// ENCRYPT / DECRYPT
// ─────────────────────────────────────────────────────────────

export async function encrypt(payload: SessionPayload): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(getSecretKey());
}

export async function decrypt(
  token: string | undefined
): Promise<SessionPayload | null> {
  if (!token) {
    return null;
  }
  try {
    const { payload } = await jwtVerify(token, getSecretKey(), {
      algorithms: ["HS256"],
    });
    return payload as unknown as SessionPayload;
  } catch (err) {
    console.error("DECRYPT: Error verifying token:", err);
    return null;
  }
}

// ─────────────────────────────────────────────────────────────
// SESSION CRUD
// ─────────────────────────────────────────────────────────────

export async function createSession(payload: Omit<SessionPayload, "expiresAt">) {
  const expiresAt = new Date(Date.now() + SESSION_DURATION_MS);
  const token = await encrypt({ ...payload, expiresAt });

  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    expires: expiresAt,
    sameSite: "lax",
    path: "/",
  });
}

export async function getSession(): Promise<SessionPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  return decrypt(token);
}

export async function updateSession(updates?: Partial<Omit<SessionPayload, "userId" | "expiresAt">>) {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  const payload = await decrypt(token);
  if (!payload) return null;

  // Merge updates
  const newPayload = { ...payload, ...(updates || {}) };

  // Slide the expiration window
  const expiresAt = new Date(Date.now() + SESSION_DURATION_MS);
  const newToken = await encrypt({ ...newPayload, expiresAt });

  cookieStore.set(COOKIE_NAME, newToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    expires: expiresAt,
    sameSite: "lax",
    path: "/",
  });

  return payload;
}

export async function deleteSession() {
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
  cookieStore.delete(COOKIE_NAME);
}

// ─────────────────────────────────────────────────────────────
// HELPER: assert authenticated (throws if not)
// ─────────────────────────────────────────────────────────────

export async function requireAuth(): Promise<SessionPayload> {
  const session = await getSession();
  if (!session) {
    throw new Error("Unauthorized");
  }
  return session;
}
