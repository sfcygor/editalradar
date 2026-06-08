import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { getSession } from "@/lib/session";

export type PlanType = "gratuito" | "padrao" | "avancado";

export const PLAN_HIERARCHY: Record<PlanType, number> = {
  gratuito: 0,
  padrao: 1,
  avancado: 2,
};

// Map of feature to required minimum plan
export const FEATURE_REQUIREMENTS = {
  flashcards: "padrao" as PlanType,
  edital: "padrao" as PlanType,
  estatisticas: "padrao" as PlanType,
  simulados: "padrao" as PlanType, // Gratuito Sem acesso. Padrão tem acesso (com limite na action). Avançado ilimitado.
  revisoes: "avancado" as PlanType,
};

export async function getUserPlan(userId: string): Promise<PlanType> {
  const [user] = await db()
    .select({ plan: users.plan })
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);

  if (!user || !user.plan) return "gratuito";
  
  return user.plan as PlanType;
}

export function hasAccess(userPlan: PlanType, requiredPlan: PlanType): boolean {
  return PLAN_HIERARCHY[userPlan] >= PLAN_HIERARCHY[requiredPlan];
}

export async function requireFeatureAccess(feature: keyof typeof FEATURE_REQUIREMENTS) {
  const session = await getSession();
  
  if (!session || !session.userId) {
    return { hasAccess: false, plan: "gratuito" as PlanType, requiredPlan: FEATURE_REQUIREMENTS[feature] };
  }

  const plan = await getUserPlan(session.userId);
  const requiredPlan = FEATURE_REQUIREMENTS[feature];

  return {
    hasAccess: hasAccess(plan, requiredPlan),
    plan,
    requiredPlan,
  };
}
