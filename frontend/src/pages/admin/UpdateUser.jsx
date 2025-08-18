import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Layout from "../../components/admin/Layout";
import api from "../../api/api";

const UpdateUser = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState({
    fullname: "",
    username: "",
    password: "",
    role: "author",
  });
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.get(`/admin/users/${id}`);
        setUser(res.data);
      } catch (err) {
        console.error(err);
        setError("Failed to load user data.");
      }
    };
    fetchUser();
  }, [id]);

  const handleChange = (e) => {
    setUser((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await api.put(`/admin/update-user/${id}`, user);
      navigate("/admin/users");
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to update user.");
    }
  };

  return (
    <Layout>
      <div className="container mx-auto p-4 max-w-3xl">
        <h1 className="text-3xl font-bold mb-6">Modify User Details</h1>
        <div className="bg-light-mint rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Update User</h2>

          <form onSubmit={handleSubmit} className="space-y-4">

            <div>
              <label className="block font-medium mb-1">Full Name</label>
              <input
                type="text"
                name="fullname"
                value={user.fullname}
                onChange={handleChange}
                placeholder="Full Name"
                className="w-full px-4 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-muted-green"
                required
              />
            </div>

            <div>
              <label className="block font-medium mb-1">User Name</label>
              <input
                type="text"
                name="username"
                value={user.username}
                placeholder="Username"
                disabled
                className="w-full px-4 py-2 rounded border border-gray-300 bg-gray-100 text-gray-500 cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block font-medium mb-1">Password</label>
              <input
                type="password"
                name="password"
                value={user.password}
                onChange={handleChange}
                placeholder="Password"
                className="w-full px-4 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-muted-green"
              />
            </div>

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

            <div>
              <button
                type="submit"
                className="bg-muted-green text-white px-6 py-2 rounded hover:bg-deep-green transition cursor-pointer"
              >
                Update
              </button>
            </div>

            {error && <p className="text-red-600 mt-2">{error}</p>}

          </form>
        </div>
      </div>
    </Layout>
  );
};

export default UpdateUser;
