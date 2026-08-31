"use client";

import { Languages } from "lucide-react";

import { Button } from "@/components/ui/button";

interface LanguageButtonProps {
  onClick: () => void;
}

const LanguageButton = ({
  onClick,
}: LanguageButtonProps) => {
  return (
    /* Language switch button */
    <Button
      type="button"
      onClick={onClick}
      className="fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full bg-orange-500 p-0 text-white shadow-lg hover:bg-orange-600"
      aria-label="Change Language"
    >
      <Languages className="h-6 w-6" />
    </Button>
  );
};

export default LanguageButton;