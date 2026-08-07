import Mainlayout from "@/layout/Mainlayout";
import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";
import { getPosts } from "@/components/services/communityService";
import { getSubscription } from "@/components/services/subscriptionService";
import PostFeed from "@/components/feed/PostFeed";
import Link from "next/link";

export default function SearchPage() {
  const router = useRouter();
  const { q } = router.query;
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPlan, setCurrentPlan] = useState("Free");
  const [selectedType, setSelectedType] = useState("All");
const hasAdvancedSearch = ["Bronze", "Silver", "Gold"].includes(currentPlan);

  const query = useMemo(() => {
     
    if (!q) return "";
    return Array.isArray(q) ? q[0] : String(q);
  }, [q]);

useEffect(() => {
  const loadSubscription = async () => {
    try {
      const response = await getSubscription();
      setCurrentPlan(response.data.plan || "Free");
    } catch (error) {
      console.log(error);
      setCurrentPlan("Free");
    }
  };

  loadSubscription();
}, []);

  useEffect(() => {
    const loadResults = async () => {
      if (!query) {
        setResults([]);
        setLoading(false);
        return;
      }

      try {
        const response = await getPosts();
        const posts = response?.data || [];
        
        const normalizedQuery = query.trim().toLowerCase();

        const filtered = Array.isArray(posts)
          ? posts.filter((post: any) => {
              const titleMatches = String(post.content || "").
                toLowerCase()
                .includes(normalizedQuery);
              const hashtagMatches = (post.hashtags || [])
                .map((tag: any) => String(tag).toLowerCase())
                .some((tag: string) => tag.includes(normalizedQuery));
              const searchMatches = titleMatches || hashtagMatches;
const typeMatches =
  !hasAdvancedSearch ||
  selectedType === "All" ||
  post.postType === selectedType;

return searchMatches && typeMatches;
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
  }, [query, selectedType, hasAdvancedSearch]);

  return (
    <Mainlayout>
      <main className="min-w-0 p-4 lg:p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold">Search results</h1>
          <p className="mt-2 text-gray-600">Results for “{query}”.</p>
        </div>

{hasAdvancedSearch && (
  <div className="mb-6">
    <label className="block text-sm font-medium text-gray-700 mb-2">
      Filter by Post Type
    </label>

    <select
      value={selectedType}
      onChange={(e) => setSelectedType(e.target.value)}
      className="border border-gray-300 rounded-md px-3 py-2 bg-white"
    >
      <option value="All">All Types</option>
      <option value="Technical Update">Technical Update</option>
      <option value="Project Showcase">Project Showcase</option>
      <option value="Learning Achievement">Learning Achievement</option>
      <option value="Code Snippet">Code Snippet</option>
    </select>
  </div>
)}

        {loading ? (
          <p className="text-gray-500">Searching...</p>
        ) : results.length === 0 ? (
          <p className="text-gray-500">No posts matched your search.</p>
        ) : (
          <PostFeed
          key={`${query}-${selectedType}`}
          initialPosts={results} />
        )}
      </main>
    </Mainlayout>
  );
}
