import React, { useEffect, useState } from "react";
import { FaRegMoon } from "react-icons/fa6";
import { FaRegCircleUser } from "react-icons/fa6";
import { RiMenu2Line } from "react-icons/ri";
import { IoMdClose } from "react-icons/io";
import { IoIosLogOut } from "react-icons/io";
import { MdOutlineLightMode } from "react-icons/md";
import { NavLink, useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabase";
import {
  Handshake,
  LayoutDashboard,
  LogOut,
  ShieldUser,
  Users,
  ChevronDown,
} from "lucide-react";

function Layout({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);
  const [isMembersSubMenuOpen, setIsMembersSubMenuOpen] = useState(false);

  const [theme, setTheme] = useState("");
  useEffect(() => {
    //for persistence
    const storedTheme = localStorage.getItem("theme") || "";
    setTheme(storedTheme);

    if (storedTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  const toggleTheme = () => {
    // for switching
    const newTheme = theme === "dark" ? "" : "dark";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);

    if (newTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  const getNavLinkClass = ({ isActive }: { isActive: any }) =>
    isActive
      ? "cursor-pointer font-bold text-blue-600 dark:text-blue-400 bg-gray-100 dark:bg-gray-800 px-2 py-2 rounded flex items-center gap-2 group "
      : "cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 px-2 py-2 rounded flex items-center gap-2 group";

  //special scenario, active class was seeing both routes as active
  const getExactNavLinkClass = (path: string) => {
    const isActive = location.pathname === path;
    return isActive
      ? "cursor-pointer font-bold text-blue-600 dark:text-blue-400 bg-gray-100 dark:bg-gray-800 px-2 py-2 rounded flex items-center gap-2 group "
      : "cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 px-2 py-2 rounded flex items-center gap-2 group";
  };
  const handleToggleSidebar = () => {
    setShowMobileSidebar(!showMobileSidebar);
  };

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Error signing out:", error.message);
    } else {
      navigate("/login");
      console.log("Successfully signed out");
    }
  };

  return (
    <section className={`layout ${theme} relative h-full`}>
      {/* Desktop Navigation */}
      <nav
        className={`h-14 border border-gray-300 dark:border-gray-600  fixed inset-y-0 start-0 w-full max-w-[2000px] mx-auto z-[500] py-4 px-6 bg-white text-[#44444B]  dark:bg-[#242529] dark:text-white ${
          showMobileSidebar ? "hidden" : "flex justify-between"
        }`}
      >
        {/* Nav content */}
        <div className=" w-[220px] ">
          <div className="gap-2 items-center hidden lg:flex">
            <img src="/images/logo.png" className="w-6 h-6" alt="logo" />
            <p className="font-bold">CHEMIST MAP</p>
          </div>
          <RiMenu2Line
            onClick={handleToggleSidebar}
            className="block lg:hidden cursor-pointer"
            size={24}
          />
        </div>

        <div className="flex items-center gap-6">
          {/* <div className="border border-gray-300 dark:border-gray-600 p-1.5 rounded-md cursor-pointer">
            <CiSearch size={24} />
          </div> */}
          <div className="border border-gray-300 dark:border-gray-600 p-1.5 rounded-md cursor-pointer">
            {theme === "dark" ? (
              <MdOutlineLightMode onClick={toggleTheme} size={24} />
            ) : (
              <FaRegMoon onClick={toggleTheme} size={24} />
            )}
          </div>
          <div className="border border-gray-300 dark:border-gray-600 p-1.5 rounded-md cursor-pointer">
            <FaRegCircleUser size={24} />
          </div>
        </div>
      </nav>

      {/* Desktop Sidebar */}
      <aside className="border border-gray-300 dark:border-gray-600 px-6 py-4 hidden lg:flex flex-col fixed inset-y-0 start-0 h-dvh w-[220px] bg-white text-[#44444B] dark:bg-[#242529] dark:text-white mt-14">
        <div className="flex flex-col gap-6 p-2">
          <NavLink to="/overview" className={getNavLinkClass} end>
            <LayoutDashboard className="group-hover:animate-spin" size={15} />
            Overview
          </NavLink>

          <div
            className={`${
              isMembersSubMenuOpen ? "bg-gray-100 dark:bg-gray-800" : ""
            } cursor-pointer px-2 py-2 rounded flex flex-col  gap-2 group`}
          >
            <div
              onClick={() => setIsMembersSubMenuOpen(!isMembersSubMenuOpen)}
              className="flex items-center gap-2  "
            >
              <Users
                className="group-hover:motion-safe:animate-bounce"
                size={15}
              />
              <p> Members</p>

              <ChevronDown
                className={`ml-auto self-center transition-transform ${
                  isMembersSubMenuOpen ? "rotate-180" : ""
                }`}
                size={17}
              />
            </div>

            {isMembersSubMenuOpen && (
              <div className="text-sm flex flex-col gap-6 mt-3">
                <NavLink
                  className={getExactNavLinkClass("/members")}
                  to="/members"
                >
                  All Members
                </NavLink>
                <NavLink
                  className={`${getExactNavLinkClass(
                    "/members/follow-up"
                  )} whitespace-nowrap`}
                  to="/members/follow-up"
                >
                  Follow-Up Members
                </NavLink>
              </div>
            )}
          </div>

          <NavLink to="/admins" className={getNavLinkClass} end>
            <ShieldUser
              className="group-hover:motion-safe:animate-bounce"
              size={15}
            />
            Admins{" "}
          </NavLink>
          <NavLink to="/comms" className={getNavLinkClass} end>
            <Handshake className="group-hover:animate-bounce" size={15} />
            Communications{" "}
          </NavLink>
          <ul
            className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 px-2 py-2 rounded flex items-center gap-2 group"
            onClick={handleLogout}
          >
            <LogOut size={15} className="group-hover:animate-bounce" />
            Logout{" "}
          </ul>
        </div>
      </aside>

      {/* Mobile Sidebar */}
      <section
        className={`mobile-view fixed  left-0 top-0  transition-transform duration-500 h-dvh w-full p-6  bg-white text-#44444B z-[1000]  dark:text-white dark:bg-[#242529] ${
          showMobileSidebar ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Mobile sidebar content */}
        <nav className="flex justify-between items-center pt-3 pb-8 text-xl">
          <IoMdClose
            onClick={handleToggleSidebar}
            size={24}
            className="cursor-pointer"
          />
          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={handleLogout}
          >
            <IoIosLogOut size={24} />
            <p>Logout</p>
          </div>
        </nav>

        <div className="flex flex-col gap-2 items-center justify-center mb-16">
          <img src="/images/logo.png" className="w-32 h-32" alt="logo" />
          <p className="font-bold text-4xl">Follow-Up</p>
        </div>

        <ul className="flex flex-col gap-3 text-xl">
          <NavLink className={getNavLinkClass} to="/overview" end>
            <LayoutDashboard className="group-hover:animate-spin" size={15} />
            Overview
          </NavLink>
          <NavLink className={getNavLinkClass} to="/members/follow-up" end>
            <Users
              className="group-hover:motion-safe:animate-bounce"
              size={15}
            />
            Members
          </NavLink>
          <NavLink className={getNavLinkClass} to="/admins" end>
            <ShieldUser
              className="group-hover:motion-safe:animate-bounce"
              size={15}
            />
            Admins
          </NavLink>
          <NavLink className={getNavLinkClass} to="/comms" end>
            <Handshake className="group-hover:animate-bounce" size={15} />
            Communications
          </NavLink>
        </ul>
      </section>

      {/* Main Content */}
      <main
        className="main ml-0 lg:ml-[220px] mt-14 p-2 md:p-4 min-h-dvh  bg-white text-[#44444B] dark:bg-[#242529]
       dark:text-white  "
      >
        {children}
      </main>
    </section>
  );
}

export default Layout;
