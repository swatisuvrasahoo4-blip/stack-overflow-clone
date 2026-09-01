"use client";

import { useTranslation } from "react-i18next";

interface LanguageMenuProps {
  open: boolean;
  onClose: () => void;
  onSelect: (
    code: string,
    name: string
  ) => void;
}

const languages = [
  {
    code: "en",
    key: "english",
    name: "English",
  },
  {
    code: "es",
    key: "spanish",
    name: "Spanish",
  },
  {
    code: "hi",
    key: "hindi",
    name: "Hindi",
  },
  {
    code: "pt",
    key: "portuguese",
    name: "Portuguese",
  },
  {
    code: "zh",
    key: "chinese",
    name: "Chinese",
  },
  {
    code: "fr",
    key: "french",
    name: "French",
  },
];

const LanguageMenu = ({
  open,
  onClose,
  onSelect,
}: LanguageMenuProps) => {
  const { t } =
    useTranslation("language");

  if (!open) {
    return null;
  }

  return (
    <div
      className="
        fixed bottom-24 right-24 z-50
        w-56
        overflow-hidden
        rounded-xl
        border border-gray-200
        bg-white
        shadow-xl
      "
    >
      <div className="flex items-center justify-between border-b px-4 py-3">
        <p className="font-semibold text-gray-800">
          {t(
            "menu.choose_language"
          )}
        </p>

        <button
          type="button"
          onClick={onClose}
          className="text-lg text-gray-400 hover:text-gray-700"
          aria-label={t(
            "accessibility.close_language_menu"
          )}
        >
          ✕
        </button>
      </div>

      <div className="p-2">
        {languages.map(
          (language) => (
            <button
              key={language.code}
              onClick={() =>
                onSelect(
                  language.code,
                  language.name
                )
              }
              type="button"
              className="
                w-full
                rounded-lg
                px-3 py-2
                text-left text-sm
                text-gray-700
                transition
                hover:bg-orange-50
                hover:text-orange-600
              "
            >
              {t(
                `languages.${language.key}`
              )}
            </button>
          )
        )}
      </div>
    </div>
  );
};

export default LanguageMenu;