import Mainlayout from "@/layout/Mainlayout";
import { Badge } from "@/components/ui/badge";

const tags = [
  { name: "javascript", count: 1234 },
  { name: "reactjs", count: 987 },
  { name: "node.js", count: 721 },
  { name: "next.js", count: 614 },
  { name: "typescript", count: 532 },
  { name: "c++", count: 412 },
  { name: "web3", count: 298 },
  { name: "tailwind-css", count: 189 },
];

export default function TagsPage() {
  return (
    <Mainlayout>
      <main className="min-w-0 p-4 lg:p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <div>
            <h1 className="text-xl lg:text-2xl font-semibold">Tags</h1>
            <p className="text-sm text-gray-600 mt-1">
              Explore popular tags and topics.
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {tags.map((tag) => (
            <div key={tag.name} className="rounded-lg border bg-white p-4 shadow-sm">
              <div className="flex items-center justify-between gap-2">
                <span className="font-medium text-gray-800">#{tag.name}</span>
                <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                  {tag.count} questions
                </Badge>
              </div>
              <p className="text-sm text-gray-600 mt-2">
                Useful for questions about {tag.name} and related libraries.
              </p>
            </div>
          ))}
        </div>
      </main>
    </Mainlayout>
  );
}
