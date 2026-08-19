import { useState } from "react";
import Link from "next/link";
import { Users } from "lucide-react";
import { useTranslation } from "react-i18next";

interface Mention {
    userId: string,
  username: string;
  name?: string;
}

interface MentionAvatarProps {
  mentions: Mention[];
}

export default function MentionAvatar({
  mentions,
}: MentionAvatarProps) {
  const {t} = useTranslation();
  const [open, setOpen] = useState(false);

  if (!mentions || mentions.length === 0) return null;

  return (
    <div className="relative">
     <div className="relative">
  <button
    type="button"
    onClick={(e) => {
      e.stopPropagation();
      setOpen(!open);
    }}
    className="flex h-8 w-8 items-center justify-center rounded-full bg-black text-white hover:bg-blue-700 transition"
  >
    <Users size={16} />
  </button>

  <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-white text-[10px] font-bold text-black">
    {mentions.length}
  </span>
</div>

      {open && (
        <div className="absolute left-0 mt-2 w-56 rounded-lg border bg-white shadow-lg z-50">
          <div className="border-b px-3 py-2 text-sm font-semibold">
            {t("community.mentionedUsers")}
          </div>

          {mentions.map((user) => (
  <Link
    key={user.userId}
    href={`/users/${user.userId}`}
    onClick={(e) => {
      e.stopPropagation();
      setOpen(false);
    }}
    className="block px-3 py-2 hover:bg-gray-100"
  >
    <div className="font-medium">
      {user.name || user.username}
    </div>

    <div className="text-xs text-gray-500">
      @{user.username}
    </div>
  </Link>
))}
        </div>
      )}
    </div>
  );
}