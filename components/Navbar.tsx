"use client";

import { getFromLocalStorage } from "@/lib/utils";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { IoClose } from "react-icons/io5";
import { RiMenu2Line } from "react-icons/ri";

const Navbar = () => {
  const router = useRouter();
  const [isOpenNav, setIsOpenNav] = useState(false);

  const linkStyle = "flex py-[1em] px-[2em]";

  useEffect(() => {
    const isAuthenticated = getFromLocalStorage("isAuthenticated");

    if (isAuthenticated) {
      router.replace("/dashboard");
    }
  }, [router]);

  return (
    <div>
      <nav className="absolute top-0 z-10 w-full">
        <ul className="list-none flex items-center justify-between w-[90%] mx-auto py-2">
          <div className="flex items-center justify-between w-full md:w-auto">
            <li className="flex">
              <Link
                href="/"
                className={`${linkStyle} pl-0 text-xl font-bold text-white text-nowrap`}
              >
                MyRental <span className="">-Hub</span>
              </Link>
            </li>
            <li
              className="md:hidden flex items-center cursor-pointer"
              onClick={() => setIsOpenNav(!isOpenNav)}
            >
              <RiMenu2Line className="text-2xl text-white" />
            </li>
          </div>
          <div
            className={`fixed md:relative top-0 right-0 z-40 bg-black/50 backdrop-blur-lg md:backdrop-blur-none md:bg-transparent h-dvh w-[min(300px,100%)] md:w-auto md:h-auto md:flex items-center gap-7 border-l-2 md:border-0 border-white/20 transition-transform duration-300 ease-in-out ${
              isOpenNav ? "translate-x-0" : "translate-x-full md:translate-x-0"
            }`}
          >
            <div
              onClick={() => setIsOpenNav(false)}
              className="cursor-pointer absolute top-7 right-7 md:hidden"
            >
              <IoClose className="text-3xl text-white" />
            </div>

            <div className="flex flex-col md:flex-row mt-20 md:mt-0 mb-10 md:mb-0">
              <li className="flex">
                <Link
                  href="/"
                  className={`${linkStyle} font-semibold text-white`}
                >
                  Home
                </Link>
              </li>
              <li className="flex">
                <Link
                  href="/#"
                  className={`${linkStyle} font-semibold text-white`}
                >
                  About
                </Link>
              </li>
              <li className="flex">
                <Link
                  href="/#"
                  className={`${linkStyle} font-semibold text-white`}
                >
                  Contact
                </Link>
              </li>
            </div>
            <div className="gap-5 md:hidden flex flex-col px-7 pt-10 border-t-2 border-white/20">
              <li className="flex w-full">
                <Link
                  href="/login"
                  className={`bg-white border-2 border-white px-[2em] py-[0.5em] rounded-full text-black w-full text-center`}
                >
                  Login
                </Link>
              </li>
              <li className="flex">
                <Link
                  href="/register"
                  className={`bg-transparent border-2 border-white px-[2em] py-[0.5em] rounded-full text-white hover:bg-white hover:text-black transition-colors duration-300 w-full text-center`}
                >
                  Register
                </Link>
              </li>
            </div>
          </div>
          <div className="gap-5 hidden md:flex">
            <li className="flex">
              <Link
                href="/login"
                className={`bg-white border-2 border-white px-[2em] py-[0.5em] rounded-full text-black`}
              >
                Login
              </Link>
            </li>
            <li className="flex">
              <Link
                href="/register"
                className={`bg-transparent border-2 border-white px-[2em] py-[0.5em] rounded-full text-white hover:bg-white hover:text-black transition-colors duration-300`}
              >
                Register
              </Link>
            </li>
          </div>
        </ul>
      </nav>
    </div>
  );
};

export default Navbar;
