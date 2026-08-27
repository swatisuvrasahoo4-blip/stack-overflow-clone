import Link from "next/link"
import { useTranslation } from "react-i18next"
export default function CommunityHeader(){
  const {t} = useTranslation();
    return (
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <div>
            <h1 className="text-2xl font-semibold">
              {t("community.community_feed")}
            </h1>

            <p className="text-gray-500 text-sm mt-1">
              {t("community.share_updates_projects_code_snippets_and_learning_achievements")}
            </p>
          </div>

          <Link
            href="/community/create"
            className="inline-flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 text-center rounded-lg transition:colors text-sm font-medium"
          >
            {t("community.createPost")}
          </Link>
        </div>
    )
}
