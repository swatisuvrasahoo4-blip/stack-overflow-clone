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
  const { t } = useTranslation();

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {/* Pending reports */}
      <div className="rounded-xl border border-gray-200 bg-white p-6">
        <p className="text-sm text-gray-500">
          {t("report.pending")}
        </p>

        <p className="mt-2 text-3xl font-semibold text-yellow-600">
          {pending}
        </p>
      </div>

      {/* Reviewed reports */}
      <div className="rounded-xl border border-gray-200 bg-white p-6">
        <p className="text-sm text-gray-500">
          {t("report.reviewed")}
        </p>

        <p className="mt-2 text-3xl font-semibold text-blue-600">
          {reviewed}
        </p>
      </div>

      {/* Dismissed reports */}
      <div className="rounded-xl border border-gray-200 bg-white p-6">
        <p className="text-sm text-gray-500">
          {t("report.dismissed")}
        </p>

        <p className="mt-2 text-3xl font-semibold text-gray-700">
          {dismissed}
        </p>
      </div>

      {/* Action taken */}
      <div className="rounded-xl border border-gray-200 bg-white p-6">
        <p className="text-sm text-gray-500">
          {t("report.actionTaken")}
        </p>

        <p className="mt-2 text-3xl font-semibold text-red-600">
          {actionTaken}
        </p>
      </div>
    </div>
  );
};

export default QuestionReportStats;