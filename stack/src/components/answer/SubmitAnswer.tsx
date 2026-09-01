"use client";

import Link from "next/link";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface SubmitAnswerProps {
  value: string;
  isSubmitting: boolean;
  onChange: (value: string) => void;
  onSubmit: () => void;
}

const SubmitAnswer = ({
  value,
  isSubmitting,
  onChange,
  onSubmit,
}: SubmitAnswerProps) => {
  const { t } = useTranslation("answers");

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900">
        {t("labels.your_answer")}
      </h3>

      <Textarea
        placeholder={t("placeholders.write_answer")}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="min-h-32 mb-4 resize-none"
      />

      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
        <Button
          onClick={onSubmit}
          disabled={!value.trim() || isSubmitting}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          {isSubmitting
            ? t("status.posting")
            : t("actions.post_answer")}
        </Button>

        <p className="text-sm text-gray-600">
          {t("legal.by_posting_answer")}{" "}

          <Link
            href="#"
            className="text-blue-600 hover:underline"
          >
            {t("legal.privacy_policy")}
          </Link>{" "}

          {t("legal.and")}{" "}

          <Link
            href="#"
            className="text-blue-600 hover:underline"
          >
            {t("legal.terms_of_service")}
          </Link>
          .
        </p>
      </div>
    </div>
  );
};

export default SubmitAnswer;