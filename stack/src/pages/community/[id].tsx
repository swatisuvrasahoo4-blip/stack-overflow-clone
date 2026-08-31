import {
  useEffect,
  useState,
} from "react";

import { useRouter } from "next/router";
import { useTranslation } from "react-i18next";

import CommunityPostDetailCard from "./CommunityPostDetailCard";

import axiosInstance from "@/lib/axiosinstance";

import MainLayout from "@/layout/Mainlayout";

import type { Post } from "@/types/community";

interface PostResponse {
  data?: Post;
}

const CommunityPostDetail = () => {
  const router = useRouter();

  const { id } = router.query;

  const { t } = useTranslation();

  const [
    post,
    setPost,
  ] = useState<Post | null>(
    null
  );

  const [
    loading,
    setLoading,
  ] = useState(true);

  // Load community post
  useEffect(() => {
    if (
      !id ||
      Array.isArray(id)
    ) {
      return;
    }

    const loadPost =
      async (): Promise<void> => {
        try {
          setLoading(true);

          const response =
            await axiosInstance.get<
              PostResponse | Post
            >(`/post/${id}`);

          const responseData =
            response.data;

          if (
            "data" in
              responseData &&
            responseData.data
          ) {
            setPost(
              responseData.data
            );
          } else {
            setPost(
              responseData as Post
            );
          }
        } catch (error: unknown) {
          console.error(
            "Failed to load post:",
            error
          );

          setPost(null);
        } finally {
          setLoading(false);
        }
      };

    void loadPost();
  }, [id]);

  // Loading state
  if (loading) {
    return (
      <MainLayout>
        <main className="min-w-0 p-4 lg:p-6">
          <div className="animate-pulse rounded-lg border bg-white p-5">
            <div className="mb-4 h-6 w-1/3 rounded bg-gray-200" />

            <div className="mb-6 h-4 w-1/4 rounded bg-gray-200" />

            <div className="space-y-3">
              <div className="h-4 w-full rounded bg-gray-200" />

              <div className="h-4 w-5/6 rounded bg-gray-200" />

              <div className="h-4 w-3/4 rounded bg-gray-200" />
            </div>
          </div>
        </main>
      </MainLayout>
    );
  }

  // Post not found
  if (!post) {
    return (
      <MainLayout>
        <main className="min-w-0 p-4 lg:p-6">
          <div className="p-6">
            {t(
              "community.post_not_found"
            )}
          </div>
        </main>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <main className="min-w-0 p-4 lg:p-6">
        {/* Post details */}
        <CommunityPostDetailCard
          post={post}
        />
      </main>
    </MainLayout>
  );
};

export default CommunityPostDetail;