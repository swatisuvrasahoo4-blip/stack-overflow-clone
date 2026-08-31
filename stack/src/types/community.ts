import type {
  Dispatch,
  SetStateAction,
} from "react";

export interface Mention {
  userId?: string;
  username?: string;
  name?: string;
}

export interface Reply {
  _id: string;
  userId: string;
  userName: string;
  text: string;
  createdAt: string;
}

export interface Comment {
  _id: string;
  userId: string;
  userName: string;
  text: string;
  createdAt: string;
  replies?: Reply[];
}

export interface Post {
  _id: string;
  content: string;
  createdAt: string;

  authorId?: string;
  authorName?: string;

  userId?: string;
  userid?: string;

  postType?: string;

  isFeatured?: boolean;
  isEdited?: boolean;

  projectTitle?: string;
  projectLink?: string;

  achievementTitle?: string;
  achievementDescription?: string;

  image?: string;
  codeSnippet?: string;

  hashtags?: string[] | string;

  likes?: string[];

  comments?: Comment[];

  mentions?: Mention[];

  isBookmarked?: boolean;
}

export interface User {
  _id?: string;
  id?: string;
  userId?: string;

  name?: string;
  username?: string;

  email?: string;

  reputation?: number;

  bookmarks?: string[];
}

export interface SelectedComment {
  postId: string;
  commentId: string;
}

export interface SelectedReply {
  postId: string;
  commentId: string;
  replyId: string;
}

export interface PostCardProps {
  post: Post;

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

  activeCommentPost: string | null;

  setActiveCommentPost: Dispatch<
    SetStateAction<string | null>
  >;

  commentText: string;

  setCommentText: Dispatch<
    SetStateAction<string>
  >;

  activeReplyComment: string | null;

  setActiveReplyComment: Dispatch<
    SetStateAction<string | null>
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
    SetStateAction<string | null>
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

  isBookmarked?: boolean;
}