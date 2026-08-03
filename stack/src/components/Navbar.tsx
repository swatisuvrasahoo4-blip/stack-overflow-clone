import { useAuth } from "@/lib/AuthContext";
import { Menu, Search } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import NotificationBell from "./notifications/NotificationBell";

const Navbar = ({ handleslidein }: any) => {
  const { user, Logout } = useAuth();
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [hasMounted, setHasMounted] = useState(false);
  useEffect(() => {
    setHasMounted(true);
  }, []);
  

  const handlelogout = () => {
    Logout();
    try {
      router.push("/");
    } catch (e) {
      window.location.href = "/";
    }
  };
  return (
    <div className="fixed inset-x-0 top-0 z-50 h-53px w-full bg-white border-t-[3px] border-[#ef8236] shadow-[0_1px_5px_#00000033] flex items-center justify-center">
      <div className="mx-auto flex w-[90%] max-w-1440px items-center justify-between py-1">
       
          <div className="flex items-center gap-2 flex-1">
             <button
          aria-label="Toggle sidebar"
          className="sm:block p-2 rounded hover:bg-gray-100 transition"
          onClick={handleslidein}
        >
          <Menu className="w-4 h-5 text-gray-800" />
        </button>
          <Link href="/" className="px-3 py-1">
            <img src="/logo.png" alt="Logo" className="h-6 w-auto" />
          </Link>

          <div className="hidden sm:flex gap-1">
            {["About", "Products", "For Teams"].map((item) => (
              <Link
                key={item}
                href="/"
                className="text-sm text-[#454545] font-medium px-4 py-2 rounded hover:bg-gray-200 transition"
              >
                {item}
              </Link>
            ))}
          </div>
          <div className="hidden flex-1 items-center px-4 lg:flex">
  <form
    onSubmit={(e) => {
      e.preventDefault();

      const query = searchTerm.trim();

      if (!query) return;

      router.push(`/search?q=${encodeURIComponent(query)}`);
    }}
    className="relative flex-1"
  >
    <input
      type="text"
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      placeholder="Search..."
      className="w-90 rounded border border-gray-300 py-2 pl-10 pr-1 ml-0 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
    />

    <Search className="absolute left-4 top-2.5 h-4 w-4 text-gray-600" />
  </form>
</div>

<div className="flex items-center gap-7 pt-2 ">
  {hasMounted && user ? <NotificationBell /> : null}

   <div className="flex items-center gap-5">
          {!hasMounted ? null : !user ? (
            <div className="flex gap-2">
              <Link
                href="/auth"
                className="text-sm font-medium text-[#454545] bg-[#e7f8fe] hover:bg-[#d3e4eb] border border-blue-500 px-4 py-1.5 rounded transition"
              >
                Log in
              </Link>
            </div>
          ) : (
            <>
              <Link
                href={`/users/${user._id || user.id}`}
                className="flex items-center justify-center bg-orange-600 text-white text-sm font-semibold w-9 h-9 rounded-full"
              >
                {user.name?.charAt(0).toUpperCase()}
              </Link>

              <button
                onClick={handlelogout}
                className="text-sm font-medium text-[#454545] bg-[#e7f8fe] hover:bg-[#d3e4eb] border border-blue-500 px-4 w-22 py-1.5 rounded transition"
              >
                Log out
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