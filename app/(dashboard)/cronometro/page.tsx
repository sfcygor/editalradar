import { getRecentSessions, getWeeklyStats, getTodayStudySeconds } from "@/lib/actions/sessions";
import { getSubjects } from "@/lib/actions/subjects";
import CronometroClient from "./CronometroClient";
import { requireAuth } from "@/lib/session";

export default async function CronometroPage() {
  await requireAuth();
  
  const recentSessions = await getRecentSessions();
  const weeklyStats = await getWeeklyStats();
  const todaySeconds = await getTodayStudySeconds();
  const { subjects = [] } = await getSubjects();
  
  return (
    <CronometroClient 
      initialSessions={recentSessions} 
      initialWeekly={weeklyStats} 
      initialTodaySeconds={todaySeconds} 
      globalSubjects={subjects}
    />
  );
}
