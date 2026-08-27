import React from "react";
import { Trophy, MessageCircle, Pencil, ArrowUp, Flag } from "lucide-react";
import { useTranslation } from "react-i18next";

interface ReputationSummaryProps {
  reputation: number;
  onViewActivity: () => void;
}

const ReputationSummary = ({
  reputation,
  onViewActivity,
}: ReputationSummaryProps) => {
  const {t} = useTranslation();
  const privileges = [
    {
      name: "unrestricted_commenting",
      required: 50,
      icon: MessageCircle,
    },
    {
      name: "edit_community_posts",
      required: 100,
      icon: Pencil,
    },
    {
      name: "vote_to_close_questions",
      required: 250,
      icon: ArrowUp,
    },
    {
      name: "report_inappropriate_content",
      required: 500,
      icon: Flag,
    },
  ];

  return (
    <div className="border rounded-xl p-6 bg-white shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Trophy className="w-6 h-6 text-yellow-600" />

          <h2 className="text-2xl font-semibold">
            {t("reputation.reputation")}
          </h2>
        </div>

        <button
          onClick={onViewActivity}
          className="border border-green-600 text-green-700 px-4 py-2 rounded-lg hover:bg-green-50 transition"
        >
          {t("reputation.view_reputation_activity")}
        </button>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Reputation total */}
        <div className="flex items-center gap-4">
          <Trophy className="w-10 h-10 text-yellow-500" />

          <div>
            <p className="text-sm text-gray-500">
              {t("reputation.total_reputation")}
            </p>

            <p className="text-4xl font-bold text-green-600">
              {reputation}
            </p>
          </div>
        </div>

        {/* Privileges */}
        <div>
          <h3 className="font-semibold mb-3">
            {t("reputation.community_privileges")}
          </h3>

          <div className="space-y-3">
            {privileges.map((privilege) => {
              const Icon = privilege.icon;
              const unlocked = reputation >= privilege.required;

              return (
                <div
                  key={privilege.required}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    <Icon
                      className={`w-4 h-4 ${
                        unlocked
                          ? "text-green-600"
                          : "text-gray-400"
                      }`}
                    />

                    <span
                      className={
                        unlocked
                          ? "text-gray-800"
                          : "text-gray-400"
                      }
                    >
                     {t(`reputation.${privilege.name.toLowerCase()}`)}
                    </span>
                  </div>

                  <span className="text-sm font-medium">
                    {privilege.required} pts
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReputationSummary;