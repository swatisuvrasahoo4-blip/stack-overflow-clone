"use client";

import { useAuth } from "@/lib/AuthContext";
import { Menu, Search } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import NotificationBell from "./notifications/NotificationBell";
import { useTranslation } from "react-i18next";

interface NavbarProps {
  handleslidein: () => void;
}

const Navbar = ({ handleslidein }: NavbarProps) => {
  const { user, Logout } = useAuth();
  const router = useRouter();
  const { t } = useTranslation();

  const [searchTerm, setSearchTerm] = useState("");
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  const handleLogout = () => {
    Logout();

    try {
      void router.push("/");
    } catch (error: unknown) {
      console.error("Logout redirect failed:", error);
      window.location.href = "/";
    }
  };

  const handleSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const query = searchTerm.trim();

    if (!query) {
      return;
    }

    void router.push(
      `/search?q=${encodeURIComponent(query)}`
    );
  };

  return (
    <div className="fixed inset-x-0 top-0 z-50 flex h-53px w-full items-center justify-center border-t-[3px] border-[#ef8236] bg-white shadow-[0_1px_5px_#00000033]">
      <div className="mx-auto flex w-[90%] max-w-1440px items-center justify-between py-1">
        {/* Left Section */}
        <div className="flex flex-1 items-center gap-2">
          {/* Sidebar Button */}
          <button
            type="button"
            aria-label="Toggle sidebar"
            className="rounded p-2 transition hover:bg-gray-100 sm:block"
            onClick={handleslidein}
          >
            <Menu className="h-5 w-4 text-gray-800" />
          </button>

          {/* Logo */}
          <Link href="/" className="px-3 py-1">
            <img
              src="/logo.png"
              alt="Logo"
              className="h-6 w-auto"
            />
          </Link>

          {/* Navigation Links */}
          <div className="hidden gap-1 sm:flex">
            {[
              t("navbar.about"),
              t("navbar.products"),
              t("navbar.forTeams"),
            ].map((item) => (
              <Link
                key={item}
                href="/"
                className="rounded px-4 py-2 text-sm font-medium text-[#454545] transition hover:bg-gray-200"
              >
                {item}
              </Link>
            ))}
          </div>

          {/* Search */}
          <div className="hidden flex-1 items-center px-4 lg:flex">
            <form
              onSubmit={handleSearch}
              className="relative flex-1"
            >
              <input
                type="text"
                value={searchTerm}
                onChange={(event) =>
                  setSearchTerm(event.target.value)
                }
                placeholder={t("navbar.search")}
                className="ml-0 w-90 rounded border border-gray-300 py-2 pl-10 pr-1 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
              />

              <Search className="absolute left-4 top-2.5 h-4 w-4 text-gray-600" />
            </form>
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-7 pt-2">
            {/* Notifications */}
            {hasMounted && user ? (
              <NotificationBell />
            ) : null}

            <div className="flex items-center gap-3">
              {/* Logged Out */}
              {!hasMounted ? null : !user ? (
                <div className="flex gap-2">
                  <Link
                    href="/auth"
                    className="rounded border border-blue-500 bg-[#e7f8fe] px-4 py-1.5 text-sm font-medium text-[#454545] transition hover:bg-[#d3e4eb]"
                  >
                    {t("navbar.login")}
                  </Link>

                  <Link
                    href="/signup"
                    className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
                  >
                    {t("navbar.signup")}
                  </Link>
                </div>
              ) : (
                /* Logged In */
                <>
                  {/* Profile */}
                  <button
                    type="button"
                    onClick={() =>
                      void router.push(
                        `/users/${user._id}`
                      )
                    }
                    className="cursor-pointer rounded-full transition-transform duration-200 hover:scale-105"
                  >
                    {user.profilePhoto ? (
                      <img
                        src={user.profilePhoto}
                        alt="Profile"
                        className="h-10 w-10 rounded-full object-cover"
                      />
                    ) : (
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-600 font-semibold text-white">
                        {user.name
                          ?.charAt(0)
                          .toUpperCase()}
                      </div>
                    )}
                  </button>

                  {/* Logout */}
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="w-22 rounded border border-blue-500 bg-[#e7f8fe] px-1 py-1.5 text-sm font-medium text-[#454545] transition hover:bg-[#d3e4eb]"
                  >
                    {t("navbar.logout")}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;