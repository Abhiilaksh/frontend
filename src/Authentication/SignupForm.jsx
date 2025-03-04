import React, { useState } from "react";
import { FaEnvelope, FaUser, FaEye, FaEyeSlash, FaLock } from "react-icons/fa";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast from 'react-hot-toast';
import UserContext from "../Context/UserContext";
import { useContext } from "react";

export default function SignupForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const navigate = useNavigate();
  const { user, setUser } = useContext(UserContext);


  async function signup(e) {
    e.preventDefault();
    console.log('clicked')

    try {
      console.log("In here");
      const response = await axios.post(`http://localhost:8080/api/signup`, {
        name: username,
        password: password,
        email: email
      });
      const data = response.data;
      const token = data.token;
      console.log(token);
      localStorage.setItem("token", token);
      setUser(username);
      navigate("/home");
    } catch (error) {
      toast.error(error?.response?.data?.error || "Some error occurred");
    }
  }

  return (
    <>
      <form className="space-y-4">
        <div className="relative">
          <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
          <input
            placeholder="aichess"
            className="input-style pl-10"
            onInput={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="relative">
          <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
          <input
            type="email"
            placeholder="aichess@example.com"
            className="input-style pl-10"
            onInput={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="relative">
          <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            className="input-style pl-10"
            onInput={(e) => setPassword(e.target.value)}
            required
          />
          <button
            type="button"
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
            onClick={() => setShowPassword(!showPassword)}
          >
            {!showPassword ? <FaEye /> : <FaEyeSlash />}
          </button>
        </div>
        <button
          type="submit"
          className="bg-[#000814] hover:bg-[#f5f3f3] hover:text-[#000814] text-[#f5f3f3] w-full rounded-lg text-sm font-semibold px-6 py-3 mt-3"
          onClick={(e) => signup(e)}
        >
          Sign up
        </button>
      </form>
    </>
  );
}
