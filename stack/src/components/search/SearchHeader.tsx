import { useTranslation } from "react-i18next";

interface SearchHeaderProps {
  query: string;
}

const SearchHeader = ({
  query,
}: SearchHeaderProps) => {
  const { t } =
    useTranslation("search");

  return (
    <div className="mb-6">
      <h1 className="text-2xl font-semibold text-gray-800">
        {t(
          "title.search_results"
        )}
      </h1>

      <p className="mt-2 text-sm text-gray-600">
        {t(
          "messages.results_for",
          { query }
        )}
      </p>
    </div>
  );
};

export default SearchHeader;