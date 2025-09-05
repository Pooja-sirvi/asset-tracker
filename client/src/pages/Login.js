
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    // Demo login with roles
    if (email === "employee@test.com" && password === "123") {
      navigate("/employee");
    } else if (email === "manager@test.com" && password === "123") {
      navigate("/manager");
    } else if (email === "admin@test.com" && password === "123") {
      navigate("/admin");
    } else {
      alert("Invalid login");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-[#124191] to-[#0078D7]">
      <div className="w-96 bg-white rounded-2xl shadow-xl p-8">

        {/* Title */}
        <h1 className="text-3xl font-bold text-center text-[#124191] mb-2">
          Welcome to Asset Tracker
        </h1>
        <p className="text-center text-gray-600 mb-6">
          Please login with your credentials
        </p>

        {/* Login Form */}
        <form className="flex flex-col gap-4" onSubmit={handleLogin}>
          <input
            type="text"
            placeholder="Email"
            className="border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#124191]"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#124191]"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            type="submit"
            className="bg-[#124191] text-white rounded-lg p-3 font-medium hover:bg-blue-800 transition"
          >
            Login
          </button>
        </form>

        
        
      </div>
    </div>
  );
}

export default Login;
