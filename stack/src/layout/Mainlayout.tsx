import Navbar from "@/components/Navbar";
import RightSideBar from "@/components/RightSideBar";
import Sidebar from "@/components/Sidebar";
import SupportButton from "@/components/support/SupportButton";
import SupportModal from "@/components/support/SupportModal";

import {
  useEffect,
  useState,
  type ReactNode,
} from "react";

import { useRouter } from "next/router";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/lib/AuthContext";

interface MainlayoutProps {
  children: ReactNode;
}

const Mainlayout = ({
  children,
}: MainlayoutProps) => {
  const [sidebarOpen, setSidebarOpen] =
    useState(false);

  const [supportOpen, setSupportOpen] =
    useState(false);

  const router = useRouter();

  const { user } = useAuth();

  const { t } = useTranslation("support");

  // Set sidebar state after hydration
  useEffect(() => {
    setSidebarOpen(
      window.innerWidth >= 768
    );
  }, []);

  // Toggle sidebar from Navbar
  const handleSlideIn = () => {
    setSidebarOpen(
      (previousState) => !previousState
    );
  };

  // Close sidebar
  const handleSidebarClose = () => {
    setSidebarOpen(false);
  };

  // Open support modal
  const handleSupportClick = () => {
    if (!user) {
      toast.info(
        t(
          "messages.please_login_to_continue"
        )
      );

      void router.push("/auth");

      return;
    }

    setSupportOpen(true);
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#f8f9fa] text-[#3a3a3a]">
      <Navbar
        handleslidein={handleSlideIn}
        sidebarOpen={sidebarOpen}
      />

      <div className="flex w-full flex-1 pt-[72px]">
        <Sidebar
          isopen={sidebarOpen}
          onClose={handleSidebarClose}
        />

        {/* Sidebar space on desktop */}
        {sidebarOpen && (
          <div className="hidden shrink-0 md:block md:w-48 lg:w-64" />
        )}

        <main className="min-w-0 flex-1 bg-white">
          <div className="mx-auto w-full max-w-5xl px-4 py-4">
            {children}
          </div>
        </main>

        <div className="hidden shrink-0 border-l border-gray-200 lg:block">
          <RightSideBar />
        </div>
      </div>

      <SupportButton
        onClick={handleSupportClick}
      />

      <SupportModal
        open={supportOpen}
        onOpenChange={setSupportOpen}
      />
    </div>
  );
};

export default Mainlayout;