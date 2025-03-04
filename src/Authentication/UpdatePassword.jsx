import React, { useState } from "react";
import Squares from "./Background";
import { FaEye, FaEyeSlash, FaLock } from "react-icons/fa";

export default function UpdatePassword() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  return (
    <div className="relative min-h-screen flex items-center justify-center bg-black text-white overflow-hidden">
      <div className="absolute inset-0 w-full h-full">
        <Squares
          speed={0.5}
          squareSize={40}
          direction="diagonal"
          borderColor="#fff"
          hoverFillColor="#222"
        />
      </div>
      <div className="relative z-10 w-full max-w-md p-8 bg-[#fff] rounded-lg shadow-xl border border-gray-700/50">
        <h1 className="text-2xl font-semibold text-[#000814] justify-center flex">
          Choose new Password
        </h1>
        <p className="my-4 text-sm leading-[1.625rem] text-[#838894]">
          Almost done. Enter your new password and youre all set.
        </p>
        <form className="space-y-6">
          <div className="relative">
            <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="New Password"
              className="input-style pl-10"
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
              onClick={() => setShowPassword(!showPassword)}
            >
              {!showPassword ? <FaEye /> : <FaEyeSlash />}
            </button>
          </div>
          <div className="relative">
            <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
            <input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm New Password"
              className="input-style pl-10"
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {!showConfirmPassword ? <FaEye /> : <FaEyeSlash />}
            </button>
          </div>
          <button
            type="submit"
            className="bg-[#000814] hover:bg-[#f5f3f3] hover:text-[#000814] text-[#f5f3f3] w-full rounded-lg text-sm font-semibold px-6 py-3 mt-3"
          >
            Reset Password
          </button>
        </form>
      </div>
    </div>
  );
}
