// app/pricing/page.tsx
"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";

const pricingPlans = [
  {
    id: "basic",
    name: "Basic",
    price: { monthly: 5.99, yearly: 59.99 },
    features: ["10 Projects per month", "2GB private storage", "Email Support"],

    popular: false,
  },
  {
    id: "pro",
    name: "Pro",
    price: { monthly: 19.99, yearly: 199.99 },
    features: [
      "Unlimited Projects",
      "20GB private Storage",
      "Priority Support",
      "Custom Domain for virtual tours",
    ],
    popular: true,
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: { monthly: 49.99, yearly: 499.99 },
    features: [
      "Unlimited Everything",
      "100GB Private Storage",
      "24/7 Support",
      "Dedicated Instance",
      "other same features as pro plan",
    ],
    popular: false,
  },
];

export default function PricingPage() {
  const [isYearly, setIsYearly] = useState(false);

  const handleSubscribe = async (priceId: string) => {
    try {
      const response = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          priceId,
          interval: isYearly ? "yearly" : "monthly",
        }),
      });

      const { sessionId } = await response.json();
      const stripe = await loadStripe(
        process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
      );

      if (stripe) {
        await stripe.redirectToCheckout({ sessionId });
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Simple, transparent pricing
          </h1>
          <p className="text-xl text-gray-600">
            Choose the perfect plan for your needs
          </p>
        </motion.div>

        {/* Billing Toggle */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex justify-center items-center gap-4 mb-12"
        >
          <span
            className={`text-lg ${
              !isYearly ? "text-gray-900" : "text-gray-500"
            }`}
          >
            Monthly
          </span>
          <button
            onClick={() => setIsYearly(!isYearly)}
            className="relative inline-flex h-6 w-12 items-center rounded-full bg-blue-600"
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                isYearly ? "translate-x-7" : "translate-x-1"
              }`}
            />
          </button>
          <span
            className={`text-lg ${
              isYearly ? "text-gray-900" : "text-gray-500"
            }`}
          >
            Yearly
            <span className="ml-2 text-sm text-green-500 font-medium">
              Save 20%
            </span>
          </span>
        </motion.div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {pricingPlans.map((plan, index) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 + 0.3 }}
              className={`relative rounded-2xl bg-white p-8 shadow-lg ${
                plan.popular ? "ring-2 ring-blue-600" : ""
              }`}
            >
              {plan.popular && (
                <span className="absolute top-0 -translate-y-1/2 bg-blue-600 text-white px-3 py-0.5 rounded-full text-sm font-medium">
                  Most Popular
                </span>
              )}
              <div className="mb-8">
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  {plan.name}
                </h3>
                <div className="flex items-baseline">
                  <span className="text-4xl font-bold text-gray-900">
                    ${isYearly ? plan.price.yearly : plan.price.monthly}
                  </span>
                  <span className="ml-2 text-gray-500">
                    /{isYearly ? "year" : "month"}
                  </span>
                </div>
              </div>

              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, featureIndex) => (
                  <motion.li
                    key={featureIndex}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: featureIndex * 0.1 + 0.5 }}
                    className="flex items-center gap-3 text-gray-600"
                  >
                    <Check className="h-5 w-5 text-green-500" />
                    {feature}
                  </motion.li>
                ))}
              </ul>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleSubscribe(plan.id)}
                className={`w-full rounded-lg py-3 px-4 text-sm font-semibold transition-colors ${
                  plan.popular
                    ? "bg-blue-600 text-white hover:bg-blue-700"
                    : "bg-gray-100 text-gray-900 hover:bg-gray-200"
                }`}
              >
                Get Started
              </motion.button>
            </motion.div>
          ))}
        </div>
      </div>
    </main>
  );
}
