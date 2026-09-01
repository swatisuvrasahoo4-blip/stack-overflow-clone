import { useTranslation } from "react-i18next";

const SearchLoading = () => {
  const { t } =
    useTranslation("search");

  return (
    <div className="py-6 text-center">
      <p className="text-sm text-gray-500">
        {t("status.searching")}
      </p>
    </div>
  );
};

export default SearchLoading;