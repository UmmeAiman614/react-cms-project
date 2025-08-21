// src/pages/admin/Comments.jsx
import React, { useEffect, useState } from "react";
import Layout from "../../components/admin/Layout";
import api from "../../api/api";
import Loader from "../../common/Loader";

const Comments = () => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchComments = async () => {
    try {
      console.log("Fetching comments from backend...");
      const res = await api.get("/admin/comment");
      console.log("Raw response from backend:", res);

      if (res.data && res.data.comments) {
        console.log("Comments array received:", res.data.comments);
        setComments(res.data.comments);
      } else {
        console.warn("No 'comments' field in response, setting empty array.");
        setComments([]);
      }
    } catch (error) {
      console.error("Error fetching comments:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, []);

  const handleStatusChange = async (id, status) => {
    try {
      console.log(`Updating comment ${id} status to:`, status);
      await api.put(`/admin/update-comment-status/${id}`, { status });
      fetchComments();
    } catch (error) {
      console.error("Error updating comment status:", error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this comment?")) return;

    try {
      await api.delete(`/admin/delete-comment/${id}`);
      fetchComments();
    } catch (error) {
      console.error("Error deleting comment:", error);
    }
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6 text-deep-green">Manage Comments</h1>

        {loading ? (
          <Loader />
        ) : comments.length === 0 ? (
          <p className="text-deep-green">No comments found.</p>
        ) : (
          <div className="bg-light-mint rounded-lg shadow p-4 overflow-x-auto md:overflow-x-hidden">
            <table className="min-w-[800px] w-full border-collapse">
              <thead>
                <tr className="bg-muted-green text-white">
                  <th className="p-2 border">S.No.</th>
                  <th className="p-2 border">Comment</th>
                  <th className="p-2 border">Name</th>
                  <th className="p-2 border">Article</th>
                  <th className="p-2 border">Status</th>
                  <th className="p-2 border">Actions</th>
                </tr>
              </thead>
              <tbody>
                {comments.map((comment, index) => (
                  <tr
                    key={comment._id}
                    className={index % 2 === 0 ? "bg-light-mint" : "bg-pale-yellow"}
                  >
                    <td className="p-2 border text-center">{index + 1}</td>
                    <td className="p-2 border">{comment.content || comment.comment}</td>
                    <td className="p-2 border">{comment.name || comment.author?.username}</td>
                    <td className="p-2 border">{comment.article?.title}</td>
                    <td className="p-2 border text-center">
                      <select
                        value={comment.status}
                        onChange={(e) => handleStatusChange(comment._id, e.target.value)}
                        className={`px-2 py-1 border rounded
      ${comment.status === "approved"
                            ? "bg-deep-green text-white"
                            : comment.status === "pending"
                              ? "bg-light-mint text-deep-green"
                              : comment.status === "rejected"
                                ? "bg-pale-yellow text-deep-green"
                                : "bg-white text-deep-green"
                          }
    `}
                      >
                        <option value="approved" className="bg-deep-green text-white">
                          Approved
                        </option>
                        <option value="pending" className="bg-light-mint text-deep-green">
                          Pending
                        </option>
                        <option value="rejected" className="bg-pale-yellow text-deep-green">
                          Rejected
                        </option>
                      </select>
                    </td>


                    <td className="p-2 border text-center flex justify-center gap-2">
                      <button
                        onClick={() => handleDelete(comment._id)}
                        className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700 transition"
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
