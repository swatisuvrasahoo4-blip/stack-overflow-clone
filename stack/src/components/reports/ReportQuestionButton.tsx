import { Flag } from "lucide-react";
import { useState } from "react";
import ReportQuestionModal from "./ReportQuestionModal";
import { createQuestionReport } from "../services/reportService";
import { checkQuestionReportStatus } from "../services/questionService";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/router";
import { useAuth } from "@/lib/AuthContext";
import { toast } from "react-toastify";
import axios from "axios";

interface ReportQuestionButtonProps {
 questionId: string;
 reputation: number;
}

export default function ReportQuestionButton({
  questionId,reputation
}: ReportQuestionButtonProps) {
  const router = useRouter();
  const {user} = useAuth();
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [alreadyReported, setAlreadyReported] = useState(false);
  return (
  <>
    <button
      type="button"
     onClick={async (event) => {
  event.preventDefault();
  event.stopPropagation();
  if (!user) {
    toast.info(t("toast.please_login_to_continue"));
    router.push("/auth");
    return;
  }
  if (reputation < 500) {
  alert(
    t(`alert.you_need_at_least_500_reputation_points_to_report_inappropriate_content_your_current_reputation_is, ${reputation}`)
  );
  return;
}

  try {
    const data = await checkQuestionReportStatus(questionId);

    if (data.alreadyReported) {
      setAlreadyReported(true);
      alert(t("alert.you_have_already_reported_this_question"));
      return;
    }

    setAlreadyReported(false);
    setIsOpen(true);
  } catch (error) {
    console.error("Failed to check question report status:", error);
    alert (t("alert.failed_to_check_report_status"));
  }
}}
      className="flex items-center gap-2 text-sm text-gray-600 hover:text-red-600 transition"
    >
      <Flag className="h-5 w-5" />
      {t("community.flag")}
    </button>
    <ReportQuestionModal
  open={isOpen}
  onClose={() => setIsOpen(false)}
  onSubmit={async (reason, details) => {
  try {
    await createQuestionReport({
      questionId,
      reason,
      details,
    });

    alert(t("alert.question_reported_successfully"));
    setIsOpen(false);
  } catch (error: unknown) {
  if (axios.isAxiosError(error)) {
    alert(
      error.response?.data?.message ||
        t("alert.failed_to_report_question")
    );
  } else {
    alert(
      t("alert.failed_to_report_question")
    );
  }
}
}}
/>
  </>
  );
}