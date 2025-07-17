"use client";

import { showErrorMessage } from "@/lib/utils";
import { RootState } from "@/redux/store";
import { logoutUser } from "@/services/authServices";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { BiUser } from "react-icons/bi";
import { IoIosArrowDown } from "react-icons/io";
import { IoAddOutline, IoCheckmarkOutline } from "react-icons/io5";
import { MdLogout } from "react-icons/md";
import { useSelector } from "react-redux";

const MainNavbar = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { user } = useSelector((state: RootState) => state.auth);
  const [toggleDropdown, setToggleDropdown] = useState(false);
  const [activeHouse, setActiveHouse] = useState<string>("1");

  const houses = [
    {
      name: "Jumanji",
      id: "1",
    },
    {
      name: "Wonderland",
      id: "2",
    },
    {
      name: "Narnia",
      id: "3",
    },
  ];

  const handleLogout = async () => {
    try {
      const res = await logoutUser();

      if (res?.status === 200) {
        setToggleDropdown(false);
        router.replace("/login");
        toast.success("Logged out successfully");
      }
    } catch (err) {
      console.error("Logout failed:", err);
      showErrorMessage(err as Error);
    }
  };

  return (
    <div className="w-full border-b-2 border-gray-500/20 bg-primary text-white">
      <div className="w-[90%] mx-auto flex justify-between items-center py-4">
        <nav className="w-full">
          <ul className="flex items-center justify-between w-full">
            <div>
              <li>
                <Link href={"/dashboard"} className="text-xl font-bold">
                  MyRental-Hub
                </Link>
              </li>
            </div>
            <div className="hidden md:flex items-center gap-7">
              <li>
                <Link
                  href={"/dashboard"}
                  className={`${
                    pathname.toLowerCase() === "/dashboard"
                      ? "font-semibold text-white"
                      : "text-white/50 hover:text-white"
                  } transition-colors duration-200`}
                >
                  Dashboard
                </Link>
              </li>
              <li>
                <Link
                  href={"/members"}
                  className={`${
                    pathname.toLowerCase() === "/members"
                      ? "font-semibold text-white"
                      : "text-white/50 hover:text-white"
                  } transition-colors duration-200`}
                >
                  Members
                </Link>
              </li>
              <li>
                <Link
                  href={"/rents"}
                  className={`${
                    pathname.toLowerCase() === "/rents"
                      ? "font-semibold text-white"
                      : "text-white/50 hover:text-white"
                  } transition-colors duration-200`}
                >
                  Rents
                </Link>
              </li>
            </div>
            <li>
              <div
                onClick={() => setToggleDropdown(!toggleDropdown)}
                className="flex items-center gap-2 cursor-pointer py-1 relative"
              >
                <div className="border-2 border-white/20 rounded-lg p-1">
                  <BiUser className="text-white/50" />
                </div>
                <div className="font-semibold capitalize text-white/90">
                  {user?.name && user?.name.length > 10
                    ? user?.name.slice(0, 10) + "..."
                    : user?.name || "Guest"}
                </div>
                <IoIosArrowDown
                  className={`${
                    toggleDropdown ? "rotate-180" : ""
                  } transition-transform duration-200`}
                />
              </div>
            </li>
          </ul>

          {toggleDropdown && (
            <div
              onMouseEnter={() => setToggleDropdown(true)}
              onMouseLeave={() => setToggleDropdown(false)}
              className="absolute right-5 mt-2 w-[250px] bg-white rounded-md shadow-lg z-10 border border-gray-500/20"
            >
              <div className="cursor-pointer py-3">
                <div className="flex items-center gap-3 px-3 pb-2">
                  <div className="bg-primary rounded-lg p-1 w-10 h-10 flex items-center justify-center">
                    <BiUser className="text-white" />
                  </div>
                  <div className="font-semibold text-primary">
                    <h1 className="capitalize font-bold">
                      {user?.name || "Guest"}
                    </h1>
                    <p className="text-sm lowercase">
                      {user?.email || "No email provided"}
                    </p>
                  </div>
                </div>
                <div className="border-t border-gray-500/20">
                  <div className="px-3 pt-2">
                    {houses.map((house) => {
                      return (
                        <div
                          key={house.name}
                          onClick={() => setActiveHouse(house.id)}
                          className="flex items-center justify-between cursor-pointer text-gray-700 hover:bg-gray-100 py-2 px-2 rounded-md "
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-7 h-7 rounded-md border-2 border-gray-500/50 flex items-center justify-center font-bold text-primary">
                              {house.name[0].toUpperCase()}
                            </div>
                            <Link href={`/house/${house.id}`}>
                              {house.name}
                            </Link>
                          </div>
                          {activeHouse === house.id && <IoCheckmarkOutline />}
                        </div>
                      );
                    })}
                    <div
                      onClick={() => {
                        router.push("/house/new");
                        setToggleDropdown(false);
                      }}
                      className="flex items-center gap-3 cursor-pointer bg-primary/80 text-white hover:bg-primary transition-colors duration-300 px-3 py-2 rounded-md mt-2"
                    >
                      <IoAddOutline className="w-7 h-7 flex items-center justify-center p-[2px]" />
                      <span>New House</span>
                    </div>
                  </div>
                  <div className="border-t border-gray-500/20 mt-2 px-3 pt-2">
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-3 w-full text-left px-3 py-2 rounded-md text-red-500 hover:bg-gray-100 cursor-pointer"
                    >
                      <MdLogout />
                      Logout
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </nav>
      </div>
    </div>
  );
};

export default MainNavbar;
