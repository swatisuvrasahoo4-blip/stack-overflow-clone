import MainLayout from "@/layout/Mainlayout";
import React, { useEffect, useState } from "react";
import { getMyReputationActivity, getUserReputationActivity } from "@/components/services/reputationActivityService";
import ReputationActivityList from "@/components/reputation/ReputationActivityList";
import { useRouter } from "next/router";
import { useTranslation } from "react-i18next";

const ReputationActivityPage = () => {
  const router = useRouter();
const { userId } = router.query;
const {t} = useTranslation();
    const [reputation, setReputation] = useState(0);
const [activities, setActivities] = useState<any[]>([]);
const [loading, setLoading] = useState(true);

useEffect(() => {
  if (!router.isReady) return;

  const fetchReputationActivity = async () => {
    try {
      setLoading(true);

      let data;

      if (userId) {
        const id = Array.isArray(userId) ? userId[0] : userId;
        data = await getUserReputationActivity(id);
      } else {
        data = await getMyReputationActivity();
      }

      setReputation(data.reputation || 0);
      setActivities(data.activities || []);
    } catch (error) {
      console.error("Failed to load reputation activity:", error);
    } finally {
      setLoading(false);
    }
  };

  fetchReputationActivity();
}, [router.isReady, userId]);
  return (
    <MainLayout>
      {loading ? (
  <p className="mt-6 text-gray-500">
    {t("reputation.loading_reputation")}
  </p>
) : (
  <div className="mt-6 border rounded-xl bg-white p-6">
    <p className="text-sm text-gray-500">
      {t("reputation.current_reputation")}
    </p>

    <p className="text-4xl font-bold text-green-600 mt-1">
      {reputation}
    </p>

    <p className="text-sm text-gray-500 mt-2">
      {activities.length} {t("reputation.reputation_activities")}
    </p>
    <ReputationActivityList activities={activities} />
  </div>
)}
    </MainLayout>
  );
};

export default ReputationActivityPage;