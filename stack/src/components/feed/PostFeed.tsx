import { useEffect, useState } from "react";
import { getPosts, toggleLikePost,toggleBookmarkPost, addComment, addReply, deletePost } from "@/components/services/communityService";
import { useRouter } from "next/router";
import PostCard from "../community/PostCard";
import { useAuth } from "@/lib/AuthContext";
import { toast } from "react-toastify";
import usePostActions from "@/hooks/usePostActions";

export default function PostFeed({
  activeFeed = "for-you",
  followingIds = [],
}: {
  activeFeed?: "for-you" | "following";
  followingIds?: string[];
}) {
    const { user } = useAuth();
  const router = useRouter();
  const [posts, setPosts] = useState<any[]>([]);
  const [commentText, setCommentText] = useState("");
const [activeCommentPost, setActiveCommentPost] = useState<string | null>(null);

const [editingPost, setEditingPost] = useState<any>(null);
const [editContent, setEditContent] = useState("");

const [replyText, setReplyText] = useState("");
const [activeReplyComment, setActiveReplyComment] = useState<string | null>(null);
const [expandedComments, setExpandedComments] = useState<string[]>([]);
const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
const [showDeleteModal, setShowDeleteModal] = useState(false);
const [selectedComment, setSelectedComment] = useState<{
  postId: string;
  commentId: string;
} | null>(null);

const [showDeleteCommentModal, setShowDeleteCommentModal] =
  useState(false);
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
  posts,
  setPosts,
  user,
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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPosts = async () => {
      try {
        const data = await getPosts();
        setPosts(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    loadPosts();
  }, [activeFeed, followingIds]);

  const visiblePosts = (activeFeed === "for-you"
    ? [...posts].sort((first, second) => {
        const score = (post: any) => {
          const replies = (post.comments || []).reduce(
            (total: number, comment: any) =>
              total + (comment.replies?.length || 0),
            0
          );

          return (
            (post.likes?.length || 0) * 3 +
            (post.comments?.length || 0) * 5 +
            replies * 2 +
            (post.shareCount || 0) * 4
          );
        };

        return score(second) - score(first);
      })
    : posts
  ).filter(
    (post) =>
      activeFeed === "for-you" || followingIds.includes(String(post.authorId))
  );

  if (loading) {
    return (
      <div className="mt-6 text-center text-gray-500">
        Loading posts...
      </div>
    );
  }

  if (visiblePosts.length === 0) {
    return (
      <div className="mt-6 text-center text-gray-500">
        No posts yet.
      </div>
    );
  }

  return (
    <>
      <div className="mt-6 gap-4 flex flex-col">
      {visiblePosts.map((post) => (
  <div
      key={post._id}
      role="button"
      tabIndex={0}
      onClick={()=> router.push(`/community/${post._id}`)}
      onKeyDown={(e) => {
        if(e.key === "Enter" || e.key === " "){
            router.push(`/community/${post._id}`)
        }
      }}
      className="cursor-pointer rounded-lg transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-2xl hover:shadow-blue-200/40"
      >
    <div
     onClick={() => router.push(`/community/${post._id}`)}
     className="cursor-pointer transition-all duration300 ease-out hover:-translate-y-1 hover:shadow-xl">
    <PostCard
    key={post._id}
    post={post}
    user={user}
handleLike={handleLike}
handleBookmark={handleBookmark}
handleComment={handleComment}
handleReply={handleReply}
handleDelete={handleDelete}
handleEdit={handleEdit}
handleShare={handleShare}
activeCommentPost={activeCommentPost}
setActiveCommentPost={setActiveCommentPost}
commentText={commentText}
setCommentText={setCommentText}
activeReplyComment={activeReplyComment}
setActiveReplyComment={setActiveReplyComment}
replyText={replyText}
setReplyText={setReplyText}
expandedComments={expandedComments}
setExpandedComments={setExpandedComments}
selectedPostId={selectedPostId}
setSelectedPostId={setSelectedPostId}
showDeleteModal={showDeleteModal}
setShowDeleteModal={setShowDeleteModal}
selectedComment={selectedComment}
setSelectedComment={setSelectedComment}
showDeleteCommentModal={showDeleteCommentModal}
setShowDeleteCommentModal={setShowDeleteCommentModal}
/>

</div>
  </div>
))}
      </div>

      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="w-full max-w-sm rounded-xl bg-white p-6 shadow-xl">
            <h2 className="text-lg font-semibold">Delete Post</h2>
            <p className="mt-2 text-gray-600">
              Are you sure you want to delete this post?
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => {
                  setShowDeleteModal(false);
                  setSelectedPostId(null);
                }}
                className="rounded-lg border px-4 py-2"
              >
                No
              </button>
              <button
                type="button"
                onClick={() => {
                  if (selectedPostId) {
                    handleDelete(selectedPostId);
                  }
                  setShowDeleteModal(false);
                  setSelectedPostId(null);
                }}
                className="rounded-lg bg-red-600 px-4 py-2 text-white hover:bg-red-700"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {showDeleteCommentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="w-full max-w-sm rounded-xl bg-white p-6 shadow-xl">
            <h2 className="text-lg font-semibold">Delete Comment</h2>
            <p className="mt-2 text-gray-600">
              Are you sure you want to delete this comment?
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => {
                  setShowDeleteCommentModal(false);
                  setSelectedComment(null);
                }}
                className="rounded-lg border px-4 py-2"
              >
                No
              </button>
              <button
                type="button"
                onClick={() => {
                  if (selectedComment) {
                    handleDeleteComment(
                      selectedComment.postId,
                      selectedComment.commentId
                    );
                  }
                  setShowDeleteCommentModal(false);
                  setSelectedComment(null);
                }}
                className="rounded-lg bg-red-600 px-4 py-2 text-white hover:bg-red-700"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}