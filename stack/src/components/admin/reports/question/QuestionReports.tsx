import { useTranslation } from "react-i18next";

import QuestionReportCard from "./QuestionReportCard";
import QuestionReportStats from "@/pages/admin/reports/question/QuestionReportStats";

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

interface ReportQuestion {
  _id: string;
  questiontitle?: string;
  questionbody?: string;
}

interface QuestionReport {
  _id: string;
  reason: string;
  status: ReportStatus;
  createdAt: string;
  details?: string;
  questionId?: ReportQuestion | null;
  reporterId?: ReportUser | null;
  questionAuthorId?: ReportUser | null;
  violationCount: number;
  isRepeatOffender?: boolean;
}

interface QuestionReportsProps {
  reports: QuestionReport[];
  updatingId: string | null;

  onStatusChange: (
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

const QuestionReports = ({
  reports,
  updatingId,
  onStatusChange,
  handleSuspend,
  handleUnsuspend,
}: QuestionReportsProps) => {
  const { t } =
    useTranslation("reports");

  const questionReports =
    reports.filter(
      (report) =>
        Boolean(report.questionId)
    );

  const reportStats = {
    pending:
      questionReports.filter(
        (report) =>
          report.status === "pending"
      ).length,

    reviewed:
      questionReports.filter(
        (report) =>
          report.status === "reviewed"
      ).length,

    dismissed:
      questionReports.filter(
        (report) =>
          report.status === "dismissed"
      ).length,

    actionTaken:
      questionReports.filter(
        (report) =>
          report.status ===
          "action_taken"
      ).length,
  };

  return (
    <div className="space-y-6">
      <QuestionReportStats
        pending={
          reportStats.pending
        }
        reviewed={
          reportStats.reviewed
        }
        dismissed={
          reportStats.dismissed
        }
        actionTaken={
          reportStats.actionTaken
        }
      />

      <div className="rounded-xl border border-gray-200 bg-white p-6">
        {questionReports.length ===
        0 ? (
          <p className="text-gray-600">
            {t(
              "admin.question.no_reports_found"
            )}
          </p>
        ) : (
          <div className="space-y-4">
            {questionReports.map(
              (report) => (
                <QuestionReportCard
                  key={report._id}
                  report={report}
                  updatingId={
                    updatingId
                  }
                  onStatusChange={
                    onStatusChange
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
      </div>
    </div>
  );
};

export default QuestionReports;