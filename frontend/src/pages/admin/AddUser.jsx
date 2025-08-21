// src/pages/admin/AddUser.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom"; // import navigate
import Layout from "../../components/admin/Layout";
import { addUser } from "../../api/api"; // use the exported function from api.js

const AddUser = () => {
  const navigate = useNavigate(); // initialize navigate
  const [formData, setFormData] = useState({
    fullname: "",
    username: "",
    password: "",
    role: "author",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const response = await addUser(formData); // call API function
      setSuccess(response.message || "User added successfully!");

      // Redirect to Users page after successful addition
      navigate("/admin/users");
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <Layout>
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <h1 className="text-3xl font-bold mb-6">Add User</h1>

        {/* Card/Form */}
        <div className="bg-light-mint rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Add New User</h2>

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
                onChange={handleChange}
                placeholder="Username"
                className="w-full px-4 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-muted-green"
                required
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
                required
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
