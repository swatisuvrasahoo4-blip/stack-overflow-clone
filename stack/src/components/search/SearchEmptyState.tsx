import { useTranslation } from "react-i18next";

interface SearchEmptyStateProps {
  type: "posts" | "questions" | "all";
}

const SearchEmptyState = ({
  type,
}: SearchEmptyStateProps) => {
  const { t } = useTranslation();

  const getMessage = (): string => {
    if (type === "posts") {
      return t(
        "search.no_posts_matched_your_search"
      );
    }

    if (type === "questions") {
      return t(
        "search.no_questions_matched_your_search"
      );
    }

    return t(
      "search.no_posts_or_questions_matched_your_search"
    );
  };

  return (
    <p className="py-4 text-sm text-gray-500">
      {getMessage()}
    </p>
  );
};

export default SearchEmptyState;