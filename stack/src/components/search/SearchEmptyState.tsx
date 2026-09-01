import { useTranslation } from "react-i18next";

interface SearchEmptyStateProps {
  type: "posts" | "questions" | "all";
}

const SearchEmptyState = ({
  type,
}: SearchEmptyStateProps) => {
  const { t } = useTranslation("search");

  const getMessage = (): string => {
    if (type === "posts") {
      return t(
        "messages.no_posts_matched"
      );
    }

    if (type === "questions") {
      return t(
        "messages.no_questions_matched"
      );
    }

    return t(
      "messages.no_posts_or_questions_matched"
    );
  };

  return (
    <p className="py-4 text-sm text-gray-500">
      {getMessage()}
    </p>
  );
};

export default SearchEmptyState;