import { clerkClient } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import Stripe from "stripe";

export const POST = async (request: Request) => {
  if (!process.env.STRIPE_SECRET_KEY || !process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.error();
  }
  const signature = request.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.error();
  }
  const text = await request.text();
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: "2024-10-28.acacia",
  });
  try {
    const event = stripe.webhooks.constructEvent(
      text,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET,
    );

    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        
        // Tenta pegar o ID de vários lugares diferentes para ter certeza
        const clerkUserId = 
          session.metadata?.clerk_user_id || 
          (session.subscription ? (await stripe.subscriptions.retrieve(session.subscription as string)).metadata.clerk_user_id : null);

        if (!clerkUserId) {
          console.error("Webhook Error: clerk_user_id not found in any metadata field", session.id);
          return NextResponse.json({ error: "No user id found" }, { status: 400 });
        }

        await (await clerkClient()).users.updateUserMetadata(clerkUserId, {
          publicMetadata: {
            subscriptionPlan: "premium",
          },
        });
        console.log(`✅ Premium ativado para o usuário: ${clerkUserId}`);
        break;
      }
      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        const clerkUserId = subscription.metadata.clerk_user_id;

        if (!clerkUserId) {
          return NextResponse.error();
        }

        await (await clerkClient()).users.updateUserMetadata(clerkUserId, {
          publicMetadata: {
            subscriptionPlan: "free",
          },
        });
        console.log(`Premium deactivated for user: ${clerkUserId}`);
        break;
      }
    }
    return NextResponse.json({ received: true });
  } catch (error) {
    console.error(`Webhook Error: ${error instanceof Error ? error.message : "Unknown error"}`);
    return new NextResponse(`Webhook Error: ${error instanceof Error ? error.message : "Unknown error"}`, { status: 400 });
  }
};
