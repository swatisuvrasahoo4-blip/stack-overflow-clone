import Mainlayout from "@/layout/Mainlayout";
import TagGrid from "@/components/tags/TagGrid";

import {
  useEffect,
  useState,
} from "react";

import { useTranslation } from "react-i18next";

import {
  getTags,
} from "@/components/services/tagService";

import type { Tag } from "@/types/tag";

const TagsPage = () => {
  const { t } =
    useTranslation("tag");

  const [tags, setTags] =
    useState<Tag[]>([]);

  // Load tags
  useEffect(() => {
    const fetchTags =
      async (): Promise<void> => {
        try {
          const data =
            await getTags();

          setTags(data);
        } catch (
          error: unknown
        ) {
          console.error(
            "Unable to load tags:",
            error
          );

          setTags([]);
        }
      };

    void fetchTags();
  }, []);

  return (
    <Mainlayout>
      <main className="min-h-0 p-4 lg:p-6">
        {/* Page header */}

        <div className="mb-6">
          <h1 className="text-xl font-semibold text-gray-900 lg:text-2xl">
            {t(
              "labels.tags"
            )}
          </h1>

          <p className="mt-1 text-sm text-gray-600">
            {t(
              "messages.explore_popular_hashtags_and_community_topics"
            )}
          </p>
        </div>

        {/* Tags */}

        <TagGrid
          tags={tags}
        />
      </main>
    </Mainlayout>
  );
};

export default TagsPage;