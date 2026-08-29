import Mainlayout from "@/layout/Mainlayout";
import { useEffect, useState, useRef } from "react";
import { useAuth } from "@/lib/AuthContext";


import CommunityHeader from "@/components/community/CommunityHeader";
import PostCard from "@/components/community/PostCard";
import { getPosts, toggleLikePost, deletePost, addComment, addReply, deleteComment, deleteReply,updatePost, toggleBookmarkPost } from "@/components/services/communityService"
import { get } from "http";
import { shareCommunityPost } from "@/utils/communityUtils";
import { useRouter } from "next/router";
import { log } from "console";
import usePostActions from "@/hooks/usePostActions";
import { useTranslation } from "react-i18next";

export default function CommunityPage() {
  const { user, updateUser } = useAuth();
  const { t } = useTranslation();
  const router = useRouter();
  //posts
  const [posts, setPosts] = useState<any[]>([]);
 
  // comments
  const [commentText, setCommentText] = useState("");
const [activeCommentPost, setActiveCommentPost] = useState<string | null>(null);
const [expandedComments, setExpandedComments] = useState<string[]>([]);



  //replies
const [replyText, setReplyText] = useState("");
const [activeReplyComment, setActiveReplyComment] = useState<string | null>(null);


//Delete Modals
const [showDeleteModal, setShowDeleteModal] = useState(false);
const [showDeleteCommentModal, setShowDeleteCommentModal] =
  useState(false);
const [showDeleteReplyModal, setShowDeleteReplyModal] =useState(false);


//Selected Items
const [selectedComment, setSelectedComment] = useState<{
  postId: string;
  commentId: string;
} | null>(null);
const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
const [selectedReply, setSelectedReply] = useState<{
  postId: string;
  commentId: string;
  replyId: string;
} | null>(null);

// Edit post
const [editingPost, setEditingPost] = useState<any>(null);
const [editContent, setEditContent] = useState("");
const [editHashtags, setEditHashtags] = useState("");
const [editTagInput, setEditTagInput] = useState("");
const [editImage, setEditImage] = useState<File | null>(null);

const [editProjectTitle, setEditProjectTitle] = useState("");
const [editProjectLink, setEditProjectLink] = useState("");

const [editAchievementTitle, setEditAchievementTitle] = useState("");
const [editAchievementDescription, setEditAchievementDescription] = useState("");

const [editCodeSnippet, setEditCodeSnippet] = useState("");



 const {
  handleLike,
  handleBookmark,
  handleComment,
  handleShare,
  handleReply,
  handleDelete,
  handleDeleteComment,
  handleSaveEdit,
  handleEdit
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

  replyText,
  setReplyText,
  setActiveReplyComment,
});

  const [page, setPage] = useState(1);
const [hasMore, setHasMore] = useState(true);
const [loadingMore, setLoadingMore] = useState(false);
const loadMoreRef = useRef<HTMLDivElement | null>(null);

const fetchPosts = async (pageNumber = 1) => {
  try {
    const response = await getPosts(pageNumber, 10);
    console.log("response",response);
    

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
     setLoadingMore(false)
  } catch (error) {
    console.log(error);
    setLoadingMore(false)
  }
};

useEffect(() => {
  fetchPosts(1);
}, []);

useEffect(() => {
  if (!hasMore || loadingMore) return;

  const observer = new IntersectionObserver(
    async (entries) => {
      if (entries[0].isIntersecting && hasMore && !loadingMore) {
        setLoadingMore(true);
        await fetchPosts(page + 1);
        setLoadingMore(false);
      }
    },
    { threshold: 1 }
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
}, [hasMore, page, loadingMore]);

const handleDeleteReply = async (
  postId: string,
  commentId: string,
  replyId: string
) => {
  try {
    await deleteReply(postId, commentId, replyId)

    setPosts((prevPosts: any[]) =>
      prevPosts.map((post: any) =>
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
  } catch (error: any) {
    console.log(error);
  }
};
useEffect(() => {
}, [posts]);
useEffect(() => {
  if (posts.length > 0) {
    const savedPosition = sessionStorage.getItem("communityScrollPosition");

    if (savedPosition) {
      requestAnimationFrame(() => {
        window.scrollTo({
          top: Number(savedPosition),
          behavior: "auto",
        });

        sessionStorage.removeItem("communityScrollPosition");
      });
    }
  }
}, [posts]);
  return (
    <Mainlayout>
      <main className="min-w-0 p-4 lg:p-6">
        <CommunityHeader />
        {/* Feed */}
        
        {posts.map((post) => (
         
          
          <div key ={post._id}
            onClick={() => {
  sessionStorage.setItem(
    "communityScrollPosition",
    String(window.scrollY)
  );

  router.push(`/community/${post._id}`);
}}
            className="cursor-pointer"
          >
            
          <PostCard
            post={post}
            user = {user}
            handleLike={handleLike}
            handleEdit={handleEdit}
            handleShare={handleShare}
            handleBookmark={handleBookmark}
            handleComment={handleComment}
            handleReply={handleReply}
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
          />
        </div>
        ))}
        <div ref={loadMoreRef} className="h-10 flex items-center justify-center">
  {loadingMore && <p className="text-sm text-gray-500">Loading more...</p>}
</div>
        
      </main>
      {showDeleteModal && (
  <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
    <div className="bg-white rounded-xl p-6 w-350px shadow-xl">
      <h2 className="text-lg font-semibold">
        Delete Post
      </h2>

      <p className="text-gray-600 mt-2">
        Are you sure you want to delete this post?
      </p>

      <div className="flex justify-end gap-3 mt-6">
        <button
          onClick={() => {
            setShowDeleteModal(false);
            setSelectedPostId(null);
          }}
          className="px-4 py-2 border rounded-lg"
        >
          No
        </button>

        <button
          onClick={() => {
            if (selectedPostId) {
              handleDelete(selectedPostId);
            }

            setShowDeleteModal(false);
            setSelectedPostId(null);
          }}
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
        >
          Yes, Delete
        </button>
      </div>
    </div>
  </div>
)}
{showDeleteCommentModal && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
    <div className="w-350px rounded-xl bg-white p-6 shadow-xl">
      <h2 className="text-lg font-semibold">
        Delete Comment
      </h2>

      <p className="mt-2 text-gray-600">
        Are you sure you want to delete this comment?
      </p>

      <div className="mt-6 flex justify-end gap-3">
        <button
          onClick={() => {
            setShowDeleteCommentModal(false);
            setSelectedComment(null);
          }}
          className="rounded-lg border px-4 py-2"
        >
          No
        </button>

        <button
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
{showDeleteReplyModal && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
    <div className="w-350px rounded-xl bg-white p-6 shadow-xl">
      <h2 className="text-lg font-semibold">
        {t("community.deleteReply")}
      </h2>

      <p className="mt-2 text-gray-600">
        Are you sure you want to delete this reply?
      </p>

      <div className="mt-6 flex justify-end gap-3">
        <button
          onClick={() => {
            setShowDeleteReplyModal(false);
            setSelectedReply(null);
          }}
          className="rounded-lg border px-4 py-2"
        >
          No
        </button>

        <button
          onClick={() => {
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
          className="rounded-lg bg-red-600 px-4 py-2 text-white hover:bg-red-700"
        >
          Yes, Delete
        </button>
      </div>
    </div>
  </div>
)}
{editingPost && (
  <div
    className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 py-6"
    onClick={(e) => e.stopPropagation()}
  >
    <div
      className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-xl bg-white p-6 shadow-xl"
      onClick={(e) => e.stopPropagation()}
    >
      {/* Header */}
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-xl font-semibold">
          Edit Post
        </h2>

        <button
          type="button"
          onClick={() => {
            setEditingPost(null);
            setEditContent("");
            setEditHashtags("");
            setEditTagInput("");
            setEditImage(null);
            setEditProjectTitle("");
            setEditProjectLink("");
            setEditAchievementTitle("");
            setEditAchievementDescription("");
            setEditCodeSnippet("");
          }}
          className="text-2xl leading-none text-gray-500 hover:text-gray-800"
        >
          ×
        </button>
      </div>

      {/* Content */}
      <div>
        <label className="mb-2 block text-sm font-medium text-gray-700">
          Content
        </label>

        <textarea
          value={editContent}
          onChange={(e) => setEditContent(e.target.value)}
          onClick={(e) => e.stopPropagation()}
          className="min-h-160px w-full resize-y rounded-md border p-3 outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Edit your post..."
        />
      </div>


      {/* Hashtags */}
      <div className="mt-5">
        <label className="mb-2 block text-sm font-medium text-gray-700">
          Hashtags
        </label>

        <div className="flex gap-2">
          <input
            type="text"
            value={editTagInput}
            onChange={(e) => setEditTagInput(e.target.value)}
            onClick={(e) => e.stopPropagation()}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();

                const tag = editTagInput.trim().replace(/^#/, "");

                if (
                  tag &&
                  !editHashtags
                    .split(" ")
                    .filter(Boolean)
                    .includes(`#${tag}`)
                ) {
                  setEditHashtags((prev) =>
                    prev ? `${prev} #${tag}` : `#${tag}`
                  );
                }

                setEditTagInput("");
              }
            }}
            placeholder="Add a hashtag"
            className="flex-1 rounded-md border px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
          />

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();

              const tag = editTagInput.trim().replace(/^#/, "");

              if (
                tag &&
                !editHashtags
                  .split(" ")
                  .filter(Boolean)
                  .includes(`#${tag}`)
              ) {
                setEditHashtags((prev) =>
                  prev ? `${prev} #${tag}` : `#${tag}`
                );
              }

              setEditTagInput("");
            }}
            className="rounded-md bg-blue-600 px-4 py-2 text-xl font-semibold text-white hover:bg-blue-700"
          >
            +
          </button>
        </div>

        {/* Tags */}
        <div className="mt-3 flex flex-wrap gap-2">
          {editHashtags
            .split(" ")
            .filter(Boolean)
            .map((tag, index) => (
              <span
                key={`${tag}-${index}`}
                className="flex items-center gap-1 rounded-full bg-blue-100 px-3 py-1 text-sm text-blue-700"
              >
                {tag}

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();

                    const updatedTags = editHashtags
                      .split(" ")
                      .filter((_, i) => i !== index)
                      .join(" ");

                    setEditHashtags(updatedTags);
                  }}
                  className="ml-1 text-base font-semibold text-blue-600 hover:text-red-600"
                >
                  ×
                </button>
              </span>
            ))}
        </div>
      </div>

      {/* Image */}
<div className="mt-5">
  <label className="mb-2 block text-sm font-medium text-gray-700">
    Image
  </label>

  {/* Current / Selected Image */}
  {(editImage || editingPost?.image) && (
    <div className="relative mb-3 w-fit">
      <img
        src={
          editImage
            ? URL.createObjectURL(editImage)
            : editingPost?.image
        }
        alt="Post image"
        className="max-h-48 max-w-full rounded-lg object-cover"
      />

      {/* Remove image */}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();

          setEditImage(null);

          if (editingPost?.image) {
            setEditingPost({
              ...editingPost,
              image: null,
            });
          }
        }}
        className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-red-600 text-lg font-bold text-white shadow hover:bg-red-700"
        aria-label="Remove image"
      >
        ×
      </button>
    </div>
  )}

  <input
    type="file"
    accept="image/jpeg,image/png,image/webp"
    onChange={(e) => {
      const file = e.target.files?.[0] || null;
      setEditImage(file);
    }}
    onClick={(e) => e.stopPropagation()}
    className="w-full rounded-md border p-2 text-sm"
  />

  {!editImage && !editingPost?.image && (
    <p className="mt-2 text-sm text-red-600">
      No file chosen
    </p>
  )}

  {editImage && (
    <p className="mt-2 text-sm text-gray-500">
      Selected: {editImage.name}
    </p>
  )}
</div>

      {/* Project Showcase */}
      {editingPost?.postType === "project" && (
        <div className="mt-5 rounded-lg border p-4">
          <h3 className="mb-4 font-semibold">
            Project Showcase
          </h3>

          <input
            type="text"
            value={editProjectTitle}
            onChange={(e) => setEditProjectTitle(e.target.value)}
            onClick={(e) => e.stopPropagation()}
            placeholder="Project title"
            className="mb-3 w-full rounded-md border px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
          />

          <input
            type="url"
            value={editProjectLink}
            onChange={(e) => setEditProjectLink(e.target.value)}
            onClick={(e) => e.stopPropagation()}
            placeholder="Project link"
            className="w-full rounded-md border px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      )}

      {/* Learning Achievement */}
      {editingPost?.postType === "achievement" && (
        <div className="mt-5 rounded-lg border p-4">
          <h3 className="mb-4 font-semibold">
            Learning Achievement
          </h3>

          <input
            type="text"
            value={editAchievementTitle}
            onChange={(e) =>
              setEditAchievementTitle(e.target.value)
            }
            onClick={(e) => e.stopPropagation()}
            placeholder="Achievement title"
            className="mb-3 w-full rounded-md border px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
          />

          <textarea
            value={editAchievementDescription}
            onChange={(e) =>
              setEditAchievementDescription(e.target.value)
            }
            onClick={(e) => e.stopPropagation()}
            placeholder="Achievement description"
            className="min-h-100px w-full rounded-md border p-3 outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      )}

      {/* Code Snippet */}
      {editingPost?.postType === "code" && (
        <div className="mt-5">
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Code Snippet
          </label>

          <textarea
            value={editCodeSnippet}
            onChange={(e) => setEditCodeSnippet(e.target.value)}
            onClick={(e) => e.stopPropagation()}
            placeholder="Edit your code..."
            className="min-h-180px w-full rounded-md border bg-gray-50 p-3 font-mono text-sm outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      )}

      {/* Buttons */}
      <div className="mt-6 flex justify-end gap-3 border-t pt-4">
        <button
          type="button"
          onClick={() => {
            setEditingPost(null);
            setEditContent("");
            setEditHashtags("");
            setEditTagInput("");
            setEditImage(null);
            setEditProjectTitle("");
            setEditProjectLink("");
            setEditAchievementTitle("");
            setEditAchievementDescription("");
            setEditCodeSnippet("");
          }}
          className="rounded-md border px-4 py-2 text-gray-700 hover:bg-gray-50"
        >
          Cancel
        </button>

        <button
          type="button"
          onClick={handleSaveEdit}
          className="rounded-md bg-blue-600 px-5 py-2 text-white hover:bg-blue-700"
        >
          Save Changes
        </button>
      </div>
    </div>
  </div>
)}
    </Mainlayout>
  );
}