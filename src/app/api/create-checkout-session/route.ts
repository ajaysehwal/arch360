import { stripe } from "@/lib/stripe";
import { NextResponse } from "next/server";
export const runtime = "edge";

export async function POST(request: Request) {
  try {
    const { priceId, interval } = await request.json();
    console.log(priceId, interval);
    
    const stripePriceId = getStripePriceId(priceId, interval);
    // console.log(stripePriceId);
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [
        {
          price: stripePriceId,
          quantity: 1,
        },
      ],
      success_url: `${process.env.NEXT_PUBLIC_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_URL}/pricing`,
      metadata: {
        priceId,
        interval,
      },
    });

    return NextResponse.json({ sessionId: session.id });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

function getStripePriceId(
  plan: "basic" | "pro" | "enterprise",
  interval: "monthly" | "yearly"
): string {
  const priceMap = {
    basic: {
      monthly: "price_1QqT4SBMxClYjLwG6dz7uVDs",
      yearly: "price_1QqT57BMxClYjLwGZUkqmoIg",
    },
    pro: {
      monthly: "price_pro_monthly",
      yearly: "price_pro_yearly",
    },
    enterprise: {
      monthly: "price_enterprise_monthly",
      yearly: "price_enterprise_yearly",
    },
  };

  return priceMap[plan][interval];
}
