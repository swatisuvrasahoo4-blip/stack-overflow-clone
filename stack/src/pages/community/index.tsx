import Mainlayout from "@/layout/Mainlayout";
import {
  useEffect,
  useRef,
  useState,
} from "react";
import { useAuth } from "@/lib/AuthContext";

import CommunityHeader from "@/components/community/CommunityHeader";
import PostCard from "@/components/community/PostCard";

import {
  getPosts,
  deleteReply,
} from "@/components/services/communityService";

import { useRouter } from "next/router";
import usePostActions from "@/hooks/usePostActions";
import { useTranslation } from "react-i18next";

import type { Post } from "@/types/community";

type PostComment =
  NonNullable<Post["comments"]>[number];

type PostReply =
  NonNullable<PostComment["replies"]>[number];

export default function CommunityPage() {
  const { user, updateUser } = useAuth();
  const { t } = useTranslation();
  const router = useRouter();

  const [posts, setPosts] =
    useState<Post[]>([]);

  const [commentText, setCommentText] =
    useState<string>("");

  const [
    activeCommentPost,
    setActiveCommentPost,
  ] = useState<string | null>(null);

  const [
    expandedComments,
    setExpandedComments,
  ] = useState<string[]>([]);

  const [replyText, setReplyText] =
    useState<string>("");

  const [
    activeReplyComment,
    setActiveReplyComment,
  ] = useState<string | null>(null);

  const [
    showDeleteModal,
    setShowDeleteModal,
  ] = useState<boolean>(false);

  const [
    showDeleteCommentModal,
    setShowDeleteCommentModal,
  ] = useState<boolean>(false);

  const [
    showDeleteReplyModal,
    setShowDeleteReplyModal,
  ] = useState<boolean>(false);

  const [
    selectedComment,
    setSelectedComment,
  ] = useState<{
    postId: string;
    commentId: string;
  } | null>(null);

  const [
    selectedPostId,
    setSelectedPostId,
  ] = useState<string | null>(null);

  const [
    selectedReply,
    setSelectedReply,
  ] = useState<{
    postId: string;
    commentId: string;
    replyId: string;
  } | null>(null);

  const [
    editingPost,
    setEditingPost,
  ] = useState<Post | null>(null);

  const [
    editContent,
    setEditContent,
  ] = useState<string>("");

  const [
    editHashtags,
    setEditHashtags,
  ] = useState<string>("");

  const [
    editTagInput,
    setEditTagInput,
  ] = useState<string>("");

  const [
    editImage,
    setEditImage,
  ] = useState<File | null>(null);

  const [
    editProjectTitle,
    setEditProjectTitle,
  ] = useState<string>("");

  const [
    editProjectLink,
    setEditProjectLink,
  ] = useState<string>("");

  const [
    editAchievementTitle,
    setEditAchievementTitle,
  ] = useState<string>("");

  const [
    editAchievementDescription,
    setEditAchievementDescription,
  ] = useState<string>("");

  const [
    editCodeSnippet,
    setEditCodeSnippet,
  ] = useState<string>("");

  const {
    handleLike,
    handleBookmark,
    handleComment,
    handleShare,
    handleReply,
    handleDelete,
    handleDeleteComment,
    handleSaveEdit,
    handleEdit,
  } = usePostActions({
    posts,
    setPosts,
    user,
    updateUser,

    commentText,
    setCommentText,
    setActiveCommentPost,

    editingPost,
    setEditingPost,

    editContent,
    setEditContent,

    editHashtags,
    setEditHashtags,

    editTagInput,
    setEditTagInput,

    editImage,
    setEditImage,

    editProjectTitle,
    setEditProjectTitle,

    editProjectLink,
    setEditProjectLink,

    editAchievementTitle,
    setEditAchievementTitle,

    editAchievementDescription,
    setEditAchievementDescription,

    editCodeSnippet,
    setEditCodeSnippet,

    replyText,
    setReplyText,
    setActiveReplyComment,
  });

  const [cursor, setCursor] =
    useState<string | null>(null);

  const [hasMore, setHasMore] =
    useState<boolean>(true);

  const [
    loadingMore,
    setLoadingMore,
  ] = useState<boolean>(false);

  const loadMoreRef =
    useRef<HTMLDivElement | null>(null);

  const fetchPosts = async (
    cursorToUse: string | null = null
  ): Promise<void> => {
    try {
      const response =
        await getPosts(
          "trending",
          cursorToUse,
          10
        );

      const incomingPosts: Post[] =
        response.data ?? [];

      if (cursorToUse === null) {
        setPosts(incomingPosts);
      } else {
        setPosts((previousPosts) => {
          const existingIds =
            new Set(
              previousPosts.map(
                (post) => post._id
              )
            );

          const newPosts =
            incomingPosts.filter(
              (post) =>
                !existingIds.has(
                  post._id
                )
            );

          return [
            ...previousPosts,
            ...newPosts,
          ];
        });
      }

      setHasMore(
        response.pagination
          ?.hasMore ?? false
      );

      setCursor(
        response.pagination
          ?.nextCursor ?? null
      );
    } catch (error: unknown) {
      console.error(
        "Failed to load posts:",
        error
      );
    } finally {
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    void fetchPosts(null);
  }, []);

  useEffect(() => {
    if (!hasMore || loadingMore) {
      return;
    }

    const observer =
      new IntersectionObserver(
        async (entries) => {
          const entry =
            entries[0];

          if (
            entry?.isIntersecting &&
            hasMore &&
            !loadingMore
          ) {
            setLoadingMore(true);

            await fetchPosts(
              cursor
            );
          }
        },
        {
          threshold: 1,
        }
      );

    const currentElement =
      loadMoreRef.current;

    if (currentElement) {
      observer.observe(
        currentElement
      );
    }

    return () => {
      if (currentElement) {
        observer.unobserve(
          currentElement
        );
      }

      observer.disconnect();
    };
  }, [
    hasMore,
    cursor,
    loadingMore,
  ]);

  const handleDeleteReply =
    async (
      postId: string,
      commentId: string,
      replyId: string
    ): Promise<void> => {
      try {
        await deleteReply(
          postId,
          commentId,
          replyId
        );

        setPosts(
          (previousPosts) =>
            previousPosts.map(
              (post) =>
                post._id === postId
                  ? {
                      ...post,

                      comments: (
                        post.comments ??
                        []
                      ).map(
                        (
                          comment: PostComment
                        ) =>
                          comment._id ===
                          commentId
                            ? {
                                ...comment,

                                replies: (
                                  comment.replies ??
                                  []
                                ).filter(
                                  (
                                    reply: PostReply
                                  ) =>
                                    reply._id !==
                                    replyId
                                ),
                              }
                            : comment
                      ),
                    }
                  : post
            )
        );
      } catch (error: unknown) {
        console.error(
          "Failed to delete reply:",
          error
        );
      }
    };

  useEffect(() => {
    if (posts.length === 0) {
      return;
    }

    const savedPosition =
      sessionStorage.getItem(
        "communityScrollPosition"
      );

    if (!savedPosition) {
      return;
    }

    requestAnimationFrame(() => {
      window.scrollTo({
        top: Number(
          savedPosition
        ),
        behavior: "auto",
      });

      sessionStorage.removeItem(
        "communityScrollPosition"
      );
    });
  }, [posts]);

  return (
    <Mainlayout>
      <main className="min-w-0 p-4 lg:p-6">
        <CommunityHeader />

        {posts.map((post) => (
          <div
            key={post._id}
            onClick={() => {
              sessionStorage.setItem(
                "communityScrollPosition",
                String(
                  window.scrollY
                )
              );

              router.push(
                `/community/${post._id}`
              );
            }}
            className="cursor-pointer"
          >
            <PostCard
              post={post}
              user={user}
              handleLike={
                handleLike
              }
              handleEdit={
                handleEdit
              }
              handleShare={
                handleShare
              }
              handleBookmark={
                handleBookmark
              }
              handleComment={
                handleComment
              }
              handleReply={
                handleReply
              }
              handleDelete={
                handleDelete
              }
              activeCommentPost={
                activeCommentPost
              }
              setActiveCommentPost={
                setActiveCommentPost
              }
              commentText={
                commentText
              }
              setCommentText={
                setCommentText
              }
              expandedComments={
                expandedComments
              }
              setExpandedComments={
                setExpandedComments
              }
              activeReplyComment={
                activeReplyComment
              }
              setActiveReplyComment={
                setActiveReplyComment
              }
              replyText={
                replyText
              }
              setReplyText={
                setReplyText
              }
              setSelectedComment={
                setSelectedComment
              }
              setShowDeleteCommentModal={
                setShowDeleteCommentModal
              }
              setSelectedReply={
                setSelectedReply
              }
              setShowDeleteReplyModal={
                setShowDeleteReplyModal
              }
              setSelectedPostId={
                setSelectedPostId
              }
              setShowDeleteModal={
                setShowDeleteModal
              }
              selectedPostId={
                selectedPostId
              }
              showDeleteModal={
                showDeleteModal
              }
            />
          </div>
        ))}

        <div
          ref={loadMoreRef}
          className="h-10 flex items-center justify-center"
        >
          {loadingMore && (
            <p className="text-sm text-gray-500">
              Loading more...
            </p>
          )}
        </div>
      </main>

      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="w-350px rounded-xl bg-white p-6 shadow-xl">
            <h2 className="text-lg font-semibold">
              Delete Post
            </h2>

            <p className="mt-2 text-gray-600">
              Are you sure you want
              to delete this post?
            </p>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => {
                  setShowDeleteModal(
                    false
                  );

                  setSelectedPostId(
                    null
                  );
                }}
                className="rounded-lg border px-4 py-2"
              >
                No
              </button>

              <button
                type="button"
                onClick={() => {
                  if (
                    selectedPostId
                  ) {
                    void handleDelete(
                      selectedPostId
                    );
                  }

                  setShowDeleteModal(
                    false
                  );

                  setSelectedPostId(
                    null
                  );
                }}
                className="rounded-lg bg-red-600 px-4 py-2 text-white hover:bg-red-700"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {showDeleteCommentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="w-350px rounded-xl bg-white p-6 shadow-xl">
            <h2 className="text-lg font-semibold">
              Delete Comment
            </h2>

            <p className="mt-2 text-gray-600">
              Are you sure you want
              to delete this
              comment?
            </p>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => {
                  setShowDeleteCommentModal(
                    false
                  );

                  setSelectedComment(
                    null
                  );
                }}
                className="rounded-lg border px-4 py-2"
              >
                No
              </button>

              <button
                type="button"
                onClick={() => {
                  if (
                    selectedComment
                  ) {
                    void handleDeleteComment(
                      selectedComment.postId,
                      selectedComment.commentId
                    );
                  }

                  setShowDeleteCommentModal(
                    false
                  );

                  setSelectedComment(
                    null
                  );
                }}
                className="rounded-lg bg-red-600 px-4 py-2 text-white hover:bg-red-700"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {showDeleteReplyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="w-350px rounded-xl bg-white p-6 shadow-xl">
            <h2 className="text-lg font-semibold">
              {t(
                "community.deleteReply"
              )}
            </h2>

            <p className="mt-2 text-gray-600">
              Are you sure you want
              to delete this reply?
            </p>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => {
                  setShowDeleteReplyModal(
                    false
                  );

                  setSelectedReply(
                    null
                  );
                }}
                className="rounded-lg border px-4 py-2"
              >
                No
              </button>

              <button
                type="button"
                onClick={() => {
                  if (
                    selectedReply
                  ) {
                    void handleDeleteReply(
                      selectedReply.postId,
                      selectedReply.commentId,
                      selectedReply.replyId
                    );
                  }

                  setShowDeleteReplyModal(
                    false
                  );

                  setSelectedReply(
                    null
                  );
                }}
                className="rounded-lg bg-red-600 px-4 py-2 text-white hover:bg-red-700"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {editingPost && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 py-6"
          onClick={(event) =>
            event.stopPropagation()
          }
        >
          <div
            className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-xl bg-white p-6 shadow-xl"
            onClick={(event) =>
              event.stopPropagation()
            }
          >
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-xl font-semibold">
                Edit Post
              </h2>

              <button
                type="button"
                onClick={() => {
                  setEditingPost(
                    null
                  );
                  setEditContent("");
                  setEditHashtags("");
                  setEditTagInput("");
                  setEditImage(null);
                  setEditProjectTitle(
                    ""
                  );
                  setEditProjectLink(
                    ""
                  );
                  setEditAchievementTitle(
                    ""
                  );
                  setEditAchievementDescription(
                    ""
                  );
                  setEditCodeSnippet(
                    ""
                  );
                }}
                className="text-2xl leading-none text-gray-500 hover:text-gray-800"
              >
                ×
              </button>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Content
              </label>

              <textarea
                value={
                  editContent
                }
                onChange={(event) =>
                  setEditContent(
                    event.target
                      .value
                  )
                }
                onClick={(event) =>
                  event.stopPropagation()
                }
                className="min-h-160px w-full resize-y rounded-md border p-3 outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Edit your post..."
              />
            </div>

            <div className="mt-5">
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Hashtags
              </label>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={
                    editTagInput
                  }
                  onChange={(
                    event
                  ) =>
                    setEditTagInput(
                      event.target
                        .value
                    )
                  }
                  onClick={(
                    event
                  ) =>
                    event.stopPropagation()
                  }
                  onKeyDown={(
                    event
                  ) => {
                    if (
                      event.key ===
                      "Enter"
                    ) {
                      event.preventDefault();

                      const tag =
                        editTagInput
                          .trim()
                          .replace(
                            /^#/,
                            ""
                          );

                      if (
                        tag &&
                        !editHashtags
                          .split(" ")
                          .filter(
                            Boolean
                          )
                          .includes(
                            `#${tag}`
                          )
                      ) {
                        setEditHashtags(
                          (
                            previous
                          ) =>
                            previous
                              ? `${previous} #${tag}`
                              : `#${tag}`
                        );
                      }

                      setEditTagInput(
                        ""
                      );
                    }
                  }}
                  placeholder="Add a hashtag"
                  className="flex-1 rounded-md border px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                />

                <button
                  type="button"
                  onClick={(
                    event
                  ) => {
                    event.stopPropagation();

                    const tag =
                      editTagInput
                        .trim()
                        .replace(
                          /^#/,
                          ""
                        );

                    if (
                      tag &&
                      !editHashtags
                        .split(" ")
                        .filter(
                          Boolean
                        )
                        .includes(
                          `#${tag}`
                        )
                    ) {
                      setEditHashtags(
                        (
                          previous
                        ) =>
                          previous
                            ? `${previous} #${tag}`
                            : `#${tag}`
                      );
                    }

                    setEditTagInput(
                      ""
                    );
                  }}
                  className="rounded-md bg-blue-600 px-4 py-2 text-xl font-semibold text-white hover:bg-blue-700"
                >
                  +
                </button>
              </div>

              <div className="mt-3 flex flex-wrap gap-2">
                {editHashtags
                  .split(" ")
                  .filter(Boolean)
                  .map(
                    (
                      tag,
                      index
                    ) => (
                      <span
                        key={`${tag}-${index}`}
                        className="flex items-center gap-1 rounded-full bg-blue-100 px-3 py-1 text-sm text-blue-700"
                      >
                        {tag}

                        <button
                          type="button"
                          onClick={(
                            event
                          ) => {
                            event.stopPropagation();

                            const updatedTags =
                              editHashtags
                                .split(
                                  " "
                                )
                                .filter(
                                  (
                                    _,
                                    currentIndex
                                  ) =>
                                    currentIndex !==
                                    index
                                )
                                .join(
                                  " "
                                );

                            setEditHashtags(
                              updatedTags
                            );
                          }}
                          className="ml-1 text-base font-semibold text-blue-600 hover:text-red-600"
                        >
                          ×
                        </button>
                      </span>
                    )
                  )}
              </div>
            </div>

            <div className="mt-5">
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Image
              </label>

              {(editImage ||
                editingPost.image) && (
                <div className="relative mb-3 w-fit">
                  <img
                    src={
                      editImage
                        ? URL.createObjectURL(
                            editImage
                          )
                        : editingPost.image ??
                          ""
                    }
                    alt="Post image"
                    className="max-h-48 max-w-full rounded-lg object-cover"
                  />

                  <button
                    type="button"
                    onClick={(
                      event
                    ) => {
                      event.stopPropagation();

                      setEditImage(
                        null
                      );

                      if (editingPost.image) {
  setEditingPost({
    ...editingPost,
    image: undefined,
  });
}
                    }}
                    className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-red-600 text-lg font-bold text-white shadow hover:bg-red-700"
                    aria-label="Remove image"
                  >
                    ×
                  </button>
                </div>
              )}

              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={(
                  event
                ) => {
                  const file =
                    event.target
                      .files?.[0] ??
                    null;

                  setEditImage(
                    file
                  );
                }}
                onClick={(
                  event
                ) =>
                  event.stopPropagation()
                }
                className="w-full rounded-md border p-2 text-sm"
              />

              {!editImage &&
                !editingPost.image && (
                  <p className="mt-2 text-sm text-red-600">
                    No file chosen
                  </p>
                )}

              {editImage && (
                <p className="mt-2 text-sm text-gray-500">
                  Selected:{" "}
                  {editImage.name}
                </p>
              )}
            </div>

            {editingPost.postType ===
              "project" && (
              <div className="mt-5 rounded-lg border p-4">
                <h3 className="mb-4 font-semibold">
                  Project Showcase
                </h3>

                <input
                  type="text"
                  value={
                    editProjectTitle
                  }
                  onChange={(
                    event
                  ) =>
                    setEditProjectTitle(
                      event.target
                        .value
                    )
                  }
                  onClick={(
                    event
                  ) =>
                    event.stopPropagation()
                  }
                  placeholder="Project title"
                  className="mb-3 w-full rounded-md border px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                />

                <input
                  type="url"
                  value={
                    editProjectLink
                  }
                  onChange={(
                    event
                  ) =>
                    setEditProjectLink(
                      event.target
                        .value
                    )
                  }
                  onClick={(
                    event
                  ) =>
                    event.stopPropagation()
                  }
                  placeholder="Project link"
                  className="w-full rounded-md border px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            )}

            {editingPost.postType ===
              "achievement" && (
              <div className="mt-5 rounded-lg border p-4">
                <h3 className="mb-4 font-semibold">
                  Learning
                  Achievement
                </h3>

                <input
                  type="text"
                  value={
                    editAchievementTitle
                  }
                  onChange={(
                    event
                  ) =>
                    setEditAchievementTitle(
                      event.target
                        .value
                    )
                  }
                  onClick={(
                    event
                  ) =>
                    event.stopPropagation()
                  }
                  placeholder="Achievement title"
                  className="mb-3 w-full rounded-md border px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                />

                <textarea
                  value={
                    editAchievementDescription
                  }
                  onChange={(
                    event
                  ) =>
                    setEditAchievementDescription(
                      event.target
                        .value
                    )
                  }
                  onClick={(
                    event
                  ) =>
                    event.stopPropagation()
                  }
                  placeholder="Achievement description"
                  className="min-h-100px w-full rounded-md border p-3 outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            )}

            {editingPost.postType ===
              "code" && (
              <div className="mt-5">
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Code Snippet
                </label>

                <textarea
                  value={
                    editCodeSnippet
                  }
                  onChange={(
                    event
                  ) =>
                    setEditCodeSnippet(
                      event.target
                        .value
                    )
                  }
                  onClick={(
                    event
                  ) =>
                    event.stopPropagation()
                  }
                  placeholder="Edit your code..."
                  className="min-h-180px w-full rounded-md border bg-gray-50 p-3 font-mono text-sm outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            )}

            <div className="mt-6 flex justify-end gap-3 border-t pt-4">
              <button
                type="button"
                onClick={() => {
                  setEditingPost(
                    null
                  );
                  setEditContent("");
                  setEditHashtags("");
                  setEditTagInput("");
                  setEditImage(null);
                  setEditProjectTitle(
                    ""
                  );
                  setEditProjectLink(
                    ""
                  );
                  setEditAchievementTitle(
                    ""
                  );
                  setEditAchievementDescription(
                    ""
                  );
                  setEditCodeSnippet(
                    ""
                  );
                }}
                className="rounded-md border px-4 py-2 text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={
                  handleSaveEdit
                }
                className="rounded-md bg-blue-600 px-5 py-2 text-white hover:bg-blue-700"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </Mainlayout>
  );
}