import {
  useState,
} from "react";

import { useTranslation } from "react-i18next";

interface CreatePostHashtagsProps {
  tags: string[];
  setTags: (
    tags: string[]
  ) => void;
}

const CreatePostHashtags = ({
  tags,
  setTags,
}: CreatePostHashtagsProps) => {
  const { t } =
    useTranslation("create_post");

  const [
    tagInput,
    setTagInput,
  ] = useState("");

  const addTag = (): void => {
    const tag =
      tagInput.trim();

    if (!tag) {
      return;
    }

    if (!tags.includes(tag)) {
      setTags([
        ...tags,
        tag,
      ]);
    }

    setTagInput("");
  };

  const removeTag = (
    tag: string
  ): void => {
    setTags(
      tags.filter(
        (existingTag) =>
          existingTag !== tag
      )
    );
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium">
        {t(
          "hashtags.label"
        )}
      </label>

      <div className="grid w-full grid-cols-[minmax(0,1fr)_44px] gap-2">
        <input
          type="text"
          placeholder={t(
            "hashtags.placeholder"
          )}
          value={tagInput}
          onChange={(event) =>
            setTagInput(
              event.target.value
            )
          }
          className="h-11 min-w-0 w-full rounded-md border px-3 text-sm"
        />

        <button
          type="button"
          onClick={addTag}
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md bg-blue-600 text-white hover:bg-blue-700"
          aria-label={t(
            "hashtags.add_hashtag"
          )}
        >
          +
        </button>
      </div>

      {tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center gap-1 rounded-md bg-blue-100 px-3 py-1 text-sm text-blue-700"
            >
              #{tag}

              <button
                type="button"
                onClick={() =>
                  removeTag(tag)
                }
                className="ml-1 font-bold text-blue-600 hover:text-red-600"
                aria-label={t(
                  "hashtags.remove_hashtag",
                  {
                    tag,
                  }
                )}
              >
                ×
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

export default CreatePostHashtags;