import Mainlayout from "@/layout/Mainlayout";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { getTagContent } from "@/components/services/tagService";
import PostCard from "@/components/community/PostCard";
import { useAuth } from "@/lib/AuthContext";
import usePostActions from "@/hooks/usePostActions";
import type { Post } from "@/types/community";

interface TagQuestion {
  _id: string;
  questiontitle: string;
  questionbody: string;
  questiontags: string[];
}

export default function TagDetailPage() {
  const router = useRouter();
  const { tag } = router.query;

  const [posts, setPosts] = useState<Post[]>([]);
  const [questions, setQuestions] = useState<TagQuestion[]>([]);
  const [loading, setLoading] = useState(true);

  const [commentText, setCommentText] = useState("");

  const [activeCommentPost, setActiveCommentPost] =
    useState<string | null>(null);

  const [replyText, setReplyText] = useState("");

  const [activeReplyComment, setActiveReplyComment] =
    useState<string | null>(null);

  const [expandedComments, setExpandedComments] =
    useState<string[]>([]);

  const [editingPost, setEditingPost] =
    useState<Post | null>(null);

  const [editContent, setEditContent] = useState("");

  const [editHashtags, setEditHashtags] = useState("");
  const [editTagInput, setEditTagInput] = useState("");

  const [editImage, setEditImage] =
    useState<File | null>(null);

  const [editProjectTitle, setEditProjectTitle] =
    useState("");

  const [editProjectLink, setEditProjectLink] =
    useState("");

  const [
    editAchievementTitle,
    setEditAchievementTitle,
  ] = useState("");

  const [
    editAchievementDescription,
    setEditAchievementDescription,
  ] = useState("");

  const [editCodeSnippet, setEditCodeSnippet] =
    useState("");

  // Delete post modal states
  const [selectedPostId, setSelectedPostId] =
    useState<string | null>(null);

  const [showDeleteModal, setShowDeleteModal] =
    useState(false);

  const { user, updateUser } = useAuth();

  const {
    handleLike,
    handleBookmark,
    handleComment,
    handleShare,
    handleEdit,
    handleDelete,
    handleReply,
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
  });

  useEffect(() => {
    const loadTagContent = async (): Promise<void> => {
      const tagName =
        Array.isArray(tag) ? tag[0] : tag;

      if (!tagName) {
        setPosts([]);
        setQuestions([]);
        setLoading(false);
        return;
      }

      try {
        const data = await getTagContent(tagName);

        setPosts(data.posts || []);
        setQuestions(data.questions || []);
      } catch (error: unknown) {
        console.error(
          "Tag detail load failed:",
          error
        );

        setPosts([]);
        setQuestions([]);
      } finally {
        setLoading(false);
      }
    };

    void loadTagContent();
  }, [tag]);

  const tagName =
    Array.isArray(tag) ? tag[0] : tag;

  return (
    <Mainlayout>
      <main className="min-w-0 p-4 lg:p-6">
        {/* Tag Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-semibold">
            #{tagName}
          </h1>

          <p className="mt-2 text-gray-600">
            Questions and community posts tagged with #
            {tagName}.
          </p>
        </div>

        {loading ? (
          <p className="text-gray-500">
            Loading...
          </p>
        ) : (
          <>
            {/* Questions */}
            {questions.length > 0 && (
              <div className="mb-8">
                <h2 className="mb-3 text-lg font-semibold">
                  Questions
                </h2>

                <div className="space-y-4">
                  {questions.map((question) => (
                    <div
                      key={question._id}
                      onClick={() =>
                        void router.push(
                          `/questions/${question._id}`
                        )
                      }
                      className="cursor-pointer rounded-lg border bg-white p-4 shadow-sm transition hover:shadow-md"
                    >
                      <h3 className="font-medium text-blue-600 hover:underline">
                        {question.questiontitle}
                      </h3>

                      <p className="mt-2 line-clamp-2 text-sm text-gray-700">
                        {question.questionbody}
                      </p>

                      <div className="mt-3 flex flex-wrap gap-2">
                        {question.questiontags.map(
                          (questionTag) => (
                            <span
                              key={questionTag}
                              className="rounded bg-blue-100 px-2 py-1 text-xs text-blue-800"
                            >
                              {questionTag}
                            </span>
                          )
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Community Posts */}
            {posts.length > 0 && (
              <div>
                <h2 className="mb-3 text-lg font-semibold">
                  Community Posts
                </h2>

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
                      handleReply={handleReply}
                      activeCommentPost={
                        activeCommentPost
                      }
                      setActiveCommentPost={
                        setActiveCommentPost
                      }
                      commentText={commentText}
                      setCommentText={
                        setCommentText
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
                      replyText={replyText}
                      setReplyText={setReplyText}
                      setSelectedComment={() => {}}
                      setShowDeleteCommentModal={() =>
                        {}
                      }
                      setSelectedReply={() => {}}
                      setShowDeleteReplyModal={() =>
                        {}
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
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Empty State */}
            {posts.length === 0 &&
              questions.length === 0 && (
                <p className="text-gray-500">
                  No questions or posts found for this
                  tag.
                </p>
              )}
          </>
        )}
      </main>
    </Mainlayout>
  );
}