import MainLayout from "@/layout/Mainlayout";
import React, { useEffect, useState } from "react";
import {
  getMyReputationActivity,
  getUserReputationActivity,
} from "@/components/services/reputationActivityService";
import ReputationActivityList from "@/components/reputation/ReputationActivityList";
import { useRouter } from "next/router";
import { useTranslation } from "react-i18next";

type ReputationActivity =
  React.ComponentProps<
    typeof ReputationActivityList
  >["activities"][number];

interface ReputationActivityResponse {
  reputation?: number;
  activities?: ReputationActivity[];
}

const ReputationActivityPage = () => {
  const router = useRouter();
  const { userId } = router.query;
  const { t } = useTranslation();

  const [reputation, setReputation] =
    useState<number>(0);

  const [activities, setActivities] =
    useState<ReputationActivity[]>([]);

  const [loading, setLoading] =
    useState<boolean>(true);

  useEffect(() => {
    if (!router.isReady) {
      return;
    }

    const fetchReputationActivity =
      async (): Promise<void> => {
        try {
          setLoading(true);

          let data: ReputationActivityResponse;

          if (userId) {
            const id = Array.isArray(userId)
              ? userId[0]
              : userId;

            if (!id) {
              return;
            }

            data =
              await getUserReputationActivity(
                id
              );
          } else {
            data =
              await getMyReputationActivity();
          }

          setReputation(
            data.reputation ?? 0
          );

          setActivities(
            data.activities ?? []
          );
        } catch (error: unknown) {
          console.error(
            "Failed to load reputation activity:",
            error
          );
        } finally {
          setLoading(false);
        }
      };

    void fetchReputationActivity();
  }, [router.isReady, userId]);

  return (
    <MainLayout>
      {loading ? (
        <p className="mt-6 text-gray-500">
          {t(
            "reputation.loading_reputation"
          )}
        </p>
      ) : (
        <div className="mt-6 rounded-xl border bg-white p-6">
          <p className="text-sm text-gray-500">
            {t(
              "reputation.current_reputation"
            )}
          </p>

          <p className="mt-1 text-4xl font-bold text-green-600">
            {reputation}
          </p>

          <p className="mt-2 text-sm text-gray-500">
            {activities.length}{" "}
            {t(
              "reputation.reputation_activities"
            )}
          </p>

          <ReputationActivityList
            activities={activities}
          />
        </div>
      )}
    </MainLayout>
  );
};

export default ReputationActivityPage;