import Mainlayout from "@/layout/Mainlayout";
import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";
import { searchPosts } from "@/components/services/communityService";
import { searchQuestions } from "@/components/services/questionService";
import { getSubscription } from "@/components/services/subscriptionService";
import PostFeed from "@/components/feed/PostFeed";
import { useTranslation } from "react-i18next";

export default function SearchPage() {
  const router = useRouter();
  const {t} = useTranslation();
  const { q } = router.query;
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPlan, setCurrentPlan] = useState("Free");
  const [selectedType, setSelectedType] = useState("All");
  const [searchType, setSearchType] = useState<
  "All" | "Posts" | "Questions"
>("All");

const [questionResults, setQuestionResults] = useState<any[]>([]);
const hasAdvancedSearch = ["Bronze", "Silver", "Gold"].includes(currentPlan);

  const query = useMemo(() => {
     
    if (!q) return "";
    return Array.isArray(q) ? q[0] : String(q);
  }, [q]);

useEffect(() => {
  const loadSubscription = async () => {
    try {
      const response = await getSubscription();
      setCurrentPlan(response.data.plan || "Free");
    } catch (error) {
      console.log(error);
      setCurrentPlan("Free");
    }
  };

  loadSubscription();
}, []);

  useEffect(() => {
  const loadResults = async () => {
    if (!query) {
      setResults([]);
      setQuestionResults([]);
      setLoading(false);
      return;
    }

    setLoading(true);

    try {
      const normalizedQuery = query.trim().toLowerCase();

      // Search Posts
      if (searchType === "Posts" || searchType === "All") {
        const response = await searchPosts(
  query,
  hasAdvancedSearch ? selectedType : "All"
);

setResults(response?.data || []);
      } else {
        setResults([]);
      }

      // Search Questions
      if (searchType === "Questions" || searchType === "All") {
        const response = await searchQuestions(query);

        const questions = response?.data || [];

        setQuestionResults(
          Array.isArray(questions) ? questions : []
        );
      } else {
        setQuestionResults([]);
      }
    } catch (error) {
      console.error("Search error:", error);
      setResults([]);
      setQuestionResults([]);
    } finally {
      setLoading(false);
    }
  };

  loadResults();
}, [
  query,
  searchType,
  selectedType,
  hasAdvancedSearch,
]);

  return (
    <Mainlayout>
      <main className="min-w-0 p-4 lg:p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold">{t("search.search_results")}</h1>
          <p className="mt-2 text-gray-600">{t("search.results_for")} “{query}”.</p>
          <div className="flex gap-2 mt-4">
  {(["All", "Posts", "Questions"] as const).map((type) => (
    <button
      key={type}
      onClick={() => {
        setSearchType(type);

        if (type === "Questions") {
          setSelectedType("All");
        }
      }}
      className={`px-4 py-2 rounded-md text-sm font-medium transition ${
        searchType === type
          ? "bg-blue-600 text-white"
          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
      }`}
    >
      {t(`search.${type.toLowerCase()}`)}
    </button>
  ))}
</div>
        </div>

{hasAdvancedSearch && searchType !== "Questions" && (
  <div className="mb-6">
    <label className="block text-sm font-medium text-gray-700 mb-2">
      {t("search.filter_by_post_type")}
    </label>

    <select
      value={selectedType}
      onChange={(e) => setSelectedType(e.target.value)}
      className="border border-gray-300 rounded-md px-3 py-2 bg-white"
    >
      <option value="All">{t("search.all_types")}</option>
      <option value="Technical Update">{t("search.technical_update")}</option>
      <option value="Project Showcase">{t("search.project_showcase")}</option>
      <option value="Learning Achievement">{t("search.learning_achievement")}</option>
      <option value="Code Snippet">{t("search.code_snippet")}</option>
    </select>
  </div>
)}

        {loading ? (
  <p className="text-gray-500">{t("search.searching")}</p>
) : searchType === "Posts" ? (
  results.length === 0 ? (
    <p className="text-gray-500">
      {t("search.no_posts_matched_your_search")}
    </p>
  ) : (
    <PostFeed
      key={`${query}-${selectedType}`}
      initialPosts={results}
    />
  )
) : searchType === "Questions" ? (
  questionResults.length === 0 ? (
    <p className="text-gray-500">
      {t("search.no_questions_matched_your_search")}
    </p>
  ) : (
    <div className="space-y-4">
      {questionResults.map((question: any) => (
        <div
          key={question._id}
          onClick={() => {
            router.push(`/questions/${question._id}`);
          }}
          className="border rounded-lg bg-white p-4 shadow-sm cursor-pointer hover:shadow-md transition-shadow"
        >
          <div className="flex flex-col sm:flex-row sm:justify-between gap-3">
            <h2 className="text-blue-600 hover:underline font-medium">
              {question.questiontitle || t("search.no_title")}
            </h2>

            <div className="text-sm text-gray-600">
              {question.noofanswer || 0} {t("search.answers")} ·{" "}
              {question.views || 0} {t("search.views")}
            </div>
          </div>

          <p className="text-gray-700 mt-2 line-clamp-2">
            {question.questionbody || ""}
          </p>

          <div className="mt-3 flex flex-wrap gap-2">
            {(question.questiontags || []).map(
              (tag: string) => (
                <span
                  key={tag}
                  className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm"
                >
                  {tag}
                </span>
              )
            )}
          </div>
        </div>
      ))}
    </div>
  )
) : (
  <>
    {results.length > 0 && (
      <>
        <h2 className="text-lg font-semibold mb-3">
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
        <h2 className="text-lg font-semibold mb-3">
          {t("search.questions")}
        </h2>

        <div className="space-y-4">
          {questionResults.map((question: any) => (
            <div
              key={question._id}
              onClick={() =>
                router.push(`/questions/${question._id}`)
              }
              className="border rounded-lg bg-white p-4 shadow-sm cursor-pointer hover:shadow-md transition-shadow"
            >
              <h2 className="text-blue-600 font-medium">
                {question.questiontitle || t("search.no_title")}
              </h2>

              <p className="text-gray-700 mt-2 line-clamp-2">
                {question.questionbody || ""}
              </p>

              <div className="mt-3 flex flex-wrap gap-2">
                {(question.questiontags || []).map(
                  (tag: string) => (
                    <span
                      key={tag}
                      className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm"
                    >
                      {tag}
                    </span>
                  )
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    )}

    {results.length === 0 &&
      questionResults.length === 0 && (
        <p className="text-gray-500">
          {t("search.no_posts_or_questions_matched_your_search")}
        </p>
      )}
  </>
)}
      </main>
    </Mainlayout>
  );
}
