import OnlineGame from "./Components/OnlineGame";
import LocalGame from "./Components/localGame";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from 'react-hot-toast';
import LocalGamePage from "./Components/localGamePage";
import ProtectedRoute from './Components/ProtectedRoutes';
import Home from "./landing/Home";
import Signup from "./Authentication/Signup";
import Login from "./Authentication/Login";
import ForgotPassword from "./Authentication/forgotPassword";
import UpdatePassword from "./Authentication/UpdatePassword";
import PlayWithEngine from "./engine/PlayWithEngine";
import FuzzyText from "./utils/Error";

function App() {

  const hoverIntensity = 0.5;
  const enableHover = true;

  return (
    <div>
      <Toaster />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />}></Route>
          <Route path="/signup" element={<Signup />} />
          <Route path="/full" element={
            <Home />
          }></Route>
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/update-password/:id" element={<UpdatePassword />} />

          <Route path="/localgame/:gameId" element={
            <ProtectedRoute><LocalGame /></ProtectedRoute>
          } />
          <Route path="/game" element={
            <ProtectedRoute><OnlineGame /></ProtectedRoute>
          }></Route>
          <Route path="/localgamePage" element={
            <ProtectedRoute><LocalGamePage /></ProtectedRoute>
          }></Route>
          <Route path="/chess" element={
            <ProtectedRoute>
              <PlayWithEngine />
            </ProtectedRoute>
          } />
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
      </BrowserRouter>
    </div>
  )
}

export default App;
