"use server";

import { db } from "@/lib/db";
import { studySessions, questionAttempts, flashcardReviews, users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { getSession } from "@/lib/session";
import { format, subMonths, startOfMonth } from "date-fns";
import { ptBR } from "date-fns/locale";

export async function getUserStatistics() {
  const session = await getSession();
  if (!session || !session.userId) {
    return null;
  }
  const userId = session.userId;

  // Query raw data to process metrics
  const sessions = await db()
    .select({ durationSeconds: studySessions.durationSeconds, endedAt: studySessions.endedAt })
    .from(studySessions)
    .where(eq(studySessions.userId, userId));

  const questions = await db()
    .select({ isCorrect: questionAttempts.isCorrect, attemptedAt: questionAttempts.attemptedAt })
    .from(questionAttempts)
    .where(eq(questionAttempts.userId, userId));

  const flashcards = await db()
    .select({ repetitions: flashcardReviews.repetitions, lastReview: flashcardReviews.lastReview })
    .from(flashcardReviews)
    .where(eq(flashcardReviews.userId, userId));

  const [user] = await db().select({ createdAt: users.createdAt }).from(users).where(eq(users.id, userId));

  // Compute Total Study Time
  const totalSeconds = sessions.reduce((acc, s) => acc + s.durationSeconds, 0);
  const totalHours = Math.floor(totalSeconds / 3600);
  const totalMinutes = Math.floor((totalSeconds % 3600) / 60);
  const formattedTime = totalHours > 0 ? `${totalHours}h ${totalMinutes}min` : `${totalMinutes}min`;

  // Compute Questions
  const totalQuestions = questions.length;
  const correctQuestions = questions.filter((q) => q.isCorrect).length;
  const accuracyRate = totalQuestions > 0 ? Math.round((correctQuestions / totalQuestions) * 100) : 0;

  // Compute Flashcards
  const totalFlashcards = flashcards.reduce((acc, f) => acc + f.repetitions, 0);

  // Compute Days Studying and Streak
  const activeDatesSet = new Set<string>();
  sessions.forEach((s) => s.endedAt && activeDatesSet.add(format(new Date(s.endedAt), "yyyy-MM-dd")));
  questions.forEach((q) => q.attemptedAt && activeDatesSet.add(format(new Date(q.attemptedAt), "yyyy-MM-dd")));
  flashcards.forEach((f) => f.lastReview && activeDatesSet.add(format(new Date(f.lastReview), "yyyy-MM-dd")));

  const activeDates = Array.from(activeDatesSet).sort((a, b) => new Date(b).getTime() - new Date(a).getTime());
  
  const daysStudying = activeDates.length;
  
  // Calculate Streak
  let streak = 0;
  const todayStr = format(new Date(), "yyyy-MM-dd");
  let currentDate = new Date();
  
  // Start from today or yesterday
  if (activeDates.includes(todayStr)) {
    // Current streak is at least today
  } else {
    // Check if yesterday was active
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = format(yesterday, "yyyy-MM-dd");
    if (activeDates.includes(yesterdayStr)) {
      currentDate = yesterday;
    } else {
      currentDate = new Date(0); // Set far in past (streak broken)
    }
  }

  if (currentDate.getTime() > 0 && activeDates.length > 0) {
    let checkDate = currentDate;
    while (true) {
      const checkStr = format(checkDate, "yyyy-MM-dd");
      if (activeDates.includes(checkStr)) {
        streak++;
        checkDate.setDate(checkDate.getDate() - 1);
      } else {
        break;
      }
    }
  }

  // Monthly Chart Data (Last 6 months)
  const monthlyData = [];
  for (let i = 5; i >= 0; i--) {
    const monthStart = startOfMonth(subMonths(new Date(), i));
    const monthStr = format(monthStart, "MMM", { locale: ptBR });
    
    // Sum questions
    const mQuestions = questions.filter(q => q.attemptedAt && new Date(q.attemptedAt).getMonth() === monthStart.getMonth() && new Date(q.attemptedAt).getFullYear() === monthStart.getFullYear()).length;
    // Sum hours
    const mSeconds = sessions.filter(s => s.endedAt && new Date(s.endedAt).getMonth() === monthStart.getMonth() && new Date(s.endedAt).getFullYear() === monthStart.getFullYear()).reduce((acc, s) => acc + s.durationSeconds, 0);
    const mHours = Math.round((mSeconds / 3600) * 10) / 10;
    
    // Sum flashcards
    const mFlashcards = flashcards.filter(f => f.lastReview && new Date(f.lastReview).getMonth() === monthStart.getMonth() && new Date(f.lastReview).getFullYear() === monthStart.getFullYear()).reduce((acc, f) => acc + f.repetitions, 0);

    monthlyData.push({ month: monthStr.charAt(0).toUpperCase() + monthStr.slice(1), questions: mQuestions, hours: mHours, flashcards: mFlashcards });
  }

  // Milestones
  const getQDate = (num: number) => {
    if (questions.length >= num) {
      const sorted = [...questions].sort((a,b) => new Date(a.attemptedAt).getTime() - new Date(b.attemptedAt).getTime());
      return format(new Date(sorted[num - 1].attemptedAt), "MMM yyyy", { locale: ptBR });
    }
    return "—";
  };

  const milestones = [
    { label: "Primeira questão respondida", date: getQDate(1), done: totalQuestions > 0 },
    { label: "100 questões resolvidas", date: getQDate(100), done: totalQuestions >= 100 },
    { label: "Sequência de 7 dias", date: "—", done: streak >= 7 },
    { label: "500 questões resolvidas", date: getQDate(500), done: totalQuestions >= 500 },
    { label: "1.000 flashcards revisados", date: "—", done: totalFlashcards >= 1000 },
    { label: "Sequência de 30 dias", date: "—", done: streak >= 30 },
    { label: "2.500 questões resolvidas", date: getQDate(2500), done: totalQuestions >= 2500 },
  ];

  return {
    totalStudyTime: formattedTime,
    totalQuestions,
    accuracyRate: `${accuracyRate}%`,
    totalFlashcards,
    daysStudying,
    streak,
    userSince: user?.createdAt ? format(new Date(user.createdAt), "MMM/yyyy", { locale: ptBR }) : "",
    monthlyData,
    milestones
  };
}
