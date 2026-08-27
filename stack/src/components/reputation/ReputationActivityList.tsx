import React from "react";
import { useTranslation } from "react-i18next";

interface ReputationActivityListProps {
  activities: any[];
}

const ReputationActivityList = ({
  activities,
}: ReputationActivityListProps) => {
  const {t} = useTranslation();
  if (activities.length === 0) {
    return (
      <div className="mt-6 border rounded-xl bg-white p-6">
        <p className="text-gray-500 text-center">
          {t("reputation.no_reputation_activity_yet")}
        </p>
      </div>
    );
  }

  return (
    <div className="mt-6 border rounded-xl bg-white p-6">
      <h2 className="text-xl font-semibold mb-5">
        {t("reputation.reputation_activity")}
      </h2>

      <div className="space-y-3">
        {activities.map((activity) => (
          <div
            key={activity._id}
            className="flex items-center justify-between border-b pb-3"
          >
            <div>
              <p className="font-medium">
                {activity.reason}
              </p>

              {activity.transferReason && (
  <p className="text-sm text-gray-600 mt-1">
    {t("reputation.reason")}: {activity.transferReason}
  </p>
)}

              <p className="text-sm text-gray-500 mt-1">
                {new Date(activity.createdAt).toLocaleString()}
              </p>
            </div>

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