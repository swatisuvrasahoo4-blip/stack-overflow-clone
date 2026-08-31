"use client";

import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import { useAuth } from "@/lib/AuthContext";
import type { Question } from "@/types/questions";

import { getQuestionBookmarks } from "@/components/services/questionService";
import { getBookmarkedPosts } from "../services/communityService";

import SavedQuestionsList from "./SavedQuestionsList";
import SavedPostsList from "./SavedPostsList";

import EditPostModal from "../community/modals/EditPostModal";
import DeletePostModal from "../community/modals/DeletePostModal";
import DeleteCommentModal from "../community/modals/DeleteCommentModal";
import DeleteReplyModal from "../community/modals/DeleteReplyModal";

import useSavedPosts from "@/hooks/useSavedPosts";

interface SavedListProps {
  max?: number;
}

const SavedList = ({ max = 100 }: SavedListProps) => {
  const { t } = useTranslation();
  const { user } = useAuth();

  const [saved, setSaved] = useState<Question[]>([]);

  const [activeTab, setActiveTab] = useState<
    "questions" | "posts"
  >("questions");

  const {
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
  } = useSavedPosts();

  // Load saved questions and posts

  useEffect(() => {
    const loadSavedItems = async () => {
      try {
        const userId = user?._id || user?.id;

        if (!userId) {
          setSaved([]);
          setSavedPosts([]);
          return;
        }

        const questions = await getQuestionBookmarks(
          userId
        );

        setSaved(
          Array.isArray(questions)
            ? questions.slice(0, max)
            : []
        );

        const posts = await getBookmarkedPosts(userId);

        setSavedPosts(
          Array.isArray(posts)
            ? posts.slice(0, max)
            : []
        );
      } catch (error: unknown) {
        console.error(
          "Unable to load saved items:",
          error
        );

        setSaved([]);
        setSavedPosts([]);
      }
    };

    void loadSavedItems();
  }, [
    max,
    user?._id,
    user?.id,
    setSavedPosts,
  ]);

  return (
    <div>
      {/* Tabs */}

      <div className="mb-6 flex gap-3">
        <button
          type="button"
          onClick={() => setActiveTab("questions")}
          className={`rounded-lg px-4 py-2 ${
            activeTab === "questions"
              ? "bg-blue-600 text-white"
              : "bg-gray-100 text-gray-700"
          }`}
        >
          {t("community.questions")}
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("posts")}
          className={`rounded-lg px-4 py-2 ${
            activeTab === "posts"
              ? "bg-blue-600 text-white"
              : "bg-gray-100 text-gray-700"
          }`}
        >
          {t("community.communityPosts")}
        </button>
      </div>

      {/* Saved Questions */}

      {activeTab === "questions" && (
        <SavedQuestionsList questions={saved} />
      )}

      {/* Saved Community Posts */}

      {activeTab === "posts" && (
        <SavedPostsList
          posts={savedPosts}
          postCardProps={{
            user,
            handleLike,
            handleBookmark,
            handleComment,
            handleReply,
            handleShare,
            handleEdit,
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
          }}
        />
      )}

      {/* Delete Post Modal */}

      <DeletePostModal
        open={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setSelectedPostId(null);
        }}
        onConfirm={async () => {
          if (selectedPostId) {
            await handleDelete(selectedPostId);
          }

          setShowDeleteModal(false);
          setSelectedPostId(null);
        }}
      />

      {/* Delete Comment Modal */}

      <DeleteCommentModal
        open={showDeleteCommentModal}
        onClose={() => {
          setShowDeleteCommentModal(false);
          setSelectedComment(null);
        }}
        onConfirm={async () => {
          if (selectedComment) {
            await handleDeleteComment(
              selectedComment.postId,
              selectedComment.commentId
            );
          }

          setShowDeleteCommentModal(false);
          setSelectedComment(null);
        }}
      />

      {/* Delete Reply Modal */}

      <DeleteReplyModal
        open={showDeleteReplyModal}
        onClose={() => {
          setShowDeleteReplyModal(false);
          setSelectedReply(null);
        }}
        onConfirm={async () => {
          if (selectedReply) {
            await handleDeleteReply(
              selectedReply.postId,
              selectedReply.commentId,
              selectedReply.replyId
            );
          }

          setShowDeleteReplyModal(false);
          setSelectedReply(null);
        }}
      />

      {/* Edit Post Modal */}

      <EditPostModal
        editingPost={editingPost}
        setEditingPost={setEditingPost}
        editContent={editContent}
        setEditContent={setEditContent}
        editHashtags={editHashtags}
        setEditHashtags={setEditHashtags}
        editTagInput={editTagInput}
        setEditTagInput={setEditTagInput}
        editImage={editImage}
        setEditImage={setEditImage}
        editProjectTitle={editProjectTitle}
        setEditProjectTitle={setEditProjectTitle}
        editProjectLink={editProjectLink}
        setEditProjectLink={setEditProjectLink}
        editAchievementTitle={editAchievementTitle}
        setEditAchievementTitle={
          setEditAchievementTitle
        }
        editAchievementDescription={
          editAchievementDescription
        }
        setEditAchievementDescription={
          setEditAchievementDescription
        }
        editCodeSnippet={editCodeSnippet}
        setEditCodeSnippet={setEditCodeSnippet}
        handleSaveEdit={handleSaveEdit}
      />
    </div>
  );
};

export default SavedList;