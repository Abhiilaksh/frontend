import React from "react";
import Sidebarlink from "./Sidebarlink";
import { Link } from "react-router-dom";

export default function Sidebar() {
  const sidebarLinks = [
    {
      id: 1,
      name: "Dashboard",
      path: "/dashboard/admin",
      icon: "VscDashboard",
    },
    {
      id: 2,
      name: "Users",
      path: "/dashboard/admin/users",
      icon: "VscAccount",
    },
    {
      id: 3,
      name: "Reports",
      path: "/dashboard/admin/reports",
      icon: "VscReport",
    },
    {
      id: 4,
      name: "Banned Users",
      path: "/dashboard/admin/banned",
      icon: "VscCircleSlash",
    },
  ];

  return (
    <div className="min-w-[220px] bg-black h-screen flex flex-col shadow-lg">
      <div className="py-6 px-4 border-b border-gray-800">
        <Link
          to="/dashboard/admin"
          className="flex items-center gap-2 justify-center"
        >
          <img src="/LOGO_White.png" alt="Logo" className="w-36" />
        </Link>
      </div>
      <div className="flex-1 py-6">
        <h2 className="text-gray-500 text-xs font-semibold uppercase tracking-wider px-6 mb-4">
          Admin Panel
        </h2>
        <nav className="mt-2 flex flex-col gap-1">
          {sidebarLinks.map((link) => (
            <Sidebarlink key={link.id} link={link} iconName={link.icon} />
          ))}
        </nav>
      </div>
    </div>
  );
}
