import React, { use, useEffect, useState } from "react";
import { FaRegMoon } from "react-icons/fa6";
import { CiSearch } from "react-icons/ci";
import { FaRegCircleUser } from "react-icons/fa6";
import { RiMenu2Line } from "react-icons/ri";
import { IoMdClose } from "react-icons/io";
import { IoIosLogOut } from "react-icons/io";
import { MdOutlineLightMode } from "react-icons/md";
import { NavLink } from "react-router-dom";

function Layout({ children }: { children: React.ReactNode }) {
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);
  const [theme, setTheme] = useState("");

  useEffect(() => {
    // Apply dark class to the HTML element
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

  const getNavLinkClass = ({ isActive }: { isActive: any }) =>
    isActive
      ? "cursor-pointer font-bold text-blue-600 dark:text-blue-400 bg-gray-100 dark:bg-gray-800 px-2 py-2 rounded"
      : "cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 px-2 py-2 rounded";

  const handleToggleSidebar = () => {
    setShowMobileSidebar(!showMobileSidebar);
  };

  const handleLogout = () => {
    // Logout functionality here
  };

  return (
    <section className={`layout ${theme} relative`}>
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
            <p className="font-bold">Follow-Up</p>
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
              <MdOutlineLightMode onClick={() => setTheme("")} size={24} />
            ) : (
              <FaRegMoon onClick={() => setTheme("dark")} size={24} />
            )}
          </div>
          <div className="border border-gray-300 dark:border-gray-600 p-1.5 rounded-md cursor-pointer">
            <FaRegCircleUser size={24} />
          </div>
        </div>
      </nav>

      {/* Desktop Sidebar */}
      <aside className="border border-gray-300 dark:border-gray-600 px-6 py-4 hidden lg:flex flex-col fixed inset-y-0 start-0 h-dvh w-[220px] bg-white dark:bg-[#242529] dark:text-white mt-14">
        <div className="flex flex-col gap-6 p-2">
          <NavLink to="/overview" className={getNavLinkClass} end>
            Overview
          </NavLink>

          <NavLink to="/members" className={getNavLinkClass} end>
            Members{" "}
          </NavLink>
          <NavLink to="/admins" className={getNavLinkClass} end>
            Admins{" "}
          </NavLink>
          <NavLink to="/comms" className={getNavLinkClass} end>
            Communications{" "}
          </NavLink>
          <NavLink to="/login" className={getNavLinkClass} end>
            Logout{" "}
          </NavLink>
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
            Overview
          </NavLink>
          <NavLink className={getNavLinkClass} to="/members" end>
            Members
          </NavLink>
          <NavLink className={getNavLinkClass} to="/admins" end>
            Admins
          </NavLink>
          <NavLink className={getNavLinkClass} to="/comms" end>
            Communications
          </NavLink>
        </ul>
      </section>

      {/* Main Content */}
      <main
        className="main ml-0 lg:ml-[220px] mt-14 p-4 h-full  bg-white text-[#44444B] dark:bg-[#242529]
       dark:text-white  "
      >
        {children}
      </main>
    </section>
  );
}

export default Layout;
