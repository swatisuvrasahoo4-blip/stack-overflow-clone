import {
  useEffect,
  useState,
} from "react";

import { useRouter } from "next/router";

import { useTranslation } from "react-i18next";

import QuestionReports from "./question/QuestionReports";
import PostReports from "./post/PostReports";

import {
  getAdminReports,
  suspendAdminUser,
  unsuspendAdminUser,
  updateAdminReportStatus,
} from "@/components/services/adminService";

import { useAuth } from "@/lib/AuthContext";

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
  postType?: string;
  image?: string;
  createdAt?: string;
}

interface ReportQuestion {
  _id: string;
  questiontitle?: string;
  questionbody?: string;
}

interface ReportItem {
  _id: string;
  reason: string;
  details?: string;
  status: ReportStatus;
  createdAt: string;
  reporterId?: ReportUser | null;
  postAuthorId?: ReportUser | null;
  questionAuthorId?: ReportUser | null;
  postId?: ReportPost | null;
  questionId?: ReportQuestion | null;
  violationCount: number;
  isRepeatOffender?: boolean;
}

interface ApiError {
  response?: {
    status?: number;
    data?: {
      message?: string;
    };
  };
  message?: string;
}

interface AdminReportsResponse {
  reports?: ReportItem[];
}

type ReportTab =
  | "posts"
  | "questions";

const AdminReportsPage = () => {
  const router = useRouter();

  const { user } = useAuth();
  const { t } = useTranslation();

  const [
    reports,
    setReports,
  ] = useState<ReportItem[]>([]);

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    updatingId,
    setUpdatingId,
  ] = useState<string | null>(
    null
  );

  const [
    activeReportTab,
    setActiveReportTab,
  ] = useState<ReportTab>(
    "posts"
  );

  // Fetch admin reports
  const fetchReports =
    async (): Promise<void> => {
      try {
        setLoading(true);

        const response:
          AdminReportsResponse =
          await getAdminReports();

        setReports(
          response.reports ?? []
        );
      } catch (error: unknown) {
        const apiError =
          error as ApiError;

        console.error(
          "Failed to fetch reports:",
          error
        );

        if (
          apiError.response
            ?.status === 403
        ) {
          alert(
            t(
              "alert.admin_access_required"
            )
          );

          void router.push("/");
        }
      } finally {
        setLoading(false);
      }
    };

  // Suspend user
  const handleSuspend = async (
    userId: string
  ): Promise<void> => {
    const reason = prompt(
      t(
        "prompt.reason_for_suspension"
      )
    );

    if (!reason) {
      return;
    }

    try {
      await suspendAdminUser(
        userId,
        reason
      );

      alert(
        t(
          "alert.user_suspended_successfully"
        )
      );

      await fetchReports();
    } catch (error: unknown) {
      console.error(
        "Suspend user error:",
        error
      );

      alert(
        t(
          "alert.failed_to_suspend_user"
        )
      );
    }
  };

  // Unsuspend user
  const handleUnsuspend = async (
    userId: string
  ): Promise<void> => {
    try {
      await unsuspendAdminUser(
        userId
      );

      alert(
        t(
          "alert.user_unsuspend_successfully"
        )
      );

      await fetchReports();
    } catch (error: unknown) {
      console.error(
        "Unsuspend user error:",
        error
      );

      alert(
        t(
          "alert.failed_to_unsuspend_user"
        )
      );
    }
  };

  // Update report status
  const handleStatusChange =
    async (
      reportId: string,
      status: ReportStatus
    ): Promise<void> => {
      try {
        setUpdatingId(
          reportId
        );

        setReports(
          (
            previousReports
          ) =>
            previousReports.map(
              (report) =>
                String(
                  report._id
                ) ===
                String(
                  reportId
                )
                  ? {
                      ...report,
                      status,
                    }
                  : report
            )
        );

        await updateAdminReportStatus(
          reportId,
          status
        );
      } catch (error: unknown) {
        const apiError =
          error as ApiError;

        console.error(
          "Failed to update report:",
          error
        );

        alert(
          apiError.response
            ?.data?.message ||
            t(
              "alert.failed_to_update_report"
            )
        );

        await fetchReports();
      } finally {
        setUpdatingId(null);
      }
    };

  useEffect(() => {
    if (!user) {
      return;
    }

    void fetchReports();
  }, [user]);

  if (loading) {
    return (
      <div className="p-8 text-center text-gray-500">
        Loading reports...
      </div>
    );
  }

  const postReports =
    reports.filter(
      (report) =>
        Boolean(report.postId)
    );

  const reportStats = {
    pending:
      postReports.filter(
        (report) =>
          report.status ===
          "pending"
      ).length,

    reviewed:
      postReports.filter(
        (report) =>
          report.status ===
          "reviewed"
      ).length,

    dismissed:
      postReports.filter(
        (report) =>
          report.status ===
          "dismissed"
      ).length,

    actionTaken:
      postReports.filter(
        (report) =>
          report.status ===
          "action_taken"
      ).length,
  };

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="mx-auto max-w-6xl">
        {/* Page header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            {t(
              "admin.reports"
            )}
          </h1>

          <p className="mt-2 text-sm text-gray-600">
            {t(
              "admin.reviewReportsModerateContentManageSuspendedUsers"
            )}
          </p>

          {/* Report tabs */}
          <div className="my-6 flex gap-2">
            <button
              type="button"
              onClick={() =>
                setActiveReportTab(
                  "posts"
                )
              }
              className={`rounded-lg px-4 py-2 font-medium transition ${
                activeReportTab ===
                "posts"
                  ? "bg-blue-600 text-white"
                  : "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
              }`}
            >
              {t(
                "admin.postReports"
              )}
            </button>

            <button
              type="button"
              onClick={() =>
                setActiveReportTab(
                  "questions"
                )
              }
              className={`rounded-lg px-4 py-2 font-medium transition ${
                activeReportTab ===
                "questions"
                  ? "bg-blue-600 text-white"
                  : "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
              }`}
            >
              {t(
                "admin.questionReports"
              )}
            </button>
          </div>

          {/* Question reports */}
          {activeReportTab ===
            "questions" && (
            <QuestionReports
              reports={
                reports
              }
              updatingId={
                updatingId
              }
              onStatusChange={
                handleStatusChange
              }
              handleSuspend={
                handleSuspend
              }
              handleUnsuspend={
                handleUnsuspend
              }
            />
          )}

          {/* Post reports */}
          {activeReportTab ===
            "posts" && (
            <PostReports
              reports={
                reports
              }
              reportStats={
                reportStats
              }
              handleStatusUpdate={
                handleStatusChange
              }
              handleSuspend={
                handleSuspend
              }
              handleUnsuspend={
                handleUnsuspend
              }
            />
          )}
        </div>
      </div>
    </main>
  );
};

export default AdminReportsPage;