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

  const { t } = useTranslation([
    "community",
    "reports",
  ]);

  const [
    showReportModal,
    setShowReportModal,
  ] = useState(false);

  const handleReportClick =
    async (): Promise<void> => {
      if (!user) {
        toast.info(
          t(
            "messages.please_login_to_continue",
            {
              ns: "community",
            }
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
            "messages.post_report_reputation_required",
            {
              ns: "reports",
              reputation,
            }
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
              "messages.post_already_reported",
              {
                ns: "reports",
              }
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
            "messages.failed_to_check_report_status",
            {
              ns: "reports",
            }
          )
        );
      }
    };

  const handleReportSubmit =
    async (
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
            "messages.post_reported_successfully",
            {
              ns: "reports",
            }
          )
        );

        setShowReportModal(false);
      } catch (error: unknown) {
        console.error(
          "Failed to report post:",
          error
        );

        alert(
          t(
            "messages.failed_to_report_post",
            {
              ns: "reports",
            }
          )
        );
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