import Navbar from "@/components/Navbar";
import RightSideBar from "@/components/RightSideBar";
import Sidebar from "@/components/Sidebar";
import React, { ReactNode, useState } from "react";
import SupportButton from "@/components/support/SupportButton";
import SupportModal from "@/components/support/SupportModal";
import { useRouter } from "next/router";
import { useAuth } from "@/lib/AuthContext";

interface MainlayoutProps {
  children: ReactNode;
}
const Mainlayout = ({ children }: MainlayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [supportOpen, setSupportOpen] = useState(false);
  const router = useRouter();
  const { user } = useAuth();

  const handleslidein = () => {
      setSidebarOpen((state) => !state);
  };

  const handleSupportClick = () => {
  if (user?.role === "admin") {
    router.push("/admin/support");
  } else {
    setSupportOpen(true);
  }
};

  return (
    <div className="bg-[#f8f9fa] text-[#3a3a3a] min-h-screen flex flex-col">
      <Navbar handleslidein={handleslidein} />
      <div className="flex flex-1 w-full pt-13.25 py-1">
        <Sidebar isopen={sidebarOpen} />
        <main className="flex-1 min-w-0 w-full p-4 lg:p-6 bg-white">{children}</main>
        <div className="hidden lg:block border-r border-gray-200">
          <RightSideBar />
        </div>
      </div>
      <SupportButton onClick={handleSupportClick} />

<SupportModal
  open={supportOpen}
  onOpenChange={setSupportOpen}
/>
    </div>
  );
};

export default Mainlayout;