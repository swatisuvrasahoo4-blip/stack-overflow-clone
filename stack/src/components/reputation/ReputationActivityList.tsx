import { useTranslation } from "react-i18next";

type ReputationActivity = {
  _id: string;
  reason: string;
  transferReason?: string | null;
  createdAt: string;
  points: number;
};

interface ReputationActivityListProps {
  activities: ReputationActivity[];
}

const ReputationActivityList = ({
  activities,
}: ReputationActivityListProps) => {
  const { t } = useTranslation();

  if (activities.length === 0) {
    return (
      <div className="mt-6 rounded-xl border bg-white p-6">
        <p className="text-center text-gray-500">
          {t("reputation.no_reputation_activity_yet")}
        </p>
      </div>
    );
  }

  return (
    <div className="mt-6 rounded-xl border bg-white p-6">
      {/* Reputation activity heading */}
      <h2 className="mb-5 text-xl font-semibold">
        {t("reputation.reputation_activity")}
      </h2>

      {/* Reputation activities */}
      <div className="space-y-3">
        {activities.map((activity) => (
          <div
            key={activity._id}
            className="flex items-center justify-between border-b pb-3"
          >
            <div>
              <p className="font-medium">{activity.reason}</p>

              {activity.transferReason && (
                <p className="mt-1 text-sm text-gray-600">
                  {t("reputation.reason")}: {activity.transferReason}
                </p>
              )}

              <p className="mt-1 text-sm text-gray-500">
                {new Date(activity.createdAt).toLocaleString()}
              </p>
            </div>

            {/* Reputation points */}
            <p
              className={`font-bold ${
                activity.points > 0
                  ? "text-green-600"
                  : "text-red-600"
              }`}
            >
              {activity.points > 0 ? "+" : ""}
              {activity.points}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReputationActivityList;