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
    backgroundClass: "bg-purple-100",
    iconClass: "text-purple-600",
  },
  {
    icon: BadgeCheck,
    title: "premium_badges",
    description: "stand_out_with_exclusive_profile_badges",
    backgroundClass: "bg-orange-100",
    iconClass: "text-orange-600",
  },
  {
    icon: Search,
    title: "advanced_search",
    description: "find_answers_faster_with_powerful_filters",
    backgroundClass: "bg-blue-100",
    iconClass: "text-blue-600",
  },
  {
    icon: Bookmark,
    title: "unlimited_bookmarks",
    description:
      "save_as_many_questions_and_posts_as_you_like",
    backgroundClass: "bg-green-100",
    iconClass: "text-green-600",
  },
];

const WhyUpgrade = () => {
  const { t } = useTranslation();

  return (
    <div className="mt-20">
      {/* Section heading */}
      <h2 className="mb-12 text-center text-4xl font-extrabold text-purple-700">
        {t("subscription.whyUpgrade")}
      </h2>

      {/* Upgrade benefits */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {benefits.map((item) => {
          const Icon = item.icon;

          return (
            <div
              key={item.title}
              className="rounded-2xl border border-gray-100 bg-white p-7 shadow-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl"
            >
              {/* Benefit icon */}
              <div
                className={`mb-5 flex h-14 w-14 items-center justify-center rounded-full ${item.backgroundClass}`}
              >
                <Icon
                  className={`h-7 w-7 ${item.iconClass}`}
                />
              </div>

              {/* Benefit information */}
              <h3 className="text-lg font-bold text-gray-900">
                {t(`subscription.${item.title}`)}
              </h3>

              <p className="mt-2 text-[15px] leading-7 text-gray-600">
                {t(
                  `subscription.${item.description}`
                )}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default WhyUpgrade;