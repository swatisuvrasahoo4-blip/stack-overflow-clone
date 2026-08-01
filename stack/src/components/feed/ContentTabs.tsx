import type { Dispatch, SetStateAction } from "react";

type ContentTabsProps = {
  activeContent: "questions" | "posts";
  setActiveContent: Dispatch<
    SetStateAction<"questions" | "posts">
  >;
};

export default function ContentTabs({
  activeContent,
  setActiveContent,
}: ContentTabsProps) {
  return (
    <div className="flex justify-center gap-3">
      <button
        type="button"
        onClick={() => setActiveContent("questions")}
        className={`rounded-md px-5 py-2 text-sm font-medium transition ${
          activeContent === "questions"
            ? "bg-blue-600 text-white"
            : "bg-gray-200 text-gray-700 hover:bg-gray-300"
        }`}
      >
        Questions
      </button>

      <button
        type="button"
        onClick={() => setActiveContent("posts")}
        className={`rounded-md px-5 py-2 text-sm font-medium transition ${
          activeContent === "posts"
            ? "bg-blue-600 text-white"
            : "bg-gray-200 text-gray-700 hover:bg-gray-300"
        }`}
      >
        Posts
      </button>
    </div>
  );
}