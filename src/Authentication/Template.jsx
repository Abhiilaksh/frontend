import React from "react";
import Threads from "./Background";
import LoginForm from "./LoginForm";
import SignupForm from "./SignupForm";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import { useGoogleLogin } from "@react-oauth/google";

export default function Template({ type, title }) {
  const login = useGoogleLogin({
    onSuccess: (tokenResponse) => console.log(tokenResponse),
    onError: () => console.log("Google Sign-In Failed"),
  });
  return (
    <div className="relative min-h-screen flex items-center justify-center bg-black text-white overflow-hidden">
      <div className="absolute inset-0 w-full h-full">
        <Threads
          amplitude={0.6}
          distance={0.4}
          enableMouseInteraction={false}
        />
      </div>
      <div className="relative z-10 w-full max-w-md p-8 bg-[#181818] rounded-2xl shadow-xl border border-gray-700/50 backdrop-blur-lg">
        <div className="text-3xl font-semibold text-[#f1f2ff] text-center mb-8">
          {title}
        </div>
        <div className="flex flex-row justify-evenly w-full">
          <div className="w-[40%] flex flex-col">
            <button
              onClick={() => login()}
              className="flex items-center gap-2 bg-[rgba(26,26,26,0.5)] text-white font-medium px-6 py-3 rounded-lg shadow-md hover:text-[#d9d9d9] hover:bg-[#6953d6c4]"
            >
              <FcGoogle fontSize={25} />
              <span>Google</span>
            </button>
          </div>

          <a
            href="https://github.com/login/oauth/authorize?client_id=Ov23liPbOMSVCNExxy2L&scope=user"
            className="w-[40%] flex flex-col"
          >
            <button className="flex items-center gap-2 bg-[rgba(26,26,26,0.5)] text-white font-medium px-6 py-3 rounded-lg shadow-md hover:text-[#d9d9d9] hover:bg-[#6953d6c4]">
              <FaGithub fontSize={25} />
              <span>GitHub</span>
            </button>
          </a>
        </div>
        <div className="items-center justify-center flex flex-row w-full mb-4 text-2xl text-gray-400">
          or
        </div>
      </div>
      <div>
        {type === "login" && <LoginForm />}
        {type === "signup" && <SignupForm />}
      </div>
    </div>
  );
}
