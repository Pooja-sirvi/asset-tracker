
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

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
    <div className="flex flex-col items-center justify-center h-screen bg-white">
      {/* Title on Background */}
      <h1 className="text-5xl font-extrabold text-blue-900 mb-10">
        Welcome to Asset Management Tool
      </h1>

      {/* Login Card */}
      <div className="bg-blue-700 p-10 rounded-3xl shadow-2xl w-[420px] text-white">
        {/* Subtitle */}
        <h2 className="text-center text-lg mb-6">
          Please login with your credentials
        </h2>

        <form className="flex flex-col gap-5" onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email"
            className="bg-gray-200 rounded-lg p-3 text-black text-sm"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            className="bg-gray-200 rounded-lg p-3 text-black text-sm"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            type="submit"
            className="bg-white text-blue-700 font-bold rounded-lg p-3 hover:bg-gray-200 transition"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
