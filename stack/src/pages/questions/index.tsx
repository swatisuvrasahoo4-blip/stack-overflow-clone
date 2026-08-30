import Mainlayout from "@/layout/Mainlayout";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/router";
import SavedList from "@/components/SavedList";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import axiosInstance from "@/lib/axiosinstance";
import { useAuth } from "@/lib/AuthContext";
import React from "react";
import { useTranslation } from "react-i18next";
import type { Question } from "@/types/questions";

interface StoredQuestion extends Partial<Question> {
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

interface NormalizedQuestion {
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

interface ErrorResponse {
  message?: string;
}

interface EditQuestionResponse {
  question?: StoredQuestion;
  message?: string;
  [key: string]: unknown;
}

export default function QuestionsPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { t } = useTranslation();
  const { panel } = router.query;

  const [items, setItems] = useState<NormalizedQuestion[]>([]);

  const [showDeleteModal, setShowDeleteModal] =
    useState<boolean>(false);

  const [selectedQuestionId, setSelectedQuestionId] =
    useState<string | null>(null);

  const [showEditModal, setShowEditModal] =
    useState<boolean>(false);

  const [selectedQuestion, setSelectedQuestion] =
    useState<NormalizedQuestion | null>(null);

  const [editTitle, setEditTitle] = useState<string>("");
  const [editContent, setEditContent] = useState<string>("");
  const [editTags, setEditTags] = useState<string[]>([]);
  const [editTagInput, setEditTagInput] = useState<string>("");

  const [cursor, setCursor] =
    useState<string | null>(null);

  const [hasMore, setHasMore] =
    useState<boolean>(true);

  const [loading, setLoading] =
    useState<boolean>(true);

  const [loadingMore, setLoadingMore] =
    useState<boolean>(false);

  const loadMoreRef =
    useRef<HTMLDivElement | null>(null);

  const loadingMoreRef =
    useRef<boolean>(false);

  const normalizeStoredQuestion = (
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

    const timeAgo = (() => {
      try {
        const date =
          new Date(
            question.askedon ||
              question.askedOn ||
              question.asked ||
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
          Math.floor(
            mins / 60
          );

        if (hours < 24) {
          return `${hours} hours ago`;
        }

        const days =
          Math.floor(
            hours / 24
          );

        return `${days} days ago`;
      } catch {
        return "just now";
      }
    })();

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

    const votes =
      upvotes - downvotes;

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
      votes,
      answers,
      views,
    };
  };

  const fetchPage = async (
    cursorToUse: string | null
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

    console.log(
      "Fetching:",
      `/question/getallquestion?${params.toString()}`
    );

    const res =
      await axiosInstance.get<QuestionsResponse>(
        `/question/getallquestion?${params.toString()}`
      );

    const rawItems =
      res.data.data ?? [];

    const newItems =
      rawItems.map(
        (
          question: StoredQuestion
        ) =>
          normalizeStoredQuestion(
            question
          )
      );

    console.log(
      "Received:",
      newItems.length
    );

    console.log(
      "nextCursor:",
      res.data.pagination
        ?.nextCursor
    );

    console.log(
      "hasMore:",
      res.data.pagination
        ?.hasMore
    );

    return {
      items: newItems,

      nextCursor:
        res.data.pagination
          ?.nextCursor ??
        null,

      hasMore:
        res.data.pagination
          ?.hasMore ??
        false,
    };
  };

  useEffect(() => {
    let cancelled = false;

    const loadInitial =
      async (): Promise<void> => {
        setLoading(true);

        try {
          const targetQuestionId =
            sessionStorage.getItem(
              "questionSelectedId"
            );

          let allItems: NormalizedQuestion[] =
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
                (
                  question: NormalizedQuestion
                ) =>
                  question.id ===
                  targetQuestionId
              )
            ) {
              foundTarget = true;
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
        } catch (error: unknown) {
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
  }, []);

  const loadMore =
    useCallback(
      async (): Promise<void> => {
        if (
          loadingMoreRef.current
        ) {
          return;
        }

        if (!hasMore) {
          return;
        }

        if (!cursor) {
          console.log(
            "No cursor available"
          );
          return;
        }

        loadingMoreRef.current =
          true;

        setLoadingMore(true);

        console.log(
          "Loading more with cursor:",
          cursor
        );

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
                    (
                      question
                    ) =>
                      question.id
                  )
                );

              const uniqueItems =
                result.items.filter(
                  (
                    question: NormalizedQuestion
                  ) =>
                    !existingIds.has(
                      question.id
                    )
                );

              console.log(
                "Adding:",
                uniqueItems.length
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
        } catch (error: unknown) {
          console.error(
            "Failed to load more questions:",
            error
          );
        } finally {
          loadingMoreRef.current =
            false;

          setLoadingMore(
            false
          );
        }
      },
      [
        cursor,
        hasMore,
      ]
    );

  useEffect(() => {
    if (
      panel === "saves"
    ) {
      return;
    }

    if (loading) {
      return;
    }

    const element =
      loadMoreRef.current;

    if (!element) {
      console.log(
        "❌ Sentinel element not found"
      );
      return;
    }

    if (!hasMore) {
      console.log(
        "No more questions"
      );
      return;
    }

    if (!cursor) {
      console.log(
        "Cursor not available yet"
      );
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
    panel,
    loading,
    cursor,
    hasMore,
    loadMore,
  ]);

  useEffect(() => {
    if (loading) {
      return;
    }

    if (
      items.length === 0
    ) {
      return;
    }

    const targetQuestionId =
      sessionStorage.getItem(
        "questionSelectedId"
      );

    if (
      !targetQuestionId
    ) {
      return;
    }

    const questionElement =
      document.getElementById(
        `question-${targetQuestionId}`
      );

    if (
      !questionElement
    ) {
      return;
    }

    const timer =
      setTimeout(() => {
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
      }, 300);

    return () => {
      clearTimeout(
        timer
      );
    };
  }, [
    loading,
    items.length,
  ]);

  const handleDelete =
    async (
      questionId: string
    ): Promise<void> => {
      try {
        const token =
          user?.token;

        const response =
          await fetch(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/question/delete/${questionId}`,
            {
              method:
                "DELETE",

              headers: {
                Authorization:
                  `Bearer ${token}`,
              },
            }
          );

        if (
          !response.ok
        ) {
          const errorData =
            (await response.json()) as ErrorResponse;

          throw new Error(
            errorData.message ||
              "Failed to delete question"
          );
        }

        setItems(
          (
            previousItems
          ) =>
            previousItems.filter(
              (
                question
              ) =>
                question.id !==
                questionId
            )
        );
      } catch (error: unknown) {
        alert(
          error instanceof Error
            ? error.message
            : t(
                "alert.something_went_wrong_while_deleting"
              )
        );
      }
    };

  const handleEdit =
    async (): Promise<void> => {
      if (
        !selectedQuestion
      ) {
        return;
      }

      try {
        const token =
          user?.token;

        const questionId =
          selectedQuestion.id;

        const response =
          await fetch(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/question/edit/${questionId}`,
            {
              method:
                "PATCH",

              headers: {
                "Content-Type":
                  "application/json",

                Authorization:
                  `Bearer ${token}`,
              },

              body:
                JSON.stringify(
                  {
                    questiontitle:
                      editTitle,

                    questionbody:
                      editContent,

                    questiontags:
                      editTags,
                  }
                ),
            }
          );

        const data =
          (await response.json()) as EditQuestionResponse;

        if (
          !response.ok
        ) {
          throw new Error(
            data.message ||
              "Failed to edit question"
          );
        }

        const rawUpdatedQuestion =
          data.question
            ? data.question
            : (data as StoredQuestion);

        const updatedQuestion =
          normalizeStoredQuestion(
            rawUpdatedQuestion
          );

        setItems(
          (
            previousItems
          ) =>
            previousItems.map(
              (
                question
              ) =>
                question.id ===
                questionId
                  ? updatedQuestion
                  : question
            )
        );

        setShowEditModal(
          false
        );

        setSelectedQuestion(
          null
        );
      } catch (error: unknown) {
        alert(
          error instanceof Error
            ? error.message
            : t(
                "alert.something_went_wrong_while_editing"
              )
        );
      }
    };

  const addEditTag =
    (): void => {
      const newTag =
        editTagInput.trim();

      if (!newTag) {
        return;
      }

      if (
        editTags.includes(
          newTag
        )
      ) {
        return;
      }

      if (
        editTags.length >= 5
      ) {
        return;
      }

      setEditTags(
        (
          previousTags
        ) => [
          ...previousTags,
          newTag,
        ]
      );

      setEditTagInput(
        ""
      );
    };

  const removeEditTag =
    (
      tagToRemove: string
    ): void => {
      setEditTags(
        (
          previousTags
        ) =>
          previousTags.filter(
            (
              tag
            ) =>
              tag !==
              tagToRemove
          )
      );
    };

  const handleEditTagKeyDown =
    (
      e: React.KeyboardEvent<HTMLInputElement>
    ): void => {
      if (
        e.key === "Enter"
      ) {
        e.preventDefault();

        addEditTag();
      }
    };

  return (
    <Mainlayout>
      <main className="min-w-0 p-4 lg:p-6">
        <div className="mb-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-xl font-semibold lg:text-2xl">
              {t(
                "community.allQuestions"
              )}
            </h1>

            <p className="mt-1 text-sm text-gray-600">
              {t(
                "community.browseTheLatestQuestionsFromTheCommunity"
              )}
            </p>
          </div>

          {panel !==
            "saves" && (
            <button
              type="button"
              onClick={() => {
                if (user) {
                  void router.push(
                    "/ask"
                  );
                } else {
                  void router.push(
                    "/auth"
                  );
                }
              }}
              className="whitespace-nowrap rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              {t(
                "community.askQuestion"
              )}
            </button>
          )}
        </div>

        {panel ===
        "saves" ? (
          <SavedList />
        ) : loading ? (
          <div className="py-10 text-center text-gray-500">
            {t(
              "feed.loading_questions"
            )}
          </div>
        ) : (
          <>
            <div className="space-y-4">
              {items.map(
                (
                  question
                ) => (
                  <div
                    key={
                      question.id
                    }
                    id={`question-${question.id}`}
                    onClick={() => {
                      sessionStorage.setItem(
                        "questionSelectedId",
                        question.id
                      );

                      void router.push(
                        `/questions/${question.id}`
                      );
                    }}
                    className="cursor-pointer rounded-lg border bg-white p-4 shadow-sm transition-shadow hover:shadow-md"
                  >
                    <div className="flex flex-col gap-3 sm:flex-row sm:justify-between">
                      <Link
                        href={`/questions/${question.id}`}
                        onClick={(
                          e
                        ) => {
                          e.stopPropagation();

                          sessionStorage.setItem(
                            "questionSelectedId",
                            question.id
                          );
                        }}
                        className="text-blue-600 hover:underline"
                      >
                        {
                          question.title
                        }
                      </Link>

                      <div className="text-sm text-gray-600">
                        {
                          question.answers
                        }{" "}
                        {t(
                          "community.answers"
                        )}{" "}
                        ·{" "}
                        {
                          question.views
                        }{" "}
                        {t(
                          "community.views"
                        )}
                      </div>
                    </div>

                    <p className="mt-2 line-clamp-2 text-gray-700">
                      {
                        question.content
                      }
                    </p>

                    {question.authorId ===
                      user?._id && (
                      <div className="mt-3 flex gap-2">
                        <button
                          type="button"
                          onClick={(
                            e
                          ) => {
                            e.stopPropagation();

                            setSelectedQuestion(
                              question
                            );

                            setEditTitle(
                              question.title
                            );

                            setEditContent(
                              question.content
                            );

                            setEditTags(
                              question.tags
                            );

                            setShowEditModal(
                              true
                            );
                          }}
                          className="text-sm text-blue-600 transition hover:underline"
                        >
                          {t(
                            "community.edit"
                          )}
                        </button>

                        <button
                          type="button"
                          onClick={(
                            e
                          ) => {
                            e.stopPropagation();

                            setSelectedQuestionId(
                              question.id
                            );

                            setShowDeleteModal(
                              true
                            );
                          }}
                          className="text-sm text-red-600 transition hover:underline"
                        >
                          {t(
                            "community.delete"
                          )}
                        </button>
                      </div>
                    )}

                    <div className="mt-3 flex flex-wrap gap-2">
                      {question.tags.map(
                        (
                          tag
                        ) => (
                          <Badge
                            key={
                              tag
                            }
                            variant="secondary"
                            className="bg-blue-100 text-blue-800"
                          >
                            {
                              tag
                            }
                          </Badge>
                        )
                      )}
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
        )}
      </main>

      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="w-350px rounded-xl bg-white p-6 shadow-xl">
            <h2 className="text-lg font-semibold">
              Delete Question
            </h2>

            <p className="mt-2 text-gray-600">
              Are you sure you
              want to delete this
              question?
            </p>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => {
                  setShowDeleteModal(
                    false
                  );

                  setSelectedQuestionId(
                    null
                  );
                }}
                className="rounded-lg border px-4 py-2 hover:bg-gray-100"
              >
                No
              </button>

              <button
                type="button"
                onClick={() => {
                  if (
                    selectedQuestionId
                  ) {
                    void handleDelete(
                      selectedQuestionId
                    );
                  }

                  setShowDeleteModal(
                    false
                  );

                  setSelectedQuestionId(
                    null
                  );
                }}
                className="rounded-lg bg-red-600 px-4 py-2 text-white hover:bg-red-700"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {showEditModal &&
        selectedQuestion && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="w-[90%] max-w-lg rounded-xl bg-white p-6 shadow-xl">
              <h2 className="text-lg font-semibold">
                {t(
                  "editquestion.edit_question"
                )}
              </h2>

              <div className="mt-4">
                <label className="text-sm font-medium">
                  {t(
                    "editquestion.title"
                  )}
                </label>

                <input
                  type="text"
                  value={
                    editTitle
                  }
                  onChange={(
                    e
                  ) =>
                    setEditTitle(
                      e.target
                        .value
                    )
                  }
                  className="mt-1 w-full rounded-lg border px-3 py-2 outline-none focus:border-blue-500"
                />
              </div>

              <div className="mt-4">
                <label className="text-sm font-medium">
                  {t(
                    "editquestion.question"
                  )}
                </label>

                <textarea
                  value={
                    editContent
                  }
                  onChange={(
                    e
                  ) =>
                    setEditContent(
                      e.target
                        .value
                    )
                  }
                  rows={5}
                  className="mt-1 w-full resize-none rounded-lg border px-3 py-2 outline-none focus:border-blue-500"
                />
              </div>

              <div className="mb-3 mt-4">
                <label className="mb-2 block text-sm font-medium">
                  {t(
                    "editquestion.tags_maximum_5"
                  )}
                </label>

                <div className="flex gap-2">
                  <input
                    type="text"
                    value={
                      editTagInput
                    }
                    onChange={(
                      e
                    ) =>
                      setEditTagInput(
                        e.target
                          .value
                      )
                    }
                    onKeyDown={
                      handleEditTagKeyDown
                    }
                    placeholder={t(
                      "editquestion.enter_a_tag"
                    )}
                    className="flex-1 rounded-lg border px-3 py-2"
                  />

                  <button
                    type="button"
                    onClick={
                      addEditTag
                    }
                    className="rounded-lg bg-blue-600 px-4 text-white hover:bg-blue-700"
                  >
                    +
                  </button>
                </div>

                <div className="mt-3 flex flex-wrap gap-2">
                  {editTags.map(
                    (
                      tag
                    ) => (
                      <span
                        key={
                          tag
                        }
                        className="inline-flex w-fit items-center rounded bg-blue-100 px-2 py-1 text-sm text-blue-800"
                      >
                        {
                          tag
                        }

                        <button
                          type="button"
                          onClick={() =>
                            removeEditTag(
                              tag
                            )
                          }
                          className="ml-2 text-red-500 hover:text-red-700"
                        >
                          ×
                        </button>
                      </span>
                    )
                  )}
                </div>
              </div>

              <div className="mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowEditModal(
                      false
                    );

                    setSelectedQuestion(
                      null
                    );
                  }}
                  className="rounded-lg border px-4 py-2 hover:bg-gray-100"
                >
                  {t(
                    "editquestion.cancel"
                  )}
                </button>

                <button
                  type="button"
                  onClick={() =>
                    void handleEdit()
                  }
                  className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                >
                  {t(
                    "editquestion.save_changes"
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
    </Mainlayout>
  );
}