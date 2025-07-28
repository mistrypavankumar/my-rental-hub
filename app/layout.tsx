import type { Metadata } from "next";
import { Toaster } from "react-hot-toast";

import Providers from "@/redux/Providers";
import LoadUser from "@/components/LoadUser";

import "./globals.css";

export const metadata: Metadata = {
  title: "MyRental-Hub",
  description: "Your one-stop solution for managing rental properties",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased ">
        <Toaster position="top-center" />
        <Providers>
          <LoadUser>{children}</LoadUser>
        </Providers>
      </body>
    </html>
  );
}
