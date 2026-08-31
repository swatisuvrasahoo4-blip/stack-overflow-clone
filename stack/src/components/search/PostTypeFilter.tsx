import type {
  Dispatch,
  SetStateAction,
} from "react";
import { useTranslation } from "react-i18next";

type PostType =
  | "All"
  | "Technical Update"
  | "Project Showcase"
  | "Learning Achievement"
  | "Code Snippet";

interface PostTypeFilterProps {
  selectedType: PostType;
  setSelectedType: Dispatch<
    SetStateAction<PostType>
  >;
}

const PostTypeFilter = ({
  selectedType,
  setSelectedType,
}: PostTypeFilterProps) => {
  const { t } = useTranslation();

  return (
    <div className="mb-6">
      <label className="mb-2 block text-sm font-medium text-gray-700">
        {t(
          "search.filter_by_post_type"
        )}
      </label>

      <select
        value={selectedType}
        onChange={(event) =>
          setSelectedType(
            event.target.value as PostType
          )
        }
        className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm"
      >
        <option value="All">
          {t("search.all_types")}
        </option>

        <option value="Technical Update">
          {t(
            "search.technical_update"
          )}
        </option>

        <option value="Project Showcase">
          {t(
            "search.project_showcase"
          )}
        </option>

        <option value="Learning Achievement">
          {t(
            "search.learning_achievement"
          )}
        </option>

        <option value="Code Snippet">
          {t(
            "search.code_snippet"
          )}
        </option>
      </select>
    </div>
  );
};

export default PostTypeFilter;