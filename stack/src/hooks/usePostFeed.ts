import {
  useEffect,
  useRef,
  useState,
} from "react";

import { getPosts } from "@/components/services/communityService";

import type { Post } from "@/types/community";

interface UsePostFeedProps {
  activeFeed: "trending" | "following";
  followingIds: string[];
  initialPosts?: Post[];
}

interface FetchPageResult {
  items: Post[];
  hasMore: boolean;
  nextCursor: string | null;
}

const usePostFeed = ({
  activeFeed,
  followingIds,
  initialPosts,
}: UsePostFeedProps) => {
  const [posts, setPosts] =
    useState<Post[]>(initialPosts ?? []);

  const [loading, setLoading] =
    useState(!initialPosts);

  const [cursor, setCursor] =
    useState<string | null>(null);

  const [hasMore, setHasMore] =
    useState(true);

  const [
    loadingMore,
    setLoadingMore,
  ] = useState(false);

  const loadMoreRef =
    useRef<HTMLDivElement | null>(null);

  const fetchPage = async (
    cursorToUse: string | null
  ): Promise<FetchPageResult> => {
    const response = await getPosts(
      activeFeed,
      cursorToUse,
      10,
      followingIds
    );

    const items: Post[] =
      Array.isArray(response?.data)
        ? response.data
        : [];

    return {
      items,
      hasMore:
        response?.pagination?.hasMore ??
        false,
      nextCursor:
        response?.pagination
          ?.nextCursor ?? null,
    };
  };

  const loadMore = async () => {
    if (
      !hasMore ||
      loadingMore
    ) {
      return;
    }

    setLoadingMore(true);

    try {
      const {
        items,
        hasMore: more,
        nextCursor,
      } = await fetchPage(cursor);

      setPosts((previousPosts) => {
        const existingIds = new Set(
          previousPosts.map((post) =>
            String(post._id)
          )
        );

        const newPosts = items.filter(
          (post) =>
            !existingIds.has(
              String(post._id)
            )
        );

        return [
          ...previousPosts,
          ...newPosts,
        ];
      });

      setHasMore(more);
      setCursor(nextCursor);
    } catch (error: unknown) {
      console.error(
        "Failed to load more posts:",
        error
      );
    } finally {
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    if (
      initialPosts ||
      !hasMore
    ) {
      return;
    }

    const observer =
      new IntersectionObserver(
        (entries) => {
          const entry = entries[0];

          if (
            entry?.isIntersecting &&
            !loadingMore &&
            hasMore
          ) {
            void loadMore();
          }
        },
        {
          rootMargin: "300px",
        }
      );

    const element =
      loadMoreRef.current;

    if (element) {
      observer.observe(element);
    }

    return () => {
      observer.disconnect();
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    cursor,
    hasMore,
    loadingMore,
    initialPosts,
  ]);

  useEffect(() => {
    if (initialPosts) {
      setPosts(initialPosts);
      setLoading(false);

      return;
    }

    let cancelled = false;

    const loadInitialFeed =
      async () => {
        setLoading(true);
        setCursor(null);
        setHasMore(true);

        const targetPostId =
          sessionStorage.getItem(
            "communitySelectedPostId"
          );

        try {
          let accumulated: Post[] = [];

          let currentCursor:
            | string
            | null = null;

          let more = true;

          let foundTarget =
            !targetPostId;

          do {
            const page =
              await fetchPage(
                currentCursor
              );

            accumulated = [
              ...accumulated,
              ...page.items,
            ];

            currentCursor =
              page.nextCursor;

            more =
              page.hasMore;

            if (
              targetPostId &&
              page.items.some(
                (post) =>
                  String(post._id) ===
                  targetPostId
              )
            ) {
              foundTarget = true;
            }
          } while (
            targetPostId &&
            !foundTarget &&
            more
          );

          if (cancelled) {
            return;
          }

          setPosts(accumulated);
          setHasMore(more);
          setCursor(currentCursor);

          if (
            targetPostId &&
            !foundTarget
          ) {
            sessionStorage.removeItem(
              "communitySelectedPostId"
            );

            window.scrollTo({
              top: 0,
            });
          }
        } catch (error: unknown) {
          console.error(
            "Failed to load community feed:",
            error
          );
        } finally {
          if (!cancelled) {
            setLoading(false);
          }
        }
      };

    void loadInitialFeed();

    return () => {
      cancelled = true;
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    activeFeed,
    initialPosts,
    followingIds.join(","),
  ]);

  return {
    posts,
    setPosts,
    loading,
    hasMore,
    loadingMore,
    loadMoreRef,
  };
};

export default usePostFeed;