type QuestionFiltersProps = {
  children: React.ReactNode;
};

export default function QuestionFilters({
  children,
}: QuestionFiltersProps) {
  return (
    <div className="flex flex-wrap gap-1 sm:gap-2">
      {children}
    </div>
  );
}