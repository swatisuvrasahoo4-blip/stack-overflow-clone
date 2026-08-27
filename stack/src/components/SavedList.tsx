import React, { useEffect, useState } from "react";
import Link from "next/link";
import { getQuestionBookmarks} from "@/components/services/questionService"
import { useAuth } from "@/lib/AuthContext"
import { useRouter } from "next/router";
import { useTranslation } from "react-i18next";
import {
  deleteReply,
  getBookmarkedPosts,
} from "./services/communityService";
import PostCard from "./community/PostCard";
import usePostActions from "@/hooks/usePostActions";

export default function SavedList({ max = 100 }: { max?: number }) {
  const router = useRouter();
  const {t} = useTranslation();
  const { user, updateUser } = useAuth();
  const [saved, setSaved] = useState<any[]>([]);
  const [savedPosts, setSavedPosts] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState("questions");
  const [commentText, setCommentText] = useState("");
  const [activeCommentPost, setActiveCommentPost] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");
  const [activeReplyComment, setActiveReplyComment] = useState<string | null>(null);
  const [expandedComments, setExpandedComments] = useState<string[]>([]);
  const [editingPost, setEditingPost] = useState<any>(null);
  const [editContent, setEditContent] = useState("");
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedComment, setSelectedComment] = useState<any>(null);
  const [showDeleteCommentModal, setShowDeleteCommentModal] = useState(false);
  const [selectedReply, setSelectedReply] = useState<any>(null);
  const [showDeleteReplyModal, setShowDeleteReplyModal] = useState(false);

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
    posts: savedPosts,
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
    replyText,
    setReplyText,
    setActiveReplyComment,
  });

  const handleDeleteReply = async (
    postId: string,
    commentId: string,
    replyId: string
  ) => {
    try {
      await deleteReply(postId, commentId, replyId);
      setSavedPosts((previousPosts) =>
        previousPosts.map((post) =>
          post._id === postId
            ? {
                ...post,
                comments: post.comments.map((comment: any) =>
                  comment._id === commentId
                    ? {
                        ...comment,
                        replies: comment.replies.filter(
                          (reply: any) => reply._id !== replyId
                        ),
                      }
                    : comment
                ),
              }
            : post
        )
      );
    } catch (error) {
      console.error("Delete reply error:", error);
    }
  };

useEffect(() => {
  const loadSavedItems = async () => {
    try {
      const userId = user?._id || user?.id

      if (!userId) {
        setSaved([]);
        return;
      }

      const res = await getQuestionBookmarks(userId);

      setSaved(
        Array.isArray(res)
          ? res.slice(0, max)
          : []
      );

    const posts = await getBookmarkedPosts(userId);

setSavedPosts(
  Array.isArray(posts)
    ? posts.slice(0, max)
    : []
);
    } catch (error) {
      console.error(
        "Unable to load saved questions:",
        error
      );

      setSaved([]);
    }
  };

  loadSavedItems();
}, [max, user?._id, user?.id]);


  return (
    <div>
      {/* Tabs */}
      <div className="flex gap-3 mb-6">
        <button
          onClick={() => setActiveTab("questions")}
          className={`px-4 py-2 rounded-lg ${
            activeTab === "questions"
              ? "bg-blue-600 text-white"
              : "bg-gray-100 text-gray-700"
          }`}
        >
          {t("community.questions")}
        </button>

        <button
          onClick={() => setActiveTab("posts")}
          className={`px-4 py-2 rounded-lg ${
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
        <>
          {saved.length === 0 ? (
            <div className="text-gray-600">
              You have no saved questions.
            </div>
          ) : (
            <div className="space-y-4">
              {saved.map((q) => (
                <div
                  key={q._id}
                  className="border rounded-lg bg-white p-4 shadow-sm cursor-pointer transition-all duration-200 hover:scale-[1.01]"
                  onClick={()=> router.push(`/questions/${q._id}`)}
                >
                  <Link
                    href={`/questions/${q._id}`}
                    className="text-blue-600 hover:text-blue-800 text-lg font-semibold"
                  >
                    {q.questiontitle || "(no title)"}
                  </Link>

                  <p className="text-sm text-gray-700 mt-2">
                    {q.questionbody?.slice(0, 200)}
                  </p>

                  <div className="flex flex-wrap gap-2 mt-3">
                    {(q.questiontags || []).map(
                      (tag: string) => (
                        <span
                          key={tag}
                          className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded"
                        >
                          {tag}
                        </span>
                      )
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}


      {/* Saved Community Posts */}
      {activeTab === "posts" && (
        <>
          {savedPosts.length === 0 ? (
            <div className="text-gray-600">
              No saved community posts.
            </div>
          ) : (
            <div className="space-y-4">
              {savedPosts.map((post) => (
                <PostCard
                  key={post._id}
                  post={post}
                  user={user}
                  handleLike={handleLike}
                  handleBookmark={handleBookmark}
                  handleComment={handleComment}
                  handleReply={handleReply}
                  handleShare={handleShare}
                  handleEdit={handleEdit}
                  handleDelete={handleDelete}
                  activeCommentPost={activeCommentPost}
                  setActiveCommentPost={setActiveCommentPost}
                  commentText={commentText}
                  setCommentText={setCommentText}
                  expandedComments={expandedComments}
                  setExpandedComments={setExpandedComments}
                  activeReplyComment={activeReplyComment}
                  setActiveReplyComment={setActiveReplyComment}
                  replyText={replyText}
                  setReplyText={setReplyText}
                  setSelectedComment={setSelectedComment}
                  setShowDeleteCommentModal={setShowDeleteCommentModal}
                  setSelectedReply={setSelectedReply}
                  setShowDeleteReplyModal={setShowDeleteReplyModal}
                  setSelectedPostId={setSelectedPostId}
                  setShowDeleteModal={setShowDeleteModal}
                  isBookmarked
                />
              ))}
            </div>
          )}
        </>
      )}

      {showDeleteModal && (
        <DeleteModal
          title="Delete Post"
          message="Are you sure you want to delete this post?"
          onCancel={() => {
            setShowDeleteModal(false);
            setSelectedPostId(null);
          }}
          onConfirm={() => {
            if (selectedPostId) handleDelete(selectedPostId);
            setShowDeleteModal(false);
            setSelectedPostId(null);
          }}
        />
      )}

      {showDeleteCommentModal && (
        <DeleteModal
          title="Delete Comment"
          message="Are you sure you want to delete this comment?"
          onCancel={() => {
            setShowDeleteCommentModal(false);
            setSelectedComment(null);
          }}
          onConfirm={() => {
            if (selectedComment) {
              handleDeleteComment(selectedComment.postId, selectedComment.commentId);
            }
            setShowDeleteCommentModal(false);
            setSelectedComment(null);
          }}
        />
      )}

      {showDeleteReplyModal && (
        <DeleteModal
          title="Delete Reply"
          message="Are you sure you want to delete this reply?"
          onCancel={() => {
            setShowDeleteReplyModal(false);
            setSelectedReply(null);
          }}
          onConfirm={() => {
            if (selectedReply) {
              handleDeleteReply(
                selectedReply.postId,
                selectedReply.commentId,
                selectedReply.replyId
              );
            }
            setShowDeleteReplyModal(false);
            setSelectedReply(null);
          }}
        />
      )}

      {editingPost && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-lg rounded-xl bg-white p-5 shadow-xl">
            <h2 className="mb-4 text-xl font-semibold">Edit Post</h2>
            <textarea
              value={editContent}
              onChange={(event) => setEditContent(event.target.value)}
              className="min-h-40 w-full rounded-md border p-3 outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Edit your post..."
            />
            <div className="mt-4 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => {
                  setEditingPost(null);
                  setEditContent("");
                }}
                className="rounded-md border px-4 py-2"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveEdit}
                className="rounded-md bg-blue-600 px-4 py-2 text-white"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function DeleteModal({
  title,
  message,
  onCancel,
  onConfirm,
}: {
  title: string;
  message: string;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-sm rounded-xl bg-white p-6 shadow-xl">
        <h2 className="text-lg font-semibold">{title}</h2>
        <p className="mt-2 text-gray-600">{message}</p>
        <div className="mt-6 flex justify-end gap-3">
          <button type="button" onClick={onCancel} className="rounded-lg border px-4 py-2">
            No
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="rounded-lg bg-red-600 px-4 py-2 text-white hover:bg-red-700"
          >
            Yes, Delete
          </button>
        </div>
      </div>
    </div>
  );
}