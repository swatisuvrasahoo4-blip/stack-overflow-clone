import { useState } from "react";
import Link from "next/link";
import { useTranslation } from "react-i18next";

import type { Post } from "@/types/community";

interface CommunityPostDetailCardProps {
  post: Post;
}

const CommunityPostDetailCard = ({
  post,
}: CommunityPostDetailCardProps) => {
  const { t } = useTranslation("community");

  const [copied, setCopied] =
    useState(false);

    if (!post) {
  return null;
}

  const handleCopyCode =
    async (): Promise<void> => {
      if (!post.codeSnippet) {
        return;
      }

      try {
        await navigator.clipboard.writeText(
          post.codeSnippet
        );

        setCopied(true);

        setTimeout(() => {
          setCopied(false);
        }, 2000);
      } catch (error: unknown) {
        console.error(
          "Failed to copy code:",
          error
        );
      }
    };

  const hashtags = post.hashtags
    ? Array.isArray(post.hashtags)
      ? post.hashtags
      : post.hashtags.split(",")
    : [];

  const imageUrl =
    post.image &&
    post.image.startsWith("http")
      ? post.image
      : post.image
        ? `http://localhost:5000${post.image}`
        : "";

  return (
    <div className="rounded-lg border bg-white p-5">
      {/* Author */}

      <Link
        href={`/users/${post.authorId}`}
        className="text-lg font-semibold hover:text-blue-600"
      >
        {post.authorName ||
          t("labels.unknown_user")}
      </Link>

      {/* Post type */}

      <p className="mt-1 text-sm text-blue-600">
        {post.postType ||
          t("labels.community_post")}
      </p>

      {/* Content */}

      <p className="mt-4 text-gray-800">
        {post.content}
      </p>

      {/* Image */}

      {post.image && (
        <img
          src={imageUrl}
          alt={t(
            "accessibility.post_image"
          )}
          className="mt-4 max-h-[500px] w-full rounded-lg object-cover"
        />
      )}

      {/* Hashtags */}

      {hashtags.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {hashtags.map((tag) => (
            <span
              key={tag.trim()}
              className="rounded bg-blue-100 px-2 py-1 text-xs text-blue-700"
            >
              #{tag.trim()}
            </span>
          ))}
        </div>
      )}

      {/* Code snippet */}

      {post.codeSnippet && (
        <div className="relative mt-4">
          <button
            type="button"
            onClick={() =>
              void handleCopyCode()
            }
            className="absolute right-2 top-2 rounded bg-gray-700 px-3 py-1 text-xs text-white hover:bg-gray-600"
          >
            {copied
              ? `✅ ${t(
                  "status.copied"
                )}`
              : `📋 ${t(
                  "actions.copy"
                )}`}
          </button>

          <pre className="overflow-x-auto rounded-lg bg-gray-900 p-4 pt-10 text-sm text-green-400">
            <code>
              {post.codeSnippet}
            </code>
          </pre>
        </div>
      )}

      {/* Created date */}

      {post.createdAt && (
        <p className="mt-4 text-xs text-gray-500">
          {new Date(
            post.createdAt
          ).toLocaleString()}
        </p>
      )}
    </div>
  );
};

export default CommunityPostDetailCard;