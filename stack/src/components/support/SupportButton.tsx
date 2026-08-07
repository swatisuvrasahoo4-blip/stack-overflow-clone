"use client";

import { Headphones } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SupportButtonProps {
  onClick: () => void;
}

const SupportButton = ({ onClick }: SupportButtonProps) => {
  return (
    <Button
      onClick={onClick}
      className="
        fixed bottom-6 right-6 z-50
        h-14 w-14 rounded-full
        bg-orange-500 hover:bg-orange-600
        text-white shadow-lg
        p-0
      "
      aria-label="Help and Support"
    >
      <Headphones className="h-6 w-6" />
    </Button>
  );
};

export default SupportButton;