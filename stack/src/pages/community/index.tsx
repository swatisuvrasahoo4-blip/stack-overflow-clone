import Mainlayout from "@/layout/Mainlayout";
import Link from "next/link";

export default function CommunityPage() {
  return (
    <Mainlayout>
      <main className="min-w-0 p-4 lg:p-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <div>
            <h1 className="text-2xl font-semibold">
              Community Feed
            </h1>

            <p className="text-gray-500 text-sm mt-1">
              Share updates, projects, code snippets and learning achievements.
            </p>
          </div>

          <Link
            href="/community/create"
            className="inline-flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 text-center rounded-lg transition:colors text-sm font-medium"
          >
            Create Post
          </Link>
        </div>

        {/* Feed */}
        <div className="bg-white border rounded-lg p-5">

  <div className="flex items-center justify-between">
    <div>
      <h3 className="font-semibold">Swati</h3>
      <p className="text-xs text-gray-500">
        2 minutes ago
      </p>
    </div>
  </div>

  <p className="mt-4">
    🚀 Started building the Community Feed feature for CodeQuest using
    Next.js, Express.js and MongoDB.
  </p>

  <div className="flex gap-2 mt-4">
    <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs">
      #NextJS
    </span>

    <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs">
      #MongoDB
    </span>

    <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs">
      #Internship
    </span>
  </div>

  <div className="flex gap-6 mt-5 text-gray-600 text-sm">
    <button>👍 Like</button>
    <button>💬 Comment</button>
    <button>🔖 Bookmark</button>
    <button>↗ Share</button>
  </div>

</div>
      </main>
    </Mainlayout>
  );
}