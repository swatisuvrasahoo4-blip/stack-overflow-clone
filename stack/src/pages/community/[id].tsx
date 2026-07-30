import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import axiosInstance from "@/lib/axiosinstance";
import MainLayout from "@/layout/Mainlayout";

export default function CommunityPostDetail() {
  const router = useRouter();
  const { id } = router.query;

  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const loadPost = async () => {
      try {
        const res = await axiosInstance.get(`/post/${id}`);
        setPost(res.data.data || res.data);
      } catch (error) {
        console.log(error);
        setPost(null);
      } finally {
        setLoading(false);
      }
    };

    loadPost();
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
    return <div className="p-6">Post not found.</div>;
  }

  return (
    <MainLayout>
      <main className="min-w-0 p-4 lg:p-6">
        <div className="bg-white border rounded-lg p-5">
          <h2 className="font-semibold text-lg">
            {post.authorName || "Unknown user"}
          </h2>

          <p className="text-sm text-blue-600 mt-1">
            {post.postType || "Community Post"}
          </p>

          <p className="mt-4 text-gray-800">
            {post.content}
          </p>

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