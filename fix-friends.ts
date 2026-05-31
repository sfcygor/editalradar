import { db } from './lib/db';
import { friendships } from './lib/db/schema';
import { eq } from 'drizzle-orm';

async function run() {
  const pending = await db().select().from(friendships).where(eq(friendships.status, "pending"));
  console.log("Pending friendships found:", pending.length);
  if (pending.length > 0) {
    await db().update(friendships).set({ status: "accepted" }).where(eq(friendships.status, "pending"));
    console.log("Updated to accepted.");
  }
}
run();
