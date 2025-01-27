"use client";
import { errorRoutes, publicRoutes } from "@/lib/routes-client";
import { usePathname } from "next/navigation";
import React from "react";
import { Navbar } from "./navbar";

export default function LayoutMain({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const shouldHideNavbar = [...publicRoutes, ...errorRoutes].includes(pathname);
  return (
    <body
      className={` antialiased ${
        shouldHideNavbar ? "h-screen bg-gray-100" : "h-auto"
      } container mx-auto py-10 pt-none`}
    >
      {!shouldHideNavbar && <Navbar />}
      {children}
    </body>
  );
}
