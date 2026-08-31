import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import axiosInstance from "@/lib/axiosinstance";

import type { Question } from "@/types/questions";

export interface StoredQuestion extends Partial<Question> {
  id?: string;
  title?: string;
  questionTitle?: string;
  content?: string;
  body?: string;
  tags?: string[];
  author?: string;
  authorId?: string;
  askedOn?: string;
  asked?: string;
  upvotes?: number;
  downvotes?: number;
  answers?: number;
}

export interface NormalizedQuestion {
  id: string;
  _id: string;
  title: string;
  content: string;
  tags: string[];
  author: string;
  authorId: string;
  timeAgo: string;
  votes: number;
  answers: number;
  views: number;
}

interface QuestionsResponse {
  data?: StoredQuestion[];
  pagination?: {
    nextCursor?: string | null;
    hasMore?: boolean;
  };
}

interface QuestionPageResult {
  items: NormalizedQuestion[];
  nextCursor: string | null;
  hasMore: boolean;
}

interface UseQuestionsFeedProps {
  disabled?: boolean;
}

// Normalize backend question data
export const normalizeStoredQuestion = (
  question: StoredQuestion
): NormalizedQuestion => {
  const id =
    question._id ||
    question.id;

  if (!id) {
    throw new Error(
      "Question Id is missing"
    );
  }

  const title =
    question.questiontitle ||
    question.title ||
    question.questionTitle ||
    "(no title)";

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
    "Unknown";

  const authorId =
    question.userid ||
    question.authorId ||
    "";

  let timeAgo = "just now";

  try {
    const date = new Date(
      question.askedon ||
        question.askedOn ||
        question.asked ||
        Date.now()
    );

    const difference =
      Date.now() -
      date.getTime();

    const minutes =
      Math.floor(
        difference / 60000
      );

    if (minutes <= 0) {
      timeAgo = "just now";
    } else if (minutes < 60) {
      timeAgo =
        `${minutes} mins ago`;
    } else {
      const hours =
        Math.floor(
          minutes / 60
        );

      if (hours < 24) {
        timeAgo =
          `${hours} hours ago`;
      } else {
        const days =
          Math.floor(
            hours / 24
          );

        timeAgo =
          `${days} days ago`;
      }
    }
  } catch {
    timeAgo = "just now";
  }

  const upvotes =
    Array.isArray(
      question.upvote
    )
      ? question.upvote.length
      : question.upvotes ?? 0;

  const downvotes =
    Array.isArray(
      question.downvote
    )
      ? question.downvote.length
      : question.downvotes ?? 0;

  const answers =
    question.noofanswer ??
    question.answers ??
    question.answer?.length ??
    0;

  const views =
    question.views ?? 0;

  return {
    id,
    _id: id,
    title,
    content,
    tags,
    author,
    authorId,
    timeAgo,
    votes:
      upvotes - downvotes,
    answers,
    views,
  };
};

const useQuestionsFeed = ({
  disabled = false,
}: UseQuestionsFeedProps = {}) => {
  const [
    items,
    setItems,
  ] = useState<
    NormalizedQuestion[]
  >([]);

  const [
    cursor,
    setCursor,
  ] = useState<
    string | null
  >(null);

  const [
    hasMore,
    setHasMore,
  ] = useState(true);

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    loadingMore,
    setLoadingMore,
  ] = useState(false);

  const loadMoreRef =
    useRef<HTMLDivElement | null>(
      null
    );

  const loadingMoreRef =
    useRef(false);

  // Fetch one page of questions
  const fetchPage =
    useCallback(
      async (
        cursorToUse:
          | string
          | null
      ): Promise<QuestionPageResult> => {
        const params =
          new URLSearchParams();

        params.set(
          "limit",
          "10"
        );

        if (cursorToUse) {
          params.set(
            "cursor",
            cursorToUse
          );
        }

        const response =
          await axiosInstance.get<QuestionsResponse>(
            `/question/getallquestion?${params.toString()}`
          );

        const rawItems =
          response.data.data ??
          [];

        return {
          items:
            rawItems.map(
              normalizeStoredQuestion
            ),

          nextCursor:
            response.data
              .pagination
              ?.nextCursor ??
            null,

          hasMore:
            response.data
              .pagination
              ?.hasMore ??
            false,
        };
      },
      []
    );

  // Load initial questions
  useEffect(() => {
    if (disabled) {
      setLoading(false);
      return;
    }

    let cancelled = false;

    const loadInitial =
      async (): Promise<void> => {
        setLoading(true);

        try {
          const targetQuestionId =
            sessionStorage.getItem(
              "questionSelectedId"
            );

          let allItems:
            NormalizedQuestion[] =
            [];

          let currentCursor:
            | string
            | null = null;

          let more = true;

          let foundTarget =
            !targetQuestionId;

          do {
            const result =
              await fetchPage(
                currentCursor
              );

            allItems = [
              ...allItems,
              ...result.items,
            ];

            currentCursor =
              result.nextCursor;

            more =
              result.hasMore;

            if (
              targetQuestionId &&
              result.items.some(
                (question) =>
                  question.id ===
                  targetQuestionId
              )
            ) {
              foundTarget =
                true;
            }

            if (
              !targetQuestionId
            ) {
              break;
            }
          } while (
            !foundTarget &&
            more &&
            currentCursor
          );

          if (cancelled) {
            return;
          }

          setItems(
            allItems
          );

          setCursor(
            currentCursor
          );

          setHasMore(
            more
          );

          if (
            targetQuestionId &&
            !foundTarget
          ) {
            sessionStorage.removeItem(
              "questionSelectedId"
            );

            window.scrollTo({
              top: 0,
            });
          }
        } catch (
          error: unknown
        ) {
          console.error(
            "Failed to load questions:",
            error
          );

          if (!cancelled) {
            setItems([]);
            setCursor(null);
            setHasMore(false);
          }
        } finally {
          if (!cancelled) {
            setLoading(false);
          }
        }
      };

    void loadInitial();

    return () => {
      cancelled = true;
    };
  }, [
    disabled,
    fetchPage,
  ]);

  // Load next page
  const loadMore =
    useCallback(
      async (): Promise<void> => {
        if (
          disabled ||
          loadingMoreRef.current ||
          !hasMore ||
          !cursor
        ) {
          return;
        }

        loadingMoreRef.current =
          true;

        setLoadingMore(true);

        try {
          const result =
            await fetchPage(
              cursor
            );

          setItems(
            (
              previousItems
            ) => {
              const existingIds =
                new Set(
                  previousItems.map(
                    (question) =>
                      question.id
                  )
                );

              const uniqueItems =
                result.items.filter(
                  (question) =>
                    !existingIds.has(
                      question.id
                    )
                );

              return [
                ...previousItems,
                ...uniqueItems,
              ];
            }
          );

          setCursor(
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
          loadingMoreRef.current =
            false;

          setLoadingMore(false);
        }
      },
      [
        cursor,
        disabled,
        fetchPage,
        hasMore,
      ]
    );

  // Infinite scroll
  useEffect(() => {
    if (
      disabled ||
      loading ||
      !hasMore ||
      !cursor
    ) {
      return;
    }

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
            entry?.isIntersecting
          ) {
            void loadMore();
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
      element
    );

    return () => {
      observer.disconnect();
    };
  }, [
    cursor,
    disabled,
    hasMore,
    loadMore,
    loading,
  ]);

  // Restore selected question
  useEffect(() => {
    if (
      disabled ||
      loading ||
      items.length === 0
    ) {
      return;
    }

    const targetQuestionId =
      sessionStorage.getItem(
        "questionSelectedId"
      );

    if (!targetQuestionId) {
      return;
    }

    const questionElement =
      document.getElementById(
        `question-${targetQuestionId}`
      );

    if (!questionElement) {
      return;
    }

    const timer =
      window.setTimeout(
        () => {
          questionElement.scrollIntoView(
            {
              behavior:
                "auto",
              block:
                "center",
            }
          );

          sessionStorage.removeItem(
            "questionSelectedId"
          );
        },
        300
      );

    return () => {
      window.clearTimeout(
        timer
      );
    };
  }, [
    disabled,
    items.length,
    loading,
  ]);

  return {
    items,
    setItems,
    loading,
    loadingMore,
    hasMore,
    loadMoreRef,
  };
};

export default useQuestionsFeed;