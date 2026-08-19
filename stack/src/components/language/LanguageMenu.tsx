"use client";

interface LanguageMenuProps {
  open: boolean;
  onClose: () => void;
  onSelect: (code: string, name: string) => void;
}

const languages = [
  { code: "en", name: "English" },
  { code: "es", name: "Spanish" },
  { code: "hi", name: "Hindi" },
  { code: "pt", name: "Portuguese" },
  { code: "zh", name: "Chinese" },
  { code: "fr", name: "French" },
];

const LanguageMenu = ({ open, onClose, onSelect, }: LanguageMenuProps) => {
  if (!open) return null;

 return (
  <div
    className="
      fixed bottom-24 right-24 z-50
      w-56
      rounded-xl
      bg-white
      border border-gray-200
      shadow-xl
      overflow-hidden
    "
  >
    <div className="flex items-center justify-between px-4 py-3 border-b">
      <p className="font-semibold text-gray-800">
        Choose Language
      </p>

      <button
        type="button"
        onClick={onClose}
        className="text-gray-400 hover:text-gray-700 text-lg"
      >
        ✕
      </button>
    </div>

    <div className="p-2">
      {languages.map((language) => (
        <button
          key={language.code}
          onClick={() => onSelect(language.code, language.name)}
          type="button"
          className="
            w-full
            px-3 py-2
            text-left text-sm
            text-gray-700
            rounded-lg
            hover:bg-orange-50
            hover:text-orange-600
            transition
          "
        >
          {language.name}
        </button>
      ))}
    </div>
  </div>
);
};

export default LanguageMenu;