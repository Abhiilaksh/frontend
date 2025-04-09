import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Squares from "./Background";
import toast from "react-hot-toast";
import axios from "axios";

export default function VerifyConfirmation() {
  const [countdown, setCountdown] = useState(10);
  const { token } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/verify/${token}`);
        console.log(response.data);
        toast.success("Email verified successfully!");
      } catch (error) {
        console.error("Verification failed:", error.response?.data || error.message);
        toast.error("Invalid or expired token.");
        navigate("/");
      }
    };

    verifyEmail();

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          navigate("/");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [navigate, token]);

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
        <div className="flex flex-col items-center justify-center">
          <h1 className="text-2xl font-semibold text-[#000814] text-center">
            Thank You for Verifying!
          </h1>
          <p className="mt-4 text-[#838894] text-center">
            Your email has been successfully verified and your account is now active.
          </p>

          <div className="mt-8 w-full bg-gray-100 rounded-lg py-3 px-4 text-center">
            <p className="text-[#000814] text-sm">
              Redirecting to login in{" "}
              <span className="font-bold">{countdown}</span> seconds
            </p>
          </div>

          <button
            onClick={() => navigate("/")}
            className="bg-[#000814] hover:bg-[#f5f3f3] hover:text-[#000814] text-[#f5f3f3] w-full rounded-lg text-sm font-semibold px-6 py-3 mt-6"
          >
            Login Now
          </button>
        </div>
      </div>
    </div>
  );
}
