import Mainlayout from "@/layout/Mainlayout";
import TagGrid from "@/components/tags/TagGrid";

import {
  useEffect,
  useState,
  useRef,
} from "react";

import { useTranslation } from "react-i18next";

import {
  getTags,
  type TagsPagination,
} from "@/components/services/tagService";

import type { Tag } from "@/types/tag";

const TAGS_PER_PAGE = 12;

const DEFAULT_PAGINATION: TagsPagination = {
  currentPage: 1,
  totalPages: 0,
  totalTags: 0,
  limit: TAGS_PER_PAGE,
  hasNextPage: false,
  hasPreviousPage: false,
};

const TagsPage = () => {
  const { t } =
    useTranslation("tag");

  const [
    tags,
    setTags,
  ] = useState<Tag[]>([]);

  const [
    pagination,
    setPagination,
  ] = useState<TagsPagination>(
    DEFAULT_PAGINATION
  );

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    loadingMore,
    setLoadingMore,
  ] = useState(false);

  // Initial tags
  useEffect(() => {
    const fetchTags =
      async (): Promise<void> => {
        try {
          setLoading(true);

          const data =
            await getTags(
              1,
              TAGS_PER_PAGE
            );

          setTags(
            data.tags || []
          );

          setPagination(
            data.pagination ??
              DEFAULT_PAGINATION
          );
        } catch (
          error: unknown
        ) {
          console.error(
            "Unable to load tags:",
            error
          );

          setTags([]);

          setPagination(
            DEFAULT_PAGINATION
          );
        } finally {
          setLoading(false);
        }
      };

    void fetchTags();
  }, []);


  // Load next page
  const handleLoadMore =
    async (): Promise<void> => {
      if (
        loadingMore ||
        !pagination.hasNextPage
      ) {
        return;
      }

      try {
        setLoadingMore(true);

        const nextPage =
          pagination.currentPage +
          1;

        const data =
          await getTags(
            nextPage,
            pagination.limit
          );

        setTags(
          (previousTags) => {
            const existingNames =
              new Set(
                previousTags.map(
                  (tag) =>
                    tag.name
                )
              );

            const newTags =
              (
                data.tags || []
              ).filter(
                (tag) =>
                  !existingNames.has(
                    tag.name
                  )
              );

            return [
              ...previousTags,
              ...newTags,
            ];
          }
        );

        if (data.pagination) {
          setPagination(
            data.pagination
          );
        }
      } catch (
        error: unknown
      ) {
        console.error(
          "Unable to load more tags:",
          error
        );
      } finally {
        setLoadingMore(false);
      }
    };

    const loadMoreRef =
  useRef<HTMLDivElement | null>(null);

useEffect(() => {
  const element = loadMoreRef.current;

  if (
    !element ||
    !pagination.hasNextPage ||
    loadingMore
  ) {
    return;
  }

  const observer =
    new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          void handleLoadMore();
        }
      },
      {
        rootMargin: "200px",
      }
    );

  observer.observe(element);

  return () => {
    observer.disconnect();
  };
}, [
  pagination.hasNextPage,
  loadingMore,
  handleLoadMore,
]);

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

        {/* Initial loading */}

        {loading ? (
          <p className="text-sm text-gray-500">
            {t(
              "status.loading"
            )}
          </p>
        ) : (
          <>
            {/* Tags */}

            <TagGrid
              tags={tags}
            />

            {/* Load more */}

          {pagination.hasNextPage && (
  <div
    ref={loadMoreRef}
    className="mt-8 flex min-h-12 items-center justify-center"
  >
    {loadingMore && (
      <p className="text-sm text-gray-500">
        {t("status.loading_more")}
      </p>
    )}
  </div>
)}
          </>
        )}
      </main>
    </Mainlayout>
  );
};

export default TagsPage;