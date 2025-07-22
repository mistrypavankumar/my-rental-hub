"use client";

import {
  getObjectFromLocalStorage,
  setInLocalStorage,
  setObjectInLocalStorage,
  showErrorMessage,
} from "@/lib/utils";
import {
  getAllHousesStart,
  getAllHousesSuccess,
  setActiveHouse,
  setPrefetchHouses,
} from "@/redux/slices/houseSlice";
import { RootState } from "@/redux/store";
import { logoutUser } from "@/services/authServices";
import { getHouses } from "@/services/houseServices";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { BiMenuAltLeft, BiUser } from "react-icons/bi";
import { IoIosArrowDown } from "react-icons/io";
import { IoAddOutline, IoCheckmarkOutline, IoClose } from "react-icons/io5";
import { MdLogout } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";

const MainNavbar = () => {
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useDispatch();

  const { user, isAuthenticated } = useSelector(
    (state: RootState) => state.auth
  );
  const { houses, activeHouse, prefetchHouses } = useSelector(
    (state: RootState) => state.house
  );
  const [toggleDropdown, setToggleDropdown] = useState(false);
  const [isOpenNav, setIsOpenNav] = useState(false);

  useEffect(() => {
    const fetchHouses = async () => {
      dispatch(getAllHousesStart());

      try {
        const res = await getHouses();

        if (res?.status === 200 && Array.isArray(res.data?.houses)) {
          const houses = res.data.houses;
          dispatch(getAllHousesSuccess(houses));

          // If activeHouse already set correctly from localStorage, skip reassignment
          const stored = getObjectFromLocalStorage("activeHouse");

          const isValid = houses.some(
            (h: { _id: string }) => h._id === stored?.houseId
          );

          if (!isValid && houses.length > 0) {
            const first = {
              houseId: houses[0]._id,
              houseName: houses[0].name,
              defaultPrice: houses[0].defaultPrice || 0,
            };
            dispatch(setActiveHouse(first));
            setObjectInLocalStorage("activeHouse", first);
          }
        }
      } catch (error) {
        showErrorMessage(error as Error);
      }
    };

    if (isAuthenticated || prefetchHouses) {
      fetchHouses();
      dispatch(setPrefetchHouses(false));
    }
  }, [dispatch, isAuthenticated, prefetchHouses]);

  const handleLogout = async () => {
    try {
      const res = await logoutUser();

      if (res?.status === 200) {
        setToggleDropdown(false);
        router.replace("/login");
        toast.success("Logged out successfully");
        setInLocalStorage("isAuthenticated", false);
        setObjectInLocalStorage("activeHouse", {});
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
            <div className="flex items-center gap-3">
              <div
                onClick={() => setIsOpenNav(true)}
                className="md:hidden cursor-pointer"
              >
                <BiMenuAltLeft size={25} />
              </div>
              <li>
                <Link href={"/dashboard"} className="text-xl font-bold">
                  MyRental-Hub
                </Link>
              </li>
            </div>
            <div
              className={`fixed md:relative top-0 left-0 z-40 bg-primary h-dvh w-[min(300px,100%)] md:w-auto md:h-auto md:flex items-center gap-7 border-r-2 md:border-0 border-white/20 transition-transform duration-300 ease-in-out ${
                isOpenNav
                  ? "translate-x-0"
                  : "-translate-x-full md:-translate-0"
              }`}
            >
              <div className="flex flex-col md:flex-row md:items-center gap-5 md:gap-7 md:mt-0 mt-16 w-[85%] md:w-full mx-auto">
                <div
                  onClick={() => setIsOpenNav(false)}
                  className="cursor-pointer absolute top-7 right-7 md:hidden"
                >
                  <IoClose className="text-3xl" />
                </div>

                <li>
                  <Link
                    onClick={() => setIsOpenNav(false)}
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

                {isAuthenticated && houses.length > 0 && (
                  <>
                    <li>
                      <Link
                        onClick={() => setIsOpenNav(false)}
                        href={"/my-house"}
                        className={`${
                          pathname.toLowerCase() === "/my-house"
                            ? "font-semibold text-white"
                            : "text-white/50 hover:text-white"
                        } transition-colors duration-200`}
                      >
                        My House
                      </Link>
                    </li>

                    <li>
                      <Link
                        onClick={() => setIsOpenNav(false)}
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
                        onClick={() => setIsOpenNav(false)}
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
                  </>
                )}
              </div>
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
                  <p className="text-primary px-3 py-2 font-semibold text-sm">
                    My Houses
                  </p>
                  <div className="px-3 pt-2">
                    {houses.length > 0 ? (
                      houses.map((house) => {
                        return (
                          <div
                            key={house.name}
                            onClick={() => {
                              setObjectInLocalStorage("activeHouse", {
                                houseId: house._id,
                                houseName: house.name,
                                defaultPrice: house.defaultPrice || 0,
                              });
                              dispatch(
                                setActiveHouse({
                                  houseId: house._id,
                                  houseName: house.name,
                                  defaultPrice: house.defaultPrice || 0,
                                })
                              );

                              if (
                                pathname !== "/dashboard" &&
                                pathname !== "/members"
                              ) {
                                router.refresh();
                              }
                            }}
                            className="flex items-center justify-between cursor-pointer text-gray-700 hover:bg-gray-100 py-2 px-2 rounded-md "
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-7 h-7 rounded-md border-2 border-gray-500/50 flex items-center justify-center font-bold text-primary">
                                {house.name[0].toUpperCase()}
                              </div>
                              <span>{house.name}</span>
                            </div>
                            {activeHouse?.houseId === house._id && (
                              <IoCheckmarkOutline />
                            )}
                          </div>
                        );
                      })
                    ) : (
                      <p className="text-gray-500 text-center py-2">
                        No houses found
                      </p>
                    )}
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
