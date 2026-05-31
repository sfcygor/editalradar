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

  if (!session) {
    redirect("/login");
  }

  const [dbUser] = await db()
    .select({ avatarUrl: users.avatarUrl })
    .from(users)
    .where(eq(users.id, session.userId))
    .limit(1);

  if (!dbUser) {
    // Prevents ghost sessions (valid JWT but user deleted/missing from DB)
    await deleteSession();
    redirect("/login");
  }

  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-content">
        <Header 
          initials={session.name ? session.name.substring(0, 2).toUpperCase() : "US"} 
          avatarUrl={dbUser?.avatarUrl}
        />
        <main>{children}</main>
      </div>
    </div>
  );
}
