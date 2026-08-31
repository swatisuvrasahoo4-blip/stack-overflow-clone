import {
  useState,
} from "react";

import {
  deleteReply,
} from "@/components/services/communityService";

import type {
  Dispatch,
  SetStateAction,
} from "react";

import type {
  Post,
  SelectedComment,
  SelectedReply,
} from "@/types/community";

type PostComment =
  NonNullable<Post["comments"]>[number];

type PostReply =
  NonNullable<PostComment["replies"]>[number];

interface UsePostDeleteProps {
  setPosts: Dispatch<
    SetStateAction<Post[]>
  >;

  handleDelete: (
    postId: string
  ) => Promise<void>;

  handleDeleteComment: (
    postId: string,
    commentId: string
  ) => Promise<void>;
}

const usePostDelete = ({
  setPosts,
  handleDelete,
  handleDeleteComment,
}: UsePostDeleteProps) => {
  const [
    selectedPostId,
    setSelectedPostId,
  ] = useState<string | null>(
    null
  );

  const [
    showDeleteModal,
    setShowDeleteModal,
  ] = useState(false);

  const [
    selectedReply,
    setSelectedReply,
  ] =
    useState<SelectedReply | null>(
      null
    );

  const [
    showDeleteReplyModal,
    setShowDeleteReplyModal,
  ] = useState(false);

  const [
    selectedComment,
    setSelectedComment,
  ] =
    useState<SelectedComment | null>(
      null
    );

  const [
    showDeleteCommentModal,
    setShowDeleteCommentModal,
  ] = useState(false);

  const closeDeletePostModal = () => {
    setShowDeleteModal(false);
    setSelectedPostId(null);
  };

  const closeDeleteReplyModal = () => {
    setShowDeleteReplyModal(false);
    setSelectedReply(null);
  };

  const closeDeleteCommentModal = () => {
    setShowDeleteCommentModal(false);
    setSelectedComment(null);
  };

  const confirmDeletePost =
    async (): Promise<void> => {
      if (!selectedPostId) {
        return;
      }

      await handleDelete(
        selectedPostId
      );

      closeDeletePostModal();
    };

  const confirmDeleteReply =
    async (): Promise<void> => {
      if (!selectedReply) {
        return;
      }

      await deleteReply(
        selectedReply.postId,
        selectedReply.commentId,
        selectedReply.replyId
      );

      setPosts(
        (previousPosts) =>
          previousPosts.map(
            (post) =>
              post._id ===
              selectedReply.postId
                ? {
                    ...post,

                    comments: (
                      post.comments ??
                      []
                    ).map(
                      (
                        comment: PostComment
                      ) =>
                        comment._id ===
                        selectedReply.commentId
                          ? {
                              ...comment,

                              replies:
                                (
                                  comment.replies ??
                                  []
                                ).filter(
                                  (
                                    reply: PostReply
                                  ) =>
                                    reply._id !==
                                    selectedReply.replyId
                                ),
                            }
                          : comment
                    ),
                  }
                : post
          )
      );

      closeDeleteReplyModal();
    };

  const confirmDeleteComment =
    async (): Promise<void> => {
      if (!selectedComment) {
        return;
      }

      await handleDeleteComment(
        selectedComment.postId,
        selectedComment.commentId
      );

      closeDeleteCommentModal();
    };

  return {
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
  };
};

export default usePostDelete;