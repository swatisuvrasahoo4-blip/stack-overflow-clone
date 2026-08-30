import { useEffect, useState } from "react";
import PlanCard from "@/components/subscription/PlanCard";
import {
  subscriptionPlans,
  type PlanName,
} from "@/constants/subscriptionPlans";
import WhyUpgrade from "@/components/subscription/WhyUpgrade";
import {
  createOrder,
  verifyPayment,
  getSubscription,
} from "@/components/services/subscriptionService";
import Script from "next/script";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/lib/AuthContext";
import { useRouter } from "next/router";
import { toast } from "react-toastify";

interface RazorpayPaymentResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

interface RazorpayOrder {
  id: string;
  amount: number;
  currency: string;
}

interface CreateOrderResponse {
  order: RazorpayOrder;
  key: string;
}

interface SubscriptionResponse {
  data: {
    plan: string;
  };
}

interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  handler: (
    response: RazorpayPaymentResponse
  ) => void | Promise<void>;
  prefill?: {
    name?: string;
    email?: string;
  };
  theme?: {
    color?: string;
  };
}

interface RazorpayInstance {
  open: () => void;
}

interface RazorpayConstructor {
  new (
    options: RazorpayOptions
  ): RazorpayInstance;
}

declare global {
  interface Window {
    Razorpay: RazorpayConstructor;
  }
}

export default function SubscriptionPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const { user } = useAuth();

  const [plans, setPlans] =
    useState(subscriptionPlans);

  useEffect(() => {
    const loadSubscription =
      async (): Promise<void> => {
        try {
          const response =
            (await getSubscription()) as SubscriptionResponse;

          setPlans((previousPlans) =>
            previousPlans.map((plan) => ({
              ...plan,
              isCurrent:
                plan.name.toLowerCase() ===
                response.data.plan.toLowerCase(),
            }))
          );
        } catch (error: unknown) {
          console.error(
            "Failed to load subscription:",
            error
          );
        }
      };

    void loadSubscription();
  }, []);

 const currentPlan: PlanName | "" =
  plans.find((plan) => plan.isCurrent)?.name ?? "";

 type PaidPlan = "Bronze" | "Silver" | "Gold";

const handleUpgrade = async (
  plan: PaidPlan
): Promise<void> => {
    if (!user) {
      toast.info(
        t("toast.please_login_to_continue")
      );

      void router.push("/auth");
      return;
    }

    try {
      const response =
        (await createOrder(plan)) as CreateOrderResponse;

      const { order, key } = response;

      const options: RazorpayOptions = {
        key,
        amount: order.amount,
        currency: order.currency,
        name: "CodeQuest",
        description: `${plan} Subscription`,
        order_id: order.id,

        handler: async (
          paymentResponse: RazorpayPaymentResponse
        ): Promise<void> => {
          try {
            await verifyPayment({
  ...paymentResponse,
  plan,
});

            alert(
              t(
                "alert.subscription_activated_successfully"
              )
            );
          } catch (error: unknown) {
            console.error(
              "Payment verification failed:",
              error
            );

            alert(
              t(
                "alert.payment_verification_failed"
              )
            );
          }
        },

        prefill: {
          name: "",
          email: "",
        },

        theme: {
          color: "#7C3AED",
        },
      };

      if (!window.Razorpay) {
        toast.error(
          "Payment service is not loaded yet"
        );
        return;
      }

      const razorpay =
        new window.Razorpay(options);

      razorpay.open();
    } catch (error: unknown) {
      console.error(
        "Failed to create payment order:",
        error
      );

      toast.error(
        t(
          "alert.something_went_wrong"
        )
      );
    }
  };

  return (
    <>
      <Script
        src="https://checkout.razorpay.com/v1/checkout.js"
        strategy="afterInteractive"
      />

      <div className="min-h-screen bg-gray-50">
        <div className="mx-auto max-w-7xl px-6 py-8">
          <div className="mb-12 text-center">
            <h1 className="text-4xl font-bold text-black">
              {t(
                "subscription.subscriptionPlans"
              )}
            </h1>

            <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-600">
              {t(
                "subscription.upgrade_membership_title"
              )}
            </p>
          </div>

          <div className="mt-14 grid gap-8 md:grid-cols-2 xl:grid-cols-4">
            {plans.map((plan) => (
              <PlanCard
                key={plan.id}
                name={plan.name}
                price={plan.price}
                description={plan.description}
                features={plan.features}
                isCurrent={plan.isCurrent}
                isPopular={plan.isPopular}
                currentPlan={currentPlan}
                onUpgrade={handleUpgrade}
              />
            ))}
          </div>

          <WhyUpgrade />
        </div>
      </div>
    </>
  );
}