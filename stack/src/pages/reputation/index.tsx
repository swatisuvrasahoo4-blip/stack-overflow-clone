import {
  useEffect,
  useState,
} from "react";

import { useRouter } from "next/router";

import { useTranslation } from "react-i18next";

import ReputationActivityList from "@/components/reputation/ReputationActivityList";

import {
  getMyReputationActivity,
  getUserReputationActivity,
} from "@/components/services/reputationActivityService";

import MainLayout from "@/layout/Mainlayout";

import type { ComponentProps } from "react";

type ReputationActivity =
  ComponentProps<
    typeof ReputationActivityList
  >["activities"][number];

interface ReputationActivityResponse {
  reputation?: number;
  activities?: ReputationActivity[];
}

const ReputationActivityPage = () => {
  const router = useRouter();

  const { t } =
    useTranslation("reputation");

  const { userId } = router.query;

  const resolvedUserId =
    Array.isArray(userId)
      ? userId[0]
      : userId;

  const [
    reputation,
    setReputation,
  ] = useState(0);

  const [
    activities,
    setActivities,
  ] = useState<
    ReputationActivity[]
  >([]);

  const [
    loading,
    setLoading,
  ] = useState(true);

  // Load reputation activity

  useEffect(() => {
    if (!router.isReady) {
      return;
    }

    let cancelled = false;

    const fetchReputationActivity =
      async (): Promise<void> => {
        try {
          setLoading(true);

          let data:
            ReputationActivityResponse;

          if (resolvedUserId) {
            data =
              await getUserReputationActivity(
                resolvedUserId
              );
          } else {
            data =
              await getMyReputationActivity();
          }

          if (cancelled) {
            return;
          }

          setReputation(
            data.reputation ?? 0
          );

          setActivities(
            data.activities ?? []
          );
        } catch (
          error: unknown
        ) {
          console.error(
            "Failed to load reputation activity:",
            error
          );
        } finally {
          if (!cancelled) {
            setLoading(false);
          }
        }
      };

    void fetchReputationActivity();

    return () => {
      cancelled = true;
    };
  }, [
    resolvedUserId,
    router.isReady,
  ]);

  return (
    <MainLayout>
      {/* Loading state */}

      {loading ? (
        <p className="mt-6 text-gray-500">
          {t(
            "status.loading_reputation"
          )}
        </p>
      ) : (
        /* Reputation activity */

        <div className="mt-6 rounded-xl border bg-white p-6">
          <p className="text-sm text-gray-500">
            {t(
              "labels.current_reputation"
            )}
          </p>

          <p className="mt-1 text-4xl font-bold text-green-600">
            {reputation}
          </p>

          <p className="mt-2 text-sm text-gray-500">
            {t(
              "labels.reputation_activities",
              {
                count:
                  activities.length,
              }
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