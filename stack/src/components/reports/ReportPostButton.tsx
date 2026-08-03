import { Flag } from "lucide-react";

interface ReportPostButtonProps {
  onClick: () => void;
}

export default function ReportPostButton({
  onClick,
}: ReportPostButtonProps) {
  return (
    <button
      type="button"
      onClick={(event) => {
        event.preventDefault();
        event.stopPropagation();
        onClick();
      }}
      className="flex items-center gap-2 text-sm text-gray-600 hover:text-red-600 transition"
    >
      <Flag className="h-5 w-5" />
    </button>
  );
}