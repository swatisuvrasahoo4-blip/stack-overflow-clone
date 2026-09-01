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
  const { t } = useTranslation(["answers", "community"]);

  const [isSharing, setIsSharing] = useState(false);

  const handleShare = async () => {
    if (isSharing) return;

    const shareUrl = `${window.location.origin}/questions/${questionId}#answer-${answerId}`;

    try {
      setIsSharing(true);

      if (navigator.share) {
        await navigator.share({
          title: questionTitle || t("share.title", { ns: "answers" }),
          text: t("share.text", { ns: "answers" }),
          url: shareUrl,
        });
      } else {
        await navigator.clipboard.writeText(shareUrl);

        toast.success(
          t("messages.link_copied", {
            ns: "answers",
          })
        );
      }
    } catch (error: any) {
      if (error?.name !== "AbortError") {
        console.error("Failed to share answer:", error);

        toast.error(
          t("messages.failed_to_share", {
            ns: "answers",
          })
        );
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

      {isSharing
        ? t("share.sharing", { ns: "answers" })
        : t("actions.share", { ns: "community" })}
    </Button>
  );
};

export default AnswerShareButton;