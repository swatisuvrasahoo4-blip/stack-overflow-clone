import { useTranslation } from "react-i18next";

interface QuestionReportStatsProps {
  pending: number;
  reviewed: number;
  dismissed: number;
  actionTaken: number;
}

const QuestionReportStats = ({
  pending,
  reviewed,
  dismissed,
  actionTaken,
}: QuestionReportStatsProps) => {
  const { t } =
    useTranslation("reports");

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <div className="rounded-xl border border-gray-200 bg-white p-6">
        <p className="text-sm text-gray-500">
          {t(
            "admin.stats.pending"
          )}
        </p>

        <p className="mt-2 text-3xl font-semibold text-yellow-600">
          {pending}
        </p>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-6">
        <p className="text-sm text-gray-500">
          {t(
            "admin.stats.reviewed"
          )}
        </p>

        <p className="mt-2 text-3xl font-semibold text-blue-600">
          {reviewed}
        </p>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-6">
        <p className="text-sm text-gray-500">
          {t(
            "admin.stats.dismissed"
          )}
        </p>

        <p className="mt-2 text-3xl font-semibold text-gray-700">
          {dismissed}
        </p>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-6">
        <p className="text-sm text-gray-500">
          {t(
            "admin.stats.action_taken"
          )}
        </p>

        <p className="mt-2 text-3xl font-semibold text-red-600">
          {actionTaken}
        </p>
      </div>
    </div>
  );
};

export default QuestionReportStats;