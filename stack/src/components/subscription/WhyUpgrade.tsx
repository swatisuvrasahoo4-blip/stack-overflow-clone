import {
  Crown,
  BadgeCheck,
  Search,
  Bookmark,
} from "lucide-react";

const benefits = [
  {
    icon: Crown,
    title: "More Questions",
    description: "Increase your daily question limit.",
  },
  {
    icon: BadgeCheck,
    title: "Premium Badges",
    description: "Stand out with exclusive profile badges.",
  },
  {
    icon: Search,
    title: "Advanced Search",
    description: "Find answers faster with powerful filters.",
  },
  {
    icon: Bookmark,
    title: "Unlimited Bookmarks",
    description: "Save as many questions and posts as you like.",
  },
];

export default function WhyUpgrade() {
  return (
    <div className="mt-20">
      <h2 className="text-4xl font-extrabold text-center mb-12 text-purple-700">
        Why Upgrade?
      </h2>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {benefits.map((item, index) => {
          const Icon = item.icon;

          return (
            <div
              key={index}
              className="rounded-2xl border border-gray-100 bg-white p-7 shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300"
            >
              <div
  className={`w-14 h-14 rounded-full flex items-center justify-center mb-5 ${
    index === 0
      ? "bg-purple-100"
      : index === 1
      ? "bg-orange-100"
      : index === 2
      ? "bg-blue-100"
      : "bg-green-100"
  }`}
>
  <Icon
    className={`h-7 w-7 ${
      index === 0
        ? "text-purple-600"
        : index === 1
        ? "text-orange-600"
        : index === 2
        ? "text-blue-600"
        : "text-green-600"
    }`}
  />
</div>

              <h3 className="text-lg font-bold text-gray-900">
                {item.title}
              </h3>

              <p className="mt-2 text-gray-600 text-[15px] leading-7">
                {item.description}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}