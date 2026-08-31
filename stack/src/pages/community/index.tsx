import {
  useEffect,
  useState,
} from "react";

import CommunityHeader from "@/components/community/CommunityHeader";
import PostFeedList from "@/components/community/PostFeedList";

import DeleteCommentModal from "@/components/community/modals/DeleteCommentModal";
import DeletePostModal from "@/components/community/modals/DeletePostModal";
import DeleteReplyModal from "@/components/community/modals/DeleteReplyModal";
import EditPostModal from "@/components/community/modals/EditPostModal";

import useEditPostState from "@/hooks/useEditPostState";
import usePostActions from "@/hooks/usePostActions";
import usePostDelete from "@/hooks/usePostDelete";
import usePostFeed from "@/hooks/usePostFeed";

import Mainlayout from "@/layout/Mainlayout";

import { useAuth } from "@/lib/AuthContext";

const CommunityPage = () => {
  const {
    user,
    updateUser,
  } = useAuth();

  // Community feed
  const {
    posts,
    setPosts,
    loading,
    loadingMore,
    loadMoreRef,
  } = usePostFeed({
    activeFeed: "trending",
    followingIds: [],
  });

  // Edit post state
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

  // Comment state
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
    expandedComments,
    setExpandedComments,
  ] = useState<string[]>([]);

  // Reply state
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

  // Post actions
  const {
    handleLike,
    handleBookmark,
    handleComment,
    handleShare,
    handleReply,
    handleDelete,
    handleDeleteComment,
    handleSaveEdit,
    handleEdit,
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

  // Delete state and actions
  const {
    setSelectedPostId,
    showDeleteModal,
    setShowDeleteModal,

    setSelectedReply,
    showDeleteReplyModal,
    setShowDeleteReplyModal,

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

  // Restore scroll position
  useEffect(() => {
    if (posts.length === 0) {
      return;
    }

    const savedPosition =
      sessionStorage.getItem(
        "communityScrollPosition"
      );

    if (!savedPosition) {
      return;
    }

    requestAnimationFrame(() => {
      window.scrollTo({
        top: Number(
          savedPosition
        ),
        behavior: "auto",
      });

      sessionStorage.removeItem(
        "communityScrollPosition"
      );
    });
  }, [posts]);

  return (
    <Mainlayout>
      <main className="min-w-0 p-4 lg:p-6">
        {/* Community header */}
        <CommunityHeader />

        {/* Initial loading */}
        {loading && (
          <p className="py-6 text-center text-sm text-gray-500">
            Loading posts...
          </p>
        )}

        {/* Community posts */}
        {!loading && (
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
        )}

        {/* Infinite scroll trigger */}
        <div
          ref={loadMoreRef}
          className="flex h-10 items-center justify-center"
        >
          {loadingMore && (
            <p className="text-sm text-gray-500">
              Loading more...
            </p>
          )}
        </div>
      </main>

      {/* Delete post modal */}
      <DeletePostModal
        open={showDeleteModal}
        onClose={
          closeDeletePostModal
        }
        onConfirm={
          confirmDeletePost
        }
      />

      {/* Delete comment modal */}
      <DeleteCommentModal
        open={
          showDeleteCommentModal
        }
        onClose={
          closeDeleteCommentModal
        }
        onConfirm={
          confirmDeleteComment
        }
      />

      {/* Delete reply modal */}
      <DeleteReplyModal
        open={
          showDeleteReplyModal
        }
        onClose={
          closeDeleteReplyModal
        }
        onConfirm={
          confirmDeleteReply
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
    </Mainlayout>
  );
};

export default CommunityPage;