import { useState } from "react";

import axios from "axios";
import { Flag } from "lucide-react";
import { useRouter } from "next/router";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";

import { useAuth } from "@/lib/AuthContext";

import { checkQuestionReportStatus } from "../services/questionService";
import { createQuestionReport } from "../services/reportService";
import ReportQuestionModal from "./ReportQuestionModal";

interface ReportQuestionButtonProps {
  questionId: string;
  reputation: number;
}

const ReportQuestionButton = ({
  questionId,
  reputation,
}: ReportQuestionButtonProps) => {
  const router = useRouter();
  const { user } = useAuth();
  const { t } = useTranslation();

  const [isOpen, setIsOpen] = useState(false);

  const handleReportClick = async (
    event: React.MouseEvent<HTMLButtonElement>
  ): Promise<void> => {
    event.preventDefault();
    event.stopPropagation();

    if (!user) {
      toast.info(
        t("toast.please_login_to_continue")
      );

      void router.push("/auth");

      return;
    }

    if (reputation < 500) {
      alert(
        t(
          "alert.you_need_at_least_500_reputation_points_to_report_inappropriate_content_your_current_reputation_is",
          {
            reputation,
          }
        )
      );

      return;
    }

    try {
      const data =
        await checkQuestionReportStatus(
          questionId
        );

      if (data.alreadyReported) {
        alert(
          t(
            "alert.you_have_already_reported_this_question"
          )
        );

        return;
      }

      setIsOpen(true);
    } catch (error: unknown) {
      console.error(
        "Failed to check question report status:",
        error
      );

      alert(
        t(
          "alert.failed_to_check_report_status"
        )
      );
    }
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleSubmit = async (
    reason: string,
    details: string
  ): Promise<void> => {
    try {
      await createQuestionReport({
        questionId,
        reason,
        details,
      });

      alert(
        t(
          "alert.question_reported_successfully"
        )
      );

      setIsOpen(false);
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        alert(
          error.response?.data?.message ||
            t(
              "alert.failed_to_report_question"
            )
        );

        return;
      }

      alert(
        t(
          "alert.failed_to_report_question"
        )
      );
    }
  };

  return (
    <>
      {/* Report question button */}

      <button
        type="button"
        onClick={(event) =>
          void handleReportClick(event)
        }
        className="flex items-center gap-2 text-sm text-gray-600 transition hover:text-red-600"
      >
        <Flag className="h-5 w-5" />

        {t("community.flag")}
      </button>

      {/* Report question modal */}

      <ReportQuestionModal
        open={isOpen}
        onClose={handleClose}
        onSubmit={handleSubmit}
      />
    </>
  );
};

export default ReportQuestionButton;