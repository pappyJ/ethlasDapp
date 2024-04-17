"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

export default function Navigation() {
  const pathname = usePathname();

  const routes = [
    {
      label: "Dashboard",
      href: "/connected/dashboard",
    },
    {
      label: "Deposit",
      href: "/connected/deposit",
    },
    {
      label: "Withdraw",
      href: "/connected/withdraw",
    },
    {
      label: "Add Token",
      href: "/connected/add-token",
    },
    {
      label: "Pause contract",
      href: "/connected/contract-status",
    },
  ];

  return (
    <div className="flex md:flex-col flex-row gap-6 items-center overflow-x-auto max-md:border-y border-purple-500/20 py-6 my-2">
      {routes.map((route: { label: string; href: string }) => (
        <Link
          href={route.href}
          key={route.href}
          className={`md:rounded-md rounded-full  max-md:border  md:w-full w-max md:py-3 py-1 px-4 whitespace-nowrap ${
            pathname === route.href
              ? "text-purple-500 border-purple-500 bg-purple-500/20"
              : "border-gray-500 text-gray-500 hover:bg-white/10"
          }`}
        >
          {route.label}
        </Link>
      ))}
    </div>
  );
}
