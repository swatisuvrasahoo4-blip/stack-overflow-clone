import React from "react";
import { Trophy, MessageCircle, Pencil, ArrowUp, Flag } from "lucide-react";

interface ReputationSummaryProps {
  reputation: number;
  onViewActivity: () => void;
}

const ReputationSummary = ({
  reputation,
  onViewActivity,
}: ReputationSummaryProps) => {
  const privileges = [
    {
      name: "Unrestricted commenting",
      required: 50,
      icon: MessageCircle,
    },
    {
      name: "Edit community posts",
      required: 100,
      icon: Pencil,
    },
    {
      name: "Vote to close questions",
      required: 250,
      icon: ArrowUp,
    },
    {
      name: "Report inappropriate content",
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
            Reputation
          </h2>
        </div>

        <button
          onClick={onViewActivity}
          className="border border-green-600 text-green-700 px-4 py-2 rounded-lg hover:bg-green-50 transition"
        >
          View Reputation Activity
        </button>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Reputation total */}
        <div className="flex items-center gap-4">
          <Trophy className="w-10 h-10 text-yellow-500" />

          <div>
            <p className="text-sm text-gray-500">
              Total Reputation
            </p>

            <p className="text-4xl font-bold text-green-600">
              {reputation}
            </p>
          </div>
        </div>

        {/* Privileges */}
        <div>
          <h3 className="font-semibold mb-3">
            Community Privileges
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
                      {privilege.name}
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