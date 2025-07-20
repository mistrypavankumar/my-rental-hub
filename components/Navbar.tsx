"use client";

import { getFromLocalStorage } from "@/lib/utils";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { RiMenu2Line } from "react-icons/ri";

const Navbar = () => {
  const router = useRouter();

  const linkStyle = "flex py-[1em] px-[2em]";

  useEffect(() => {
    if (getFromLocalStorage("isAuthenticated")) {
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
            <li className="md:hidden flex items-center cursor-pointer">
              <RiMenu2Line className="text-2xl" />
            </li>
          </div>
          <div className="items-center hidden md:flex">
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
