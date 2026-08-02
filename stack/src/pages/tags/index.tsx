import Mainlayout from "@/layout/Mainlayout";
import TagGrid from "@/components/tags/TagGrid";
import { useEffect, useState } from "react";
import { getPosts } from "@/components/services/communityService";
import type { Tag } from "@/types/tag";

const normalizeHashtags = (hashtags: any) => {
  if (Array.isArray(hashtags)) {
    return hashtags.map((tag) => String(tag).trim()).filter(Boolean);
  }
  if (typeof hashtags === "string") {
    return hashtags
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean);
  }
  return [];
};

export default function TagsPage() {
  const [tags, setTags] = useState<Tag[]>([]);

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const posts = await getPosts();
        if (!Array.isArray(posts)) {
          setTags([]);
          return;
        }

        const tagCountMap: Record<string, number> = {};

        posts.forEach((post: any) => {
          normalizeHashtags(post.hashtags).forEach((tag) => {
            const normalized = tag.replace(/^#/, "").toLowerCase();
            if (!normalized) return;
            tagCountMap[normalized] = (tagCountMap[normalized] || 0) + 1;
          });
        });

        const sortedTags = Object.entries(tagCountMap)
          .sort((a, b) => b[1] - a[1])
          .map(([name, count]) => ({ name, count }));

        setTags(sortedTags);
      } catch (error) {
        console.error("Unable to load tags:", error);
        setTags([]);
      }
    };

    fetchTags();
  }, []);

  return (
    <Mainlayout>
      <main className="min-h-0 p-4 lg:p-6">
        <div className="mb-6">
          <h1 className="text-xl font-semibold text-gray-900 lg:text-2xl">
            Tags
          </h1>

          <p className="mt-1 text-sm text-gray-600">
            Explore popular hashtags and community topics.
          </p>
        </div>

        <TagGrid tags={tags} />
      </main>
    </Mainlayout>
  );
}