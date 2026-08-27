import { Calendar, CreditCard, Crown } from "lucide-react";
import { useEffect, useState } from "react";
import { getSubscription } from "../services/subscriptionService";
import { useTranslation } from "react-i18next";


export default function SubscriptionDashboard(){
    const [subscription, setSubscription] = useState<any>(null);
    const {t} = useTranslation();

useEffect(() => {
  const loadSubscription = async () => {
    try {
      const response = await getSubscription();
      setSubscription(response.data);
      
    } catch (error) {
      console.log(error);
    }
  };

  loadSubscription();
}, []);
  return (
    <div className="mt-10 rounded-xl border bg-white p-6 shadow-sm">
      <div className="flex items-center gap-2 mb-6">
        <Crown className="w-6 h-6 text-amber-500" />
        <h2 className="text-2xl font-bold">{t("subscription.subscription")}</h2>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="flex items-center gap-3">
          <CreditCard className="text-blue-600" />
          <div>
            <p className="text-gray-500 text-sm">{t("subscription.current_plan")}</p>
            <p className="font-semibold">
  {subscription?.plan && t(`subscription.${subscription.plan.toLowerCase()}`)}
</p>
          </div>
        </div>

        <div>
          <p className="text-gray-500 text-sm">{t("subscription.status")}</p>
          <span
  className={`inline-block rounded-full px-3 py-1 text-sm font-medium ${
    subscription?.status === "Expired"
      ? "bg-red-100 text-red-700"
      : subscription?.status === "Cancelled"
      ? "bg-gray-200 text-gray-700"
      : "bg-green-100 text-green-700"
  }`}
>
  {t(`subscription.${subscription?.status.toLowerCase()}`)}
</span>
        </div>

        <div>
          <p className="text-gray-500 text-sm">{t("subscription.amount")}</p>
          <p className="font-semibold">
            ₹{subscription?.amount}/{t("subscription.month")}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Calendar className="text-purple-500" />
          <div>
            <p className="text-gray-500 text-sm">{t("subscription.start_date")}</p>
            <p className="font-semibold">{subscription?.startdate
  ? new Date(subscription.startdate).toLocaleDateString()
  : "-"}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Calendar className="text-orange-500" />
          <div>
            <p className="text-gray-500 text-sm">{t("subscription.renewal_date")}</p>
            <p className="font-semibold">{subscription?.renewaldate
  ? new Date(subscription.renewaldate).toLocaleDateString()
  : "-"}</p>
          </div>
        </div>
      </div>

      <button
        onClick={() => (window.location.href = "/subscription")}
        className="mt-8 rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700 transition"
      >
        {t("subscription.upgrade_plan")}
      </button>
      
    </div>
  );
}