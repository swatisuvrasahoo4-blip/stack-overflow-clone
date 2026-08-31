import { useState } from "react";
import { useTranslation } from "react-i18next";

import PostReportCard from "./PostReportCard";
import PostReportStats from "./PostReportStats";

type ReportStatus =
  | "pending"
  | "reviewed"
  | "dismissed"
  | "action_taken";

interface ReportUser {
  _id: string;
  name?: string;
  username?: string;
  profilePhoto?: string;
  isSuspended?: boolean;
}

interface ReportPost {
  _id: string;
  content?: string;
  image?: string;
}

interface ReportItem {
  _id: string;
  reason: string;
  status: ReportStatus;
  createdAt: string;
  details?: string;
  postId?: ReportPost | null;
  reporterId?: ReportUser | null;
  postAuthorId?: ReportUser | null;
  violationCount: number;
  isRepeatOffender?: boolean;
}

interface ReportStats {
  pending: number;
  reviewed: number;
  dismissed: number;
  actionTaken: number;
}

interface PostReportsProps {
  reports: ReportItem[];

  reportStats: ReportStats;

  handleStatusUpdate: (
    reportId: string,
    status: ReportStatus
  ) => Promise<void>;

  handleSuspend: (
    userId: string
  ) => void;

  handleUnsuspend: (
    userId: string
  ) => void;
}

const PostReports = ({
  reports,
  reportStats,
  handleStatusUpdate,
  handleSuspend,
  handleUnsuspend,
}: PostReportsProps) => {
  const { t } = useTranslation();

  const [
    updatingId,
    setUpdatingId,
  ] = useState<string | null>(
    null
  );

  // Update report status
  const handleStatusChange = async (
    reportId: string,
    status: ReportStatus
  ): Promise<void> => {
    try {
      setUpdatingId(reportId);

      await handleStatusUpdate(
        reportId,
        status
      );
    } finally {
      setUpdatingId(null);
    }
  };

  const postReports =
    reports.filter(
      (report) =>
        report.postId
    );

  return (
    <>
      {/* Report statistics */}
      <PostReportStats
        reportStats={
          reportStats
        }
      />

      {/* Empty state */}
      {postReports.length ===
      0 ? (
        <div className="rounded-xl border border-gray-200 bg-white p-10 text-center shadow-sm">
          <p className="text-base font-medium text-gray-700">
            {t(
              "report.no_reports_found"
            )}
          </p>

          <p className="mt-1 text-sm text-gray-500">
            {t(
              "report.new_reported_posts_will_appear_here"
            )}
          </p>
        </div>
      ) : (
        /* Report list */
        <div className="space-y-6">
          {postReports.map(
            (report) => (
              <PostReportCard
                key={
                  report._id
                }
                report={
                  report
                }
                updatingId={
                  updatingId
                }
                handleStatusChange={
                  handleStatusChange
                }
                handleSuspend={
                  handleSuspend
                }
                handleUnsuspend={
                  handleUnsuspend
                }
              />
            )
          )}
        </div>
      )}
    </>
  );
};

export default PostReports;