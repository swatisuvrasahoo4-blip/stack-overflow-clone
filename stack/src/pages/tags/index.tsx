import Mainlayout from "@/layout/Mainlayout";
import TagGrid from "@/components/tags/TagGrid";
import { useEffect, useState } from "react";
import getTags from "@/components/services/tagService";
import type { Tag } from "@/types/tag";
import { useTranslation } from "react-i18next";

export default function TagsPage() {
  const [tags, setTags] = useState<Tag[]>([]);
useEffect(() => {
  const fetchTags = async () => {
    try {
      const data = await getTags();
      setTags(data);
    } catch (error) {
      console.error("Unable to load tags:", error);
      setTags([]);
    }
  };

  fetchTags();
}, []);
const {t} = useTranslation();
  return (
    <Mainlayout>
      <main className="min-h-0 p-4 lg:p-6">
        <div className="mb-6">
          <h1 className="text-xl font-semibold text-gray-900 lg:text-2xl">
            {t("tag.tags")}
          </h1>

          <p className="mt-1 text-sm text-gray-600">
            {t("tag.explorePopularHashtagsAndCommunityTopics")}
          </p>
        </div>

        <TagGrid tags={tags} />
      </main>
    </Mainlayout>
  );
}