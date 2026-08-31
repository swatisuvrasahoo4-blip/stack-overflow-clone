"use client";

import { useTranslation } from "react-i18next";
import { getImageUrl } from "@/lib/getImageUrl";
import type { Post } from "@/types/community";

interface PostContentProps {
  post: Post;
}

const PostContent = ({ post }: PostContentProps) => {
  const { t } = useTranslation();

  const hashtags: string[] = Array.isArray(post.hashtags)
    ? post.hashtags
        .flatMap((tag: string) =>
          tag.split(/[,\s]+/).map((value: string) =>
            value.trim()
          )
        )
        .filter(Boolean)
    : typeof post.hashtags === "string"
      ? post.hashtags
          .split(/[,\s]+/)
          .map((tag: string) => tag.trim())
          .filter(Boolean)
      : [];

  return (
    <>
      {/* Main post content */}
      <p className="mt-4">
        {post.content}
      </p>

      {/* Project showcase */}
      {post.postType === "Project Showcase" &&
        post.projectTitle && (
          <div className="mt-4 rounded-lg border border-blue-200 bg-blue-50 p-4">
            <h4 className="font-semibold text-blue-900">
              {post.projectTitle}
            </h4>

            {post.projectLink && (
              <a
                href={post.projectLink}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(event) =>
                  event.stopPropagation()
                }
                className="mt-2 inline-block rounded bg-blue-600 px-4 py-2 text-white transition hover:bg-blue-700"
              >
                View Project →
              </a>
            )}
          </div>
        )}

      {/* Learning achievement */}
      {post.postType === "Learning Achievement" &&
        post.achievementTitle && (
          <div className="mt-4 rounded-lg border border-green-200 bg-green-50 p-4">
            <h4 className="font-semibold text-green-900">
              🏆 {post.achievementTitle}
            </h4>

            {post.achievementDescription && (
              <p className="mt-2 text-sm text-green-800">
                {post.achievementDescription}
              </p>
            )}
          </div>
        )}

      {/* Post image */}
      {post.image && (
        <img
          src={getImageUrl(post.image)}
          alt="Post"
          className="mt-4 max-h-96 w-full rounded-lg object-cover"
        />
      )}

      {/* Code snippet */}
      {post.codeSnippet && (
        <pre className="mt-4 overflow-x-auto rounded-lg bg-gray-900 p-4 text-sm text-green-400">
          <code>{post.codeSnippet}</code>
        </pre>
      )}

      {/* Hashtags */}
      <div className="mt-4 flex flex-wrap gap-2">
        {hashtags.map((tag, index) => (
          <span
            key={`${tag}-${index}`}
            className="rounded bg-blue-100 px-2 py-1 text-xs text-blue-700"
          >
            #{tag.replace(/^#/, "")}
          </span>
        ))}
      </div>
    </>
  );
};

export default PostContent;