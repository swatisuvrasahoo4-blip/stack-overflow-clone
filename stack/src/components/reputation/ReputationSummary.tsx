import {
  Trophy,
  MessageCircle,
  Pencil,
  ArrowUp,
  Flag,
} from "lucide-react";

import { useTranslation } from "react-i18next";

interface ReputationSummaryProps {
  reputation: number;
  onViewActivity: () => void;
}

const ReputationSummary = ({
  reputation,
  onViewActivity,
}: ReputationSummaryProps) => {
  const { t } =
    useTranslation("reputation");

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
    <div className="rounded-xl border bg-white p-6 shadow-sm">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Trophy className="h-6 w-6 text-yellow-600" />

          <h2 className="text-2xl font-semibold">
            {t(
              "title.reputation"
            )}
          </h2>
        </div>

        <button
          type="button"
          onClick={onViewActivity}
          className="rounded-lg border border-green-600 px-4 py-2 text-green-700 transition hover:bg-green-50"
        >
          {t(
            "actions.view_reputation_activity"
          )}
        </button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="flex items-center gap-4">
          <Trophy className="h-10 w-10 text-yellow-500" />

          <div>
            <p className="text-sm text-gray-500">
              {t(
                "labels.total_reputation"
              )}
            </p>

            <p className="text-4xl font-bold text-green-600">
              {reputation}
            </p>
          </div>
        </div>

        <div>
          <h3 className="mb-3 font-semibold">
            {t(
              "labels.community_privileges"
            )}
          </h3>

          <div className="space-y-3">
            {privileges.map(
              (privilege) => {
                const Icon =
                  privilege.icon;

                const unlocked =
                  reputation >=
                  privilege.required;

                return (
                  <div
                    key={
                      privilege.required
                    }
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2">
                      <Icon
                        className={`h-4 w-4 ${
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
                        {t(
                          `privileges.${privilege.name}`
                        )}
                      </span>
                    </div>

                    <span className="text-sm font-medium">
                      {t(
                        "labels.points",
                        {
                          count:
                            privilege.required,
                        }
                      )}
                    </span>
                  </div>
                );
              }
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReputationSummary;