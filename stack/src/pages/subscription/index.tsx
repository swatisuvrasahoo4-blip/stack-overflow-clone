import { useState, useEffect } from "react";
import PlanCard from "@/components/subscription/PlanCard";
import { subscriptionPlans } from "@/constants/subscriptionPlans"
import WhyUpgrade from "@/components/subscription/WhyUpgrade";
import { createOrder, verifyPayment, getSubscription } from "@/components/services/subscriptionService";
import Script from "next/script";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/lib/AuthContext";
import { useRouter } from "next/router";
import { toast } from "react-toastify";

export default function SubscriptionPage() {
  const {t} = useTranslation();
  const router = useRouter();
  const { user } = useAuth();
  const [plans, setPlans] = useState(subscriptionPlans);
  useEffect(() => {
  const loadSubscription = async () => {
    try {
      const response = await getSubscription();

      setPlans((prev) =>
        prev.map((plan) => ({
          ...plan,
          isCurrent:
            plan.name.toLowerCase() ===
            response.data.plan.toLowerCase(),
        }))
      );
    } catch (error) {
      console.log(error);
    }
  };

  loadSubscription();
}, []);
const planOrder: Record<string, number> = {
  Free: 0,
  Bronze: 1,
  Silver: 2,
  Gold: 3,
};

const currentPlan = plans.find((plan) => plan.isCurrent)?.name || "";

const handleUpgrade = async (plan: string) => {
  if (!user) {
    toast.info(t("toast.please_login_to_continue"));
    router.push("/auth");
    return;
  }
  
  try {
    const response = await createOrder(plan);

    const { order, key } = response;

    const options = {
      key,
      amount: order.amount,
      currency: order.currency,
      name: "CodeQuest",
      description: `${plan} Subscription`,
      order_id: order.id,

      handler: async (paymentResponse: any) => {
        try {
          await verifyPayment({
            ...paymentResponse,
            plan,
          });

          alert(t("alert.subscription_activated_successfully"));
        } catch (error) {
          console.log(error);
          alert(t("alert.payment_verification_failed"));
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

    const razorpay = new (window as any).Razorpay(options);
    razorpay.open();
  } catch (error) {
    console.log(error);
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
          <h1 className="text-4xl font-bold text-black">{t("subscription.subscriptionPlans")}</h1>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
 {t("subscription.upgrade_membership_title")}
</p>
        </div>

        <div className="grid gap-8 mt-14 md:grid-cols-2 xl:grid-cols-4">
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