import type {
  Dispatch,
  SetStateAction,
} from "react";

import { useRouter } from "next/router";

import PostCard from "./PostCard/PostCard";

import type {
  Post,
  SelectedComment,
  SelectedReply,
  User,
} from "@/types/community";

interface PostFeedListProps {
  posts: Post[];
  user: User | null;

  handleLike: (
    postId: string
  ) => Promise<void>;

  handleBookmark: (
    post: Post
  ) => Promise<boolean | null>;

  handleComment: (
    postId: string
  ) => Promise<void>;

  handleReply: (
    postId: string,
    commentId: string
  ) => Promise<void>;

  handleDelete: (
    postId: string
  ) => Promise<void>;

  handleEdit: (
    post: Post
  ) => void;

  handleShare: (
    postId: string
  ) => Promise<void>;

  activeCommentPost:
    | string
    | null;

  setActiveCommentPost: Dispatch<
    SetStateAction<
      string | null
    >
  >;

  commentText: string;

  setCommentText: Dispatch<
    SetStateAction<string>
  >;

  activeReplyComment:
    | string
    | null;

  setActiveReplyComment: Dispatch<
    SetStateAction<
      string | null
    >
  >;

  replyText: string;

  setReplyText: Dispatch<
    SetStateAction<string>
  >;

  expandedComments: string[];

  setExpandedComments: Dispatch<
    SetStateAction<string[]>
  >;

  setSelectedPostId: Dispatch<
    SetStateAction<
      string | null
    >
  >;

  setShowDeleteModal: Dispatch<
    SetStateAction<boolean>
  >;

  setSelectedComment: Dispatch<
    SetStateAction<
      SelectedComment | null
    >
  >;

  setShowDeleteCommentModal: Dispatch<
    SetStateAction<boolean>
  >;

  setSelectedReply: Dispatch<
    SetStateAction<
      SelectedReply | null
    >
  >;

  setShowDeleteReplyModal: Dispatch<
    SetStateAction<boolean>
  >;
}

const PostFeedList = ({
  posts,
  user,

  handleLike,
  handleBookmark,
  handleComment,
  handleReply,
  handleDelete,
  handleEdit,
  handleShare,

  activeCommentPost,
  setActiveCommentPost,

  commentText,
  setCommentText,

  activeReplyComment,
  setActiveReplyComment,

  replyText,
  setReplyText,

  expandedComments,
  setExpandedComments,

  setSelectedPostId,
  setShowDeleteModal,

  setSelectedComment,
  setShowDeleteCommentModal,

  setSelectedReply,
  setShowDeleteReplyModal,
}: PostFeedListProps) => {
  const router = useRouter();

  return (
    <div className="mt-6 flex flex-col gap-4">
      {posts.map((post) => (
        <div
          key={post._id}
          id={`community-post-${post._id}`}
          className="rounded-lg transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-2xl hover:shadow-blue-200/40"
          onClick={(event) => {
            const target =
              event.target as HTMLElement;

            if (
              target.closest(
                "button, input, textarea, select, a, [role='button'], [contenteditable='true']"
              )
            ) {
              return;
            }

            sessionStorage.setItem(
              "communitySelectedPostId",
              String(post._id)
            );

            void router.push(
              `/community/${post._id}`
            );
          }}
        >
          {/* Post card */}

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
        </div>
      ))}
    </div>
  );
};

export default PostFeedList;