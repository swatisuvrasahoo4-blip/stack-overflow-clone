import type { ReactNode } from "react";

interface QuestionFiltersProps {
  children: ReactNode;
}

const QuestionFilters = ({
  children,
}: QuestionFiltersProps) => {
  return (
    <div className="flex flex-wrap gap-1 sm:gap-2">
      {children}
    </div>
  );
};

export default QuestionFilters;