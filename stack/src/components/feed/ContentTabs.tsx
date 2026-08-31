import type {
  Dispatch,
  SetStateAction,
} from "react";

import { useRouter } from "next/router";
import { useTranslation } from "react-i18next";

type ContentType =
  | "questions"
  | "posts";

interface ContentTabsProps {
  activeContent: ContentType;

  setActiveContent: Dispatch<
    SetStateAction<ContentType>
  >;
}

const ContentTabs = ({
  activeContent,
  setActiveContent,
}: ContentTabsProps) => {
  const { t } =
    useTranslation();

  const router =
    useRouter();

  const handleContentChange = (
    content: ContentType
  ) => {
    setActiveContent(
      content
    );

    void router.push(
      {
        pathname: "/",
        query: {
          content,
        },
      },
      undefined,
      {
        shallow: true,
      }
    );
  };

  return (
    <div className="flex justify-center gap-3">
      {/* Questions tab */}

      <button
        type="button"
        onClick={() =>
          handleContentChange(
            "questions"
          )
        }
        className={`rounded-md px-5 py-2 text-sm font-medium transition ${
          activeContent ===
          "questions"
            ? "bg-blue-600 text-white"
            : "bg-gray-200 text-gray-700 hover:bg-gray-300"
        }`}
      >
        {t(
          "community.questions"
        )}
      </button>

      {/* Posts tab */}

      <button
        type="button"
        onClick={() =>
          handleContentChange(
            "posts"
          )
        }
        className={`rounded-md px-5 py-2 text-sm font-medium transition ${
          activeContent ===
          "posts"
            ? "bg-blue-600 text-white"
            : "bg-gray-200 text-gray-700 hover:bg-gray-300"
        }`}
      >
        {t(
          "community.posts"
        )}
      </button>
    </div>
  );
};

export default ContentTabs;