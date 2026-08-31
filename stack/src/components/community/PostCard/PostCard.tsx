"use client";

import {
  useEffect,
  useState,
} from "react";

import PostHeader from "./PostHeader";
import PostContent from "./PostContent";
import PostInteractions from "./PostInteractions";
import PostCommentInput from "./PostCommentInput";

import CommentSection from "../CommentSection";
import ReportPostModal from "../modals/ReportPostModal";

import usePostReport from "@/hooks/usePostReport";

import type {
  PostCardProps,
} from "@/types/community";

const PostCard = ({
  post,
  user,
  handleLike,
  handleEdit,
  handleShare,
  handleBookmark,
  handleComment,
  handleReply,
  handleDelete,
  activeCommentPost,
  setActiveCommentPost,
  commentText,
  setCommentText,
  expandedComments,
  setExpandedComments,
  activeReplyComment,
  setActiveReplyComment,
  replyText,
  setReplyText,
  setSelectedComment,
  setShowDeleteCommentModal,
  setSelectedReply,
  setShowDeleteReplyModal,
  setSelectedPostId,
  setShowDeleteModal,
  isBookmarked: initialBookmarked,
}: PostCardProps) => {
  const [
    isBookmarked,
    setIsBookmarked,
  ] = useState<boolean>(
    initialBookmarked ??
      post.isBookmarked ??
      user?.bookmarks?.some(
        (bookmarkId: string) =>
          String(bookmarkId) ===
          String(post._id)
      ) ??
      false
  );

  const [
    isLiked,
    setIsLiked,
  ] = useState<boolean>(
    post.likes?.some(
      (likeUserId: string) =>
        String(likeUserId) ===
        String(
          user?.id ||
            user?._id ||
            user?.userId
        )
    ) ?? false
  );

  const {
    showReportModal,
    handleReportClick,
    handleReportSubmit,
    handleCloseReport,
  } = usePostReport({
    postId: post._id,
    user,
  });

  useEffect(() => {
    const bookmarked =
      user?.bookmarks?.some(
        (bookmarkId: string) =>
          String(bookmarkId) ===
          String(post._id)
      ) ?? false;

    setIsBookmarked(bookmarked);
  }, [
    user?.bookmarks,
    post._id,
  ]);

  useEffect(() => {
    const liked =
      post.likes?.some(
        (likeUserId: string) =>
          String(likeUserId) ===
          String(
            user?.id ||
              user?._id ||
              user?.userId
          )
      ) ?? false;

    setIsLiked(liked);
  }, [
    post.likes,
    user?.id,
    user?._id,
    user?.userId,
  ]);

  const currentUserId =
    user?.id ||
    user?._id ||
    user?.userId;

  return (
    <>
      {/* Post card */}

      <div
        className={`mb-4 rounded-lg border p-5 ${
          post.isFeatured
            ? "border-yellow-300 bg-yellow-50 shadow-sm"
            : "bg-white"
        }`}
      >
        {/* Post header */}

        <PostHeader
          post={post}
          user={user}
          currentUserId={
            currentUserId
          }
          handleDelete={
            handleDelete
          }
          handleEdit={
            handleEdit
          }
          setSelectedPostId={
            setSelectedPostId
          }
          setShowDeleteModal={
            setShowDeleteModal
          }
          handleReportClick={
            handleReportClick
          }
        />

        {/* Post content */}

        <PostContent
          post={post}
        />

        {/* Post interactions */}

        <PostInteractions
          post={post}
          user={user}
          isLiked={
            isLiked
          }
          isBookmarked={
            isBookmarked
          }
          setIsLiked={
            setIsLiked
          }
          setIsBookmarked={
            setIsBookmarked
          }
          handleLike={
            handleLike
          }
          handleBookmark={
            handleBookmark
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
        />

        {/* Comment input */}

        <PostCommentInput
          postId={
            post._id
          }
          user={
            user
          }
          commentText={
            commentText
          }
          setCommentText={
            setCommentText
          }
          activeCommentPost={
            activeCommentPost
          }
          handleComment={
            handleComment
          }
        />

        {/* Comments and replies */}

        <CommentSection
          post={
            post
          }
          user={
            user
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
          handleReply={
            handleReply
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
      </div>

      {/* Report post modal */}

      <ReportPostModal
        open={
          showReportModal
        }
        onClose={
          handleCloseReport
        }
        onSubmit={
          handleReportSubmit
        }
      />
    </>
  );
};

export default PostCard;