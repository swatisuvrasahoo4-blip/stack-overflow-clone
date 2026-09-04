import { useState } from "react";

import { useRouter } from "next/router";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";

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
import axiosInstance from "@/lib/axiosinstance";

interface EditQuestionResponse {
  question?: StoredQuestion;
  message?: string;
  [key: string]: unknown;
}

interface QuestionLimitResponse {
  success: boolean;
  allowed: boolean;
  plan: string;
  limit: number | null;
  totalQuestions: number;
}

const QuestionsPage = () => {
  const router = useRouter();
  const { user } = useAuth();
  const { t } = useTranslation("questions");

  const { panel } = router.query;
  const showingSaved = panel === "saves";

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
  ] = useState<string | null>(null);

  // Edit state
  const [
    showEditModal,
    setShowEditModal,
  ] = useState(false);

  const [
    selectedQuestion,
    setSelectedQuestion,
  ] = useState<NormalizedQuestion | null>(
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

      await axiosInstance.delete(
        `/question/delete/${questionId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setItems((previousItems) =>
        previousItems.filter(
          (question) =>
            question.id !== questionId
        )
      );
    } catch (error: unknown) {
      console.error(
        "Failed to delete question:",
        error
      );

      alert(
        t(
          "messages.failed_to_delete_question"
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

        const response =
          await axiosInstance.patch<EditQuestionResponse>(
            `/question/edit/${questionId}`,
            {
              questiontitle:
                editTitle,
              questionbody:
                editContent,
              questiontags:
                editTags,
            },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

        const data = response.data;

        const rawUpdatedQuestion =
          data.question
            ? data.question
            : (data as StoredQuestion);

        const updatedQuestion =
          normalizeStoredQuestion(
            rawUpdatedQuestion
          );

        setItems((previousItems) =>
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
        console.error(
          "Failed to edit question:",
          error
        );

        alert(
          t(
            "messages.failed_to_edit_question"
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
    async (): Promise<void> => {
      if (!user) {
        void router.push("/auth");
        return;
      }

      try {
        const response =
          await axiosInstance.get<QuestionLimitResponse>(
            "/question/limit/status"
          );

        const {
          allowed,
          plan,
          limit,
        } = response.data;

        if (!allowed) {
          toast.error(
            t(
              "messages.question_limit_reached",
              {
                plan,
                limit,
              }
            )
          );

          return;
        }

        void router.push("/ask");
      } catch (error: unknown) {
        console.error(
          "Failed to check question limit:",
          error
        );

        toast.error(
          t(
            "ask_question.something_went_wrong"
          )
        );
      }
    };

  return (
    <Mainlayout>
      <main className="min-w-0 p-4 lg:p-6">
        {/* Page header */}
        <div className="mb-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-xl font-semibold lg:text-2xl">
              {t(
                "labels.all_questions"
              )}
            </h1>

            <p className="mt-1 text-sm text-gray-600">
              {t(
                "messages.browse_the_latest_questions_from_the_community"
              )}
            </p>
          </div>

          {!showingSaved && (
            <button
              type="button"
              onClick={() =>
                void handleAskQuestion()
              }
              className="whitespace-nowrap rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              {t(
                "actions.ask_question"
              )}
            </button>
          )}
        </div>

        {/* Saved items */}
        {showingSaved ? (
          <SavedList />
        ) : loading ? (
          <div className="py-10 text-center text-gray-500">
            {t(
              "status.loading_questions"
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
                {t(
                  "status.loading_more_questions"
                )}
              </div>
            )}

            {/* End of questions */}
            {!hasMore &&
              items.length > 0 && (
                <div className="py-6 text-center text-gray-400">
                  {t(
                    "messages.no_more_questions"
                  )}
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
        onSave={handleEdit}
      />
    </Mainlayout>
  );
};

export default QuestionsPage;