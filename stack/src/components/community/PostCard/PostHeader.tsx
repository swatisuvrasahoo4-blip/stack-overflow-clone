"use client";

import { Dispatch, SetStateAction } from "react";
import Link from "next/link";
import { Star } from "lucide-react";
import { useTranslation } from "react-i18next";

import PostActions from "../PostActions";
import ReportPostButton from "../../reports/ReportPostButton";

import type { Post, User } from "@/types/community";

interface PostHeaderProps {
  post: Post;
  user: User | null;
  currentUserId?: string;

  handleEdit: (
    post: Post
  ) => void;

  setSelectedPostId: Dispatch<
    SetStateAction<string | null>
  >;

  setShowDeleteModal: Dispatch<
    SetStateAction<boolean>
  >;

  handleReportClick: () => Promise<void>;
}

const PostHeader = ({
  post,
  user,
  currentUserId,
  handleEdit,
  setSelectedPostId,
  setShowDeleteModal,
  handleReportClick,
}: PostHeaderProps) => {
  const { t } = useTranslation("community");

  return (
    <div className="flex items-start justify-between">
      {/* Author information */}

      <div>
        <Link
          href={`/users/${post.authorId}`}
          className="text-lg font-semibold hover:text-blue-600 hover:underline"
          onClick={(event) =>
            event.stopPropagation()
          }
        >
          {post.authorName}
        </Link>

        <div className="flex items-center gap-2">
          <p className="text-xs font-medium text-blue-600">
            {post.postType}
          </p>

          {post.isFeatured && (
            <span className="inline-flex items-center gap-1 rounded-full bg-yellow-100 px-2 py-1 text-xs font-semibold text-yellow-800">
              <Star className="h-3 w-3 fill-yellow-500 text-yellow-500" />

              {t("badges.featured")}
            </span>
          )}
        </div>

        <p className="text-xs text-gray-500">
          {new Date(
            post.createdAt
          ).toLocaleString()}

          {post.isEdited && (
            <span className="ml-2 italic text-gray-400">
              {t("status.edited")}
            </span>
          )}
        </p>
      </div>

      {/* Post actions */}

      <div className="flex items-center gap-2">
        {String(currentUserId) !==
          String(post.authorId) && (
          <ReportPostButton
            onClick={handleReportClick}
          />
        )}

        <PostActions
          post={post}
          user={user}
          onEdit={handleEdit}
          setSelectedPostId={
            setSelectedPostId
          }
          setShowDeleteModal={
            setShowDeleteModal
          }
        />
      </div>
    </div>
  );
};

export default PostHeader;