import { useState } from "react";

import { useRouter } from "next/router";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";

import {
  checkReportStatus,
  createReport,
} from "@/components/services/reportService";

import type { User } from "@/types/community";

interface UsePostReportProps {
  postId: string;
  user: User | null;
}

const usePostReport = ({
  postId,
  user,
}: UsePostReportProps) => {
  const router = useRouter();
  const { t } = useTranslation();

  const [
    showReportModal,
    setShowReportModal,
  ] = useState(false);

  const handleReportClick =
    async (): Promise<void> => {
      if (!user) {
        toast.info(
          t(
            "toast.please_login_to_continue"
          )
        );

        void router.push("/auth");

        return;
      }

      const reputation = Number(
        user.reputation ?? 0
      );

      if (reputation < 500) {
        alert(
          t(
            `alert.you_need_atleast_least_500_reputation_points_to_report_inappropriate_content_your_current_reputation_is,${reputation}`
          )
        );

        return;
      }

      try {
        const response =
          await checkReportStatus(
            postId
          );

        if (
          response.alreadyReported
        ) {
          alert(
            t(
              "alert.you_have_already_reported_this_post"
            )
          );

          return;
        }

        setShowReportModal(true);
      } catch (error: unknown) {
        console.error(
          "Failed to check report status:",
          error
        );

        alert(
          t(
            "alert.failed_to_check_report_status"
          )
        );
      }
    };

  const handleReportSubmit = async (
    reason: string,
    details: string
  ): Promise<void> => {
    try {
      await createReport({
        postId,
        reason,
        details,
      });

      alert(
        t(
          "alert.post_reported_successfully"
        )
      );

      setShowReportModal(false);
    } catch (error: unknown) {
      const message =
        error instanceof Error
          ? error.message
          : t(
              "alert.failed_to_report_post"
            );

      alert(message);
    }
  };

  const handleCloseReport = () => {
    setShowReportModal(false);
  };

  return {
    showReportModal,
    handleReportClick,
    handleReportSubmit,
    handleCloseReport,
  };
};

export default usePostReport;