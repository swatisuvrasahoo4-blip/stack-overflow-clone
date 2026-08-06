import { Calendar, CreditCard, Crown } from "lucide-react";
import { useEffect, useState } from "react";
import { getSubscription,getPaymentHistory } from "../services/subscriptionService";


export default function SubscriptionDashboard(){
    const [subscription, setSubscription] = useState<any>(null);

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
        <h2 className="text-2xl font-bold">Subscription</h2>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="flex items-center gap-3">
          <CreditCard className="text-blue-600" />
          <div>
            <p className="text-gray-500 text-sm">Current Plan</p>
            <p className="font-semibold">{subscription?.plan}</p>
          </div>
        </div>

        <div>
          <p className="text-gray-500 text-sm">Status</p>
          <span className="inline-block rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-700">
            {subscription?.status}
          </span>
        </div>

        <div>
          <p className="text-gray-500 text-sm">Amount</p>
          <p className="font-semibold">
            ₹{subscription?.amount}/month
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Calendar className="text-purple-500" />
          <div>
            <p className="text-gray-500 text-sm">Start Date</p>
            <p className="font-semibold">{subscription?.startdate
  ? new Date(subscription.startdate).toLocaleDateString()
  : "-"}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Calendar className="text-orange-500" />
          <div>
            <p className="text-gray-500 text-sm">Renewal Date</p>
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
        Upgrade Plan
      </button>
      
    </div>
  );
}