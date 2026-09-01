import { Button } from "@/components/ui/button";

import { Check } from "lucide-react";

import { useRouter } from "next/router";
import { useTranslation } from "react-i18next";

import { useAuth } from "@/lib/AuthContext";

import { toast } from "react-toastify";

import type { PlanName } from "@/constants/subscriptionPlans";

type PaidPlan =
  | "Bronze"
  | "Silver"
  | "Gold";

interface PlanCardProps {
  name: PlanName;
  price: string;
  description: string;
  features: string[];
  isCurrent?: boolean;
  isPopular?: boolean;
  currentPlan: PlanName | "";
  onUpgrade?: (
    plan: PaidPlan
  ) => void | Promise<void>;
}

const PlanCard = ({
  name,
  price,
  description,
  features,
  isCurrent = false,
  isPopular = false,
  currentPlan,
  onUpgrade,
}: PlanCardProps) => {
  const router = useRouter();
  const { user } = useAuth();

  const { t } =
    useTranslation("subscription");

  const planOrder: Record<
    PlanName,
    number
  > = {
    Free: 0,
    Bronze: 1,
    Silver: 2,
    Gold: 3,
  };

  const currentPlanLevel =
    currentPlan
      ? planOrder[currentPlan]
      : -1;

  const canUpgrade =
    planOrder[name] >
    currentPlanLevel;

  const handleUpgradeClick =
    () => {
      if (!user) {
        toast.info(
          t(
            "messages.please_login_to_continue"
          )
        );

        void router.push(
          "/auth"
        );

        return;
      }

      if (
        !canUpgrade ||
        name === "Free"
      ) {
        return;
      }

      void onUpgrade?.(
        name
      );
    };

  return (
    <div
      className={`relative w-full rounded-2xl border bg-white p-6 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl sm:p-8 ${
        isPopular
          ? "scale-[1.03] border-yellow-400 shadow-xl ring-2 ring-yellow-200"
          : "border-gray-200 shadow-md"
      }`}
    >
      {isPopular && (
        <span className="absolute right-4 top-4 rounded-full bg-yellow-500 px-3 py-1 text-xs font-semibold text-white">
          {t(
            "plans.most_popular"
          )}
        </span>
      )}

      <h2
        className={`text-3xl font-bold ${
          name === "Free"
            ? "text-gray-900"
            : name ===
                "Bronze"
              ? "text-amber-700"
              : name ===
                  "Silver"
                ? "text-slate-600"
                : "text-yellow-600"
        }`}
      >
        {t(
          `plans.names.${name.toLowerCase()}`
        )}
      </h2>

      <p
        className={`mb-3 mt-4 text-5xl font-extrabold ${
          name === "Free"
            ? "text-purple-600"
            : name ===
                "Bronze"
              ? "text-amber-700"
              : name ===
                  "Silver"
                ? "text-slate-600"
                : "text-yellow-500"
        }`}
      >
        {price.replace(
          "month",
          t("plans.month")
        )}
      </p>

      <p className="mt-4 text-base text-gray-600">
        {t(
          `plans.descriptions.${description}`
        )}
      </p>

      <div className="mt-8 space-y-4">
        {features.map(
          (feature) => (
            <div
              key={feature}
              className="flex items-center gap-2"
            >
              <Check
                className={`h-5 w-5 ${
                  name ===
                  "Free"
                    ? "text-purple-600"
                    : name ===
                        "Bronze"
                      ? "text-amber-600"
                      : name ===
                          "Silver"
                        ? "text-slate-500"
                        : "text-yellow-500"
                }`}
              />

              <span className="text-sm font-medium text-gray-700">
                {t(
                  `plans.features.${feature}`
                )}
              </span>
            </div>
          )
        )}
      </div>

      <div className="mt-8">
        {isCurrent ? (
          <Button
            type="button"
            disabled
            className={`w-full font-semibold text-white ${
              name === "Free"
                ? "bg-purple-600 hover:bg-purple-600"
                : name ===
                    "Bronze"
                  ? "bg-amber-700 hover:bg-amber-700"
                  : name ===
                      "Silver"
                    ? "bg-slate-600 hover:bg-slate-600"
                    : "bg-yellow-500 hover:bg-yellow-500"
            }`}
          >
            {t(
              "actions.current_plan"
            )}
          </Button>
        ) : (
          <Button
            type="button"
            onClick={
              handleUpgradeClick
            }
            disabled={
              Boolean(user) &&
              !canUpgrade
            }
            className={`w-full font-semibold text-white transition-all duration-300 ${
              name === "Bronze"
                ? "bg-amber-700 hover:bg-amber-800"
                : name ===
                    "Silver"
                  ? "bg-slate-600 hover:bg-slate-700"
                  : name ===
                      "Gold"
                    ? "bg-yellow-500 text-black hover:bg-yellow-600"
                    : "bg-purple-600 hover:bg-purple-700"
            }`}
          >
            {!user ||
            canUpgrade
              ? t(
                  "actions.upgrade"
                )
              : t(
                  "actions.lower_plan"
                )}
          </Button>
        )}
      </div>
    </div>
  );
};

export default PlanCard;