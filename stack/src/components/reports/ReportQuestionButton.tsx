import { useState } from "react";

import axios from "axios";
import { Flag } from "lucide-react";
import { useRouter } from "next/router";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";

import { useAuth } from "@/lib/AuthContext";

import {
  checkQuestionReportStatus,
} from "../services/questionService";

import {
  createQuestionReport,
} from "../services/reportService";

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

  const { t } = useTranslation([
    "reports",
    "community",
  ]);

  const [isOpen, setIsOpen] =
    useState(false);

  const handleReportClick = async (
    event: React.MouseEvent<HTMLButtonElement>
  ): Promise<void> => {
    event.preventDefault();
    event.stopPropagation();

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

    if (reputation < 500) {
      alert(
        t(
          "messages.question_report_reputation_required",
          {
            ns: "reports",
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
            "messages.question_already_reported",
            {
              ns: "reports",
            }
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
          "messages.failed_to_check_report_status",
          {
            ns: "reports",
          }
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
          "messages.question_reported_successfully",
          {
            ns: "reports",
          }
        )
      );

      setIsOpen(false);
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        console.error(
          "Failed to report question:",
          error.response?.data
        );
      }

      alert(
        t(
          "messages.failed_to_report_question",
          {
            ns: "reports",
          }
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

        {t("actions.flag", {
          ns: "community",
        })}
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