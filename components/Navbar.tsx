import Link from "next/link";
import React from "react";

const Navbar = () => {
  return (
    <div>
      <div>
        <Link href={"/"} className="text-xl">
          MyRental <span className="text-primary">Hub</span>
        </Link>
      </div>
    </div>
  );
};

export default Navbar;
