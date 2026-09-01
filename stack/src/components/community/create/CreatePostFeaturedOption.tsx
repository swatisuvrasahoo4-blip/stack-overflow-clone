import { useRouter } from "next/router";
import { useTranslation } from "react-i18next";

interface CreatePostFeaturedOptionProps {
  isGoldUser: boolean;
  isFeatured: boolean;
  onFeaturedChange: (
    isFeatured: boolean
  ) => void;
}

const CreatePostFeaturedOption = ({
  isGoldUser,
  isFeatured,
  onFeaturedChange,
}: CreatePostFeaturedOptionProps) => {
  const router = useRouter();

  const { t } =
    useTranslation("create_post");

  return (
    <>
      {isGoldUser ? (
        <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-yellow-300 bg-yellow-50 p-3">
          <input
            type="checkbox"
            checked={isFeatured}
            onChange={(event) =>
              onFeaturedChange(
                event.target.checked
              )
            }
            className="h-4 w-4 accent-yellow-500"
          />

          <div>
            <p className="font-medium text-yellow-800">
              {t(
                "featured.feature_this_post"
              )}
            </p>

            <p className="text-sm text-yellow-700">
              {t(
                "featured.premium_visibility"
              )}
            </p>
          </div>
        </label>
      ) : (
        <button
          type="button"
          onClick={() =>
            void router.push(
              "/subscription"
            )
          }
          className="flex w-full cursor-pointer items-center gap-3 rounded-lg border border-gray-200 bg-gray-50 p-3 text-left"
        >
          <input
            type="checkbox"
            disabled
            className="h-4 w-4 cursor-not-allowed"
          />

          <div>
            <p className="font-medium text-gray-700">
              {t(
                "featured.feature_this_post"
              )}
            </p>

            <p className="text-sm text-gray-500">
              {t(
                "featured.gold_upgrade_required"
              )}
            </p>
          </div>
        </button>
      )}
    </>
  );
};

export default CreatePostFeaturedOption;