import {
  Crown,
  BadgeCheck,
  Search,
  Bookmark,
} from "lucide-react";
import { useTranslation } from "react-i18next";

const benefits = [
  {
    icon: Crown,
    title: "more_questions",
    description: "increase_your_daily_question_limit",
  },
  {
    icon: BadgeCheck,
    title: "premium_badges",
    description: "stand_out_with_exclusive_profile_badges",
  },
  {
    icon: Search,
    title: "advanced_search",
    description: "find_answers_faster_with_powerful_filters",
  },
  {
    icon: Bookmark,
    title: "unlimited_bookmarks",
    description: "save_as_many_questions_and_posts_as_you_like",
  },
];

export default function WhyUpgrade() {
  const {t} = useTranslation();
  return (
    <div className="mt-20">
      <h2 className="text-4xl font-extrabold text-center mb-12 text-purple-700">
       {t("subscription.whyUpgrade")}
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
                {t(`subscription.${item.title}`)}
              </h3>

              <p className="mt-2 text-gray-600 text-[15px] leading-7">
                {t(`subscription.${item.description}`)}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}