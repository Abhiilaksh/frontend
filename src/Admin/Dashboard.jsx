import React from "react";
import Sidebar from "./Sidebar";
import { Outlet } from "react-router-dom";

export default function Dashboard() {
  return (
    <div className="bg-white relative flex h-[100vh] overflow-hidden">
      <Sidebar />
      <div className="flex-1 overflow-auto bg-gray-50">
        <div className="mx-auto w-11/12 max-w-[1000px] py-6">
          <Outlet />
        </div>
      </div>
    </div>
  );
}