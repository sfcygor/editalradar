import type { Metadata } from "next";
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
import { getSession, deleteSession } from "@/lib/session";
import { redirect } from "next/navigation";

import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export const metadata: Metadata = {
  title: {
    default: "Dashboard | EditalRadar",
    template: "%s | EditalRadar",
  },
};

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  if (!session || !session.userId) {
    redirect("/home?login=true");
  }

  const [dbUser] = await db()
    .select({ 
      avatarUrl: users.avatarUrl,
      subscriptionStatus: users.subscriptionStatus,
      renewalDate: users.renewalDate,
      plan: users.plan
    })
    .from(users)
    .where(eq(users.id, session.userId))
    .limit(1);

  if (!dbUser) {
    redirect("/api/auth/logout");
  }

  const isTrialing = dbUser.subscriptionStatus === "trialing";
  let daysLeft = 0;
  if (isTrialing && dbUser.renewalDate) {
    daysLeft = Math.ceil((new Date(dbUser.renewalDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
  }

  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-content">
        <Header 
          initials={session.name ? session.name.substring(0, 2).toUpperCase() : "US"} 
          avatarUrl={dbUser.avatarUrl}
          isTrialing={isTrialing}
          daysLeft={daysLeft}
          planName={dbUser.plan || "Padrão"}
        />
        <main>{children}</main>
      </div>
    </div>
  );
}
