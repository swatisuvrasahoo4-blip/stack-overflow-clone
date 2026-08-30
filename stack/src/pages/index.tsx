import {
  Avatar,
  AvatarFallback,
} from "@/components/ui/avatar";
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

type RawQuestion = {
  _id?: string;
  id?: string;
  questiontitle?: string;
  title?: string;
  questionTitle?: string;
  questionbody?: string;
  content?: string;
  body?: string;
  questiontags?: string[];
  tags?: string[];
  userposted?: string;
  author?: string;
  userid?: string;
  authorId?: string;
  askedon?: string;
  askedOn?: string;
  asked?: string;
  upvote?: string[];
  upvotes?: number;
  downvote?: string[];
  downvotes?: number;
  noofanswer?: number;
  answers?: number;
  answer?: unknown[];
  views?: number;
};

type QuestionResponse = {
  data?: RawQuestion[];
  pagination?: {
    nextCursor?: string | null;
    hasMore?: boolean;
  };
};

type FollowingRelationship = {
  following?:
    | string
    | {
        _id?: string;
        id?: string;
      };
};

export default function Home() {
  const { t } = useTranslation();
  const router = useRouter();
  const { user } = useAuth();
  const { panel } = router.query;

  const [items, setItems] =
    useState<Question[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [loadingMore, setLoadingMore] =
    useState(false);

  const [hasMore, setHasMore] =
    useState(true);

  const [nextCursor, setNextCursor] =
    useState<string | null>(null);

  const loadMoreRef =
    useRef<HTMLDivElement | null>(null);

  const loadingMoreRef =
    useRef(false);

  const [activeFeed, setActiveFeed] =
    useState<
      "trending" | "following"
    >("trending");

  const [followingIds, setFollowingIds] =
    useState<string[]>([]);

  const [, setPostCount] =
    useState(0);

  const [activeContent, setActiveContent] =
    useState<
      "questions" | "posts"
    >("questions");

  const [contentReady, setContentReady] =
    useState(false);

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

  function normalizeStoredQuestion(
    s: RawQuestion
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
        const date = new Date(
          s.askedon ||
            s.askedOn ||
            s.asked ||
            Date.now()
        );

        const diff =
          Date.now() -
          date.getTime();

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
      (s.upvote?.length ??
        s.upvotes ??
        0) -
      (s.downvote?.length ??
        s.downvotes ??
        0);

    const answers =
      s.noofanswer ??
      s.answers ??
      s.answer?.length ??
      0;

    const views =
      s.views ?? 0;

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

  const fetchQuestions =
    async (
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
        await axiosInstance.get<QuestionResponse>(
          `/question/getallquestion?${params.toString()}`
        );

      console.log(
        "Question API response:",
        response.data
      );

      const rawQuestions =
        response.data.data ?? [];

      const questions =
        rawQuestions.map(
          (question) =>
            normalizeStoredQuestion(
              question
            )
        );

      const pagination =
        response.data.pagination;

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

  useEffect(() => {
    let cancelled = false;

    const loadHomeFeedData =
      async (): Promise<void> => {
        setLoading(true);

        try {
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
                (
                  followingResponse as FollowingRelationship[]
                )
                  .map(
                    (
                      relationship
                    ) => {
                      if (
                        typeof relationship.following ===
                        "string"
                      ) {
                        return relationship.following;
                      }

                      return (
                        relationship
                          .following
                          ?._id ||
                        relationship
                          .following
                          ?.id
                      );
                    }
                  )
                  .filter(
                    (
                      followingId
                    ): followingId is string =>
                      Boolean(
                        followingId
                      )
                  );

              setFollowingIds(
                following
              );
            } else {
              setFollowingIds([]);
            }
          } else {
            setFollowingIds([]);
          }
        } catch (
          error: unknown
        ) {
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

    void loadHomeFeedData();

    return () => {
      cancelled = true;
    };
  }, [
    user?._id,
    user?.id,
  ]);

  const loadMoreQuestions =
    useCallback(
      async (): Promise<void> => {
        if (
          loadingMoreRef.current ||
          !hasMore ||
          !nextCursor
        ) {
          return;
        }

        loadingMoreRef.current =
          true;

        setLoadingMore(true);

        try {
          const result =
            await fetchQuestions(
              nextCursor
            );

          setItems(
            (
              previousItems
            ) => {
              const existingIds =
                new Set(
                  previousItems.map(
                    (
                      question
                    ) =>
                      question.id
                  )
                );

              const newQuestions =
                result.questions.filter(
                  (
                    question
                  ) =>
                    !existingIds.has(
                      question.id
                    )
                );

              return [
                ...previousItems,
                ...newQuestions,
              ];
            }
          );

          setNextCursor(
            result.nextCursor
          );

          setHasMore(
            result.hasMore
          );
        } catch (
          error: unknown
        ) {
          console.error(
            "Failed to load more questions:",
            error
          );
        } finally {
          setTimeout(() => {
            loadingMoreRef.current =
              false;

            setLoadingMore(false);
          }, 500);
        }
      },
      [
        nextCursor,
        hasMore,
      ]
    );

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

            void loadMoreQuestions();
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
          attempts >=
            maxAttempts
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
            <div className="mb-4 flex flex-col items-start gap-2 text-sm sm:flex-row sm:items-center sm:gap-4">
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

                    <button className="rounded bg-gray-200 px-2 py-1 text-xs text-gray-700 sm:px-3 sm:text-sm">
                      {t(
                        "community.newest"
                      )}
                    </button>

                    <button className="rounded px-2 py-1 text-xs text-gray-600 hover:bg-gray-100 sm:px-3 sm:text-sm">
                      {t(
                        "community.active"
                      )}
                    </button>

                    <button className="flex items-center rounded px-2 py-1 text-xs text-gray-600 hover:bg-gray-100 sm:px-3 sm:text-sm">
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

                    <button className="rounded px-2 py-1 text-xs text-gray-600 hover:bg-gray-100 sm:px-3 sm:text-sm">
                      {t(
                        "community.unanswered"
                      )}
                    </button>

                    <button className="rounded px-2 py-1 text-xs text-gray-600 hover:bg-gray-100 sm:px-3 sm:text-sm">
                      {t(
                        "community.more"
                      )}{" "}
                      ▼
                    </button>

                    <button className="ml-auto rounded border border-gray-300 px-2 py-1 text-xs text-gray-600 hover:bg-gray-50 sm:px-3 sm:text-sm">
                      🔍{" "}
                      {t(
                        "community.filter"
                      )}
                    </button>
                  </QuestionFilters>
                )}
            </div>

            <div className="space-y-4">
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
                                  <div className="flex flex-wrap gap-1">
                                    {question.tags.map(
                                      (
                                        tag
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

                  <div
                    ref={
                      loadMoreRef
                    }
                    className="h-20 w-full"
                  />

                  {loadingMore && (
                    <div className="py-6 text-center text-gray-500">
                      Loading more
                      questions...
                    </div>
                  )}

                  {!hasMore &&
                    items.length >
                      0 && (
                      <div className="py-6 text-center text-gray-400">
                        No more
                        questions.
                      </div>
                    )}
                </>
              ) : (
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