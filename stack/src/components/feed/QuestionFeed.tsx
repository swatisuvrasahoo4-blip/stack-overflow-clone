import {
  Avatar,
  AvatarFallback,
} from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import axiosInstance from "@/lib/axiosinstance";
import Link from "next/link";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
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

interface QuestionFeedProps {
  activeFeed:
    | "trending"
    | "following";
  followingIds: string[];
}

const QuestionFeed = ({
  activeFeed,
  followingIds,
}: QuestionFeedProps) => {
  const { t } = useTranslation([
    "questions",
    "answers",
  ]);

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

  const normalizeQuestion =
    useCallback(
      (
        question: RawQuestion
      ): Question => {
        const id =
          question._id ||
          question.id ||
          String(Date.now());

        const title =
          question.questiontitle ||
          question.title ||
          question.questionTitle ||
          t("messages.no_title", {
            ns: "questions",
          });

        const content =
          question.questionbody ||
          question.content ||
          question.body ||
          "";

        const tags =
          question.questiontags ||
          question.tags ||
          [];

        const author =
          question.userposted ||
          question.author ||
          t("labels.you", {
            ns: "questions",
          });

        const authorId =
          question.userid ||
          question.authorId ||
          "local";

        const timeAgo = (() => {
          try {
            const date = new Date(
              question.askedon ||
                question.askedOn ||
                question.asked ||
                Date.now()
            );

            const diff =
              Date.now() -
              date.getTime();

            const minutes =
              Math.floor(
                diff / 60000
              );

            if (minutes <= 0) {
              return t(
                "time.just_now",
                {
                  ns: "questions",
                }
              );
            }

            if (minutes < 60) {
              return minutes === 1
                ? t(
                    "time.minute_ago",
                    {
                      ns: "questions",
                      count:
                        minutes,
                    }
                  )
                : t(
                    "time.minutes_ago",
                    {
                      ns: "questions",
                      count:
                        minutes,
                    }
                  );
            }

            const hours =
              Math.floor(
                minutes / 60
              );

            if (hours < 24) {
              return hours === 1
                ? t(
                    "time.hour_ago",
                    {
                      ns: "questions",
                      count: hours,
                    }
                  )
                : t(
                    "time.hours_ago",
                    {
                      ns: "questions",
                      count: hours,
                    }
                  );
            }

            const days =
              Math.floor(
                hours / 24
              );

            return days === 1
              ? t(
                  "time.day_ago",
                  {
                    ns: "questions",
                    count: days,
                  }
                )
              : t(
                  "time.days_ago",
                  {
                    ns: "questions",
                    count: days,
                  }
                );
          } catch {
            return t(
              "time.just_now",
              {
                ns: "questions",
              }
            );
          }
        })();

        const votes =
          (question.upvote?.length ??
            question.upvotes ??
            0) -
          (question.downvote
            ?.length ??
            question.downvotes ??
            0);

        const answers =
          question.noofanswer ??
          question.answers ??
          question.answer?.length ??
          0;

        const views =
          question.views ?? 0;

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
      },
      [t]
    );

  const fetchQuestions =
    useCallback(
      async (
        cursor: string | null = null
      ) => {
        const params =
          new URLSearchParams();

        params.set(
          "limit",
          "10"
        );

        if (cursor) {
          params.set(
            "cursor",
            cursor
          );
        }

        const response =
          await axiosInstance.get<QuestionResponse>(
            `/question/getallquestion?${params.toString()}`
          );

        const rawQuestions =
          response.data.data ??
          [];

        const questions =
          rawQuestions.map(
            normalizeQuestion
          );

        const pagination =
          response.data
            .pagination;

        return {
          questions,
          nextCursor:
            pagination
              ?.nextCursor ??
            null,
          hasMore:
            pagination?.hasMore ??
            false,
        };
      },
      [normalizeQuestion]
    );

  useEffect(() => {
    let cancelled = false;

    const loadQuestions =
      async (): Promise<void> => {
        setLoading(true);

        try {
          const result =
            await fetchQuestions();

          if (cancelled) {
            return;
          }

          setItems(
            result.questions
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
            "Failed to load questions:",
            error
          );

          if (!cancelled) {
            setItems([]);
            setNextCursor(null);
            setHasMore(false);
          }
        } finally {
          if (!cancelled) {
            setLoading(
              false
            );
          }
        }
      };

    void loadQuestions();

    return () => {
      cancelled = true;
    };
  }, [fetchQuestions]);

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
            (previousItems) => {
              const existingIds =
                new Set(
                  previousItems.map(
                    (question) =>
                      question.id
                  )
                );

              const newQuestions =
                result.questions.filter(
                  (question) =>
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

            setLoadingMore(
              false
            );
          }, 500);
        }
      },
      [
        fetchQuestions,
        hasMore,
        nextCursor,
      ]
    );

  useEffect(() => {
    if (
      loading ||
      !hasMore ||
      !nextCursor
    ) {
      return;
    }

    const sentinel =
      loadMoreRef.current;

    if (!sentinel) {
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
      loading
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
  ]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-10">
        <p className="text-sm text-gray-500">
          {t(
            "status.loading_questions",
            {
              ns: "questions",
            }
          )}
        </p>
      </div>
    );
  }

  const displayedQuestions =
    (
      activeFeed ===
      "trending"
        ? [...items].sort(
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
    ).filter(
      (question) =>
        activeFeed ===
          "trending" ||
        followingIds.includes(
          String(
            question.authorId
          )
        )
    );

  if (
    displayedQuestions.length === 0
  ) {
    return (
      <div className="py-10 text-center text-sm text-gray-500">
        {t(
          "messages.no_questions_yet",
          {
            ns: "questions",
          }
        )}
      </div>
    );
  }

  return (
    <>
      <div className="space-y-4">
        {displayedQuestions.map(
          (question) => (
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
                        "labels.votes",
                        {
                          ns: "questions",
                        }
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
                      {question.answers ===
                      1
                        ? t(
                            "labels.answer",
                            {
                              ns: "answers",
                            }
                          )
                        : t(
                            "labels.answers",
                            {
                              ns: "answers",
                            }
                          )}
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
                        (tag) => (
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

                    <div className="flex flex-shrink-0 items-center text-xs text-gray-600">
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
                              question
                                .author?.[0]
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
                          "labels.asked",
                          {
                            ns: "questions",
                          }
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
        ref={loadMoreRef}
        className="h-20 w-full"
      />

      {loadingMore && (
        <div className="py-6 text-center text-gray-500">
          {t(
            "status.loading_more_questions",
            {
              ns: "questions",
            }
          )}
        </div>
      )}

      {!hasMore &&
        items.length > 0 && (
          <div className="py-6 text-center text-gray-400">
            {t(
              "messages.no_more_questions",
              {
                ns: "questions",
              }
            )}
          </div>
        )}
    </>
  );
};

export default QuestionFeed;