import type {
  Dispatch,
  KeyboardEvent,
  SetStateAction,
} from "react";

import { useTranslation } from "react-i18next";

interface EditQuestionModalProps {
  open: boolean;

  editTitle: string;
  setEditTitle: Dispatch<
    SetStateAction<string>
  >;

  editContent: string;
  setEditContent: Dispatch<
    SetStateAction<string>
  >;

  editTags: string[];
  setEditTags: Dispatch<
    SetStateAction<string[]>
  >;

  editTagInput: string;
  setEditTagInput: Dispatch<
    SetStateAction<string>
  >;

  onClose: () => void;
  onSave: () => void | Promise<void>;
}

const EditQuestionModal = ({
  open,
  editTitle,
  setEditTitle,
  editContent,
  setEditContent,
  editTags,
  setEditTags,
  editTagInput,
  setEditTagInput,
  onClose,
  onSave,
}: EditQuestionModalProps) => {
  const { t } = useTranslation();

  if (!open) {
    return null;
  }

  // Add a tag
  const addEditTag = (): void => {
    const newTag =
      editTagInput.trim();

    if (!newTag) {
      return;
    }

    if (
      editTags.includes(
        newTag
      )
    ) {
      return;
    }

    if (
      editTags.length >= 5
    ) {
      return;
    }

    setEditTags(
      (previousTags) => [
        ...previousTags,
        newTag,
      ]
    );

    setEditTagInput("");
  };

  // Remove a tag
  const removeEditTag = (
    tagToRemove: string
  ): void => {
    setEditTags(
      (previousTags) =>
        previousTags.filter(
          (tag) =>
            tag !== tagToRemove
        )
    );
  };

  // Add tag with Enter
  const handleTagKeyDown = (
    event: KeyboardEvent<HTMLInputElement>
  ): void => {
    if (
      event.key === "Enter"
    ) {
      event.preventDefault();

      addEditTag();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      {/* Edit question modal */}
      <div className="w-full max-w-lg rounded-xl bg-white p-6 shadow-xl">
        <h2 className="text-lg font-semibold">
          {t(
            "editquestion.edit_question"
          )}
        </h2>

        {/* Title */}
        <div className="mt-4">
          <label
            htmlFor="edit-question-title"
            className="text-sm font-medium"
          >
            {t(
              "editquestion.title"
            )}
          </label>

          <input
            id="edit-question-title"
            type="text"
            value={editTitle}
            onChange={(event) =>
              setEditTitle(
                event.target.value
              )
            }
            className="mt-1 w-full rounded-lg border px-3 py-2 outline-none focus:border-blue-500"
          />
        </div>

        {/* Question */}
        <div className="mt-4">
          <label
            htmlFor="edit-question-content"
            className="text-sm font-medium"
          >
            {t(
              "editquestion.question"
            )}
          </label>

          <textarea
            id="edit-question-content"
            value={editContent}
            onChange={(event) =>
              setEditContent(
                event.target.value
              )
            }
            rows={5}
            className="mt-1 w-full resize-none rounded-lg border px-3 py-2 outline-none focus:border-blue-500"
          />
        </div>

        {/* Tags */}
        <div className="mb-3 mt-4">
          <label
            htmlFor="edit-question-tag"
            className="mb-2 block text-sm font-medium"
          >
            {t(
              "editquestion.tags_maximum_5"
            )}
          </label>

          <div className="flex gap-2">
            <input
              id="edit-question-tag"
              type="text"
              value={editTagInput}
              onChange={(event) =>
                setEditTagInput(
                  event.target.value
                )
              }
              onKeyDown={
                handleTagKeyDown
              }
              placeholder={t(
                "editquestion.enter_a_tag"
              )}
              className="flex-1 rounded-lg border px-3 py-2"
            />

            <button
              type="button"
              onClick={
                addEditTag
              }
              className="rounded-lg bg-blue-600 px-4 text-white hover:bg-blue-700"
            >
              +
            </button>
          </div>

          {/* Selected tags */}
          <div className="mt-3 flex flex-wrap gap-2">
            {editTags.map(
              (tag) => (
                <span
                  key={tag}
                  className="inline-flex w-fit items-center rounded bg-blue-100 px-2 py-1 text-sm text-blue-800"
                >
                  {tag}

                  <button
                    type="button"
                    onClick={() =>
                      removeEditTag(
                        tag
                      )
                    }
                    className="ml-2 text-red-500 hover:text-red-700"
                  >
                    ×
                  </button>
                </span>
              )
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border px-4 py-2 hover:bg-gray-100"
          >
            {t(
              "editquestion.cancel"
            )}
          </button>

          <button
            type="button"
            onClick={() =>
              void onSave()
            }
            className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          >
            {t(
              "editquestion.save_changes"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditQuestionModal;