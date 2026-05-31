"use server";

import { db } from "@/lib/db";
import { friendships, users, questionAttempts } from "@/lib/db/schema";
import { requireAuth } from "@/lib/session";
import { eq, or, and, sql, desc, inArray } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function addFriendByCodeAction(code: string) {
  const session = await requireAuth();

  const [friend] = await db()
    .select()
    .from(users)
    .where(eq(users.shareCode, code.toUpperCase()))
    .limit(1);

  if (!friend) return { error: "Código inválido" };
  if (friend.id === session.userId) return { error: "Você não pode adicionar a si mesmo" };

  // Check existing
  const [existing] = await db()
    .select()
    .from(friendships)
    .where(
      or(
        and(eq(friendships.userId, session.userId), eq(friendships.friendId, friend.id)),
        and(eq(friendships.userId, friend.id), eq(friendships.friendId, session.userId))
      )
    )
    .limit(1);

  if (existing) return { error: "Vocês já são amigos ou há um convite pendente" };

  await db().insert(friendships).values({
    userId: session.userId,
    friendId: friend.id,
    status: "accepted",
  });

  revalidatePath("/amigos");
  return { success: true };
}

export async function getFriends() {
  const session = await requireAuth();

  // Get accepted friends
  const acceptedRows = await db()
    .select({
      id: users.id,
      name: users.name,
      avatarUrl: users.avatarUrl,
    })
    .from(friendships)
    .innerJoin(
      users,
      sql`${friendships.userId} = ${users.id} OR ${friendships.friendId} = ${users.id}`
    )
    .where(
      and(
        eq(friendships.status, "accepted"),
        or(eq(friendships.userId, session.userId), eq(friendships.friendId, session.userId)),
        sql`${users.id} != ${session.userId}`
      )
    );

  return acceptedRows.map((f) => ({ ...f, isOnline: Math.random() > 0.5 }));
}

export async function getRanking() {
  const session = await requireAuth();

  const friends = await getFriends();
  const userIds = [session.userId, ...friends.map((f) => f.id)];

  // Basic ranking by correct answers
  const rows = await db()
    .select({
      userId: questionAttempts.userId,
      score: sql<number>`SUM(CASE WHEN ${questionAttempts.isCorrect} THEN 1 ELSE 0 END)`,
    })
    .from(questionAttempts)
    .where(inArray(questionAttempts.userId, userIds))
    .groupBy(questionAttempts.userId);

  // If no attempts, fetch their basic info and assign 0
  const ranked = [];
  for (const uid of userIds) {
    const row = rows.find((r) => r.userId === uid);
    let name = session.name || "Eu";
    let avatarUrl = session.avatarUrl || null;
    if (uid !== session.userId) {
      const friend = friends.find((f) => f.id === uid);
      name = friend?.name || "Amigo";
      avatarUrl = friend?.avatarUrl || null;
    }
    ranked.push({
      userId: uid,
      name,
      avatarUrl,
      score: row ? Number(row.score) * 10 : 0, // 10 pts per correct answer
    });
  }

  return ranked.sort((a, b) => b.score - a.score);
}
