import { useRouter } from "next/router";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";

import { useAuth } from "@/lib/AuthContext";

const CommunityHeader = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const { user } = useAuth();

  const handleCreatePost = () => {
    if (!user) {
      toast.info(
        t("toast.please_login_to_continue")
      );

      void router.push("/auth");
      return;
    }

    void router.push(
      "/community/create"
    );
  };

  return (
    <div className="mb-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
      {/* Community heading */}

      <div>
        <h1 className="text-2xl font-semibold">
          {t(
            "community.community_feed"
          )}
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          {t(
            "community.share_updates_projects_code_snippets_and_learning_achievements"
          )}
        </p>
      </div>

      {/* Create post button */}

      <button
        type="button"
        onClick={
          handleCreatePost
        }
        className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-3 py-1.5 text-center text-sm font-medium text-white transition-colors hover:bg-blue-700"
      >
        {t(
          "community.createPost"
        )}
      </button>
    </div>
  );
};

export default CommunityHeader;