"use client";

import { Headphones } from "lucide-react";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/ui/button";

interface SupportButtonProps {
  onClick: () => void;
}

const SupportButton = ({
  onClick,
}: SupportButtonProps) => {
  const { t } =
    useTranslation("support");

  return (
    <Button
      type="button"
      onClick={onClick}
      className="fixed bottom-24 right-6 z-50 h-14 w-14 rounded-full bg-orange-500 p-0 text-white shadow-lg hover:bg-orange-600"
      aria-label={t(
        "accessibility.help_and_support"
      )}
    >
      <Headphones className="h-6 w-6" />
    </Button>
  );
};

export default SupportButton;