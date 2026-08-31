import {
  useEffect,
  useState,
} from "react";

import { useRouter } from "next/router";
import { useTranslation } from "react-i18next";

import PostFeedList from "../community/PostFeedList";
import EditPostModal from "../community/modals/EditPostModal";
import DeletePostModal from "../community/modals/DeletePostModal";
import DeleteReplyModal from "../community/modals/DeleteReplyModal";
import DeleteCommentModal from "../community/modals/DeleteCommentModal";

import { useAuth } from "@/lib/AuthContext";

import usePostActions from "@/hooks/usePostActions";
import usePostFeed from "@/hooks/usePostFeed";
import useEditPostState from "@/hooks/useEditPostState";
import usePostDelete from "@/hooks/usePostDelete";

import type { Post } from "@/types/community";

interface PostFeedProps {
  activeFeed?: "trending" | "following";

  followingIds?: string[];

  initialPosts?: Post[];

  onPostCountChange?: (
    count: number
  ) => void;
}

const PostFeed = ({
  activeFeed = "trending",
  followingIds = [],
  initialPosts,
  onPostCountChange,
}: PostFeedProps) => {
  const {
    user,
    updateUser,
  } = useAuth();

  const router = useRouter();
  const { t } = useTranslation();

  const {
    posts,
    setPosts,
    loading,
    hasMore,
    loadingMore,
    loadMoreRef,
  } = usePostFeed({
    activeFeed,
    followingIds,
    initialPosts,
  });

  const {
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
  } = useEditPostState();

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
    replyText,
    setReplyText,
  ] = useState("");

  const [
    activeReplyComment,
    setActiveReplyComment,
  ] = useState<string | null>(
    null
  );

  const [
    expandedComments,
    setExpandedComments,
  ] = useState<string[]>(
    []
  );

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

  useEffect(() => {
    if (
      !router.isReady ||
      loading ||
      posts.length === 0
    ) {
      return;
    }

    const targetPostId =
      sessionStorage.getItem(
        "communitySelectedPostId"
      );

    if (!targetPostId) {
      return;
    }

    const postElement =
      document.getElementById(
        `community-post-${targetPostId}`
      );

    if (!postElement) {
      return;
    }

    const timer =
      setTimeout(() => {
        postElement.scrollIntoView({
          behavior: "auto",
          block: "center",
        });

        sessionStorage.removeItem(
          "communitySelectedPostId"
        );
      }, 300);

    return () => {
      clearTimeout(timer);
    };
  }, [
    router.isReady,
    loading,
    posts.length,
  ]);

  useEffect(() => {
    onPostCountChange?.(
      posts.length
    );
  }, [
    posts.length,
    onPostCountChange,
  ]);

  if (loading) {
    return (
      <div className="mt-6 text-center text-gray-500">
        {t(
          "feed.loading_posts"
        )}
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="mt-6 text-center text-gray-500">
        {t(
          "feed.no_posts_yet"
        )}
      </div>
    );
  }

  return (
    <>
      {/* Post feed */}
      <PostFeedList
        posts={posts}
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
        handleReply={
          handleReply
        }
        handleDelete={
          handleDelete
        }
        handleEdit={
          handleEdit
        }
        handleShare={
          handleShare
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
        expandedComments={
          expandedComments
        }
        setExpandedComments={
          setExpandedComments
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

      {/* Edit post modal */}
      <EditPostModal
        editingPost={
          editingPost
        }
        setEditingPost={
          setEditingPost
        }
        editContent={
          editContent
        }
        setEditContent={
          setEditContent
        }
        editHashtags={
          editHashtags
        }
        setEditHashtags={
          setEditHashtags
        }
        editTagInput={
          editTagInput
        }
        setEditTagInput={
          setEditTagInput
        }
        editImage={
          editImage
        }
        setEditImage={
          setEditImage
        }
        editProjectTitle={
          editProjectTitle
        }
        setEditProjectTitle={
          setEditProjectTitle
        }
        editProjectLink={
          editProjectLink
        }
        setEditProjectLink={
          setEditProjectLink
        }
        editAchievementTitle={
          editAchievementTitle
        }
        setEditAchievementTitle={
          setEditAchievementTitle
        }
        editAchievementDescription={
          editAchievementDescription
        }
        setEditAchievementDescription={
          setEditAchievementDescription
        }
        editCodeSnippet={
          editCodeSnippet
        }
        setEditCodeSnippet={
          setEditCodeSnippet
        }
        handleSaveEdit={
          handleSaveEdit
        }
      />

      {/* Infinite scroll */}
      {!initialPosts && (
        <div
          ref={loadMoreRef}
          className="py-6 text-center text-gray-500"
        >
          {hasMore
            ? loadingMore
              ? "Loading more posts..."
              : ""
            : "No more posts"}
        </div>
      )}

      {/* Delete post modal */}
      <DeletePostModal
        open={
          showDeleteModal &&
          Boolean(selectedPostId)
        }
        onClose={
          closeDeletePostModal
        }
        onConfirm={
          confirmDeletePost
        }
      />

      {/* Delete reply modal */}
      <DeleteReplyModal
        open={
          showDeleteReplyModal &&
          Boolean(selectedReply)
        }
        onClose={
          closeDeleteReplyModal
        }
        onConfirm={
          confirmDeleteReply
        }
      />

      {/* Delete comment modal */}
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
    </>
  );
};

export default PostFeed;