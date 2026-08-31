import { Flag } from "lucide-react";

interface ReportPostButtonProps {
  onClick: () => void;
}

const ReportPostButton = ({
  onClick,
}: ReportPostButtonProps) => {
  const handleClick = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
    event.stopPropagation();

    onClick();
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className="flex items-center gap-2 text-sm text-gray-600 transition hover:text-red-600"
      aria-label="Report post"
    >
      {/* Report icon */}

      <Flag className="h-5 w-5" />
    </button>
  );
};

export default ReportPostButton;