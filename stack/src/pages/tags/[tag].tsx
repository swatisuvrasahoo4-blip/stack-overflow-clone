import {
  useEffect,
  useState,
} from "react";

import { useRouter } from "next/router";
import { useTranslation } from "react-i18next";

import Mainlayout from "@/layout/Mainlayout";

import { useAuth } from "@/lib/AuthContext";

import PostCard from "@/components/community/PostCard/PostCard";
import TagQuestionList from "@/components/tags/TagQuestionList";

import DeletePostModal from "@/components/community/modals/DeletePostModal";
import DeleteCommentModal from "@/components/community/modals/DeleteCommentModal";
import DeleteReplyModal from "@/components/community/modals/DeleteReplyModal";

import {
  getTagContent,
  type TagPagination,
  type TagQuestion,
} from "@/components/services/tagService";

import usePostActions from "@/hooks/usePostActions";
import useEditPostState from "@/hooks/useEditPostState";
import usePostDelete from "@/hooks/usePostDelete";

import type { Post } from "@/types/community";

const DEFAULT_PAGINATION: TagPagination = {
  currentPage: 1,
  totalPages: 0,
  totalQuestions: 0,
  limit: 5,
  hasNextPage: false,
  hasPreviousPage: false,
};

const TagDetailPage = () => {
  const router = useRouter();

  const { t } = useTranslation("tag");

  const { tag } = router.query;

  const {
    user,
    updateUser,
  } = useAuth();

  const [
    posts,
    setPosts,
  ] = useState<Post[]>([]);

  const [
    questions,
    setQuestions,
  ] = useState<TagQuestion[]>([]);

  const [
    pagination,
    setPagination,
  ] = useState<TagPagination>(
    DEFAULT_PAGINATION
  );

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    loadingMore,
    setLoadingMore,
  ] = useState(false);

  const [
    commentText,
    setCommentText,
  ] = useState("");

  const [
    activeCommentPost,
    setActiveCommentPost,
  ] = useState<string | null>(
    null
  );

  const [
    expandedComments,
    setExpandedComments,
  ] = useState<string[]>([]);

  const [
    replyText,
    setReplyText,
  ] = useState("");

  const [
    activeReplyComment,
    setActiveReplyComment,
  ] = useState<string | null>(
    null
  );

  const {
    editingPost,
    setEditingPost,
    editContent,
    setEditContent,
    editHashtags,
    setEditHashtags,
    setEditTagInput,
    editImage,
    setEditImage,
    editProjectTitle,
    setEditProjectTitle,
    editProjectLink,
    setEditProjectLink,
    editAchievementTitle,
    setEditAchievementTitle,
    editAchievementDescription,
    setEditAchievementDescription,
    editCodeSnippet,
    setEditCodeSnippet,
  } = useEditPostState();

  const {
    handleLike,
    handleBookmark,
    handleComment,
    handleShare,
    handleEdit,
    handleDelete,
    handleDeleteComment,
    handleReply,
  } = usePostActions({
    setPosts,
    user,
    updateUser,
    commentText,
    setCommentText,
    setActiveCommentPost,
    editingPost,
    setEditingPost,
    editContent,
    setEditContent,
    editHashtags,
    setEditHashtags,
    setEditTagInput,
    editImage,
    setEditImage,
    editProjectTitle,
    setEditProjectTitle,
    editProjectLink,
    setEditProjectLink,
    editAchievementTitle,
    setEditAchievementTitle,
    editAchievementDescription,
    setEditAchievementDescription,
    editCodeSnippet,
    setEditCodeSnippet,
    replyText,
    setReplyText,
    setActiveReplyComment,
  });

  const {
    selectedPostId,
    setSelectedPostId,
    showDeleteModal,
    setShowDeleteModal,

    selectedReply,
    setSelectedReply,
    showDeleteReplyModal,
    setShowDeleteReplyModal,

    selectedComment,
    setSelectedComment,
    showDeleteCommentModal,
    setShowDeleteCommentModal,

    closeDeletePostModal,
    closeDeleteReplyModal,
    closeDeleteCommentModal,

    confirmDeletePost,
    confirmDeleteReply,
    confirmDeleteComment,
  } = usePostDelete({
    setPosts,
    handleDelete,
    handleDeleteComment,
  });

  const tagName =
    Array.isArray(tag)
      ? tag[0]
      : tag;

  useEffect(() => {
    const loadTagContent =
      async (): Promise<void> => {
        if (!tagName) {
          setPosts([]);
          setQuestions([]);
          setPagination(
            DEFAULT_PAGINATION
          );

          setLoading(false);

          return;
        }

        try {
          setLoading(true);

          const data =
            await getTagContent(
              tagName,
              1,
              5
            );

          setPosts(
            data.posts || []
          );

          setQuestions(
            data.questions || []
          );

          setPagination(
            data.pagination ??
              DEFAULT_PAGINATION
          );
        } catch (
          error: unknown
        ) {
          console.error(
            "Tag detail load failed:",
            error
          );

          setPosts([]);
          setQuestions([]);
          setPagination(
            DEFAULT_PAGINATION
          );
        } finally {
          setLoading(false);
        }
      };

    void loadTagContent();
  }, [tagName]);

  const handleLoadMore =
    async (): Promise<void> => {
      if (
        !tagName ||
        loadingMore ||
        !pagination.hasNextPage
      ) {
        return;
      }

      try {
        setLoadingMore(true);

        const nextPage =
          pagination.currentPage +
          1;

        const data =
          await getTagContent(
            tagName,
            nextPage,
            pagination.limit
          );

        setQuestions(
          (
            previousQuestions
          ) => {
            const existingIds =
              new Set(
                previousQuestions.map(
                  (question) =>
                    question._id
                )
              );

            const newQuestions =
              (
                data.questions || []
              ).filter(
                (question) =>
                  !existingIds.has(
                    question._id
                  )
              );

            return [
              ...previousQuestions,
              ...newQuestions,
            ];
          }
        );

        if (data.pagination) {
          setPagination(
            data.pagination
          );
        }
      } catch (
        error: unknown
      ) {
        console.error(
          "Failed to load more tagged questions:",
          error
        );
      } finally {
        setLoadingMore(false);
      }
    };

  return (
    <Mainlayout>
      <main className="min-w-0 p-4 lg:p-6">
        {/* Tag header */}

        <div className="mb-6">
          <h1 className="text-2xl font-semibold">
            #{tagName}
          </h1>

          <p className="mt-2 text-gray-600">
            {t(
              "messages.questions_and_community_posts_tagged_with",
              {
                tag: tagName,
              }
            )}
          </p>
        </div>

        {loading ? (
          <p className="text-gray-500">
            {t(
              "status.loading"
            )}
          </p>
        ) : (
          <>
            {/* Questions */}

            <TagQuestionList
              questions={
                questions
              }
              pagination={
                pagination
              }
              loadingMore={
                loadingMore
              }
              onLoadMore={
                handleLoadMore
              }
            />

            {/* Community posts */}

            {posts.length > 0 && (
              <div>
                <h2 className="mb-3 text-lg font-semibold">
                  {t(
                    "labels.community_posts"
                  )}
                </h2>

                <div className="space-y-4">
                  {posts.map(
                    (post) => (
                      <PostCard
                        key={
                          post._id
                        }
                        post={post}
                        user={user}
                        handleLike={
                          handleLike
                        }
                        handleBookmark={
                          handleBookmark
                        }
                        handleComment={
                          handleComment
                        }
                        handleShare={
                          handleShare
                        }
                        handleEdit={
                          handleEdit
                        }
                        handleDelete={
                          handleDelete
                        }
                        handleReply={
                          handleReply
                        }
                        activeCommentPost={
                          activeCommentPost
                        }
                        setActiveCommentPost={
                          setActiveCommentPost
                        }
                        commentText={
                          commentText
                        }
                        setCommentText={
                          setCommentText
                        }
                        expandedComments={
                          expandedComments
                        }
                        setExpandedComments={
                          setExpandedComments
                        }
                        activeReplyComment={
                          activeReplyComment
                        }
                        setActiveReplyComment={
                          setActiveReplyComment
                        }
                        replyText={
                          replyText
                        }
                        setReplyText={
                          setReplyText
                        }
                        setSelectedPostId={
                          setSelectedPostId
                        }
                        setShowDeleteModal={
                          setShowDeleteModal
                        }
                        setSelectedComment={
                          setSelectedComment
                        }
                        setShowDeleteCommentModal={
                          setShowDeleteCommentModal
                        }
                        setSelectedReply={
                          setSelectedReply
                        }
                        setShowDeleteReplyModal={
                          setShowDeleteReplyModal
                        }
                      />
                    )
                  )}
                </div>
              </div>
            )}

            {/* Empty state */}

            {posts.length === 0 &&
              questions.length ===
                0 && (
                <p className="text-gray-500">
                  {t(
                    "messages.no_questions_or_posts_found_for_tag"
                  )}
                </p>
              )}
          </>
        )}

        <DeletePostModal
          open={
            showDeleteModal &&
            Boolean(
              selectedPostId
            )
          }
          onClose={
            closeDeletePostModal
          }
          onConfirm={
            confirmDeletePost
          }
        />

        <DeleteCommentModal
          open={
            showDeleteCommentModal &&
            Boolean(
              selectedComment
            )
          }
          onClose={
            closeDeleteCommentModal
          }
          onConfirm={
            confirmDeleteComment
          }
        />

        <DeleteReplyModal
          open={
            showDeleteReplyModal &&
            Boolean(
              selectedReply
            )
          }
          onClose={
            closeDeleteReplyModal
          }
          onConfirm={
            confirmDeleteReply
          }
        />
      </main>
    </Mainlayout>
  );
};

export default TagDetailPage;