import { useEffect, useState, useRef } from "react";
import {
  getPosts,
  deleteReply,
} from "@/components/services/communityService";
import { useRouter } from "next/router";
import PostCard from "../community/PostCard";
import { useAuth } from "@/lib/AuthContext";
import usePostActions from "@/hooks/usePostActions";
import { useTranslation } from "react-i18next";

export default function PostFeed({
  activeFeed = "trending",
  followingIds = [],
  initialPosts,
  onPostCountChange,
}: {
  activeFeed?: "trending" | "following";
  followingIds?: string[];
  initialPosts?: any[];
  onPostCountChange?: (count: number) => void;
}) {
  const { user, updateUser } = useAuth();
  const router = useRouter();
  const { t } = useTranslation();

  const [posts, setPosts] = useState<any[]>(
    initialPosts || []
  );

  const [commentText, setCommentText] = useState("");
  const [activeCommentPost, setActiveCommentPost] =
    useState<string | null>(null);

  const [editingPost, setEditingPost] = useState<any>(null);
  const [editContent, setEditContent] = useState("");
  const [editHashtags, setEditHashtags] = useState("");
  const [editTagInput, setEditTagInput] = useState("");
  const [editImage, setEditImage] = useState<File | null>(null);
  const [editProjectTitle, setEditProjectTitle] = useState("");
  const [editProjectLink, setEditProjectLink] = useState("");
  const [editAchievementTitle, setEditAchievementTitle] =
    useState("");
  const [editAchievementDescription, setEditAchievementDescription] =
    useState("");
  const [editCodeSnippet, setEditCodeSnippet] = useState("");

  const [replyText, setReplyText] = useState("");
  const [activeReplyComment, setActiveReplyComment] =
    useState<string | null>(null);

  const [expandedComments, setExpandedComments] = useState<
    string[]
  >([]);

  const [selectedPostId, setSelectedPostId] =
    useState<string | null>(null);

  const [showDeleteModal, setShowDeleteModal] =
    useState(false);

  const [selectedReply, setSelectedReply] = useState<{
    postId: string;
    commentId: string;
    replyId: string;
  } | null>(null);

  const [showDeleteReplyModal, setShowDeleteReplyModal] =
    useState(false);

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
    editHashtags,
    setEditHashtags,
    editImage,
    editTagInput,
    setEditTagInput,
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

  const [loading, setLoading] = useState(
    !initialPosts
  );

  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] =
    useState(false);

    const loadMoreRef = useRef<HTMLDivElement | null>(null);

  // --------------------------------------------------
  // FETCH POSTS
  // --------------------------------------------------

  const fetchPosts = async (
    pageNumber = 1
  ) => {
    try {
      console.log(
        "FETCHING PAGE:",
        pageNumber
      );

      const response = await getPosts(
        pageNumber,
        10
      );

      console.log(
        "RECEIVED POSTS:",
        response.data?.length
      );

      console.log(
        "HAS MORE:",
        response.pagination?.hasMore
      );

      if (pageNumber === 1) {
        setPosts(response.data || []);
      } else {
        setPosts((previousPosts) => {
          const existingIds = new Set(
            previousPosts.map((post: any) =>
              String(post._id)
            )
          );

          const newPosts = (
            response.data || []
          ).filter(
            (post: any) =>
              !existingIds.has(
                String(post._id)
              )
          );

          console.log(
            "OLD POSTS:",
            previousPosts.length
          );

          console.log(
  "PAGE",
  pageNumber,
  "API POSTS",
  response.data?.map((post: any) => post._id)
);

console.log(
  "NEW POSTS",
  newPosts.map((post: any) => post._id)
);

          console.log(
            "NEW POSTS:",
            newPosts.length
          );

          console.log(
            "TOTAL POSTS:",
            previousPosts.length +
              newPosts.length
          );

          return [
            ...previousPosts,
            ...newPosts,
          ];
        });
      }

      setHasMore(
        response.pagination?.hasMore ?? false
      );

      setPage(pageNumber);
    } catch (error) {
      console.error(
        "Failed to fetch posts:",
        error
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
  if (initialPosts || !hasMore) return;

  const observer = new IntersectionObserver(
    (entries) => {
      if (
        entries[0].isIntersecting &&
        !loadingMore &&
        hasMore
      ) {
        setLoadingMore(true);

        fetchPosts(page + 1).finally(() => {
          setLoadingMore(false);
        });
      }
    },
    {
      rootMargin: "300px",
    }
  );

  const element = loadMoreRef.current;

  if (element) {
    observer.observe(element);
  }

  return () => {
    observer.disconnect();
  };
}, [
  page,
  hasMore,
  loadingMore,
  initialPosts,
]);

useEffect(() => {
  if (initialPosts) {
    setPosts(initialPosts);
    return;
  }

  const selectedPostId = sessionStorage.getItem(
    "communitySelectedPostId"
  );

  const savedPage = sessionStorage.getItem(
    "communityFeedPage"
  );

  const restorePage =
    selectedPostId && savedPage
      ? Number(savedPage)
      : 1;

  // Clear it immediately so a normal refresh
  // does not load extra pages.
  if (selectedPostId && savedPage) {
    sessionStorage.removeItem(
      "communityFeedPage"
    );
  }

  setPage(1);
  setHasMore(true);
  setLoading(true);

  const loadRequiredPages = async () => {
    try {
      await fetchPosts(1);

      for (
        let currentPage = 2;
        currentPage <= restorePage;
        currentPage++
      ) {
        await fetchPosts(currentPage);
      }
    } catch (error) {
      console.error(
        "Failed to restore community feed:",
        error
      );
    }
  };

  loadRequiredPages();
}, [activeFeed, initialPosts]);

// RESTORE EXACT POST WHEN RETURNING FROM POST PAGE
useEffect(() => {
  if (!router.isReady || loading || posts.length === 0) {
    return;
  }

  const selectedPostId = sessionStorage.getItem(
    "communitySelectedPostId"
  );

  if (!selectedPostId) {
    return;
  }

  const postElement = document.getElementById(
    `community-post-${selectedPostId}`
  );

  if (!postElement) {
    // The selected post is not loaded yet.
    return;
  }

  const timer = setTimeout(() => {
    postElement.scrollIntoView({
      behavior: "auto",
      block: "center",
    });

    sessionStorage.removeItem(
      "communitySelectedPostId"
    );
  }, 300);

  return () => clearTimeout(timer);
}, [router.isReady, loading, posts.length]);

  // --------------------------------------------------
  // VISIBLE POSTS
  // --------------------------------------------------

  const visiblePosts = (
  activeFeed === "trending"
    ? [...(Array.isArray(posts) ? posts : [])].sort(
        (first: any, second: any) => {
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

          const firstFeatured =
            first.isFeatured === true;

          const secondFeatured =
            second.isFeatured === true;

          if (firstFeatured && !secondFeatured) {
            return -1;
          }

          if (!firstFeatured && secondFeatured) {
            return 1;
          }

          return score(second) - score(first);
        }
      )
    : posts
).filter((post: any) => {
  return (
    activeFeed === "trending" ||
    followingIds.includes(String(post.authorId))
  );
});
  // --------------------------------------------------
  // POST COUNT
  // --------------------------------------------------

  useEffect(() => {
    onPostCountChange?.(
      visiblePosts.length
    );
  }, [
    visiblePosts.length,
    onPostCountChange,
  ]);

  // --------------------------------------------------
  // LOADING
  // --------------------------------------------------

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

  // --------------------------------------------------
  // UI
  // --------------------------------------------------

  return (
    <>
      <div className="mt-6 flex flex-col gap-4">
        {visiblePosts.map(
          (post) => (
            <div
              key={post._id}
              id={`community-post-${post._id}`}
              className="rounded-lg transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-2xl hover:shadow-blue-200/40"
              onClick={(e) => {
  const target = e.target as HTMLElement;

  if (
    target.closest(
      "button, input, textarea, select, a, [role='button'], [contenteditable='true']"
    )
  ) {
    return;
  }

  // Save the exact post that was clicked
  sessionStorage.setItem(
    "communitySelectedPostId",
    String(post._id)
  );

  sessionStorage.setItem(
  "communityFeedPage",
  String(page)
);

  router.push(`/community/${post._id}`);
}}
            >
              <PostCard
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
                handleReply={
                  handleReply
                }
                handleDelete={
                  handleDelete
                }
                handleEdit={
                  handleEdit
                }
                editingPost={
                  editingPost
                }
                editContent={
                  editContent
                }
                setEditContent={
                  setEditContent
                }
                handleSaveEdit={
                  handleSaveEdit
                }
                setEditingPost={
                  setEditingPost
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
                selectedPostId={
                  selectedPostId
                }
                setSelectedPostId={
                  setSelectedPostId
                }
                showDeleteModal={
                  showDeleteModal
                }
                setShowDeleteModal={
                  setShowDeleteModal
                }
                selectedComment={
                  selectedComment
                }
                setSelectedComment={
                  setSelectedComment
                }
                showDeleteCommentModal={
                  showDeleteCommentModal
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
          )
        )}
      </div>

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

      {/* DELETE POST */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="w-full max-w-sm rounded-xl bg-white p-6 shadow-xl">
            <h2 className="text-lg font-semibold">
              Delete Post
            </h2>

            <p className="mt-2 text-gray-600">
              Are you sure you want to delete this post?
            </p>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => {
                  setShowDeleteModal(
                    false
                  );
                  setSelectedPostId(
                    null
                  );
                }}
                className="rounded-lg border px-4 py-2"
              >
                No
              </button>

              <button
                type="button"
                onClick={() => {
                  if (
                    selectedPostId
                  ) {
                    handleDelete(
                      selectedPostId
                    );
                  }

                  setShowDeleteModal(
                    false
                  );
                  setSelectedPostId(
                    null
                  );
                }}
                className="rounded-lg bg-red-600 px-4 py-2 text-white hover:bg-red-700"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DELETE REPLY */}
      {showDeleteReplyModal &&
        selectedReply && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="w-350px rounded-xl bg-white p-6 shadow-xl">
              <h2 className="text-lg font-semibold">
                Delete reply
              </h2>

              <p className="mt-2 text-sm text-gray-600">
                Are you sure you want to delete this reply?
              </p>

              <div className="mt-5 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowDeleteReplyModal(
                      false
                    );
                    setSelectedReply(
                      null
                    );
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

                    setPosts(
                      (
                        previousPosts
                      ) =>
                        previousPosts.map(
                          (
                            post: any
                          ) =>
                            post._id ===
                            selectedReply.postId
                              ? {
                                  ...post,
                                  comments:
                                    post.comments.map(
                                      (
                                        comment: any
                                      ) =>
                                        comment._id ===
                                        selectedReply.commentId
                                          ? {
                                              ...comment,
                                              replies:
                                                comment.replies.filter(
                                                  (
                                                    reply: any
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

                    setShowDeleteReplyModal(
                      false
                    );
                    setSelectedReply(
                      null
                    );
                  }}
                  className="rounded-lg bg-red-600 px-4 py-2 text-sm text-white hover:bg-red-700"
                >
                  {t(
                    "community.delete"
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

      {/* DELETE COMMENT */}
      {showDeleteCommentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="w-full max-w-sm rounded-xl bg-white p-6 shadow-xl">
            <h2 className="text-lg font-semibold">
              Delete Comment
            </h2>

            <p className="mt-2 text-gray-600">
              Are you sure you want to delete this comment?
            </p>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => {
                  setShowDeleteCommentModal(
                    false
                  );
                  setSelectedComment(
                    null
                  );
                }}
                className="rounded-lg border px-4 py-2"
              >
                No
              </button>

              <button
                type="button"
                onClick={() => {
                  if (
                    selectedComment
                  ) {
                    handleDeleteComment(
                      selectedComment.postId,
                      selectedComment.commentId
                    );
                  }

                  setShowDeleteCommentModal(
                    false
                  );
                  setSelectedComment(
                    null
                  );
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