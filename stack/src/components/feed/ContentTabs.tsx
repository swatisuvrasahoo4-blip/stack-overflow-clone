import type { Dispatch, SetStateAction } from "react";
import { useRouter } from "next/router";

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
  const router = useRouter();
  return (
    <div className="flex justify-center gap-3">
      <button
        type="button"
        onClick={() =>{ 
          setActiveContent("questions")
          router.push(
  {
    pathname: "/",
    query: { content: "questions" },
  },
  undefined,
  { shallow: true }
);
        }}
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
        onClick={() =>{ 
          setActiveContent("posts");
          router.push(
  {
    pathname: "/",
    query: { content: "posts" },
  },
  undefined,
  { shallow: true }
);     
        }}
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