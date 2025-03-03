import React, { useState } from "react";
import { CgProfile } from "react-icons/cg";
import { FiLogIn, FiUserPlus } from "react-icons/fi";
import GradientText from "../common/GradientButton";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

export default function Navbar() {
  const navigate = useNavigate();

  const { user } = useSelector((state) => state.profile);
  const { token } = useSelector((state) => state.auth);

  return (
    <nav className="bg-transparent bg-opacity-50 backdrop-blur-md fixed top-0 left-0 w-full px-6 py-4 flex items-center justify-between z-50">
      <div className="flex items-center">
        <img src="/LOGO_White.png" alt="" className="h-12 ml-10 " />
      </div>
      <div className="flex items-center gap-4">
        {user && (
          <div className="flex items-center gap-4">
            <CgProfile className="w-8 h-8 text-[#d9d9d9]" />
            <button className="px-4 py-2 text-[#d9d9d9] bg-[rgba(26,26,26,0.5)] hover:text-[#d9d9d9] hover:bg-[#6953d6c4] rounded-md font-medium flex items-center gap-2 border border-[#d9d9d9a6]">
              <FiLogIn />
              Log out
            </button>
          </div>
        )}
        {token == null && (
          <div className="flex items-center gap-4">
            <button>
              <GradientText
                colors={["#40ffaa", "#4079ff", "#40ffaa", "#4079ff", "#40ffaa"]}
                animationSpeed={3}
                showBorder={false}
                className="px-4 py-2 font-medium flex items-center gap-2"
              >
                Log in
              </GradientText>
            </button>
            <button>
              <GradientText
                colors={["#40ffaa", "#4079ff", "#40ffaa", "#4079ff", "#40ffaa"]}
                animationSpeed={3}
                showBorder={true}
                className="px-4 py-2 border border-[#d9d9d9a6] rounded-md font-medium flex items-center gap-2"
              >
                Sign up
              </GradientText>
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}
