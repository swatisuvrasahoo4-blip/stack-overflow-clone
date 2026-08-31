import { useState } from "react";
import type { ComponentProps } from "react";

import { useAuth } from "@/lib/AuthContext";

import usePostActions from "@/hooks/usePostActions";

import { deleteReply } from "@/components/services/communityService";

import PostCard from "@/components/community/PostCard/PostCard";

import type {
  SelectedComment,
  SelectedReply,
} from "@/types/community";

type CommunityPost =
  ComponentProps<typeof PostCard>["post"];

type PostComment = NonNullable<
  CommunityPost["comments"]
>[number];

type PostReply = NonNullable<
  PostComment["replies"]
>[number];

const useSavedPosts = () => {
  const {
    user,
    updateUser,
  } = useAuth();

  // Saved posts
  const [
    savedPosts,
    setSavedPosts,
  ] = useState<CommunityPost[]>([]);

  // Comment state
  const [
    commentText,
    setCommentText,
  ] = useState("");

  const [
    activeCommentPost,
    setActiveCommentPost,
  ] = useState<string | null>(null);

  const [
    expandedComments,
    setExpandedComments,
  ] = useState<string[]>([]);

  // Reply state
  const [
    replyText,
    setReplyText,
  ] = useState("");

  const [
    activeReplyComment,
    setActiveReplyComment,
  ] = useState<string | null>(null);

  // Edit post state
  const [
    editingPost,
    setEditingPost,
  ] = useState<CommunityPost | null>(
    null
  );

  const [
    editContent,
    setEditContent,
  ] = useState("");

  const [
    editHashtags,
    setEditHashtags,
  ] = useState("");

  const [
    editTagInput,
    setEditTagInput,
  ] = useState("");

  const [
    editImage,
    setEditImage,
  ] = useState<File | null>(null);

  const [
    editProjectTitle,
    setEditProjectTitle,
  ] = useState("");

  const [
    editProjectLink,
    setEditProjectLink,
  ] = useState("");

  const [
    editAchievementTitle,
    setEditAchievementTitle,
  ] = useState("");

  const [
    editAchievementDescription,
    setEditAchievementDescription,
  ] = useState("");

  const [
    editCodeSnippet,
    setEditCodeSnippet,
  ] = useState("");

  // Delete post state
  const [
    selectedPostId,
    setSelectedPostId,
  ] = useState<string | null>(null);

  const [
    showDeleteModal,
    setShowDeleteModal,
  ] = useState(false);

  // Delete comment state
  const [
    selectedComment,
    setSelectedComment,
  ] = useState<SelectedComment | null>(
    null
  );

  const [
    showDeleteCommentModal,
    setShowDeleteCommentModal,
  ] = useState(false);

  // Delete reply state
  const [
    selectedReply,
    setSelectedReply,
  ] = useState<SelectedReply | null>(
    null
  );

  const [
    showDeleteReplyModal,
    setShowDeleteReplyModal,
  ] = useState(false);

  // Community post actions
  const {
    handleLike,
    handleBookmark,
    handleComment,
    handleShare,
    handleEdit,
    handleSaveEdit,
    handleDelete,
    handleReply,
    handleDeleteComment,
  } = usePostActions({
    setPosts: setSavedPosts,
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

  // Delete reply
  const handleDeleteReply = async (
    postId: string,
    commentId: string,
    replyId: string
  ): Promise<void> => {
    try {
      await deleteReply(
        postId,
        commentId,
        replyId
      );

      setSavedPosts(
        (previousPosts) =>
          previousPosts.map((post) =>
            post._id === postId
              ? {
                  ...post,
                  comments: (
                    post.comments ?? []
                  ).map(
                    (
                      comment: PostComment
                    ) =>
                      comment._id ===
                      commentId
                        ? {
                            ...comment,
                            replies: (
                              comment.replies ??
                              []
                            ).filter(
                              (
                                reply: PostReply
                              ) =>
                                reply._id !==
                                replyId
                            ),
                          }
                        : comment
                  ),
                }
              : post
          )
      );
    } catch (error: unknown) {
      console.error(
        "Delete reply error:",
        error
      );
    }
  };

  return {
    savedPosts,
    setSavedPosts,

    commentText,
    setCommentText,

    activeCommentPost,
    setActiveCommentPost,

    expandedComments,
    setExpandedComments,

    replyText,
    setReplyText,

    activeReplyComment,
    setActiveReplyComment,

    editingPost,
    setEditingPost,

    editContent,
    setEditContent,

    editHashtags,
    setEditHashtags,

    editTagInput,
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

    selectedPostId,
    setSelectedPostId,

    showDeleteModal,
    setShowDeleteModal,

    selectedComment,
    setSelectedComment,

    showDeleteCommentModal,
    setShowDeleteCommentModal,

    selectedReply,
    setSelectedReply,

    showDeleteReplyModal,
    setShowDeleteReplyModal,

    handleLike,
    handleBookmark,
    handleComment,
    handleShare,
    handleEdit,
    handleSaveEdit,
    handleDelete,
    handleReply,
    handleDeleteComment,
    handleDeleteReply,
  };
};

export default useSavedPosts;