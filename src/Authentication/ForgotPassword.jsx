import React, { useState } from "react";
import Squares from "./Background";
import { FaEnvelope } from "react-icons/fa";
import { BiArrowBack } from "react-icons/bi";
import { Link } from "react-router-dom";

export default function ForgotPassword() {
  const [emailSent, setEmailSent] = useState(false);
  const [email, setEmail] = useState("");

  const handleonSubmit = (e) => {
    e.preventDefault();
    setEmailSent(true);
  };  

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
          {emailSent ? "Check Your Email" : "Reset Password"}
        </h1>
        <p className="my-4 text-sm leading-[1.625rem] text-[#838894]">
          {emailSent
            ? `We have sent you an email ${email} with instructions to reset your password.`
            : "Enter your email address and we will send you a link to reset your password."}
        </p>
        <form onSubmit={handleonSubmit}>
          {!emailSent && (
            <div className="relative">
              <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
              <input
                type="email"
                placeholder="Enter your email address"
                className="input-style pl-10"
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          )}
          <button
            type="submit"
            className="bg-[#000814] hover:bg-[#f5f3f3] hover:text-[#000814] text-[#f5f3f3] w-full rounded-lg text-sm font-semibold px-6 py-3 mt-3"
          >
            {emailSent ? "Resend Email" : "Reset Password"}
          </button>
        </form>

        <div className="mt-6 flex items-center justify-between">
          <Link to="/login">
            <p className="flex items-center gap-x-2 text-[#000814]">
              <BiArrowBack />
              Back to login
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
}
