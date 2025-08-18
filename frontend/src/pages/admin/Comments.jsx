// src/pages/admin/Comments.jsx
import React, { useEffect, useState } from "react";
import Layout from "../../components/admin/Layout";
import api from "../../api/api"; // ✅ Correct path
import Loader from "../../common/Loader";

const Comments = () => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch comments
  const fetchComments = async () => {
    try {
      const res = await api.get("/admin/comments");
      setComments(res.data);
    } catch (error) {
      console.error("Error fetching comments:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, []);

  // Update comment status
  const handleStatusChange = async (id, status) => {
    try {
      await api.post(`/admin/update-comment-status/${id}`, { status });
      fetchComments();
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  // Delete comment
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this comment?")) {
      try {
        await api.post(`/admin/delete-comment/${id}`);
        fetchComments();
      } catch (error) {
        console.error("Error deleting comment:", error);
      }
    }
  };

  return (
    <Layout>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6 text-textPrimary">Manage Comments</h1>

        {loading ? (
          <Loader />
        ) : comments.length === 0 ? (
          <p className="text-gray-600">No comments found.</p>
        ) : (
          <div className="overflow-x-auto bg-white shadow rounded-lg">
            <table className="w-full border border-gray-200 text-sm">
              <thead className="bg-light-mint text-textPrimary">
                <tr>
                  <th className="px-4 py-2 border">ID</th>
                  <th className="px-4 py-2 border">Comment</th>
                  <th className="px-4 py-2 border">Author</th>
                  <th className="px-4 py-2 border">Article</th>
                  <th className="px-4 py-2 border">Status</th>
                  <th className="px-4 py-2 border">Actions</th>
                </tr>
              </thead>
              <tbody>
                {comments.map((comment) => (
                  <tr key={comment._id} className="hover:bg-pale-yellow">
                    <td className="px-4 py-2 border">{comment._id}</td>
                    <td className="px-4 py-2 border">{comment.comment}</td>
                    <td className="px-4 py-2 border">{comment.author?.username}</td>
                    <td className="px-4 py-2 border">{comment.article?.title}</td>
                    <td className="px-4 py-2 border">
                      <select
                        value={comment.status}
                        onChange={(e) => handleStatusChange(comment._id, e.target.value)}
                        className="px-2 py-1 border rounded bg-white"
                      >
                        <option value="approved">Approved</option>
                        <option value="pending">Pending</option>
                        <option value="rejected">Rejected</option>
                      </select>
                    </td>
                    <td className="px-4 py-2 border space-x-2">
                      <button
                        onClick={() => handleDelete(comment._id)}
                        className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Comments;
