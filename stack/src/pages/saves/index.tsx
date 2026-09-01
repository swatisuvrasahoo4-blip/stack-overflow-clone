import { useTranslation } from "react-i18next";

import SavedList from "@/components/saved/SavedList";

const SavesPage = () => {
  const { t } =
    useTranslation("community");

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      {/* Page header */}

      <h1 className="mb-6 text-3xl font-bold">
        {t("labels.saves")}
      </h1>

      {/* Saved questions and posts */}

      <SavedList />
    </div>
  );
};

export default SavesPage;