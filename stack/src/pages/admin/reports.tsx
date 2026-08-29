import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import QuestionReports from "./reports/QuestionReports";
import PostReports from "./reports/PostReports";
import {
  getAdminReports,
  updateAdminReportStatus,
  suspendAdminUser,
  unsuspendAdminUser,
} from "@/components/services/adminService";
import { useAuth } from "@/lib/AuthContext";
import Link from "next/link";
import { useTranslation } from "react-i18next";

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

interface ReportItem {
  _id: string;
  reason: string;
  details?: string;
  status: "pending" | "reviewed" | "dismissed" | "action_taken";
  createdAt: string;
  reporterId?: ReportUser;
  postAuthorId?: ReportUser;
  postId?: ReportPost | null;
}

export default function AdminReportsPage() {
  const router = useRouter();
  const { user } = useAuth();
  const {t} = useTranslation();
  const [reports, setReports] = useState<ReportItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [activeReportTab, setActiveReportTab] = useState<"posts" | "questions">(
  "posts"
);

  const fetchReports = async () => {
    try {
      setLoading(true);

      const response = await getAdminReports();
      setReports(response.reports || []);
    } catch (error: any) {
      console.error("Failed to fetch reports:", error);

      if (error?.response?.status === 403) {
        alert(t("alert.admin_access_required"));
        router.push("/");
      }
    } finally {
      setLoading(false);
    }
  };
  const handleSuspend = async (userId: string) => {
  const reason = prompt(t("prompt.reason_for_suspension"));

  if (!reason) return;

  try {
    await suspendAdminUser(userId, reason);

    alert(t("alert.user_suspended_successfully"));

    fetchReports();
  } catch (error) {
    console.error(error);
    alert(t("alert.failed_to_suspend_user"));
  }
};

const handleUnsuspend = async (userId: string) => {
  try {
    await unsuspendAdminUser(userId);

    alert(t("alert.user_unsuspend_successfully"));

    fetchReports();
  } catch (error) {
    console.error(error);
    alert(t("alert.failed_to_unsuspend_user"));
  }
};

  useEffect(() => {
    if (!user) return;

    fetchReports();
  }, [user]);

  const handleStatusChange = async (
    reportId: string,
    status: ReportItem["status"]
  ) => {
    try {
      setUpdatingId(reportId);

      setReports((previousReports) => {
  const updatedReports = previousReports.map((report) => {
    if (String(report._id) === String(reportId)) {
      return {
        ...report,
        status,
      };
    }

    return report;
  });

  return updatedReports;
});

      const response = await updateAdminReportStatus(
        reportId,
        status
      );

      
    } catch (error: any) {
      alert(
        error?.response?.data?.message ||
          t("alert.failed_to_update_report")
      );
    } finally {
      setUpdatingId(null);
    }
  };

  if (loading) {
    return (
      <div className="p-8 text-center text-gray-500">
        Loading reports...
      </div>
    );
  }

  const postReports = reports.filter(
  (report) => report.postId
);

const reportStats = {
  pending: postReports.filter(
    (report) => report.status === "pending"
  ).length,

  reviewed: postReports.filter(
    (report) => report.status === "reviewed"
  ).length,

  dismissed: postReports.filter(
    (report) => report.status === "dismissed"
  ).length,

  actionTaken: postReports.filter(
    (report) => report.status === "action_taken"
  ).length,
};
return (
  <main className="min-h-screen bg-gray-50 px-4 py-8">
    <div className="mx-auto max-w-6xl">
      <div className="mb-8">
  <h1 className="text-3xl font-bold text-gray-900">
    {t("admin.reports")}
  </h1>

  <p className="mt-2 text-sm text-gray-600">
    {t("admin.reviewReportsModerateContentManageSuspendedUsers")}
  </p>
<div className="flex gap-2 my-6">
  <button
    onClick={() => setActiveReportTab("posts")}
    className={`px-4 py-2 rounded-lg font-medium transition ${
      activeReportTab === "posts"
        ? "bg-blue-600 text-white"
        : "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
    }`}
  >
    {t("admin.postReports")}
  </button>

  <button
    onClick={() => setActiveReportTab("questions")}
    className={`px-4 py-2 rounded-lg font-medium transition ${
      activeReportTab === "questions"
        ? "bg-blue-600 text-white"
        : "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
    }`}
  >
    {t("admin.questionReports")}
  </button>
</div>
{activeReportTab === "questions" && <QuestionReports reports={reports} updatingId={updatingId} onStatusChange={handleStatusChange} handleSuspend={handleSuspend} handleUnsuspend={handleUnsuspend} />}
{activeReportTab === "posts" && (
  <PostReports
    reports={reports}
    reportStats={reportStats}
    handleStatusUpdate={handleStatusChange}
    handleSuspend={handleSuspend}
    handleUnsuspend={handleUnsuspend}
  />
)}

 
    </div>
    </div>
  </main>
);
}