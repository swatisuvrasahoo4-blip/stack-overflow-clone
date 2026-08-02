import Mainlayout from "@/layout/Mainlayout";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { getPosts } from "@/components/services/communityService";
import PostCard from "@/components/community/PostCard";
import { useAuth } from "@/lib/AuthContext";
import usePostActions from "@/hooks/usePostActions";

export default function TagDetailPage() {
  const router = useRouter();
  const { tag } = router.query;
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [commentText, setCommentText] = useState("");
  const [activeCommentPost, setActiveCommentPost] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");
  const [activeReplyComment, setActiveReplyComment] = useState<string | null>(null);
  const [expandedComments, setExpandedComments] = useState<string[]>([]);
  const [editingPost, setEditingPost] = useState<any>(null);
  const [editContent, setEditContent] = useState("");

  const { user } = useAuth();

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

  useEffect(() => {
    const loadPosts = async () => {
      const tagName = Array.isArray(tag) ? tag[0] : tag;
      if (!tagName) {
        setPosts([]);
        setLoading(false);
        return;
      }

      try {
        const allPosts = await getPosts();
        const normalizedTag = tagName.toString().toLowerCase();

        setPosts(
          Array.isArray(allPosts)
            ? allPosts.filter((post: any) =>
                (post.hashtags || [])
                  .map((item: any) => String(item).toLowerCase())
                  .includes(normalizedTag)
              )
            : []
        );
      } catch (error) {
        console.error("Tag detail load failed:", error);
        setPosts([]);
      } finally {
        setLoading(false);
      }
    };

    loadPosts();
  }, [tag]);

  const tagName = Array.isArray(tag) ? tag[0] : tag;

  return (
    <Mainlayout>
      <main className="min-w-0 p-4 lg:p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold">#{tagName}</h1>
          <p className="mt-2 text-gray-600">
            Community posts tagged with #{tagName}.
          </p>
        </div>

        {loading ? (
          <p className="text-gray-500">Loading posts...</p>
        ) : posts.length === 0 ? (
          <p className="text-gray-500">No posts found for this tag.</p>
        ) : (
          <div className="space-y-4">
            {posts.map((post) => (
              <PostCard
                key={post._id}
                post={post}
                user={user}
                handleLike={handleLike}
                handleBookmark={handleBookmark}
                handleComment={handleComment}
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
                setSelectedComment={() => {}}
                setShowDeleteCommentModal={() => {}}
                setSelectedReply={() => {}}
                setShowDeleteReplyModal={() => {}}
                setSelectedPostId={() => {}}
                setShowDeleteModal={() => {}}
              />
            ))}
          </div>
        )}
      </main>
    </Mainlayout>
  );
}
