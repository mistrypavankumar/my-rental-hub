"use client";

import { RootState } from "@/redux/store";
import Link from "next/link";
import React, { useState } from "react";
import { BiUser } from "react-icons/bi";
import { IoIosArrowDown } from "react-icons/io";
import { IoAddOutline, IoCheckmarkOutline } from "react-icons/io5";
import { MdLogout } from "react-icons/md";
import { useSelector } from "react-redux";

const MainNavbar = () => {
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

  const handleLogout = () => {
    console.log("Logout clicked");
  };

  return (
    <div className="w-full border-b-2 border-gray-500/20">
      <div className="w-[90%] mx-auto flex justify-between items-center py-4">
        <nav className="w-full">
          <ul className="flex items-center justify-between w-full">
            <div>
              <li>
                <Link href={"/house"} className="text-xl font-bold">
                  MyRental-Hub
                </Link>
              </li>
            </div>
            <div className="hidden md:flex items-center gap-7">
              <li>
                <Link
                  href={"/house"}
                  className="font-semibold text-gray-700 hover:text-blue-700 transition-colors duration-200"
                >
                  Dashboard
                </Link>
              </li>
              <li>
                <Link
                  href={"/members"}
                  className="font-semibold text-gray-700 hover:text-blue-700 transition-colors duration-200"
                >
                  Members
                </Link>
              </li>
              <li>
                <Link
                  href={"/rents"}
                  className="font-semibold text-gray-700 hover:text-blue-700 transition-colors duration-200"
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
                <div className="border-2 border-gray-500/20 rounded-lg p-1">
                  <BiUser className="text-gray-500" />
                </div>
                <div className="font-semibold capitalize text-gray-700">
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
                    <div className="flex items-center gap-3 cursor-pointer bg-primary/80 text-white hover:bg-primary transition-colors duration-300 px-3 py-2 rounded-md mt-2">
                      <IoAddOutline className="w-7 h-7 flex items-center justify-center p-[2px]" />
                      <Link href={`/house/new`}>New House</Link>
                    </div>
                  </div>
                  <div className="border-t border-gray-500/20 mt-2 px-3 pt-2">
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-3 w-full text-left px-3 py-2 rounded-md hover:bg-gray-100 cursor-pointer"
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
