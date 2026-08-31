import type {
  ChangeEvent,
  RefObject,
} from "react";

import { useTranslation } from "react-i18next";

interface CreatePostImageUploadProps {
  postType: string;
  image: File | null;
  imageInputRef: RefObject<HTMLInputElement | null>;

  onImageChange: (
    image: File | null
  ) => void;
}

const CreatePostImageUpload = ({
  postType,
  image,
  imageInputRef,
  onImageChange,
}: CreatePostImageUploadProps) => {
  const { t } = useTranslation();

  // Select image
  const handleImageChange = (
    event: ChangeEvent<HTMLInputElement>
  ): void => {
    const file =
      event.target.files?.[0] ??
      null;

    onImageChange(file);
  };

  // Remove selected image
  const handleRemoveImage =
    (): void => {
      onImageChange(null);

      if (imageInputRef.current) {
        imageInputRef.current.value =
          "";
      }
    };

  return (
    <div className="space-y-2">
      {/* Hidden file input */}
      <input
        ref={imageInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={handleImageChange}
      />

      {/* Image selector */}
      {postType !==
        "Code Snippet" && (
        <div className="flex items-center rounded border p-2">
          <button
            type="button"
            className="cursor-pointer rounded bg-gray-100 px-4 py-2 hover:bg-gray-200"
            onClick={() =>
              imageInputRef.current?.click()
            }
          >
            {t(
              "createpost.choose_file"
            )}
          </button>

          <span
            className={`ml-auto truncate px-3 text-sm ${
              image
                ? "text-gray-700"
                : "text-red-600"
            }`}
          >
            {image
              ? image.name
              : t(
                  "createpost.no_file_choosen"
                )}
          </span>

          {/* Remove image */}
          {image && (
            <button
              type="button"
              className="cursor-pointer px-2 text-xl font-bold text-red-600 hover:text-red-800"
              aria-label="Remove selected image"
              onClick={
                handleRemoveImage
              }
            >
              ×
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default CreatePostImageUpload;