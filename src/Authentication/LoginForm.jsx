import React, { useState } from "react";
import { FaEnvelope, FaEye, FaEyeSlash, FaLock } from "react-icons/fa";
import { Link } from "react-router-dom";

export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  return (
    <>
      <form className="space-y-4">
        <div className="relative">
          <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
          <input
            type="email"
            placeholder="aichess@example.com"
            className="input-style pl-10"
          />
        </div>
        <div className="relative">
          <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
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

        <div className="w-full flex justify-end text-[#585D69] text-sm">
          <Link to="/forgot-password">Forgot Password?</Link>
        </div>
        <button
          type="submit"
          className="bg-[#000814] hover:bg-[#f5f3f3] hover:text-[#000814] text-[#f5f3f3] w-full rounded-lg text-sm font-semibold px-6 py-3 mt-3"
        >
          Log in
        </button>
      </form>
    </>
  );
}
