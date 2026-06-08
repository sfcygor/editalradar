import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { requireAuth } from "@/lib/session";
import { stripe } from "@/lib/stripe";
import PerfilClient from "./PerfilClient";

export default async function PerfilPage({ 
  searchParams 
}: { 
  searchParams: Promise<{ [key: string]: string | string[] | undefined }> 
}) {
  const session = await requireAuth();
  const sp = await searchParams;

  // Synchronous Stripe Checkout Fallback
  if (sp.session_id && typeof sp.session_id === "string") {
    try {
      const checkoutSession = await stripe.checkout.sessions.retrieve(sp.session_id);
      if (checkoutSession.status === "complete") {
        // Find which plan they bought based on the price ID
        let newPlan = "padrao";
        const lineItems = await stripe.checkout.sessions.listLineItems(sp.session_id);
        const priceId = lineItems.data[0]?.price?.id;
        
        if (priceId === process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_AVANCADO) {
          newPlan = "avancado";
        } else if (priceId === process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_PADRAO) {
          newPlan = "padrao";
        }

        const subscriptionId = typeof checkoutSession.subscription === "string" 
          ? checkoutSession.subscription 
          : checkoutSession.subscription?.id;

        const customerId = typeof checkoutSession.customer === "string"
          ? checkoutSession.customer
          : checkoutSession.customer?.id;

        let subscriptionStatus = "active";
        if (subscriptionId) {
          const subscription = await stripe.subscriptions.retrieve(subscriptionId);
          subscriptionStatus = subscription.status;
        }

        await db().update(users)
          .set({
            plan: newPlan,
            stripeCustomerId: customerId,
            stripeSubscriptionId: subscriptionId,
            stripePriceId: priceId,
            subscriptionStatus: subscriptionStatus
          })
          .where(eq(users.id, session.userId));
      }
    } catch (e) {
      console.error("Error verifying checkout session fallback:", e);
    }
  }

  const [user] = await db()
    .select({ 
      name: users.name, 
      email: users.email, 
      avatarUrl: users.avatarUrl,
      plan: users.plan,
      billingCycle: users.billingCycle,
      subscriptionDate: users.subscriptionDate,
      renewalDate: users.renewalDate,
      subscriptionStatus: users.subscriptionStatus,
      stripePriceId: users.stripePriceId
    })
    .from(users)
    .where(eq(users.id, session.userId))
    .limit(1);

  return <PerfilClient user={user} />;
}
