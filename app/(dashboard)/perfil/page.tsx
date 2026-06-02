import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { requireAuth } from "@/lib/session";
import PerfilClient from "./PerfilClient";

export default async function PerfilPage() {
  const session = await requireAuth();

  const [user] = await db()
    .select({ 
      name: users.name, 
      email: users.email, 
      avatarUrl: users.avatarUrl,
      plan: users.plan,
      billingCycle: users.billingCycle,
      subscriptionDate: users.subscriptionDate,
      renewalDate: users.renewalDate
    })
    .from(users)
    .where(eq(users.id, session.userId))
    .limit(1);

  return <PerfilClient user={user} />;
}
