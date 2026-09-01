"use client";

import { Languages } from "lucide-react";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/ui/button";

interface LanguageButtonProps {
  onClick: () => void;
}

const LanguageButton = ({
  onClick,
}: LanguageButtonProps) => {
  const { t } =
    useTranslation("language");

  return (
    <Button
      type="button"
      onClick={onClick}
      className="fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full bg-orange-500 p-0 text-white shadow-lg hover:bg-orange-600"
      aria-label={t(
        "accessibility.change_language"
      )}
    >
      <Languages className="h-6 w-6" />
    </Button>
  );
};

export default LanguageButton;