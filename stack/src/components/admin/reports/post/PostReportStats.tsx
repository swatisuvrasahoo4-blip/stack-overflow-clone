import { useTranslation } from "react-i18next";

interface ReportStats {
  pending: number;
  reviewed: number;
  dismissed: number;
  actionTaken: number;
}

interface PostReportStatsProps {
  reportStats: ReportStats;
}

const PostReportStats = ({
  reportStats,
}: PostReportStatsProps) => {
  const { t } =
    useTranslation("reports");

  return (
    <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
      <div className="rounded-xl border bg-white p-5 shadow-sm">
        <p className="text-sm text-gray-500">
          {t(
            "admin.stats.pending"
          )}
        </p>

        <h2 className="mt-2 text-3xl font-bold text-yellow-600">
          {reportStats.pending ?? 0}
        </h2>
      </div>

      <div className="rounded-xl border bg-white p-5 shadow-sm">
        <p className="text-sm text-gray-500">
          {t(
            "admin.stats.reviewed"
          )}
        </p>

        <h2 className="mt-2 text-3xl font-bold text-blue-600">
          {reportStats.reviewed ?? 0}
        </h2>
      </div>

      <div className="rounded-xl border bg-white p-5 shadow-sm">
        <p className="text-sm text-gray-500">
          {t(
            "admin.stats.dismissed"
          )}
        </p>

        <h2 className="mt-2 text-3xl font-bold text-gray-700">
          {reportStats.dismissed ?? 0}
        </h2>
      </div>

      <div className="rounded-xl border bg-white p-5 shadow-sm">
        <p className="text-sm text-gray-500">
          {t(
            "admin.stats.action_taken"
          )}
        </p>

        <h2 className="mt-2 text-3xl font-bold text-red-600">
          {reportStats.actionTaken ?? 0}
        </h2>
      </div>
    </div>
  );
};

export default PostReportStats;