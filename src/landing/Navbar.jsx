import React, { useState } from "react";
import { CgProfile } from "react-icons/cg";
import { FiLogIn, FiUserPlus } from "react-icons/fi";
import GradientText from "../utils/GradientButton";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import UserContext from "../Context/UserContext";


export default function Navbar() {
  const navigate = useNavigate();
  const { user, setUser } = useContext(UserContext);
  console.log("user", user);

  function logout() {
    localStorage.removeItem("token");
    setUser("");
    navigate("/home");
  }

  return (
    <nav className="bg-transparent fixed top-0 left-0 w-full px-6 py-4 flex items-center justify-between z-50">
      <div className="flex items-center">
        <img src="/LOGO_White.png" alt="" className="h-12 ml-10 " />
      </div>
      <div className="flex items-center gap-4">
        {user && (
          <div className="flex items-center gap-4"
            onClick={logout}
          >

            <GradientText
              colors={["#40ffaa", "#4079ff", "#40ffaa", "#4079ff", "#40ffaa"]}
              animationSpeed={3}
              showBorder={true}
              className="px-4 py-2 border border-[#d9d9d9a6] rounded-md font-medium flex items-center gap-2"
            >

              Log out
            </GradientText>
          </div>
        )}
        {!user && (
          <div className="flex items-center gap-4">
            <GradientText
              colors={["#40ffaa", "#4079ff", "#40ffaa", "#4079ff", "#40ffaa"]}
              animationSpeed={3}
              showBorder={false}
              className="px-4 py-2 font-medium flex items-center gap-2"
              onclick={() => navigate("/login")}
            >
              Log in
            </GradientText>
            <GradientText
              colors={["#40ffaa", "#4079ff", "#40ffaa", "#4079ff", "#40ffaa"]}
              animationSpeed={3}
              showBorder={true}
              className="px-4 py-2 border border-[#d9d9d9a6] rounded-md font-medium flex items-center gap-2"
              onclick={() => navigate("/signup")}
            >
              Sign up
            </GradientText>
          </div>
        )}
      </div>
    </nav>
  );
}
