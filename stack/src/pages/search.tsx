import Mainlayout from "@/layout/Mainlayout";
import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";
import { getPosts } from "@/components/services/communityService";
import Link from "next/link";

export default function SearchPage() {
  const router = useRouter();
  const { q } = router.query;
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const query = useMemo(() => {
    if (!q) return "";
    return Array.isArray(q) ? q[0] : String(q);
  }, [q]);

  useEffect(() => {
    const loadResults = async () => {
      if (!query) {
        setResults([]);
        setLoading(false);
        return;
      }

      try {
        const posts = await getPosts();
        const normalizedQuery = query.trim().toLowerCase();

        const filtered = Array.isArray(posts)
          ? posts.filter((post: any) => {
              const titleMatches = String(post.content || "").
                toLowerCase()
                .includes(normalizedQuery);
              const hashtagMatches = (post.hashtags || [])
                .map((tag: any) => String(tag).toLowerCase())
                .some((tag: string) => tag.includes(normalizedQuery));
              return titleMatches || hashtagMatches;
            })
          : [];

        setResults(filtered);
      } catch (error) {
        console.error("Search error:", error);
        setResults([]);
      } finally {
        setLoading(false);
      }
    };

    loadResults();
  }, [query]);

  return (
    <Mainlayout>
      <main className="min-w-0 p-4 lg:p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold">Search results</h1>
          <p className="mt-2 text-gray-600">Results for “{query}”.</p>
        </div>

        {loading ? (
          <p className="text-gray-500">Searching...</p>
        ) : results.length === 0 ? (
          <p className="text-gray-500">No posts matched your search.</p>
        ) : (
          <div className="space-y-4">
            {results.map((post) => (
              <Link
                key={post._id}
                href={`/community/${post._id}`}
                className="block rounded-lg border bg-white p-4 shadow-sm hover:border-blue-300"
              >
                <h2 className="text-lg font-semibold text-blue-600">
                  {post.content?.slice(0, 70) || "Community post"}
                </h2>
                <p className="mt-2 text-sm text-gray-700 line-clamp-2">
                  {post.content}
                </p>
              </Link>
            ))}
          </div>
        )}
      </main>
    </Mainlayout>
  );
}
