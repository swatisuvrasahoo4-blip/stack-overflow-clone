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
  const { t } = useTranslation();

  return (
    <div className="mb-6">
      <h1 className="text-xl lg:text-2xl font-semibold mb-4 text-gray-900">
        {title}
      </h1>

      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-4">
        <div className="flex items-center gap-1">
          <Clock className="w-4 h-4" />

          <span>
            {t("community.asked")}{" "}
            {askedOn
              ? new Date(askedOn).toLocaleDateString()
              : "Unknown date"}
          </span>
        </div>
      </div>
    </div>
  );
};

export default QuestionHeader;