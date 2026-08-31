import PostFeed from "@/components/feed/PostFeed";
import type { Post } from "@/types/community";
import type { Question } from "@/types/questions";
import QuestionSearchCard from "./QuestionSearchCard";
import SearchEmptyState from "./SearchEmptyState";
import { useTranslation } from "react-i18next";

type SearchType =
  | "All"
  | "Posts"
  | "Questions";

interface SearchResultsProps {
  searchType: SearchType;
  results: Post[];
  questionResults: Question[];
  query: string;
  selectedType:
    | "All"
    | "Technical Update"
    | "Project Showcase"
    | "Learning Achievement"
    | "Code Snippet";
}

const SearchResults = ({
  searchType,
  results,
  questionResults,
  query,
  selectedType,
}: SearchResultsProps) => {
  const { t } = useTranslation();

  if (searchType === "Posts") {
    if (results.length === 0) {
      return (
        <SearchEmptyState type="posts" />
      );
    }

    return (
      <PostFeed
        key={`${query}-${selectedType}`}
        initialPosts={results}
      />
    );
  }

  if (searchType === "Questions") {
    if (questionResults.length === 0) {
      return (
        <SearchEmptyState type="questions" />
      );
    }

    return (
      <div className="space-y-4">
        {questionResults.map((question) => (
          <QuestionSearchCard
            key={question._id}
            question={question}
          />
        ))}
      </div>
    );
  }

  return (
    <>
      {results.length > 0 && (
        <>
          <h2 className="mb-3 text-lg font-semibold">
            {t("search.posts")}
          </h2>

          <PostFeed
            key={`${query}-${selectedType}`}
            initialPosts={results}
          />
        </>
      )}

      {questionResults.length > 0 && (
        <div className="mt-8">
          <h2 className="mb-3 text-lg font-semibold">
            {t("search.questions")}
          </h2>

          <div className="space-y-4">
            {questionResults.map(
              (question) => (
                <QuestionSearchCard
                  key={question._id}
                  question={question}
                />
              )
            )}
          </div>
        </div>
      )}

      {results.length === 0 &&
        questionResults.length === 0 && (
          <SearchEmptyState type="all" />
        )}
    </>
  );
};

export default SearchResults;