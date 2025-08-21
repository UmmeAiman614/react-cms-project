// src/pages/admin/Users.jsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Layout from "../../components/admin/Layout";
import { getAllUsers, deleteUser } from "../../api/api";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");

  // Fetch users on mount
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await getAllUsers();
        setUsers(data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch users");
      }
    };
    fetchUsers();
  }, []);

  // Delete user
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure to delete this user?")) return;

    try {
      await deleteUser(id);
      setUsers(users.filter((user) => user._id !== id));
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete user");
    }
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto">
        {/* Header & Add Button */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <i className="fa fa-users"></i> All Users
          </h1>
          <Link
            to="/admin/users/add"
            className="bg-muted-green text-white px-4 py-2 rounded hover:bg-deep-green transition w-full md:w-auto text-center"
          >
            Add User
          </Link>
        </div>

        {error && <div className="text-red-600 mb-4">{error}</div>}

        {/* Users Table */}
        <div className="flex justify-center">
          <div className="bg-light-mint rounded-lg shadow p-4 max-w-full md:max-w-[1200px] overflow-x-auto md:overflow-x-hidden">
            <table className="min-w-[600px] w-full border-collapse">
              <thead>
                <tr className="bg-muted-green text-white">
                  <th className="p-2 border">S.No.</th>
                  <th className="p-2 border">Full Name</th>
                  <th className="p-2 border">Username</th>
                  <th className="p-2 border">Role</th>
                  <th className="p-2 border">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user, index) => (
                  <tr
                    key={user._id}
                    className={index % 2 === 0 ? "bg-light-mint" : "bg-[#C2E8C5]"}
                  >
                    <td className="p-2 border text-center">{index + 1}</td>
                    <td className="p-2 border">{user.fullname}</td>
                    <td className="p-2 border">{user.username}</td>
                    <td className="p-2 border">{user.role}</td>
                    <td className="p-2 border text-center flex justify-center gap-2">
                      <Link
                        to={`/admin/users/update/${user._id}`}
                        className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 transition"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(user._id)}
                        className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700 transition"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
                {users.length === 0 && (
                  <tr>
                    <td colSpan={5} className="p-4 text-center text-textPrimary">
                      No users found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Users;
