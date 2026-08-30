import Mainlayout from "@/layout/Mainlayout";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/router";
import SavedList from "@/components/SavedList";
import { useEffect, useState, useRef, useCallback } from "react";
import axiosInstance from "@/lib/axiosinstance";
import { useAuth } from "@/lib/AuthContext";
import React from "react";
import { useTranslation } from "react-i18next";

export default function QuestionsPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { t } = useTranslation();
  const { panel } = router.query;

  const [items, setItems] = useState<any[]>([]);

  const [showDeleteModal, setShowDeleteModal] =
    useState(false);

  const [selectedQuestionId, setSelectedQuestionId] =
    useState<string | null>(null);

  const [showEditModal, setShowEditModal] =
    useState(false);

  const [selectedQuestion, setSelectedQuestion] =
    useState<any>(null);

  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");
  const [editTags, setEditTags] = useState<string[]>([]);
  const [editTagInput, setEditTagInput] = useState("");

  // --------------------------------------------------
  // CURSOR PAGINATION
  // --------------------------------------------------

  const [cursor, setCursor] =
    useState<string | null>(null);

  const [hasMore, setHasMore] =
    useState(true);

  const [loading, setLoading] =
    useState(true);

  const [loadingMore, setLoadingMore] =
    useState(false);

  // Sentinel element
  const loadMoreRef =
    useRef<HTMLDivElement | null>(null);

  // Prevent multiple simultaneous requests
  const loadingMoreRef =
    useRef(false);

  // --------------------------------------------------
  // NORMALIZE QUESTION
  // --------------------------------------------------

  function normalizeStoredQuestion(s: any) {
    const id = s._id || s.id;

    if (!id) {
      throw new Error("Question Id is missing");
    }

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
      "Unknown";

    const authorId =
      s.userid ||
      s.authorId ||
      "";

    const timeAgo = (() => {
      try {
        const d = new Date(
          s.askedon ||
            s.askedOn ||
            s.asked ||
            Date.now()
        );

        const diff =
          Date.now() - d.getTime();

        const mins =
          Math.floor(diff / 60000);

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
  }

  // --------------------------------------------------
  // FETCH PAGE
  // --------------------------------------------------

  const fetchPage = async (
    cursorToUse: string | null
  ) => {
    const params = new URLSearchParams();

    params.set("limit", "10");

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
      await axiosInstance.get(
        `/question/getallquestion?${params.toString()}`
      );

    const rawItems =
      res.data?.data || [];

    const newItems =
      rawItems.map((q: any) =>
        normalizeStoredQuestion(q)
      );

    console.log(
      "Received:",
      newItems.length
    );

    console.log(
      "nextCursor:",
      res.data?.pagination?.nextCursor
    );

    console.log(
      "hasMore:",
      res.data?.pagination?.hasMore
    );

    return {
      items: newItems,

      nextCursor:
        res.data?.pagination
          ?.nextCursor ?? null,

      hasMore:
        res.data?.pagination
          ?.hasMore ?? false,
    };
  };

  // --------------------------------------------------
  // INITIAL LOAD
  // --------------------------------------------------

  useEffect(() => {
    let cancelled = false;

    const loadInitial = async () => {
      setLoading(true);

      try {
        const targetQuestionId =
          sessionStorage.getItem(
            "questionSelectedId"
          );

        /*
         * Normal first visit:
         * load only first page.
         *
         * Returning from a question:
         * load pages until target question
         * is found.
         */

        let allItems: any[] = [];

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
              (question: any) =>
                question.id ===
                targetQuestionId
            )
          ) {
            foundTarget = true;
          }

          if (!targetQuestionId) {
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

        setItems(allItems);

        setCursor(
          currentCursor
        );

        setHasMore(more);

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

      } catch (error) {
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

    loadInitial();

    return () => {
      cancelled = true;
    };
  }, []);

  // --------------------------------------------------
  // LOAD MORE
  // --------------------------------------------------

  const loadMore =
    useCallback(async () => {
      if (loadingMoreRef.current) {
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
          await fetchPage(cursor);

        setItems(
          (previousItems) => {
            const existingIds =
              new Set(
                previousItems.map(
                  (question) =>
                    question.id
                )
              );

            const uniqueItems =
              result.items.filter(
                (question: any) =>
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

      } catch (error) {
        console.error(
          "Failed to load more questions:",
          error
        );
      } finally {
        loadingMoreRef.current =
          false;

        setLoadingMore(false);
      }
    }, [
      cursor,
      hasMore,
    ]);

  // --------------------------------------------------
  // INFINITE SCROLL
  // --------------------------------------------------

  useEffect(() => {
    if (panel === "saves") {
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

    console.log(
      "✅ Observer created"
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
              "🔥 Sentinel visible"
            );

            loadMore();
          }
        },
        {
          root: null,

          /*
           * Start loading before the
           * sentinel reaches the screen.
           */
          rootMargin:
            "600px 0px",

          threshold: 0,
        }
      );

    observer.observe(element);

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

  // --------------------------------------------------
  // RESTORE QUESTION POSITION
  // --------------------------------------------------

  useEffect(() => {
    if (loading) {
      return;
    }

    if (items.length === 0) {
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
      setTimeout(() => {
        questionElement.scrollIntoView({
          behavior: "auto",
          block: "center",
        });

        sessionStorage.removeItem(
          "questionSelectedId"
        );
      }, 300);

    return () =>
      clearTimeout(timer);
  }, [
    loading,
    items.length,
  ]);

  // --------------------------------------------------
  // DELETE
  // --------------------------------------------------

  const handleDelete =
    async (
      questionId: string
    ) => {
      try {
        const token =
          user?.token;

        const response =
          await fetch(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/question/delete/${questionId}`,
            {
              method: "DELETE",

              headers: {
                Authorization:
                  `Bearer ${token}`,
              },
            }
          );

        if (!response.ok) {
          const errorData =
            await response.json();

          throw new Error(
            errorData.message ||
              "Failed to delete question"
          );
        }

        setItems(
          (previousItems) =>
            previousItems.filter(
              (question) =>
                (question._id ||
                  question.id) !==
                questionId
            )
        );

      } catch (error) {
        alert(
          error instanceof Error
            ? error.message
            : t(
                "alert.something_went_wrong_while_deleting"
              )
        );
      }
    };

  // --------------------------------------------------
  // EDIT
  // --------------------------------------------------

  const handleEdit =
    async () => {
      if (!selectedQuestion) {
        return;
      }

      try {
        const token =
          user?.token;

        const questionId =
          selectedQuestion._id ||
          selectedQuestion.id;

        const response =
          await fetch(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/question/edit/${questionId}`,
            {
              method: "PATCH",

              headers: {
                "Content-Type":
                  "application/json",

                Authorization:
                  `Bearer ${token}`,
              },

              body: JSON.stringify({
                questiontitle:
                  editTitle,

                questionbody:
                  editContent,

                questiontags:
                  editTags,
              }),
            }
          );

        const data =
          await response.json();

        if (!response.ok) {
          throw new Error(
            data.message ||
              "Failed to edit question"
          );
        }

        const updatedQuestion =
          normalizeStoredQuestion(
            data.question ||
              data
          );

        setItems(
          (previousItems) =>
            previousItems.map(
              (question) =>
                (question._id ||
                  question.id) ===
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

      } catch (error) {
        alert(
          error instanceof Error
            ? error.message
            : t(
                "alert.something_went_wrong_while_editing"
              )
        );
      }
    };

  // --------------------------------------------------
  // TAGS
  // --------------------------------------------------

  const addEditTag =
    () => {
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

      setEditTags([
        ...editTags,
        newTag,
      ]);

      setEditTagInput("");
    };

  const removeEditTag =
    (
      tagToRemove: string
    ) => {
      setEditTags(
        editTags.filter(
          (tag) =>
            tag !==
            tagToRemove
        )
      );
    };

  const handleEditTagKeyDown =
    (
      e: React.KeyboardEvent<HTMLInputElement>
    ) => {
      if (e.key === "Enter") {
        e.preventDefault();

        addEditTag();
      }
    };

  // --------------------------------------------------
  // UI
  // --------------------------------------------------

  return (
    <Mainlayout>
      <main className="min-w-0 p-4 lg:p-6">

        {/* HEADER */}

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">

          <div>
            <h1 className="text-xl lg:text-2xl font-semibold">
              {t(
                "community.allQuestions"
              )}
            </h1>

            <p className="text-sm text-gray-600 mt-1">
              {t(
                "community.browseTheLatestQuestionsFromTheCommunity"
              )}
            </p>
          </div>

          {panel !==
            "saves" && (
            <button
              onClick={() => {
                if (user) {
                  router.push(
                    "/ask"
                  );
                } else {
                  router.push(
                    "/auth"
                  );
                }
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm font-medium whitespace-nowrap"
            >
              {t(
                "community.askQuestion"
              )}
            </button>
          )}

        </div>

        {/* QUESTION LIST */}

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
                (question) => (
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

                      router.push(
                        `/questions/${question.id}`
                      );
                    }}
                    className="border rounded-lg bg-white p-4 shadow-sm cursor-pointer hover:shadow-md transition-shadow"
                  >

                    {/* QUESTION HEADER */}

                    <div className="flex flex-col sm:flex-row sm:justify-between gap-3">

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

                    {/* CONTENT */}

                    <p className="text-gray-700 mt-2 line-clamp-2">
                      {
                        question.content
                      }
                    </p>

                    {/* EDIT / DELETE */}

                    {question.authorId ===
                      user?._id && (
                      <div className="flex gap-2 mt-3">

                        <button
                          onClick={(
                            e
                          ) => {
                            e.stopPropagation();

                            setSelectedQuestion(
                              question
                            );

                            setEditTitle(
                              question.title ||
                                ""
                            );

                            setEditContent(
                              question.content ||
                                ""
                            );

                            setEditTags(
                              Array.isArray(
                                question.tags
                              )
                                ? question.tags
                                : []
                            );

                            setShowEditModal(
                              true
                            );
                          }}
                          className="text-blue-600 text-sm hover:underline transition"
                        >
                          {t(
                            "community.edit"
                          )}
                        </button>

                        <button
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
                          className="text-red-600 text-sm hover:underline transition"
                        >
                          {t(
                            "community.delete"
                          )}
                        </button>

                      </div>
                    )}

                    {/* TAGS */}

                    <div className="mt-3 flex flex-wrap gap-2">

                      {(
                        question.tags ||
                        []
                      ).map(
                        (
                          tag: string
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

            {/* -------------------------------- */}
            {/* INFINITE SCROLL SENTINEL          */}
            {/* -------------------------------- */}

            <div
              ref={
                loadMoreRef
              }
              className="w-full h-20"
            />

            {loadingMore && (
              <div className="py-6 text-center text-gray-500">
                Loading more questions...
              </div>
            )}

            {!hasMore &&
              items.length >
                0 && (
                <div className="py-6 text-center text-gray-400">
                  No more questions.
                </div>
              )}

          </>
        )}

      </main>

      {/* DELETE MODAL */}

      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">

          <div className="w-350px rounded-xl bg-white p-6 shadow-xl">

            <h2 className="text-lg font-semibold">
              Delete Question
            </h2>

            <p className="mt-2 text-gray-600">
              Are you sure you want to delete this question?
            </p>

            <div className="mt-6 flex justify-end gap-3">

              <button
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
                onClick={() => {
                  if (
                    selectedQuestionId
                  ) {
                    handleDelete(
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

      {/* EDIT MODAL */}

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
                      e.target.value
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
                      e.target.value
                    )
                  }
                  rows={5}
                  className="mt-1 w-full resize-none rounded-lg border px-3 py-2 outline-none focus:border-blue-500"
                />

              </div>

              <div className="mb-3">

                <label className="block text-sm font-medium mb-2">
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
                        e.target.value
                      )
                    }
                    onKeyDown={
                      handleEditTagKeyDown
                    }
                    placeholder={t(
                      "editquestion.enter_a_tag"
                    )}
                    className="flex-1 border rounded-lg px-3 py-2"
                  />

                  <button
                    type="button"
                    onClick={
                      addEditTag
                    }
                    className="bg-blue-600 text-white px-4 rounded-lg hover:bg-blue-700"
                  >
                    +
                  </button>

                </div>

                <div className="flex flex-wrap gap-2 mt-3">

                  {editTags.map(
                    (
                      tag
                    ) => (
                      <span
                        key={
                          tag
                        }
                        className="inline-flex items-center bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm w-fit"
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
                  onClick={
                    handleEdit
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