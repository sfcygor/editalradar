import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { requireAuth } from "@/lib/session";
import { getFriends } from "@/lib/actions/friends";
import AmigosClient from "./AmigosClient";

export default async function AmigosPage() {
  const session = await requireAuth();

  const [user] = await db()
    .select({ shareCode: users.shareCode })
    .from(users)
    .where(eq(users.id, session.userId))
    .limit(1);

  const friends = await getFriends();

  return <AmigosClient friends={friends} myCode={user.shareCode} />;
}
