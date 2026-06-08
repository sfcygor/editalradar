import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import Stripe from "stripe";

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get("Stripe-Signature") as string;
  let event: Stripe.Event;

  try {
    const secret = process.env.STRIPE_WEBHOOK_SECRET;
    if (!secret) {
      console.warn("⚠️ STRIPE_WEBHOOK_SECRET missing in .env.local");
      return NextResponse.json({ error: "Webhook secret missing" }, { status: 400 });
    }
    event = stripe.webhooks.constructEvent(body, signature, secret);
  } catch (err: any) {
    console.error(`⚠️  Webhook signature verification failed.`, err.message);
    return NextResponse.json({ error: "Webhook Error" }, { status: 400 });
  }

  const session = event.data.object as any;

  switch (event.type) {
    case "checkout.session.completed": {
      const checkoutSession = session as Stripe.Checkout.Session;
      
      if (checkoutSession.mode === "subscription") {
        const subscriptionId = checkoutSession.subscription as string;
        
        // Retrieve subscription to get the end date and price ID
        const subscription = (await stripe.subscriptions.retrieve(subscriptionId)) as Stripe.Subscription;
        
        const userId = checkoutSession.metadata?.userId;
        const priceId = subscription.items.data[0].price.id;

        let planToSet = "padrao";
        if (priceId === process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_AVANCADO) {
          planToSet = "avancado";
        }

        if (userId) {
          await db().update(users).set({
            stripeCustomerId: checkoutSession.customer as string,
            stripeSubscriptionId: subscription.id,
            stripePriceId: priceId,
            stripeCurrentPeriodEnd: new Date((subscription as any).current_period_end * 1000),
            plan: planToSet,
            subscriptionStatus: subscription.status,
            billingCycle: "mensal", // Would normally come from the price interval
            subscriptionDate: new Date((subscription as any).current_period_start * 1000),
            renewalDate: new Date((subscription as any).current_period_end * 1000),
          }).where(eq(users.id, userId));
        }
      }
      break;
    }

    case "invoice.payment_succeeded": {
      const invoice = session as Stripe.Invoice;
      const subscriptionId = (invoice as any).subscription as string;
      
      if (subscriptionId) {
        const subscription = (await stripe.subscriptions.retrieve(subscriptionId)) as Stripe.Subscription;
        const priceId = subscription.items.data[0].price.id;

        let planToSet = "padrao";
        if (priceId === process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_AVANCADO) {
          planToSet = "avancado";
        }
        
        // Update user's period end
        await db().update(users).set({
          stripeCurrentPeriodEnd: new Date((subscription as any).current_period_end * 1000),
          renewalDate: new Date((subscription as any).current_period_end * 1000),
          subscriptionStatus: subscription.status,
          plan: planToSet,
        }).where(eq(users.stripeSubscriptionId, subscription.id));
      }
      break;
    }

    case "customer.subscription.updated": {
      const subscription = session as Stripe.Subscription;
      const priceId = subscription.items.data[0].price.id;

      let planToSet = "padrao";
      if (priceId === process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_AVANCADO) {
        planToSet = "avancado";
      }

      await db().update(users).set({
        stripePriceId: priceId,
        stripeCurrentPeriodEnd: new Date((subscription as any).current_period_end * 1000),
        subscriptionStatus: subscription.status,
        renewalDate: new Date((subscription as any).current_period_end * 1000),
        plan: planToSet,
        // Se status for cancelado ou past_due, podemos regredir pra gratuito depois de vencer
      }).where(eq(users.stripeSubscriptionId, subscription.id));
      break;
    }

    case "customer.subscription.deleted": {
      const subscription = session as Stripe.Subscription;
      await db().update(users).set({
        plan: "gratuito",
        subscriptionStatus: "canceled",
        stripePriceId: null,
      }).where(eq(users.stripeSubscriptionId, subscription.id));
      break;
    }

    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  return NextResponse.json({ received: true });
}
