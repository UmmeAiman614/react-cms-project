// src/pages/admin/Login.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginAdmin } from "../../api/api";
import Layout from "../../components/admin/Layout";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

const handleSubmit = async (e) => {
  e.preventDefault();
  setError("");

  try {
    // Backend will set httpOnly cookie for auth
    const data = await loginAdmin({ username, password });

    // Store user info
    if (data.user) {
      localStorage.setItem("user", JSON.stringify(data.user));
    }

    // ✅ Store token for route guarding
    localStorage.setItem("token", data.token);

    // Redirect to dashboard
    navigate("/admin/dashboard");
  } catch (err) {
    console.error("Login error:", err);
    setError(err.response?.data?.message || "Invalid username or password");
  }
};


  return (
      <div className="bg-pale-yellow text-textPrimary min-h-screen flex items-center justify-center">
        <div className="w-full max-w-sm mx-auto p-4">
          <div className="bg-light-mint rounded-lg shadow-lg p-6">
            <h3 className="text-center text-2xl font-bold mb-6">Admin Login</h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Username */}
              <div>
                <label className="block font-medium mb-1">Username</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  className="w-full px-4 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-accent"
                />
              </div>

              {/* Password */}
              <div>
                <label className="block font-medium mb-1">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-4 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-accent"
                />
              </div>

              {/* Submit Button */}
              <div>
                <button
                  type="submit"
                  className="w-full bg-muted-green text-white px-4 py-2 rounded hover:bg-deep-green transition-colors"
                >
                  Login
                </button>
              </div>
            </form>

            {/* Error Message */}
            {error && (
              <div className="mt-4 text-red-600 font-medium text-center">
                {error}
              </div>
            )}
          </div>
        </div>
      </div>
  );
};

export default Login;
