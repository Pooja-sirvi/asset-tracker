
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import NokiaLogo from "../logo.png"; 

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    if (email === "manager@nokia.com" && password === "manager123") {
      navigate("/teamassetmanager");
    } else if (email === "admin@nokia.com" && password === "admin123") {
      navigate("/admin");
    } else {
      alert("Invalid login. Please check your credentials.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-blue-900 via-blue-700 to-cyan-500 p-6 relative overflow-hidden">
      {/* Decorative Blur Elements with Blob Animation */}
      <div className="absolute top-[-100px] left-[-100px] w-64 h-64 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob"></div>
      <div className="absolute bottom-[-100px] right-[-100px] w-64 h-64 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob [animation-delay:-2s]"></div>

      {/* Main Content Container with Pop-up Animation */}
      <div className="relative z-10 text-center mb-12 animate-fadeInUp">
        {/* 2. REPLACE THE TEXT DIV WITH THE IMG TAG */}
        <img
          src={NokiaLogo}
          alt="Nokia Official Logo"
          // Adjust 'w-40' if the size isn't right for your image
          className="mx-auto mb-4 w-40 h-auto drop-shadow-lg"
        />

        <h1 className="text-5xl font-extrabold text-white tracking-wide drop-shadow-lg">
          Laptop Asset Management Tool
        </h1>
        <p className="text-white text-xl mt-2 font-light">
          Manage assets efficiently.
        </p>
      </div>

      {/* Login Card with Zoom-in Animation */}
      <div className="relative z-10 bg-white bg-opacity-10 p-10 rounded-3xl shadow-2xl backdrop-blur-xl w-[450px] text-white border border-white border-opacity-20 transform transition-all duration-500 hover:scale-105 animate-zoomIn [animation-delay:0.3s]">
        {/* Subtitle */}
        <h2 className="text-center text-2xl font-semibold mb-6 text-gray-100">
          Sign In
        </h2>

        <form className="flex flex-col gap-5" onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email"
            className="bg-white bg-opacity-20 rounded-lg p-4 text-white placeholder-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:bg-opacity-30 transition"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            className="bg-white bg-opacity-20 rounded-lg p-4 text-white placeholder-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:bg-opacity-30 transition"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            type="submit"
            className="bg-white bg-opacity-90 text-blue-800 font-bold rounded-lg p-4 mt-2 hover:bg-opacity-100 transition duration-300 shadow-lg transform hover:scale-105"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;