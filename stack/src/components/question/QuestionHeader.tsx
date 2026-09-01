"use client";

import { Clock } from "lucide-react";
import { useTranslation } from "react-i18next";

interface QuestionHeaderProps {
  title: string;
  askedOn?: string;
}

const QuestionHeader = ({
  title,
  askedOn,
}: QuestionHeaderProps) => {
  const { t } =
    useTranslation("questions");

  return (
    <div className="mb-6">
      <h1 className="mb-4 text-xl font-semibold text-gray-900 lg:text-2xl">
        {title}
      </h1>

      <div className="mb-4 flex flex-wrap items-center gap-4 text-sm text-gray-600">
        <div className="flex items-center gap-1">
          <Clock className="h-4 w-4" />

          <span>
            {t("labels.asked")}{" "}
            {askedOn
              ? new Date(
                  askedOn
                ).toLocaleDateString()
              : t(
                  "messages.unknown_date"
                )}
          </span>
        </div>
      </div>
    </div>
  );
};

export default QuestionHeader;