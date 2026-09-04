"use client";

import {
  Bookmark,
  Bot,
  Building,
  Crown,
  FileText,
  Home,
  MessageSquare,
  MessageSquareIcon,
  ShieldAlert,
  Tag,
  Trophy,
  Users,
  UsersRound,
} from "lucide-react";

import Link from "next/link";

import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/AuthContext";
import { useTranslation } from "react-i18next";

import { Badge } from "./ui/badge";

interface SidebarProps {
  isopen: boolean;
  onClose: () => void;
}

const Sidebar = ({
  isopen,
  onClose,
}: SidebarProps) => {
  const { user } = useAuth();
  const { t } = useTranslation("sidebar");

  const linkClass =
    "flex items-center rounded px-2 py-2 text-sm text-gray-700 hover:bg-gray-100";

  const handleLinkClick = () => {
    if (
      typeof window !== "undefined" &&
      window.innerWidth < 768
    ) {
      onClose();
    }
  };

  return (
    <>
      {/* Mobile overlay */}

      {isopen && (
        <button
          type="button"
          aria-label="Close sidebar"
          onClick={onClose}
          className="fixed inset-x-0 bottom-0 top-[72px] z-30 bg-black/30 md:hidden"
        />
      )}

      {/* Fixed sidebar */}

      <aside
        className={cn(
          "fixed bottom-0 left-0 top-[72px] z-40",
          "w-64 border-r border-gray-200 bg-white",
          "transition-transform duration-300 ease-in-out md:transition-none",

          isopen
  ? "translate-x-0"
  : "-translate-x-full",
"md:w-48 lg:w-64"
        )}
      >
        {/* Scrollable sidebar without scrollbar */}

        <div
          className="
            h-full
            overflow-y-auto
            overscroll-contain
            [scrollbar-width:none]
            [-ms-overflow-style:none]
            [&::-webkit-scrollbar]:hidden
          "
        >
          <nav className="p-3 pb-10 lg:p-4">
            <ul className="space-y-1">
              <li>
                <Link
                  href="/"
                  onClick={handleLinkClick}
                  className={linkClass}
                >
                  <Home className="mr-3 h-4 w-4 shrink-0" />
                  {t("links.home")}
                </Link>
              </li>

              <li>
                <Link
                  href="/questions"
                  onClick={handleLinkClick}
                  className={linkClass}
                >
                  <MessageSquareIcon className="mr-3 h-4 w-4 shrink-0" />
                  {t("links.questions")}
                </Link>
              </li>

              <li>
                <Link
                  href="#"
                  onClick={handleLinkClick}
                  className={linkClass}
                >
                  <Bot className="mr-3 h-4 w-4 shrink-0" />

                  {t("links.ai_assist")}

                  <Badge
                    variant="secondary"
                    className="ml-auto text-xs"
                  >
                    {t("links.labs")}
                  </Badge>
                </Link>
              </li>

              <li>
                <Link
                  href="/tags"
                  onClick={handleLinkClick}
                  className={linkClass}
                >
                  <Tag className="mr-3 h-4 w-4 shrink-0" />
                  {t("links.tags")}
                </Link>
              </li>

              <li>
                <Link
                  href="/users"
                  onClick={handleLinkClick}
                  className={linkClass}
                >
                  <Users className="mr-3 h-4 w-4 shrink-0" />
                  {t("links.users")}
                </Link>
              </li>

              <li>
                <Link
                  href="/community"
                  onClick={handleLinkClick}
                  className={linkClass}
                >
                  <UsersRound className="mr-3 h-4 w-4 shrink-0" />
                  {t("links.community")}
                </Link>
              </li>

              <li>
                <Link
                  href="/?panel=saves"
                  onClick={handleLinkClick}
                  className={linkClass}
                >
                  <Bookmark className="mr-3 h-4 w-4 shrink-0" />
                  {t("links.saves")}
                </Link>
              </li>

              <li>
                <Link
                  href="#"
                  onClick={handleLinkClick}
                  className={linkClass}
                >
                  <Trophy className="mr-3 h-4 w-4 shrink-0" />

                  {t("links.challenges")}

                  <Badge
                    variant="secondary"
                    className="ml-auto bg-orange-100 text-xs text-orange-800"
                  >
                    {t("badges.new")}
                  </Badge>
                </Link>
              </li>

              <li>
                <Link
                  href="#"
                  onClick={handleLinkClick}
                  className={linkClass}
                >
                  <MessageSquare className="mr-3 h-4 w-4 shrink-0" />
                  {t("links.chat")}
                </Link>
              </li>

              <li>
                <Link
                  href="#"
                  onClick={handleLinkClick}
                  className={linkClass}
                >
                  <FileText className="mr-3 h-4 w-4 shrink-0" />
                  {t("links.articles")}
                </Link>
              </li>

              <li>
                <Link
                  href="#"
                  onClick={handleLinkClick}
                  className={linkClass}
                >
                  <Building className="mr-3 h-4 w-4 shrink-0" />
                  {t("links.companies")}
                </Link>
              </li>

              <li>
                <Link
                  href="/subscription"
                  onClick={handleLinkClick}
                  className={linkClass}
                >
                  <Crown className="mr-3 h-4 w-4 shrink-0" />
                  {t("links.subscription")}
                </Link>
              </li>

              {user?.role === "admin" && (
                <li>
                  <Link
                    href="/admin"
                    onClick={handleLinkClick}
                    className={linkClass}
                  >
                    <ShieldAlert className="mr-3 h-4 w-4 shrink-0 text-red-600" />
                    {t("links.admin")}
                  </Link>
                </li>
              )}
            </ul>
          </nav>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;