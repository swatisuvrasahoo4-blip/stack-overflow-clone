import type {
  Dispatch,
  SetStateAction,
} from "react";
import { useTranslation } from "react-i18next";

type SearchType =
  | "All"
  | "Posts"
  | "Questions";

interface SearchTypeTabsProps {
  searchType: SearchType;
  setSearchType: Dispatch<
    SetStateAction<SearchType>
  >;
  setSelectedType: Dispatch<
    SetStateAction<
      | "All"
      | "Technical Update"
      | "Project Showcase"
      | "Learning Achievement"
      | "Code Snippet"
    >
  >;
}

const SearchTypeTabs = ({
  searchType,
  setSearchType,
  setSelectedType,
}: SearchTypeTabsProps) => {
  const { t } = useTranslation();

  const searchTypes: SearchType[] = [
    "All",
    "Posts",
    "Questions",
  ];

  const handleSearchTypeChange = (
    type: SearchType
  ): void => {
    setSearchType(type);

    if (type === "Questions") {
      setSelectedType("All");
    }
  };

  return (
    <div className="mt-4 flex gap-2">
      {searchTypes.map((type) => (
        <button
          key={type}
          type="button"
          onClick={() =>
            handleSearchTypeChange(type)
          }
          className={`rounded-md px-4 py-2 text-sm font-medium transition ${
            searchType === type
              ? "bg-blue-600 text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          {t(
            `search.${type.toLowerCase()}`
          )}
        </button>
      ))}
    </div>
  );
};

export default SearchTypeTabs;