import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Full from "./landing/Full";
import PlayWithEngine from "./engine/PlayWithEngine";
import FuzzyText from "./utils/Error";
import Signup from "./Authentication/Signup";
import Login from "./Authentication/Login";
import ForgotPassword from "./Authentication/forgotPassword";
import UpdatePassword from "./Authentication/UpdatePassword";

function App() {
  const hoverIntensity = 0.5;
  const enableHover = true;
  return (
    <BrowserRouter>
      <div className="bg-[#121212] h-[100vh] w-[100vw] text-white">
        <Routes>
          <Route path="/" element={<Full />} />
          <Route path="/chess" element={<PlayWithEngine />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/update-password/:id" element={<UpdatePassword />} />
          <Route
            path="*"
            element={
              <div className="flex flex-col gap-10 items-center justify-center h-full w-full">
                <FuzzyText
                  baseIntensity={0.2}
                  hoverIntensity={hoverIntensity}
                  enableHover={enableHover}
                >
                  404
                </FuzzyText>
                <FuzzyText
                  baseIntensity={0.2}
                  hoverIntensity={hoverIntensity}
                  enableHover={enableHover}
                  fontSize="70px"
                  fontWeight={700}
                >
                  not found
                </FuzzyText>
              </div>
            }
          />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
