export type PlanName =
  | "Free"
  | "Bronze"
  | "Silver"
  | "Gold";

export interface SubscriptionPlan {
  id: number;
  name: PlanName;
  price: string;
  description: string;
  features: string[];
  isCurrent: boolean;
  isPopular: boolean;
}

// Subscription plan configuration
export const subscriptionPlans: SubscriptionPlan[] = [
  {
    id: 1,
    name: "Free",
    price: "₹0/month",
    description: "perfect_for_getting_started",
    features: [
      "one_question_per_day",
      "basic_search",
    ],
    isCurrent: true,
    isPopular: false,
  },
  {
    id: 2,
    name: "Bronze",
    price: "₹99/month",
    description: "great_for_regular_users",
    features: [
      "five_questions_per_day",
      "bronze_profile_badge",
      "advanced_search_filters",
    ],
    isCurrent: false,
    isPopular: false,
  },
  {
    id: 3,
    name: "Silver",
    price: "₹299/month",
    description: "best_for_active_community_members",
    features: [
      "fifteen_questions_per_day",
      "silver_profile_badge",
      "priority_support",
      "enhanced_profile_visibility",
      "unlimited_bookmarks",
    ],
    isCurrent: false,
    isPopular: false,
  },
  {
    id: 4,
    name: "Gold",
    price: "₹999/month",
    description: "unlock_every_premium_feature",
    features: [
      "unlimited_questions",
      "gold_profile_badge",
      "highest_search_priority",
      "featured_profile_visibility",
      "priority_customer_support",
      "exclusive_community_features",
    ],
    isCurrent: false,
    isPopular: true,
  },
];