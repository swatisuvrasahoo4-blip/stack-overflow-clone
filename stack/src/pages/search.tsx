import Mainlayout from "@/layout/Mainlayout";
import { useRouter } from "next/router";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useTranslation } from "react-i18next";

import {
  searchPosts,
} from "@/components/services/communityService";

import {
  searchQuestions,
} from "@/components/services/questionService";

import {
  getSubscription,
} from "@/components/services/subscriptionService";

import SearchHeader from "@/components/search/SearchHeader";
import SearchTypeTabs from "@/components/search/SearchTypeTabs";
import PostTypeFilter from "@/components/search/PostTypeFilter";
import SearchResults from "@/components/search/SearchResults";
import SearchLoading from "@/components/search/SearchLoading";

import type { Post } from "@/types/community";
import type { Question } from "@/types/questions";

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

export default function SearchPage() {
  const { t } =
    useTranslation("search");

  const router = useRouter();

  const { q } = router.query;

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
  ] = useState<SubscriptionPlan>(
    "Free"
  );

  const [
    selectedType,
    setSelectedType,
  ] = useState<PostType>("All");

  const [
    searchType,
    setSearchType,
  ] = useState<SearchType>("All");

  // Post pagination
  const [
    postCursor,
    setPostCursor,
  ] = useState<string | null>(null);

  const [
    hasMorePosts,
    setHasMorePosts,
  ] = useState(true);

  // Question pagination
  const [
    questionCursor,
    setQuestionCursor,
  ] = useState<string | null>(null);

  const [
    hasMoreQuestions,
    setHasMoreQuestions,
  ] = useState(true);

  const loadMoreRef =
    useRef<HTMLDivElement | null>(
      null
    );

  // Search query
  const query = useMemo(() => {
    if (!q) {
      return "";
    }

    return Array.isArray(q)
      ? q[0] ?? ""
      : String(q);
  }, [q]);

  // Check advanced search access
  const hasAdvancedSearch = [
    "Bronze",
    "Silver",
    "Gold",
  ].includes(currentPlan);

  // Load current subscription
  useEffect(() => {
    const loadSubscription =
      async (): Promise<void> => {
        try {
          const response =
            (await getSubscription()) as SubscriptionResponse;

          setCurrentPlan(
            response.data?.plan ?? "Free"
          );
        } catch (error: unknown) {
          console.error(
            "Failed to load subscription:",
            error
          );

          setCurrentPlan("Free");
        }
      };

    void loadSubscription();
  }, []);

  // Fetch posts
  const fetchPostsPage =
    useCallback(
      async (
        cursor: string | null
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
            response.data ?? [],

          nextCursor:
            response.pagination
              ?.nextCursor ?? null,

          hasMore:
            response.pagination
              ?.hasMore ?? false,
        };
      },
      [
        query,
        hasAdvancedSearch,
        selectedType,
      ]
    );

  // Fetch questions
  const fetchQuestionsPage =
    useCallback(
      async (
        cursor: string | null
      ) => {
        const response =
          (await searchQuestions(
            query,
            cursor,
            PAGE_LIMIT
          )) as QuestionSearchResponse;

        return {
          items:
            response.data ?? [],

          nextCursor:
            response.pagination
              ?.nextCursor ?? null,

          hasMore:
            response.pagination
              ?.hasMore ?? false,
        };
      },
      [query]
    );

  // Initial search
  useEffect(() => {
    if (!router.isReady) {
      return;
    }

    let cancelled = false;

    const loadResults =
      async (): Promise<void> => {
        if (!query.trim()) {
          setResults([]);
          setQuestionResults([]);

          setPostCursor(null);
          setQuestionCursor(null);

          setHasMorePosts(false);
          setHasMoreQuestions(false);

          setLoading(false);

          return;
        }

        setLoading(true);

        setResults([]);
        setQuestionResults([]);

        setPostCursor(null);
        setQuestionCursor(null);

        setHasMorePosts(true);
        setHasMoreQuestions(true);

        try {
          // Load posts
          if (
            searchType === "Posts" ||
            searchType === "All"
          ) {
            const postPage =
              await fetchPostsPage(null);

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
            setHasMorePosts(false);
          }

          // Load questions
          if (
            searchType === "Questions" ||
            searchType === "All"
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
            setQuestionResults([]);
            setHasMoreQuestions(false);
          }
        } catch (error: unknown) {
          console.error(
            "Search error:",
            error
          );

          if (!cancelled) {
            setResults([]);
            setQuestionResults([]);

            setHasMorePosts(false);
            setHasMoreQuestions(false);
          }
        } finally {
          if (!cancelled) {
            setLoading(false);
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

  // Load more results
  const loadMore =
    useCallback(
      async (): Promise<void> => {
        if (
          loading ||
          loadingMore
        ) {
          return;
        }

        const shouldLoadPosts =
          (searchType === "Posts" ||
            searchType === "All") &&
          hasMorePosts;

        const shouldLoadQuestions =
          (searchType === "Questions" ||
            searchType === "All") &&
          hasMoreQuestions;

        if (
          !shouldLoadPosts &&
          !shouldLoadQuestions
        ) {
          return;
        }

        setLoadingMore(true);

        try {
          // Load more posts
          if (
            shouldLoadPosts &&
            postCursor
          ) {
            const postPage =
              await fetchPostsPage(
                postCursor
              );

            setResults(
              (previous) => {
                const existingIds =
                  new Set(
                    previous.map(
                      (post) =>
                        String(
                          post._id
                        )
                    )
                  );

                const uniquePosts =
                  postPage.items.filter(
                    (post) =>
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

          // Load more questions
          if (
            shouldLoadQuestions &&
            questionCursor
          ) {
            const questionPage =
              await fetchQuestionsPage(
                questionCursor
              );

            setQuestionResults(
              (previous) => {
                const existingIds =
                  new Set(
                    previous.map(
                      (question) =>
                        String(
                          question._id
                        )
                    )
                  );

                const uniqueQuestions =
                  questionPage.items.filter(
                    (question) =>
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
        } catch (error: unknown) {
          console.error(
            "Failed to load more search results:",
            error
          );
        } finally {
          setLoadingMore(false);
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

  // Infinite scroll
  useEffect(() => {
    const element =
      loadMoreRef.current;

    if (!element) {
      return;
    }

    if (loading) {
      return;
    }

    const hasMore =
      searchType === "Posts"
        ? hasMorePosts
        : searchType === "Questions"
        ? hasMoreQuestions
        : hasMorePosts ||
          hasMoreQuestions;

    if (!hasMore) {
      return;
    }

    const observer =
      new IntersectionObserver(
        (entries) => {
          const entry =
            entries[0];

          if (
            entry?.isIntersecting
          ) {
            void loadMore();
          }
        },
        {
          rootMargin: "300px",
        }
      );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [
    loading,
    searchType,
    hasMorePosts,
    hasMoreQuestions,
    loadMore,
  ]);

  // Check if more results exist
  const hasMore =
    searchType === "Posts"
      ? hasMorePosts
      : searchType === "Questions"
      ? hasMoreQuestions
      : hasMorePosts ||
        hasMoreQuestions;

  return (
    <Mainlayout>
      <main className="min-w-0 p-4 lg:p-6">
        {/* Search header */}
        <SearchHeader
          query={query}
        />

        {/* Search type tabs */}
        <SearchTypeTabs
          searchType={searchType}
          setSearchType={
            setSearchType
          }
          setSelectedType={
            setSelectedType
          }
        />

        {/* Post type filter */}
        {hasAdvancedSearch &&
          searchType !==
            "Questions" && (
            <PostTypeFilter
              selectedType={
                selectedType
              }
              setSelectedType={
                setSelectedType
              }
            />
          )}

        {/* Search results */}
        <div className="mt-6">
          {loading ? (
            <SearchLoading />
          ) : (
            <SearchResults
              searchType={
                searchType
              }
              results={results}
              questionResults={
                questionResults
              }
              query={query}
              selectedType={
                selectedType
              }
            />
          )}
        </div>

        {/* Infinite scroll */}
        {!loading &&
          (results.length > 0 ||
            questionResults.length >
              0) && (
            <div
              ref={loadMoreRef}
              className="py-8 text-center text-sm text-gray-500"
            >
              {loadingMore
                ? t(
                    "status.loading_more_results"
                  )
                : hasMore
                ? ""
                : t(
                    "messages.no_more_results"
                  )}
            </div>
          )}
      </main>
    </Mainlayout>
  );
}