"use client";

import { Languages } from "lucide-react";
import { Button } from "@/components/ui/button";

interface LanguageButtonProps {
  onClick: () => void;
}

const LanguageButton = ({ onClick }: LanguageButtonProps) => {
  return (
    <Button
      onClick={onClick}
      className="
        fixed bottom-24 right-6 z-50
        h-14 w-14 rounded-full
        bg-orange-500 hover:bg-orange-600
        text-white shadow-lg
        p-0
      "
      aria-label="Change Language"
    >
      <Languages className="h-6 w-6" />
    </Button>
  );
};

export default LanguageButton;