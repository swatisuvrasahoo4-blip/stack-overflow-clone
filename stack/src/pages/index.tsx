import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import Mainlayout from "@/layout/Mainlayout";
import SavedList from "@/components/SavedList";
import axiosInstance from "../lib/axiosinstance";
import Link from "next/link";
import { useRouter } from "next/router";
import {
  useEffect,
  useState,
  useRef,
  useCallback,
} from "react";
import { useAuth } from "@/lib/AuthContext";
import FeedTabs from "@/components/feed/FeedTabs";
import ContentTabs from "@/components/feed/ContentTabs";
import QuestionFilters from "@/components/feed/QuestionFilters";
import PostFeed from "@/components/feed/PostFeed";
import { getFollowing } from "@/components/services/followService";
import { useTranslation } from "react-i18next";

type Question = {
  id: string;
  title: string;
  content: string;
  tags: string[];
  author: string;
  authorId: string;
  timeAgo: string;
  votes: number;
  answers: number;
  views: number;
};

export default function Home() {
  const { t } = useTranslation();
  const router = useRouter();
  const { user } = useAuth();
  const { panel } = router.query;

  // --------------------------------------------------
  // QUESTIONS
  // --------------------------------------------------

  const [items, setItems] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);

  const [loadingMore, setLoadingMore] =
    useState(false);

  const [hasMore, setHasMore] =
    useState(true);

  const [nextCursor, setNextCursor] =
    useState<string | null>(null);

  // Sentinel for infinite scrolling
  const loadMoreRef =
    useRef<HTMLDivElement | null>(null);

  // Prevent duplicate requests
  const loadingMoreRef =
    useRef(false);

  // --------------------------------------------------
  // FEED
  // --------------------------------------------------

  const [activeFeed, setActiveFeed] = useState<
    "trending" | "following"
  >("trending");

  const [followingIds, setFollowingIds] =
    useState<string[]>([]);

  const [postCount, setPostCount] =
    useState(0);

  const [activeContent, setActiveContent] =
    useState<"questions" | "posts">(
      "questions"
    );

  const [contentReady, setContentReady] =
    useState(false);

  // --------------------------------------------------
  // RESTORE TRENDING / FOLLOWING
  // --------------------------------------------------

  useEffect(() => {
    const savedFeed =
      sessionStorage.getItem(
        "homeActiveFeed"
      );

    if (
      savedFeed === "trending" ||
      savedFeed === "following"
    ) {
      setActiveFeed(savedFeed);
    }
  }, []);

  // --------------------------------------------------
  // RESTORE QUESTIONS / POSTS
  // --------------------------------------------------

  useEffect(() => {
    if (!router.isReady) {
      return;
    }

    const content =
      router.query.content;

    if (
      content === "posts" ||
      content === "questions"
    ) {
      setActiveContent(content);
    } else {
      setActiveContent("questions");
    }

    setContentReady(true);
  }, [
    router.isReady,
    router.query.content,
  ]);

  // --------------------------------------------------
  // NORMALIZE QUESTION
  // --------------------------------------------------

  function normalizeStoredQuestion(
    s: any
  ): Question {
    const id =
      s._id ||
      s.id ||
      String(Date.now());

    const title =
      s.questiontitle ||
      s.title ||
      s.questionTitle ||
      "(no title)";

    const content =
      s.questionbody ||
      s.content ||
      s.body ||
      "";

    const tags =
      s.questiontags ||
      s.tags ||
      [];

    const author =
      s.userposted ||
      s.author ||
      "You";

    const authorId =
      s.userid ||
      s.authorId ||
      "local";

    const timeAgo = (() => {
      try {
        const d = new Date(
          s.askedon ||
            s.askedOn ||
            s.asked ||
            Date.now()
        );

        const diff =
          Date.now() -
          d.getTime();

        const mins =
          Math.floor(
            diff / 60000
          );

        if (mins <= 0) {
          return "just now";
        }

        if (mins < 60) {
          return `${mins} mins ago`;
        }

        const hours =
          Math.floor(mins / 60);

        if (hours < 24) {
          return `${hours} hours ago`;
        }

        const days =
          Math.floor(hours / 24);

        return `${days} days ago`;
      } catch {
        return "just now";
      }
    })();

    const votes =
      (s.upvote?.length ||
        s.upvotes ||
        0) -
      (s.downvote?.length ||
        s.downvotes ||
        0);

    const answers =
      s.noofanswer ||
      s.answers ||
      (s.answer?.length || 0) ||
      0;

    const views =
      s.views || 0;

    return {
      id,
      title,
      content,
      tags,
      author,
      authorId,
      timeAgo,
      votes,
      answers,
      views,
    };
  }

  // --------------------------------------------------
  // FETCH QUESTIONS
  // --------------------------------------------------

  const fetchQuestions = async (
    cursor: string | null = null
  ) => {
    const params =
      new URLSearchParams();

    params.set("limit", "10");

    if (cursor) {
      params.set(
        "cursor",
        cursor
      );
    }

    console.log(
      "Fetching questions:",
      `/question/getallquestion?${params.toString()}`
    );

    const response =
      await axiosInstance.get(
        `/question/getallquestion?${params.toString()}`
      );

    console.log(
      "Question API response:",
      response.data
    );

    const rawQuestions =
      response.data?.data ||
      [];

    const questions =
      rawQuestions.map(
        (question: any) =>
          normalizeStoredQuestion(
            question
          )
      );

    const pagination =
      response.data?.pagination;

    console.log(
      "Received:",
      questions.length
    );

    console.log(
      "nextCursor:",
      pagination?.nextCursor
    );

    console.log(
      "hasMore:",
      pagination?.hasMore
    );

    return {
      questions,
      nextCursor:
        pagination?.nextCursor ??
        null,
      hasMore:
        pagination?.hasMore ??
        false,
    };
  };

  // --------------------------------------------------
  // INITIAL LOAD
  // --------------------------------------------------

  useEffect(() => {
    let cancelled = false;

    const loadHomeFeedData =
      async () => {
        setLoading(true);

        try {
          // First page of questions
          const questionsResult =
            await fetchQuestions();

          if (cancelled) {
            return;
          }

          setItems(
            questionsResult.questions
          );

          setNextCursor(
            questionsResult.nextCursor
          );

          setHasMore(
            questionsResult.hasMore
          );

          // Load following users
          if (
            user?._id ||
            user?.id
          ) {
            const followingResponse =
              await getFollowing(
                user._id ||
                  user.id
              );

            if (
              Array.isArray(
                followingResponse
              )
            ) {
              const following =
                followingResponse
                  .map(
                    (
                      relationship: any
                    ) =>
                      relationship
                        .following?._id ||
                      relationship.following
                  )
                  .filter(Boolean)
                  .map(String);

              setFollowingIds(
                following
              );
            } else {
              setFollowingIds([]);
            }
          } else {
            setFollowingIds([]);
          }
        } catch (error) {
          console.error(
            "Failed to load home feed:",
            error
          );

          if (!cancelled) {
            setItems([]);
            setFollowingIds([]);
            setNextCursor(null);
            setHasMore(false);
          }
        } finally {
          if (!cancelled) {
            setLoading(false);
          }
        }
      };

    loadHomeFeedData();

    return () => {
      cancelled = true;
    };
  }, [
    user?._id,
    user?.id,
  ]);

  // --------------------------------------------------
  // LOAD MORE QUESTIONS
  // --------------------------------------------------
const loadMoreQuestions = useCallback(async () => {
  if (loadingMoreRef.current || !hasMore || !nextCursor) {
    return;
  }

  loadingMoreRef.current = true;
  setLoadingMore(true);

  try {
    const result = await fetchQuestions(nextCursor);

    setItems((previousItems) => {
      const existingIds = new Set(
        previousItems.map((question) => question.id)
      );

      const newQuestions = result.questions.filter(
        (question: any) => !existingIds.has(question.id)
      );

      return [...previousItems, ...newQuestions];
    });

    setNextCursor(result.nextCursor);
    setHasMore(result.hasMore);
  } catch (error) {
    console.error("Failed to load more questions:", error);
  } finally {
    // Keep the loading message visible briefly
    setTimeout(() => {
      loadingMoreRef.current = false;
      setLoadingMore(false);
    }, 500);
  }
}, [nextCursor, hasMore]);

  // --------------------------------------------------
  // INFINITE SCROLL
  // --------------------------------------------------

  useEffect(() => {
    if (
      activeContent !==
      "questions"
    ) {
      return;
    }

    if (panel === "saves") {
      return;
    }

    if (loading) {
      return;
    }

    if (!hasMore) {
      return;
    }

    if (!nextCursor) {
      return;
    }

    const sentinel =
      loadMoreRef.current;

    if (!sentinel) {
      console.log(
        "❌ Load more sentinel not found"
      );
      return;
    }

    console.log(
      "✅ Infinite scroll observer created"
    );

    const observer =
      new IntersectionObserver(
        (entries) => {
          const entry =
            entries[0];

          if (
            entry?.isIntersecting
          ) {
            console.log(
              "🔥 Load more sentinel visible"
            );

            loadMoreQuestions();
          }
        },
        {
          root: null,
          rootMargin:
            "600px 0px",
          threshold: 0,
        }
      );

    observer.observe(
      sentinel
    );

    return () => {
      observer.disconnect();
    };
  }, [
    activeContent,
    panel,
    loading,
    hasMore,
    nextCursor,
    loadMoreQuestions,
  ]);

  // --------------------------------------------------
  // RESTORE QUESTION SCROLL
  // --------------------------------------------------

  useEffect(() => {
    const savedScroll =
      sessionStorage.getItem(
        "questionsScrollPosition"
      );

    if (
      !savedScroll ||
      loading ||
      activeContent !==
        "questions"
    ) {
      return;
    }

    let attempts = 0;
    const maxAttempts = 20;

    const position =
      Number(savedScroll);

    const restoreScroll =
      () => {
        window.scrollTo(
          0,
          position
        );

        attempts++;

        if (
          Math.abs(
            window.scrollY -
              position
          ) < 5 ||
          attempts >= maxAttempts
        ) {
          sessionStorage.removeItem(
            "questionsScrollPosition"
          );

          return;
        }

        requestAnimationFrame(
          restoreScroll
        );
      };

    requestAnimationFrame(
      restoreScroll
    );
  }, [
    loading,
    items.length,
    activeContent,
  ]);

  // --------------------------------------------------
  // UI
  // --------------------------------------------------

  return (
    <Mainlayout>
      {!contentReady ? (
        <main className="min-w-0 p-4 lg:p-6">
          <div className="flex items-center justify-center py-10">
            <p className="text-sm text-gray-500">
              {t(
                "feed.loading"
              )}
            </p>
          </div>
        </main>
      ) : (
        <main className="min-w-0 p-4 lg:p-6">

          {/* FEED TABS */}

          <div className="mb-6 space-y-6">

            {panel !==
              "saves" && (
              <>
                <FeedTabs
                  activeFeed={
                    activeFeed
                  }
                  setActiveFeed={
                    setActiveFeed
                  }
                />

                <div className="flex justify-center">
                  <ContentTabs
                    activeContent={
                      activeContent
                    }
                    setActiveContent={
                      setActiveContent
                    }
                  />
                </div>
              </>
            )}

          </div>

          <div className="w-full">

            {/* QUESTION FILTERS */}

            <div className="flex flex-col sm:flex-row items-start sm:items-center mb-4 text-sm gap-2 sm:gap-4">

              {activeContent ===
                "questions" &&
                panel !==
                  "saves" && (
                  <QuestionFilters>

                    <span className="text-gray-600">
                      {
                        items.length
                      }{" "}
                      {t(
                        "community.questions"
                      )}
                    </span>

                    <button className="px-2 sm:px-3 py-1 bg-gray-200 text-gray-700 rounded text-xs sm:text-sm">
                      {t(
                        "community.newest"
                      )}
                    </button>

                    <button className="px-2 sm:px-3 py-1 text-gray-600 hover:bg-gray-100 rounded text-xs sm:text-sm">
                      {t(
                        "community.active"
                      )}
                    </button>

                    <button className="px-2 sm:px-3 py-1 text-gray-600 hover:bg-gray-100 rounded flex items-center text-xs sm:text-sm">
                      {t(
                        "community.bountied"
                      )}

                      <Badge
                        variant="secondary"
                        className="ml-1 text-xs"
                      >
                        25
                      </Badge>
                    </button>

                    <button className="px-2 sm:px-3 py-1 text-gray-600 hover:bg-gray-100 rounded text-xs sm:text-sm">
                      {t(
                        "community.unanswered"
                      )}
                    </button>

                    <button className="px-2 sm:px-3 py-1 text-gray-600 hover:bg-gray-100 rounded text-xs sm:text-sm">
                      {t(
                        "community.more"
                      )}{" "}
                      ▼
                    </button>

                    <button className="px-2 sm:px-3 py-1 border border-gray-300 text-gray-600 hover:bg-gray-50 rounded ml-auto text-xs sm:text-sm">
                      🔍{" "}
                      {t(
                        "community.filter"
                      )}
                    </button>

                  </QuestionFilters>
                )}

            </div>

            {/* CONTENT */}

            <div className="space-y-4">

              {/* SAVED */}

              {panel ===
              "saves" ? (
                <SavedList />

              ) : loading &&
                activeContent ===
                  "questions" ? (

                <div className="flex items-center justify-center py-10">
                  <p className="text-sm text-gray-500">
                    {t(
                      "feed.loading_questions"
                    )}
                  </p>
                </div>

              ) : activeContent ===
                "questions" ? (

                <>
                  {/* QUESTION LIST */}

                  <div className="space-y-4">

                    {(activeFeed ===
                    "trending"
                      ? [
                          ...items,
                        ].sort(
                          (
                            first,
                            second
                          ) =>
                            second.votes *
                              3 +
                            second.answers *
                              5 +
                            second.views -
                            (first.votes *
                              3 +
                              first.answers *
                                5 +
                              first.views)
                        )
                      : items
                    )
                      .filter(
                        (
                          question
                        ) =>
                          activeFeed ===
                            "trending" ||
                          followingIds.includes(
                            String(
                              question.authorId
                            )
                          )
                      )
                      .map(
                        (
                          question
                        ) => (

                          <div
                            key={
                              question.id
                            }
                            className="border-b border-gray-200 pb-4"
                          >

                            <div className="flex flex-col gap-4 sm:flex-row">

                              {/* VOTES / ANSWERS */}

                              <div className="flex items-center gap-4 text-sm text-gray-600 sm:w-16 sm:flex-col sm:items-center sm:gap-2 lg:w-20">

                                <div className="text-center">

                                  <div className="font-medium">
                                    {
                                      question.votes
                                    }
                                  </div>

                                  <div className="text-xs">
                                    {t(
                                      "community.votes"
                                    )}
                                  </div>

                                </div>

                                <div className="text-center">

                                  <div
                                    className={`font-medium ${
                                      question.answers >
                                      0
                                        ? "rounded bg-green-100 px-2 py-1 text-green-600"
                                        : ""
                                    }`}
                                  >
                                    {
                                      question.answers
                                    }
                                  </div>

                                  <div className="text-xs">
                                    {
                                      question.answers ===
                                      1
                                        ? t(
                                            "community.answer"
                                          )
                                        : t(
                                            "community.answers"
                                          )
                                    }
                                  </div>

                                </div>

                              </div>

                              {/* QUESTION */}

                              <div className="min-w-0 flex-1">

                                <Link
                                  href={`/questions/${question.id}`}
                                  onClick={() => {
                                    sessionStorage.setItem(
                                      "homeActiveFeed",
                                      activeFeed
                                    );

                                    sessionStorage.setItem(
                                      "questionsScrollPosition",
                                      String(
                                        window.scrollY
                                      )
                                    );
                                  }}
                                  className="mb-2 block text-base font-medium text-blue-600 hover:text-blue-800 lg:text-lg"
                                >
                                  {
                                    question.title
                                  }
                                </Link>

                                <p className="mb-3 line-clamp-2 text-sm text-gray-700">
                                  {
                                    question.content
                                  }
                                </p>

                                <div className="flex flex-col items-start justify-between gap-2 sm:flex-row sm:items-center">

                                  {/* TAGS */}

                                  <div className="flex flex-wrap gap-1">

                                    {question.tags?.map(
                                      (
                                        tag: string
                                      ) => (
                                        <Badge
                                          key={
                                            tag
                                          }
                                          variant="secondary"
                                          className="cursor-pointer bg-blue-100 text-xs text-blue-800 hover:bg-blue-200"
                                        >
                                          {
                                            tag
                                          }
                                        </Badge>
                                      )
                                    )}

                                  </div>

                                  {/* AUTHOR */}

                                  <div className="flex flex-shrink:0 items-center text-xs text-gray-600">

                                    <Link
                                      href={`/questions/${question.id}`}
                                      onClick={() => {
                                        sessionStorage.setItem(
                                          "homeActiveFeed",
                                          activeFeed
                                        );

                                        sessionStorage.setItem(
                                          "questionsScrollPosition",
                                          String(
                                            window.scrollY
                                          )
                                        );
                                      }}
                                      className="flex items-center"
                                    >

                                      <Avatar className="mr-1 h-4 w-4">

                                        <AvatarFallback className="text-xs">
                                          {
                                            question.author?.[0]
                                          }
                                        </AvatarFallback>

                                      </Avatar>

                                      <span className="mr-1 text-blue-600 hover:text-blue-800">
                                        {
                                          question.author
                                        }
                                      </span>

                                    </Link>

                                    <span>
                                      {t(
                                        "community.asked"
                                      )}{" "}
                                      {
                                        question.timeAgo
                                      }
                                    </span>

                                  </div>

                                </div>

                              </div>

                            </div>

                          </div>

                        )
                      )}

                  </div>

                  {/* INFINITE SCROLL SENTINEL */}

                  <div
                    ref={
                      loadMoreRef
                    }
                    className="h-20 w-full"
                  />

                  {/* LOADING MORE */}

                  {loadingMore && (
                    <div className="py-6 text-center text-gray-500">
                      Loading more questions...
                    </div>
                  )}

                  {/* NO MORE */}

                  {!hasMore &&
                    items.length >
                      0 && (
                      <div className="py-6 text-center text-gray-400">
                        No more questions.
                      </div>
                    )}

                </>

              ) : (

                /* POSTS */

                <PostFeed
                  activeFeed={
                    activeFeed
                  }
                  followingIds={
                    followingIds
                  }
                  onPostCountChange={
                    setPostCount
                  }
                />

              )}

            </div>
          </div>
        </main>
      )}
    </Mainlayout>
  );
}
