import { useEffect, useState, useRef } from "react";
import { getPosts, toggleLikePost,toggleBookmarkPost, addComment, addReply, deletePost } from "@/components/services/communityService";
import { useRouter } from "next/router";
import PostCard from "../community/PostCard";
import { useAuth } from "@/lib/AuthContext";
import { toast } from "react-toastify";
import usePostActions from "@/hooks/usePostActions";
import { deleteReply } from "@/components/services/communityService";

export default function PostFeed({
  activeFeed = "trending",
  followingIds = [],
  initialPosts,
}: {
  activeFeed?: "trending" | "following";
  followingIds?: string[];
  initialPosts?: any[];
}) {
    const { user, updateUser } = useAuth();
  const router = useRouter();
  const [posts, setPosts] = useState<any[]>(initialPosts || []);
 
  const [commentText, setCommentText] = useState("");
const [activeCommentPost, setActiveCommentPost] = useState<string | null>(null);

const [editingPost, setEditingPost] = useState<any>(null);
const [editContent, setEditContent] = useState("");

const [replyText, setReplyText] = useState("");
const [activeReplyComment, setActiveReplyComment] = useState<string | null>(null);
const [expandedComments, setExpandedComments] = useState<string[]>([]);
const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
const [showDeleteModal, setShowDeleteModal] = useState(false);
const [selectedReply, setSelectedReply] = useState<{
  postId: string;
  commentId: string;
  replyId: string;
} | null>(null);

const [showDeleteReplyModal, setShowDeleteReplyModal] = useState(false);
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
 const [loading, setLoading] = useState(!initialPosts);
  const [page, setPage] = useState(1);
const [hasMore, setHasMore] = useState(true);
const [loadingMore, setLoadingMore] = useState(false);
const loadMoreRef = useRef<HTMLDivElement | null>(null);

const fetchPosts = async (pageNumber = 1) => {
  try {
    const response = await getPosts(pageNumber, 10);

    if (pageNumber === 1) {
      setPosts(response.data || []);
    } else {
      setPosts((prev) => {
        const existingIds = new Set(prev.map((p: any) => p._id));

        const newPosts = (response.data || []).filter(
          (p: any) => !existingIds.has(p._id)
        );

        return [...prev, ...newPosts];
      });
    }

    setHasMore(response.pagination.hasMore);
    setPage(pageNumber);
  } catch (error) {
    console.error(error);
  } finally {
    setLoading(false);
  }
};

useEffect(() => {
  if (initialPosts) {
    setPosts(initialPosts);
    return;
  }

  fetchPosts(1);
}, [activeFeed, followingIds, initialPosts]);

useEffect(() => {
  if (initialPosts || !hasMore || loadingMore) return;

  const observer = new IntersectionObserver(
    async (entries) => {
      if (entries[0].isIntersecting && hasMore && !loadingMore) {
        setLoadingMore(true);

        await fetchPosts(page + 1);

        setLoadingMore(false);
      }
    },
    {
      threshold: 1,
    }
  );

  if (loadMoreRef.current) {
    observer.observe(loadMoreRef.current);
  }

  return () => {
    if (loadMoreRef.current) {
      observer.unobserve(loadMoreRef.current);
    }
    observer.disconnect();
  };
}, [page, hasMore, loadingMore]);

  useEffect(() => {
  if (!posts || posts.length === 0) return;

  const savedPosition = sessionStorage.getItem(
    "communityScrollPosition"
  );

  if (!savedPosition) return;

  const timer = setTimeout(() => {
    window.scrollTo({
      top: Number(savedPosition),
      behavior: "auto",
    });

    sessionStorage.removeItem("communityScrollPosition");
    sessionStorage.removeItem("communitySelectedPostId");
  }, 300);

  return () => clearTimeout(timer);
}, [posts]);

  const visiblePosts = (activeFeed === "trending"
    ? [...(Array.isArray(posts) ? posts : [])].sort((first, second) => {
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


        const firstFeatured = first.isFeatured === true;
const secondFeatured = second.isFeatured === true;

if (firstFeatured && !secondFeatured) return -1;
if (!firstFeatured && secondFeatured) return 1;

        return score(second) - score(first);
      })
    : posts
  ).filter(
    (post) =>
      activeFeed === "trending" || followingIds.includes(String(post.authorId))
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
      onClick={() => {
  sessionStorage.setItem(
    "communityScrollPosition",
    window.scrollY.toString()
  );

  sessionStorage.setItem(
    "communitySelectedPostId",
    post._id
  );

  router.push(`/community/${post._id}`);
}}
      onKeyDown={(e) => {
        if(e.key === "Enter" || e.key === " "){
           sessionStorage.setItem(
  "communityScrollPosition",
  window.scrollY.toString()
);

sessionStorage.setItem(
  "communitySelectedPostId",
  post._id
);

router.push(`/community/${post._id}`);
        }
      }}
      className="cursor-pointer rounded-lg transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-2xl hover:shadow-blue-200/40"
      >
    <div
     onClick={() => {
  sessionStorage.setItem(
    "communityScrollPosition",
    window.scrollY.toString()
  );

  sessionStorage.setItem(
    "communitySelectedPostId",
    post._id
  );

  router.push(`/community/${post._id}`);
}}
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
setSelectedReply={setSelectedReply}
setShowDeleteReplyModal={setShowDeleteReplyModal}
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

{showDeleteReplyModal && selectedReply && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
    <div className="w-350px rounded-xl bg-white p-6 shadow-xl">
      <h2 className="text-lg font-semibold">Delete reply</h2>

      <p className="mt-2 text-sm text-gray-600">
        Are you sure you want to delete this reply?
      </p>

      <div className="mt-5 flex justify-end gap-3">
        <button
          type="button"
          onClick={() => {
            setShowDeleteReplyModal(false);
            setSelectedReply(null);
          }}
          className="rounded-lg border px-4 py-2 text-sm"
        >
          Cancel
        </button>

        <button
          type="button"
          onClick={async () => {
            await deleteReply(
              selectedReply.postId,
              selectedReply.commentId,
              selectedReply.replyId
            );

            setPosts((previousPosts: any[]) =>
              previousPosts.map((post: any) =>
                post._id === selectedReply.postId
                  ? {
                      ...post,
                      comments: post.comments.map((comment: any) =>
                        comment._id === selectedReply.commentId
                          ? {
                              ...comment,
                              replies: comment.replies.filter(
                                (reply: any) =>
                                  reply._id !== selectedReply.replyId
                              ),
                            }
                          : comment
                      ),
                    }
                  : post
              )
            );

            setShowDeleteReplyModal(false);
            setSelectedReply(null);
          }}
          className="rounded-lg bg-red-600 px-4 py-2 text-sm text-white hover:bg-red-700"
        >
          Delete
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
      <div
  ref={loadMoreRef}
  className="h-10 flex items-center justify-center"
>
  {loadingMore && (
    <p className="text-sm text-gray-500">
      Loading more...
    </p>
  )}
</div>
    </>
  );
}