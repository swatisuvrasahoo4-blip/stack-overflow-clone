import { useState } from "react";

import { useRouter } from "next/router";
import { useTranslation } from "react-i18next";

import SavedList from "@/components/saved/SavedList";
import DeleteQuestionModal from "@/components/question/list/DeleteQuestionModal";
import EditQuestionModal from "@/components/question/list/EditQuestionModal";
import QuestionList from "@/components/question/list/QuestionList";

import useQuestionsFeed, {
  normalizeStoredQuestion,
} from "@/hooks/useQuestionsFeed";

import type {
  NormalizedQuestion,
  StoredQuestion,
} from "@/hooks/useQuestionsFeed";

import Mainlayout from "@/layout/Mainlayout";

import { useAuth } from "@/lib/AuthContext";

interface ErrorResponse {
  message?: string;
}

interface EditQuestionResponse {
  question?: StoredQuestion;
  message?: string;
  [key: string]: unknown;
}

const QuestionsPage = () => {
  const router = useRouter();
  const { user } = useAuth();
  const { t } = useTranslation();

  const { panel } = router.query;

  const showingSaved =
    panel === "saves";

  // Questions feed
  const {
    items,
    setItems,
    loading,
    loadingMore,
    hasMore,
    loadMoreRef,
  } = useQuestionsFeed({
    disabled: showingSaved,
  });

  // Delete state
  const [
    showDeleteModal,
    setShowDeleteModal,
  ] = useState(false);

  const [
    selectedQuestionId,
    setSelectedQuestionId,
  ] = useState<string | null>(
    null
  );

  // Edit state
  const [
    showEditModal,
    setShowEditModal,
  ] = useState(false);

  const [
    selectedQuestion,
    setSelectedQuestion,
  ] =
    useState<NormalizedQuestion | null>(
      null
    );

  const [
    editTitle,
    setEditTitle,
  ] = useState("");

  const [
    editContent,
    setEditContent,
  ] = useState("");

  const [
    editTags,
    setEditTags,
  ] = useState<string[]>([]);

  const [
    editTagInput,
    setEditTagInput,
  ] = useState("");

  // Delete question
  const handleDelete = async (
    questionId: string
  ): Promise<void> => {
    try {
      const token = user?.token;

      const response = await fetch(
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
          (await response.json()) as ErrorResponse;

        throw new Error(
          errorData.message ||
            "Failed to delete question"
        );
      }

      setItems(
        (previousItems) =>
          previousItems.filter(
            (question) =>
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

  // Confirm question deletion
  const confirmDelete =
    async (): Promise<void> => {
      if (!selectedQuestionId) {
        return;
      }

      await handleDelete(
        selectedQuestionId
      );

      setShowDeleteModal(false);
      setSelectedQuestionId(null);
    };

  // Close delete modal
  const closeDeleteModal =
    (): void => {
      setShowDeleteModal(false);
      setSelectedQuestionId(null);
    };

  // Edit question
  const handleEdit =
    async (): Promise<void> => {
      if (!selectedQuestion) {
        return;
      }

      try {
        const token = user?.token;

        const questionId =
          selectedQuestion.id;

        const response = await fetch(
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
          (await response.json()) as EditQuestionResponse;

        if (!response.ok) {
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
          (previousItems) =>
            previousItems.map(
              (question) =>
                question.id ===
                questionId
                  ? updatedQuestion
                  : question
            )
        );

        closeEditModal();
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

  // Close edit modal
  const closeEditModal =
    (): void => {
      setShowEditModal(false);
      setSelectedQuestion(null);
      setEditTagInput("");
    };

  // Open ask question page
  const handleAskQuestion =
    (): void => {
      if (user) {
        void router.push("/ask");
        return;
      }

      void router.push("/auth");
    };

  return (
    <Mainlayout>
      <main className="min-w-0 p-4 lg:p-6">
        {/* Page header */}
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

          {!showingSaved && (
            <button
              type="button"
              onClick={
                handleAskQuestion
              }
              className="whitespace-nowrap rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              {t(
                "community.askQuestion"
              )}
            </button>
          )}
        </div>

        {/* Saved items */}
        {showingSaved ? (
          <SavedList />
        ) : loading ? (
          /* Loading state */
          <div className="py-10 text-center text-gray-500">
            {t(
              "feed.loading_questions"
            )}
          </div>
        ) : (
          <>
            {/* Question list */}
            <QuestionList
              items={items}
              user={user}
              setSelectedQuestion={
                setSelectedQuestion
              }
              setEditTitle={
                setEditTitle
              }
              setEditContent={
                setEditContent
              }
              setEditTags={
                setEditTags
              }
              setShowEditModal={
                setShowEditModal
              }
              setSelectedQuestionId={
                setSelectedQuestionId
              }
              setShowDeleteModal={
                setShowDeleteModal
              }
            />

            {/* Infinite scroll trigger */}
            <div
              ref={loadMoreRef}
              className="h-20 w-full"
            />

            {/* Loading more */}
            {loadingMore && (
              <div className="py-6 text-center text-gray-500">
                Loading more
                questions...
              </div>
            )}

            {/* End of questions */}
            {!hasMore &&
              items.length > 0 && (
                <div className="py-6 text-center text-gray-400">
                  No more questions.
                </div>
              )}
          </>
        )}
      </main>

      {/* Delete question modal */}
      <DeleteQuestionModal
        open={showDeleteModal}
        onClose={
          closeDeleteModal
        }
        onConfirm={
          confirmDelete
        }
      />

      {/* Edit question modal */}
      <EditQuestionModal
        open={
          showEditModal &&
          selectedQuestion !== null
        }
        editTitle={editTitle}
        setEditTitle={
          setEditTitle
        }
        editContent={
          editContent
        }
        setEditContent={
          setEditContent
        }
        editTags={editTags}
        setEditTags={
          setEditTags
        }
        editTagInput={
          editTagInput
        }
        setEditTagInput={
          setEditTagInput
        }
        onClose={
          closeEditModal
        }
        onSave={
          handleEdit
        }
      />
    </Mainlayout>
  );
};

export default QuestionsPage;