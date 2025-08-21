// src/pages/admin/UpdateUser.jsx
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Layout from "../../components/admin/Layout";
import { getAllUsers, updateUser } from "../../api/api"; // assuming you can fetch single user from all users

const UpdateUser = () => {
  const { id } = useParams(); // get user id from URL
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullname: "",
    username: "",
    password: "",
    role: "author",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Fetch the user data when component mounts
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const users = await getAllUsers(); // get all users
        const user = users.find(u => u._id === id);
        if (user) {
          setFormData({
            fullname: user.fullname,
            username: user.username,
            password: "", // empty password by default
            role: user.role,
          });
        } else {
          setError("User not found");
        }
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch user");
      }
    };

    fetchUser();
  }, [id]);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const response = await updateUser(id, formData);
      setSuccess(response.message || "User updated successfully!");
      navigate("/admin/users"); // redirect back to Users page
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <Layout>
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Modify User Details</h1>

        <div className="bg-light-mint rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Update User</h2>

          {error && <div className="mb-4 text-red-600">{error}</div>}
          {success && <div className="mb-4 text-green-600">{success}</div>}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block font-medium mb-1">Full Name</label>
              <input
                type="text"
                name="fullname"
                value={formData.fullname}
                onChange={handleChange}
                placeholder="Full Name"
                className="w-full px-4 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-muted-green"
                required
              />
            </div>

            <div>
              <label className="block font-medium mb-1">Username</label>
              <input
                type="text"
                name="username"
                value={formData.username}
                disabled
                className="w-full px-4 py-2 rounded border border-gray-300 bg-gray-100 text-gray-500 cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block font-medium mb-1">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Password"
                className="w-full px-4 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-muted-green"
              />
            </div>

            <div>
              <label className="block font-medium mb-1">User Role</label>
              <select
                name="role"
                value={formData.role}
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
                className="bg-muted-green text-white px-6 py-2 rounded hover:bg-deep-green transition"
              >
                Update
              </button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default UpdateUser;
