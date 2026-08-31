import { Calendar, CreditCard, Crown } from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useTranslation } from "react-i18next";
import { getSubscription } from "../services/subscriptionService";

interface Subscription {
  _id?: string;
  userid?: string;
  plan: "Free" | "Bronze" | "Silver" | "Gold";
  status: "Active" | "Expired" | "Cancelled";
  amount?: number;
  paymentid?: string;
  orderid?: string;
  startdate?: string;
  renewaldate?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

const SubscriptionDashboard = () => {
  const router = useRouter();
  const { t } = useTranslation();

  const [subscription, setSubscription] =
    useState<Subscription | null>(null);

  useEffect(() => {
    const loadSubscription = async () => {
      try {
        const response = await getSubscription();
        setSubscription(response.data);
      } catch (error: unknown) {
        console.error(
          "Failed to load subscription:",
          error
        );
      }
    };

    void loadSubscription();
  }, []);

  const handleUpgradePlan = () => {
    void router.push("/subscription");
  };

  return (
    <div className="mt-10 rounded-xl border bg-white p-6 shadow-sm">
      {/* Subscription heading */}
      <div className="mb-6 flex items-center gap-2">
        <Crown className="h-6 w-6 text-amber-500" />

        <h2 className="text-2xl font-bold">
          {t("subscription.subscription")}
        </h2>
      </div>

      {/* Subscription details */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Current plan */}
        <div className="flex items-center gap-3">
          <CreditCard className="text-blue-600" />

          <div>
            <p className="text-sm text-gray-500">
              {t("subscription.current_plan")}
            </p>

            <p className="font-semibold">
              {subscription?.plan &&
                t(
                  `subscription.${subscription.plan.toLowerCase()}`
                )}
            </p>
          </div>
        </div>

        {/* Status */}
        <div>
          <p className="text-sm text-gray-500">
            {t("subscription.status")}
          </p>

          <span
            className={`inline-block rounded-full px-3 py-1 text-sm font-medium ${
              subscription?.status === "Expired"
                ? "bg-red-100 text-red-700"
                : subscription?.status === "Cancelled"
                  ? "bg-gray-200 text-gray-700"
                  : "bg-green-100 text-green-700"
            }`}
          >
            {subscription?.status &&
              t(
                `subscription.${subscription.status.toLowerCase()}`
              )}
          </span>
        </div>

        {/* Amount */}
        <div>
          <p className="text-sm text-gray-500">
            {t("subscription.amount")}
          </p>

          <p className="font-semibold">
            ₹{subscription?.amount ?? 0}/
            {t("subscription.month")}
          </p>
        </div>

        {/* Start date */}
        <div className="flex items-center gap-3">
          <Calendar className="text-purple-500" />

          <div>
            <p className="text-sm text-gray-500">
              {t("subscription.start_date")}
            </p>

            <p className="font-semibold">
              {subscription?.startdate
                ? new Date(
                    subscription.startdate
                  ).toLocaleDateString()
                : "-"}
            </p>
          </div>
        </div>

        {/* Renewal date */}
        <div className="flex items-center gap-3">
          <Calendar className="text-orange-500" />

          <div>
            <p className="text-sm text-gray-500">
              {t("subscription.renewal_date")}
            </p>

            <p className="font-semibold">
              {subscription?.renewaldate
                ? new Date(
                    subscription.renewaldate
                  ).toLocaleDateString()
                : "-"}
            </p>
          </div>
        </div>
      </div>

      {/* Upgrade plan */}
      <button
        type="button"
        onClick={handleUpgradePlan}
        className="mt-8 rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700"
      >
        {t("subscription.upgrade_plan")}
      </button>
    </div>
  );
};

export default SubscriptionDashboard;