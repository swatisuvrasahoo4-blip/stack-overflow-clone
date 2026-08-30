import Mainlayout from "@/layout/Mainlayout";
import { useRouter } from "next/router";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  searchPosts,
} from "@/components/services/communityService";

import {
  searchQuestions,
} from "@/components/services/questionService";

import {
  getSubscription,
} from "@/components/services/subscriptionService";

import PostFeed from "@/components/feed/PostFeed";
import { useTranslation } from "react-i18next";

import type { Post } from "@/types/community";
import type { Question } from "@/types/questions";

/* =========================================
   TYPES
========================================= */

type SearchType =
  | "All"
  | "Posts"
  | "Questions";

type SubscriptionPlan =
  | "Free"
  | "Bronze"
  | "Silver"
  | "Gold";

type PostType =
  | "All"
  | "Technical Update"
  | "Project Showcase"
  | "Learning Achievement"
  | "Code Snippet";

interface PaginationResponse {
  nextCursor?: string | null;
  hasMore?: boolean;
}

interface PostSearchResponse {
  data?: Post[];
  pagination?: PaginationResponse;
}

interface QuestionSearchResponse {
  data?: Question[];
  pagination?: PaginationResponse;
}

interface SubscriptionResponse {
  data?: {
    plan?: SubscriptionPlan;
  };
}

const PAGE_LIMIT = 10;

/* =========================================
   COMPONENT
========================================= */

export default function SearchPage() {
  const router = useRouter();
  const { t } = useTranslation();

  const { q } = router.query;

  /* =========================================
     STATE
  ========================================= */

  const [results, setResults] =
    useState<Post[]>([]);

  const [
    questionResults,
    setQuestionResults,
  ] = useState<Question[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [
    loadingMore,
    setLoadingMore,
  ] = useState(false);

  const [
    currentPlan,
    setCurrentPlan,
  ] =
    useState<SubscriptionPlan>(
      "Free"
    );

  const [
    selectedType,
    setSelectedType,
  ] =
    useState<PostType>(
      "All"
    );

  const [
    searchType,
    setSearchType,
  ] =
    useState<SearchType>(
      "All"
    );

  /* =========================================
     POST PAGINATION
  ========================================= */

  const [
    postCursor,
    setPostCursor,
  ] =
    useState<string | null>(
      null
    );

  const [
    hasMorePosts,
    setHasMorePosts,
  ] =
    useState(true);

  /* =========================================
     QUESTION PAGINATION
  ========================================= */

  const [
    questionCursor,
    setQuestionCursor,
  ] =
    useState<string | null>(
      null
    );

  const [
    hasMoreQuestions,
    setHasMoreQuestions,
  ] =
    useState(true);

  const loadMoreRef =
    useRef<HTMLDivElement | null>(
      null
    );

  /* =========================================
     ADVANCED SEARCH
  ========================================= */

  const hasAdvancedSearch =
    [
      "Bronze",
      "Silver",
      "Gold",
    ].includes(currentPlan);

  /* =========================================
     QUERY
  ========================================= */

  const query = useMemo(
    () => {
      if (!q) {
        return "";
      }

      return Array.isArray(q)
        ? q[0] ?? ""
        : String(q);
    },
    [q]
  );

  /* =========================================
     SUBSCRIPTION
  ========================================= */

  useEffect(() => {
    const loadSubscription =
      async () => {
        try {
          const response =
            (await getSubscription()) as SubscriptionResponse;

          setCurrentPlan(
            response.data?.plan ??
              "Free"
          );
        } catch (
          error: unknown
        ) {
          console.error(
            "Failed to load subscription:",
            error
          );

          setCurrentPlan(
            "Free"
          );
        }
      };

    void loadSubscription();
  }, []);

  /* =========================================
     FETCH POSTS PAGE
  ========================================= */

  const fetchPostsPage =
    useCallback(
      async (
        cursor:
          | string
          | null
      ) => {
        const response =
          (await searchPosts(
            query,
            hasAdvancedSearch
              ? selectedType
              : "All",
            cursor,
            PAGE_LIMIT
          )) as PostSearchResponse;

        return {
          items:
            response.data ??
            [],

          nextCursor:
            response.pagination
              ?.nextCursor ??
            null,

          hasMore:
            response.pagination
              ?.hasMore ??
            false,
        };
      },
      [
        query,
        hasAdvancedSearch,
        selectedType,
      ]
    );

  /* =========================================
     FETCH QUESTIONS PAGE
  ========================================= */

  const fetchQuestionsPage =
    useCallback(
      async (
        cursor:
          | string
          | null
      ) => {
        const response =
          (await searchQuestions(
            query,
            cursor,
            PAGE_LIMIT
          )) as QuestionSearchResponse;

        return {
          items:
            response.data ??
            [],

          nextCursor:
            response.pagination
              ?.nextCursor ??
            null,

          hasMore:
            response.pagination
              ?.hasMore ??
            false,
        };
      },
      [query]
    );

  /* =========================================
     INITIAL SEARCH
  ========================================= */

  useEffect(() => {
    if (!router.isReady) {
      return;
    }

    let cancelled = false;

    const loadResults =
      async () => {
        if (!query.trim()) {
          setResults([]);
          setQuestionResults([]);

          setPostCursor(null);
          setQuestionCursor(
            null
          );

          setHasMorePosts(
            false
          );

          setHasMoreQuestions(
            false
          );

          setLoading(false);

          return;
        }

        setLoading(true);

        setResults([]);
        setQuestionResults([]);

        setPostCursor(null);
        setQuestionCursor(
          null
        );

        setHasMorePosts(
          true
        );

        setHasMoreQuestions(
          true
        );

        try {
          /* =====================
             POSTS
          ===================== */

          if (
            searchType ===
              "Posts" ||
            searchType ===
              "All"
          ) {
            const postPage =
              await fetchPostsPage(
                null
              );

            if (cancelled) {
              return;
            }

            setResults(
              postPage.items
            );

            setPostCursor(
              postPage.nextCursor
            );

            setHasMorePosts(
              postPage.hasMore
            );
          } else {
            setResults([]);

            setHasMorePosts(
              false
            );
          }

          /* =====================
             QUESTIONS
          ===================== */

          if (
            searchType ===
              "Questions" ||
            searchType ===
              "All"
          ) {
            const questionPage =
              await fetchQuestionsPage(
                null
              );

            if (cancelled) {
              return;
            }

            setQuestionResults(
              questionPage.items
            );

            setQuestionCursor(
              questionPage.nextCursor
            );

            setHasMoreQuestions(
              questionPage.hasMore
            );
          } else {
            setQuestionResults(
              []
            );

            setHasMoreQuestions(
              false
            );
          }
        } catch (
          error: unknown
        ) {
          console.error(
            "Search error:",
            error
          );

          if (
            !cancelled
          ) {
            setResults([]);
            setQuestionResults(
              []
            );

            setHasMorePosts(
              false
            );

            setHasMoreQuestions(
              false
            );
          }
        } finally {
          if (
            !cancelled
          ) {
            setLoading(
              false
            );
          }
        }
      };

    void loadResults();

    return () => {
      cancelled = true;
    };
  }, [
    router.isReady,
    query,
    searchType,
    selectedType,
    hasAdvancedSearch,
    fetchPostsPage,
    fetchQuestionsPage,
  ]);

  /* =========================================
     LOAD MORE
  ========================================= */

  const loadMore =
    useCallback(
      async () => {
        if (
          loading ||
          loadingMore
        ) {
          return;
        }

        const shouldLoadPosts =
          (searchType ===
            "Posts" ||
            searchType ===
              "All") &&
          hasMorePosts;

        const shouldLoadQuestions =
          (searchType ===
            "Questions" ||
            searchType ===
              "All") &&
          hasMoreQuestions;

        if (
          !shouldLoadPosts &&
          !shouldLoadQuestions
        ) {
          return;
        }

        setLoadingMore(
          true
        );

        try {
          /* =====================
             LOAD MORE POSTS
          ===================== */

          if (
            shouldLoadPosts
          ) {
            const postPage =
              await fetchPostsPage(
                postCursor
              );

            setResults(
              (
                previous
              ) => {
                const existingIds =
                  new Set(
                    previous.map(
                      (
                        post
                      ) =>
                        String(
                          post._id
                        )
                    )
                  );

                const uniquePosts =
                  postPage.items.filter(
                    (
                      post
                    ) =>
                      !existingIds.has(
                        String(
                          post._id
                        )
                      )
                  );

                return [
                  ...previous,
                  ...uniquePosts,
                ];
              }
            );

            setPostCursor(
              postPage.nextCursor
            );

            setHasMorePosts(
              postPage.hasMore
            );
          }

          /* =====================
             LOAD MORE QUESTIONS
          ===================== */

          if (
            shouldLoadQuestions
          ) {
            const questionPage =
              await fetchQuestionsPage(
                questionCursor
              );

            setQuestionResults(
              (
                previous
              ) => {
                const existingIds =
                  new Set(
                    previous.map(
                      (
                        question
                      ) =>
                        String(
                          question._id
                        )
                    )
                  );

                const uniqueQuestions =
                  questionPage.items.filter(
                    (
                      question
                    ) =>
                      !existingIds.has(
                        String(
                          question._id
                        )
                      )
                  );

                return [
                  ...previous,
                  ...uniqueQuestions,
                ];
              }
            );

            setQuestionCursor(
              questionPage.nextCursor
            );

            setHasMoreQuestions(
              questionPage.hasMore
            );
          }
        } catch (
          error: unknown
        ) {
          console.error(
            "Failed to load more search results:",
            error
          );
        } finally {
          setLoadingMore(
            false
          );
        }
      },
      [
        loading,
        loadingMore,
        searchType,
        hasMorePosts,
        hasMoreQuestions,
        postCursor,
        questionCursor,
        fetchPostsPage,
        fetchQuestionsPage,
      ]
    );

  /* =========================================
     INTERSECTION OBSERVER
  ========================================= */

  useEffect(() => {
    const element =
      loadMoreRef.current;

    if (!element) {
      return;
    }

    const observer =
      new IntersectionObserver(
        (entries) => {
          const entry =
            entries[0];

          if (
            entry
              ?.isIntersecting
          ) {
            void loadMore();
          }
        },
        {
          rootMargin:
            "300px",
        }
      );

    observer.observe(
      element
    );

    return () => {
      observer.disconnect();
    };
  }, [loadMore]);

  /* =========================================
     HAS MORE
  ========================================= */

  const hasMore =
    searchType === "Posts"
      ? hasMorePosts
      : searchType ===
        "Questions"
      ? hasMoreQuestions
      : hasMorePosts ||
        hasMoreQuestions;

  /* =========================================
     QUESTION CARD
  ========================================= */

  const renderQuestion = (
    question: Question
  ) => (
    <div
      key={question._id}
      onClick={() => {
        void router.push(
          `/questions/${question._id}`
        );
      }}
      className="cursor-pointer rounded-lg border bg-white p-4 shadow-sm transition-shadow hover:shadow-md"
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:justify-between">
        <h2 className="font-medium text-blue-600 hover:underline">
          {question.questiontitle ||
            t(
              "search.no_title"
            )}
        </h2>

        <div className="text-sm text-gray-600">
          {question.noofanswer ??
            question.answer
              ?.length ??
            0}{" "}
          {t(
            "search.answers"
          )}{" "}
          ·{" "}
          {question.views ??
            0}{" "}
          {t(
            "search.views"
          )}
        </div>
      </div>

      <p className="mt-2 line-clamp-2 text-gray-700">
        {question.questionbody ??
          ""}
      </p>

      <div className="mt-3 flex flex-wrap gap-2">
        {(question.questiontags ??
          []).map(
          (
            tag
          ) => (
            <span
              key={tag}
              className="rounded bg-blue-100 px-2 py-1 text-sm text-blue-800"
            >
              {tag}
            </span>
          )
        )}
      </div>
    </div>
  );

  /* =========================================
     UI
  ========================================= */

  return (
    <Mainlayout>
      <main className="min-w-0 p-4 lg:p-6">
        {/* HEADER */}

        <div className="mb-6">
          <h1 className="text-2xl font-semibold">
            {t(
              "search.search_results"
            )}
          </h1>

          <p className="mt-2 text-gray-600">
            {t(
              "search.results_for"
            )}{" "}
            “{query}”.
          </p>

          {/* SEARCH TYPE */}

          <div className="mt-4 flex gap-2">
            {(
              [
                "All",
                "Posts",
                "Questions",
              ] as const
            ).map(
              (
                type
              ) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => {
                    setSearchType(
                      type
                    );

                    if (
                      type ===
                      "Questions"
                    ) {
                      setSelectedType(
                        "All"
                      );
                    }
                  }}
                  className={`rounded-md px-4 py-2 text-sm font-medium transition ${
                    searchType ===
                    type
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {t(
                    `search.${type.toLowerCase()}`
                  )}
                </button>
              )
            )}
          </div>
        </div>

        {/* POST TYPE FILTER */}

        {hasAdvancedSearch &&
          searchType !==
            "Questions" && (
            <div className="mb-6">
              <label className="mb-2 block text-sm font-medium text-gray-700">
                {t(
                  "search.filter_by_post_type"
                )}
              </label>

              <select
                value={
                  selectedType
                }
                onChange={(
                  event
                ) =>
                  setSelectedType(
                    event
                      .target
                      .value as PostType
                  )
                }
                className="rounded-md border border-gray-300 bg-white px-3 py-2"
              >
                <option value="All">
                  {t(
                    "search.all_types"
                  )}
                </option>

                <option value="Technical Update">
                  {t(
                    "search.technical_update"
                  )}
                </option>

                <option value="Project Showcase">
                  {t(
                    "search.project_showcase"
                  )}
                </option>

                <option value="Learning Achievement">
                  {t(
                    "search.learning_achievement"
                  )}
                </option>

                <option value="Code Snippet">
                  {t(
                    "search.code_snippet"
                  )}
                </option>
              </select>
            </div>
          )}

        {/* LOADING */}

        {loading ? (
          <p className="text-gray-500">
            {t(
              "search.searching"
            )}
          </p>
        ) : searchType ===
          "Posts" ? (
          /* =========================
             POSTS ONLY
          ========================= */

          results.length ===
          0 ? (
            <p className="text-gray-500">
              {t(
                "search.no_posts_matched_your_search"
              )}
            </p>
          ) : (
            <PostFeed
              key={`${query}-${selectedType}`}
              initialPosts={
                results
              }
            />
          )
        ) : searchType ===
          "Questions" ? (
          /* =========================
             QUESTIONS ONLY
          ========================= */

          questionResults.length ===
          0 ? (
            <p className="text-gray-500">
              {t(
                "search.no_questions_matched_your_search"
              )}
            </p>
          ) : (
            <div className="space-y-4">
              {questionResults.map(
                renderQuestion
              )}
            </div>
          )
        ) : (
          /* =========================
             ALL
          ========================= */

          <>
            {results.length >
              0 && (
              <>
                <h2 className="mb-3 text-lg font-semibold">
                  {t(
                    "search.posts"
                  )}
                </h2>

                <PostFeed
                  key={`${query}-${selectedType}`}
                  initialPosts={
                    results
                  }
                />
              </>
            )}

            {questionResults.length >
              0 && (
              <div className="mt-8">
                <h2 className="mb-3 text-lg font-semibold">
                  {t(
                    "search.questions"
                  )}
                </h2>

                <div className="space-y-4">
                  {questionResults.map(
                    renderQuestion
                  )}
                </div>
              </div>
            )}

            {results.length ===
              0 &&
              questionResults.length ===
                0 && (
                <p className="text-gray-500">
                  {t(
                    "search.no_posts_or_questions_matched_your_search"
                  )}
                </p>
              )}
          </>
        )}

        {/* =================================
            INFINITE SCROLL TRIGGER
        ================================= */}

        {!loading &&
          (results.length >
            0 ||
            questionResults.length >
              0) && (
            <div
              ref={
                loadMoreRef
              }
              className="py-8 text-center text-sm text-gray-500"
            >
              {loadingMore
                ? t(
                    "search.loading_more"
                  )
                : hasMore
                ? ""
                : t(
                    "search.no_more_results"
                  )}
            </div>
          )}
      </main>
    </Mainlayout>
  );
}