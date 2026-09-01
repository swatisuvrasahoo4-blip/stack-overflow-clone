import { useState } from "react";
import Link from "next/link";
import { Users } from "lucide-react";
import { useTranslation } from "react-i18next";

import type { Mention } from "@/types/community";

interface MentionAvatarProps {
  mentions: Mention[];
}

const MentionAvatar = ({
  mentions,
}: MentionAvatarProps) => {
  const { t } =
    useTranslation("community");

  const [open, setOpen] =
    useState(false);

  if (
    !mentions ||
    mentions.length === 0
  ) {
    return null;
  }

  return (
    <div className="relative">
      {/* Mention button */}

      <div className="relative">
        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();

            setOpen(
              (previousOpen) =>
                !previousOpen
            );
          }}
          className="flex h-8 w-8 items-center justify-center rounded-full bg-black text-white transition hover:bg-blue-700"
          aria-label={t(
            "accessibility.view_mentioned_users"
          )}
        >
          <Users size={16} />
        </button>

        {/* Mention count */}

        <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-white text-[10px] font-bold text-black">
          {mentions.length}
        </span>
      </div>

      {/* Mentioned users */}

      {open && (
        <div className="absolute left-0 z-50 mt-2 w-56 rounded-lg border bg-white shadow-lg">
          <div className="border-b px-3 py-2 text-sm font-semibold">
            {t("mentioned_users")}
          </div>

          {mentions.map(
            (user) => (
              <Link
                key={user.userId}
                href={`/users/${user.userId}`}
                onClick={(
                  event
                ) => {
                  event.stopPropagation();
                  setOpen(false);
                }}
                className="block px-3 py-2 hover:bg-gray-100"
              >
                <div className="font-medium">
                  {user.name ||
                    user.username}
                </div>

                <div className="text-xs text-gray-500">
                  @{user.username}
                </div>
              </Link>
            )
          )}
        </div>
      )}
    </div>
  );
};

export default MentionAvatar;