import Link from "next/link";
import React from "react";

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
      {children}
      <footer className="absolute bottom-0 w-full text-center text-white backdrop-blur-sm bg-black/40 py-2">
        <p>
          Made with ❤️ by{" "}
          <Link
            href="https://www.linkedin.com/in/pavan-kumar-mistry-5067b21b1/"
            className="text-white active:text-white underline"
          >
            Mistry Pavan Kumar
          </Link>
        </p>
      </footer>
    </div>
  );
};

export default AuthLayout;
