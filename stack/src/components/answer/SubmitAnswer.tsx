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
  const { t } = useTranslation();

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900">
        {t("community.yourAnswer")}
      </h3>

      <Textarea
        placeholder={t("community.writeYourAnswer")}
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
            ? t("community.posting")
            : t("community.postYourAnswer")}
        </Button>

        <p className="text-sm text-gray-600">
          {t("community.byPostingAnswer")}{" "}
          <Link
            href="#"
            className="text-blue-600 hover:underline"
          >
            {t("community.privacyPolicy")}
          </Link>{" "}
          {t("community.and")}{" "}
          <Link
            href="#"
            className="text-blue-600 hover:underline"
          >
            {t("community.termsOfService")}
          </Link>
          .
        </p>
      </div>
    </div>
  );
};

export default SubmitAnswer;