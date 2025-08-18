import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/api";

const AdminLogin = () => {
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({ username: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setCredentials((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await api.post("/admin/login", credentials);
      if (res.status === 200) {
        navigate("/admin/dashboard");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="bg-pale-yellow text-deep-green min-h-screen flex items-center justify-center">
      <div className="w-full max-w-sm mx-auto p-4">
        <div className="bg-light-mint rounded-lg shadow-lg p-6">
          <h3 className="text-center text-2xl font-bold mb-6">Admin Login</h3>

          <form onSubmit={handleSubmit} className="space-y-4">

            <div>
              <label className="block font-medium mb-1">Username</label>
              <input
                type="text"
                name="username"
                value={credentials.username}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-muted-green"
              />
            </div>

            <div>
              <label className="block font-medium mb-1">Password</label>
              <input
                type="password"
                name="password"
                value={credentials.password}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-muted-green"
              />
            </div>

            <div>
              <button
                type="submit"
                className="w-full bg-muted-green text-white px-4 py-2 rounded hover:bg-deep-green transition-colors"
              >
                Login
              </button>
            </div>

            {error && <p className="mt-4 text-red-600 text-center">{error}</p>}

          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
