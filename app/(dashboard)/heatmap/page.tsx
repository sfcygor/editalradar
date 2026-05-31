import { db } from "@/lib/db";
import { studySessions } from "@/lib/db/schema";
import { requireAuth } from "@/lib/session";
import { and, gte, eq } from "drizzle-orm";
import HeatmapClient from "./HeatmapClient";
import { ClientOnly } from "@/components/ui/ClientOnly";

export default async function HeatmapPage() {
  const session = await requireAuth();

  const today = new Date();
  const lastYear = new Date(today);
  lastYear.setDate(today.getDate() - 364);
  lastYear.setHours(0, 0, 0, 0);

  // Fetch real study sessions from the last 365 days
  const sessions = await db()
    .select({
      durationSeconds: studySessions.durationSeconds,
      startedAt: studySessions.startedAt,
    })
    .from(studySessions)
    .where(
      and(
        eq(studySessions.userId, session.userId),
        gte(studySessions.startedAt, lastYear)
      )
    );

  // Aggregate by day
  const aggregated: Record<string, number> = {};
  sessions.forEach((s) => {
    const d = new Date(s.startedAt);
    const dateStr = d.toISOString().split("T")[0];
    if (!aggregated[dateStr]) aggregated[dateStr] = 0;
    aggregated[dateStr] += s.durationSeconds;
  });

  // Build full 365 days array
  const heatmapData: { date: string; level: number; minutes: number }[] = [];
  for (let i = 364; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split("T")[0];
    
    const seconds = aggregated[dateStr] || 0;
    const minutes = Math.round(seconds / 60);

    let level = 0;
    if (minutes > 0 && minutes < 30) level = 1;
    else if (minutes >= 30 && minutes < 60) level = 2;
    else if (minutes >= 60 && minutes < 120) level = 3;
    else if (minutes >= 120) level = 4;

    heatmapData.push({ date: dateStr, level, minutes });
  }

  // Calculate some offsets to align the weeks perfectly (Sunday to Saturday)
  const firstDayOfWeek = new Date(heatmapData[0].date).getDay();
  // Pad the beginning so the grid always starts correctly on Sunday
  const paddedData = [...heatmapData];
  for (let i = 0; i < firstDayOfWeek; i++) {
    const d = new Date(paddedData[0].date);
    d.setDate(d.getDate() - 1);
    paddedData.unshift({ date: d.toISOString().split("T")[0], level: 0, minutes: 0 });
  }

  return (
    <ClientOnly>
      <HeatmapClient heatmapData={paddedData} />
    </ClientOnly>
  );
}
