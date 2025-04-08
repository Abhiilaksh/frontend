import React from "react";
import { matchPath, NavLink, useLocation } from "react-router-dom";
import * as Icons from "react-icons/vsc";

export default function Sidebarlink({ link, iconName }) {
  const Icon = Icons[iconName];
  const location = useLocation();
  const matchRoute = (route) => {
    return matchPath({ path: route }, location.pathname);
  };
  
  return (
    <NavLink
      to={link.path}
      key={link.id}
      className={`relative flex items-center px-6 py-3 rounded-md mx-2 text-sm font-medium transition-all duration-300 hover:bg-gray-900 ${
        matchRoute(link.path)
          ? "bg-[#111111] text-white"
          : "text-gray-400 hover:text-white"
      }`}
    >
      <span
        className={`absolute left-0 top-0 bottom-0 w-1 rounded-full bg-white ${
          matchRoute(link.path) ? "opacity-100" : "opacity-0"
        } transition-opacity duration-300`}
      ></span>
      <div className="flex items-center gap-x-3">
        <div className={`text-xl ${matchRoute(link.path) ? "text-white" : "text-gray-500"}`}>
          <Icon />
        </div>
        <span>{link.name}</span>
      </div>
    </NavLink>
  );
}
