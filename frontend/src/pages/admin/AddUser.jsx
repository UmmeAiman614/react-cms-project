import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../../components/admin/Layout";
import api from "../../api/api";

const AddUser = () => {
  const navigate = useNavigate();

  const [user, setUser] = useState({
    fullname: "",
    username: "",
    password: "",
    role: "author"
  });

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/admin/add-user", user);
      navigate("/admin/users");
    } catch (err) {
      console.error(err);
      alert("Failed to add user.");
    }
  };

  return (
    <Layout>
      <div className="container mx-auto p-4 max-w-3xl">
        <h1 className="text-3xl font-bold mb-6">Add User</h1>

        <div className="bg-light-mint rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Add New User</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name */}
            <div>
              <label className="block font-medium mb-1">Full Name</label>
              <input
                type="text"
                name="fullname"
                value={user.fullname}
                onChange={handleChange}
                placeholder="Full Name"
                required
                className="w-full px-4 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-muted-green"
              />
            </div>

            {/* Username */}
            <div>
              <label className="block font-medium mb-1">User Name</label>
              <input
                type="text"
                name="username"
                value={user.username}
                onChange={handleChange}
                placeholder="Username"
                required
                className="w-full px-4 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-muted-green"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block font-medium mb-1">Password</label>
              <input
                type="password"
                name="password"
                value={user.password}
                onChange={handleChange}
                placeholder="Password"
                required
                className="w-full px-4 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-muted-green"
              />
            </div>

            {/* Role */}
            <div>
              <label className="block font-medium mb-1">User Role</label>
              <select
                name="role"
                value={user.role}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-muted-green"
              >
                <option value="author">Author</option>
                <option value="admin">Administrator</option>
              </select>
            </div>

            {/* Submit */}
            <div>
              <button
                type="submit"
                className="bg-muted-green text-white px-6 py-2 rounded hover:bg-deep-green transition"
              >
                Save
              </button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default AddUser;
