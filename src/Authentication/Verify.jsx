import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Squares from './Background';
import { FaEnvelope } from 'react-icons/fa';
import toast from 'react-hot-toast';
import { authAPI } from '../services/api';
import axios from 'axios';

export default function Verify() {
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const navigate = useNavigate();
  
//   local storage
  const token = localStorage.getItem('token');

//   function for verify button click
const handleVerifyClick = async () => {
  setIsLoading(true);
  try {
    const token = localStorage.getItem("token");
    console.log(`token is this : ${token}`);
    
    const response = await axios.post(
      "http://localhost:8080/api/verifyToken",
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log(response.data);
    toast.success("Verification email sent. Please check your inbox.");
    setEmailSent(true); // show the "Check your email" screen
  } catch (err) {
    console.error("Verification error:", err.response?.data || err.message);
    toast.error("Failed to send verification email. Try again later.");
  } finally {
    setIsLoading(false);
  }
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
        {!emailSent ? (
          <>
            <h1 className="text-2xl font-semibold text-[#000814] text-center mb-1">
              Verify Your Email
            </h1>
            <p className="my-4 text-sm leading-[1.625rem] text-[#838894] text-center">
              Please verify your email address to complete your account setup and gain full access to all features.
            </p>
            <div className="mt-6">
              <button
                onClick={handleVerifyClick}
                disabled={isLoading}
                className="bg-[#000814] hover:bg-[#f5f3f3] hover:text-[#000814] text-[#f5f3f3] w-full rounded-lg text-sm font-semibold px-6 py-3 mt-2 flex items-center justify-center transition-all duration-200"
              >
                {isLoading ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Sending...
                  </>
                ) : (
                  "Verify My Email"
                )}
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="text-center mb-6">
              <h1 className="text-2xl font-semibold text-[#000814]">
                Check Your Email
              </h1>
            </div>
            <p className="my-4 text-sm leading-[1.625rem] text-[#838894] text-center">
              We've sent a verification link to <span className="font-semibold">your email</span>. Please check your inbox and click the link to verify your account.
            </p>
            <div className="flex flex-col space-y-3 mt-6">
              <button
                onClick={() => navigate('/')}
                className="bg-[#000814] hover:bg-[#f5f3f3] hover:text-[#000814] text-[#f5f3f3] w-full rounded-lg text-sm font-semibold px-6 py-3 mt-3"
              >
                Back to Login
              </button>
              <button
                onClick={handleVerifyClick}
                disabled={isLoading}
                className="bg-[#f5f3f3] text-[#000814] hover:bg-[#000814] hover:text-[#f5f3f3] w-full rounded-lg text-sm font-semibold px-6 py-3 mt-3"
              >
                {isLoading ? "Sending..." : "Resend Email"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
