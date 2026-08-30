import React, { useState } from "react";
import { Share } from "lucide-react";
import { Button } from "../ui/button";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";

interface AnswerShareButtonProps {
  questionId: string;
  answerId: string;
  questionTitle?: string;
}

const AnswerShareButton = ({
  questionId,
  answerId,
  questionTitle,
}: AnswerShareButtonProps) => {
  const { t } = useTranslation();
  const [isSharing, setIsSharing] = useState(false);

  const handleShare = async () => {
    if (isSharing) return;

    const shareUrl = `${window.location.origin}/questions/${questionId}#answer-${answerId}`;

    try {
      setIsSharing(true);

      if (navigator.share) {
        await navigator.share({
          title: questionTitle || "Answer",
          text: "Check out this answer on CodeQuest",
          url: shareUrl,
        });
      } else {
        await navigator.clipboard.writeText(shareUrl);
        toast.success(t("toast.answer_link_copied"));
      }
    } catch (error: any) {
      // User closing the share dialog is not an actual error
      if (error?.name !== "AbortError") {
        console.error("Failed to share answer:", error);
        toast.error(t("toast.failed_to_share_answer"));
      }
    } finally {
      setIsSharing(false);
    }
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={(e) => {
        e.stopPropagation();
        handleShare();
      }}
      disabled={isSharing}
      className="text-gray-600 hover:text-gray-800"
    >
      <Share className="w-4 h-4 mr-1" />
      {isSharing ? "Sharing..." : t("community.share")}
    </Button>
  );
};

export default AnswerShareButton;