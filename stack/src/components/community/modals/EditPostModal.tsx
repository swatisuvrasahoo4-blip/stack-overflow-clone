"use client";

import { useEffect } from "react";

import type {
  Dispatch,
  SetStateAction,
} from "react";

import type { Post } from "@/types/community";

interface EditPostModalProps {
  editingPost: Post | null;

  setEditingPost: Dispatch<
    SetStateAction<Post | null>
  >;

  editContent: string;

  setEditContent: Dispatch<
    SetStateAction<string>
  >;

  editHashtags: string;

  setEditHashtags: Dispatch<
    SetStateAction<string>
  >;

  editTagInput: string;

  setEditTagInput: Dispatch<
    SetStateAction<string>
  >;

  editImage: File | null;

  setEditImage: Dispatch<
    SetStateAction<File | null>
  >;

  editProjectTitle: string;

  setEditProjectTitle: Dispatch<
    SetStateAction<string>
  >;

  editProjectLink: string;

  setEditProjectLink: Dispatch<
    SetStateAction<string>
  >;

  editAchievementTitle: string;

  setEditAchievementTitle: Dispatch<
    SetStateAction<string>
  >;

  editAchievementDescription: string;

  setEditAchievementDescription: Dispatch<
    SetStateAction<string>
  >;

  editCodeSnippet: string;

  setEditCodeSnippet: Dispatch<
    SetStateAction<string>
  >;

  handleSaveEdit:
    () => void | Promise<void>;
}

const EditPostModal = ({
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

  handleSaveEdit,
}: EditPostModalProps) => {
  useEffect(() => {
    if (!editingPost) {
      return;
    }

    const previousOverflow =
      document.body.style.overflow;

    document.body.style.overflow =
      "hidden";

    return () => {
      document.body.style.overflow =
        previousOverflow;
    };
  }, [editingPost]);

  if (!editingPost) {
    return null;
  }

  const handleClose = () => {
    setEditingPost(null);

    setEditContent("");
    setEditHashtags("");
    setEditTagInput("");
    setEditImage(null);

    setEditProjectTitle("");
    setEditProjectLink("");

    setEditAchievementTitle("");
    setEditAchievementDescription("");

    setEditCodeSnippet("");
  };

  const handleAddTag = () => {
    const tag = editTagInput
      .trim()
      .replace(/^#/, "");

    if (
      tag &&
      !editHashtags
        .split(" ")
        .filter(Boolean)
        .includes(`#${tag}`)
    ) {
      setEditHashtags(
        (previous) =>
          previous
            ? `${previous} #${tag}`
            : `#${tag}`
      );
    }

    setEditTagInput("");
  };

  const handleRemoveTag = (
    index: number
  ) => {
    const updatedTags =
      editHashtags
        .split(" ")
        .filter(Boolean)
        .filter(
          (_, currentIndex) =>
            currentIndex !== index
        )
        .join(" ");

    setEditHashtags(updatedTags);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4 py-6"
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
        {/* Modal header */}

        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-xl font-semibold">
            Edit Post
          </h2>

          <button
            type="button"
            onClick={handleClose}
            className="text-2xl leading-none text-gray-500 hover:text-gray-800"
          >
            ×
          </button>
        </div>

        {/* Main post content */}

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Content
          </label>

          <textarea
            value={editContent}
            onChange={(event) =>
              setEditContent(
                event.target.value
              )
            }
            onClick={(event) =>
              event.stopPropagation()
            }
            className="min-h-160px w-full resize-y rounded-md border p-3 outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Edit your post..."
          />
        </div>

        {/* Hashtags */}

        <div className="mt-5">
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Hashtags
          </label>

          <div className="flex gap-2">
            <input
              type="text"
              value={editTagInput}
              onChange={(event) =>
                setEditTagInput(
                  event.target.value
                )
              }
              onClick={(event) =>
                event.stopPropagation()
              }
              onKeyDown={(event) => {
                if (
                  event.key === "Enter"
                ) {
                  event.preventDefault();

                  handleAddTag();
                }
              }}
              placeholder="Add a hashtag"
              className="flex-1 rounded-md border px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
            />

            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();

                handleAddTag();
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
                (tag, index) => (
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

                        handleRemoveTag(
                          index
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

        {/* Image */}

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
                onClick={(event) => {
                  event.stopPropagation();

                  setEditImage(null);

                  if (
                    editingPost.image
                  ) {
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
            onChange={(event) => {
              const file =
                event.target.files?.[0] ??
                null;

              setEditImage(file);
            }}
            onClick={(event) =>
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

        {/* Project fields */}

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
              onChange={(event) =>
                setEditProjectTitle(
                  event.target.value
                )
              }
              onClick={(event) =>
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
              onChange={(event) =>
                setEditProjectLink(
                  event.target.value
                )
              }
              onClick={(event) =>
                event.stopPropagation()
              }
              placeholder="Project link"
              className="w-full rounded-md border px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        )}

        {/* Achievement fields */}

        {editingPost.postType ===
          "achievement" && (
          <div className="mt-5 rounded-lg border p-4">
            <h3 className="mb-4 font-semibold">
              Learning Achievement
            </h3>

            <input
              type="text"
              value={
                editAchievementTitle
              }
              onChange={(event) =>
                setEditAchievementTitle(
                  event.target.value
                )
              }
              onClick={(event) =>
                event.stopPropagation()
              }
              placeholder="Achievement title"
              className="mb-3 w-full rounded-md border px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
            />

            <textarea
              value={
                editAchievementDescription
              }
              onChange={(event) =>
                setEditAchievementDescription(
                  event.target.value
                )
              }
              onClick={(event) =>
                event.stopPropagation()
              }
              placeholder="Achievement description"
              className="min-h-100px w-full rounded-md border p-3 outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        )}

        {/* Code fields */}

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
              onChange={(event) =>
                setEditCodeSnippet(
                  event.target.value
                )
              }
              onClick={(event) =>
                event.stopPropagation()
              }
              placeholder="Edit your code..."
              className="min-h-180px w-full rounded-md border bg-gray-50 p-3 font-mono text-sm outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        )}

        {/* Modal actions */}

        <div className="mt-6 flex justify-end gap-3 border-t pt-4">
          <button
            type="button"
            onClick={handleClose}
            className="rounded-md border px-4 py-2 text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={() =>
              void handleSaveEdit()
            }
            className="rounded-md bg-blue-600 px-5 py-2 text-white hover:bg-blue-700"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditPostModal;