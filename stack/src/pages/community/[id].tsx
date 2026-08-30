import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import axiosInstance from "@/lib/axiosinstance";
import MainLayout from "@/layout/Mainlayout";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import type { Post } from "@/types/community";

interface PostResponse {
  data?: Post;
}

export default function CommunityPostDetail() {
  const router = useRouter();
  const { id } = router.query;
  const { t } = useTranslation();

  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [copied, setCopied] = useState<boolean>(false);

  useEffect(() => {
    if (!id || Array.isArray(id)) {
      return;
    }

    const loadPost = async (): Promise<void> => {
      try {
        setLoading(true);

        const res = await axiosInstance.get<PostResponse | Post>(
          `/post/${id}`
        );

        const responseData = res.data;

        if ("data" in responseData && responseData.data) {
          setPost(responseData.data);
        } else {
          setPost(responseData as Post);
        }
      } catch (error: unknown) {
        console.error("Failed to load post:", error);
        setPost(null);
      } finally {
        setLoading(false);
      }
    };

    void loadPost();
  }, [id]);

  if (loading) {
    return (
      <MainLayout>
        <main className="min-w-0 p-4 lg:p-6">
          <div className="bg-white border rounded-lg p-5 animate-pulse">
            <div className="h-6 bg-gray-200 rounded w-1/3 mb-4" />
            <div className="h-4 bg-gray-200 rounded w-1/4 mb-6" />

            <div className="space-y-3">
              <div className="h-4 bg-gray-200 rounded w-full" />
              <div className="h-4 bg-gray-200 rounded w-5/6" />
              <div className="h-4 bg-gray-200 rounded w-3/4" />
            </div>
          </div>
        </main>
      </MainLayout>
    );
  }

  if (!post) {
    return (
      <MainLayout>
        <main className="min-w-0 p-4 lg:p-6">
          <div className="p-6">
            {t("community.post_not_found")}
          </div>
        </main>
      </MainLayout>
    );
  }

  const handleCopyCode = async (): Promise<void> => {
    if (!post.codeSnippet) {
      return;
    }

    try {
      await navigator.clipboard.writeText(post.codeSnippet);

      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (error: unknown) {
      console.error("Failed to copy code:", error);
    }
  };

  return (
    <MainLayout>
      <main className="min-w-0 p-4 lg:p-6">
        <div className="bg-white border rounded-lg p-5">
          <Link
            href={`/users/${post.authorId}`}
            className="font-semibold text-lg hover:text-blue-600"
          >
            {post.authorName || "Unknown user"}
          </Link>

          <p className="text-sm text-blue-600 mt-1">
            {post.postType || "Community Post"}
          </p>

          <p className="mt-4 text-gray-800">
            {post.content}
          </p>

          {post.image && (
            <img
              src={
                post.image.startsWith("http")
                  ? post.image
                  : `http://localhost:5000${post.image}`
              }
              alt="Post"
              className="mt-4 w-full max-h-500px rounded-lg object-cover"
            />
          )}

          {post.hashtags && (
  <div className="mt-3 flex flex-wrap gap-2">
    {(Array.isArray(post.hashtags)
      ? post.hashtags
      : post.hashtags.split(",")
    ).map((tag) => (
      <span
        key={tag.trim()}
        className="rounded bg-blue-100 px-2 py-1 text-xs text-blue-700"
      >
        #{tag.trim()}
      </span>
    ))}
  </div>
)}

          {post.codeSnippet && (
            <div className="relative mt-4">
              <button
                type="button"
                onClick={handleCopyCode}
                className="absolute right-2 top-2 rounded bg-gray-700 px-3 py-1 text-xs text-white hover:bg-gray-600"
              >
                {copied
                  ? `✅ ${t("community.copied")}`
                  : `📋 ${t("community.copy")}`}
              </button>

              <pre className="overflow-x-auto rounded-lg bg-gray-900 p-4 pt-10 text-sm text-green-400">
                <code>{post.codeSnippet}</code>
              </pre>
            </div>
          )}

          {post.createdAt && (
            <p className="text-xs text-gray-500 mt-4">
              {new Date(post.createdAt).toLocaleString()}
            </p>
          )}
        </div>
      </main>
    </MainLayout>
  );
}