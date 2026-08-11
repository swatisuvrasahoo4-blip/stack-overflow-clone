import { Flag } from "lucide-react";
import { useState } from "react";
import ReportQuestionModal from "./ReportQuestionModal";
import { createQuestionReport } from "../services/reportService";
import { checkQuestionReportStatus } from "../services/questionService";

interface ReportQuestionButtonProps {
 questionId: string
}

export default function ReportQuestionButton({
  questionId,
}: ReportQuestionButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [alreadyReported, setAlreadyReported] = useState(false);
  return (
  <>
    <button
      type="button"
     onClick={async (event) => {
  event.preventDefault();
  event.stopPropagation();

  try {
    const data = await checkQuestionReportStatus(questionId);

    if (data.alreadyReported) {
      setAlreadyReported(true);
      alert("You have already reported this question.");
      return;
    }

    setAlreadyReported(false);
    setIsOpen(true);
  } catch (error) {
    console.error("Failed to check question report status:", error);
    alert("Failed to check report status.");
  }
}}
      className="flex items-center gap-2 text-sm text-gray-600 hover:text-red-600 transition"
    >
      <Flag className="h-5 w-5" />
      Flag
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

    alert("Question reported successfully.");
    setIsOpen(false);
  } catch (error: any) {
    alert(
      error?.response?.data?.message ||
      "Failed to report question."
    );
  }
}}
/>
  </>
  );
}