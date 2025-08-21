import React, { useState } from "react";
import api from "../../api/api";

const CommentForm = ({ articleId, onCommentAdded }) => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    content: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post(`/single/${articleId}/comment`, form);
      console.log("Submitting comment for article:", articleId, form);

      alert("Comment submitted!");
      setForm({ name: "", email: "", content: "" });

      if (onCommentAdded) onCommentAdded(res.data); // notify parent
    } catch (err) {
      console.error("Failed to submit comment:", err.response?.data || err.message);
      alert(err.response?.data?.message || "Failed to submit comment");
    }
  };

  return (
    <div className="bg-light-mint p-4 rounded-lg shadow-md">
      <form className="space-y-3" onSubmit={handleSubmit}>
        <div>
          <label className="block mb-1 font-medium text-deep-green">Name</label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 rounded border border-deep-green focus:outline-none focus:ring-2 focus:ring-muted-green"
          />
        </div>
        <div>
          <label className="block mb-1 font-medium text-deep-green">Email</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 rounded border border-deep-green focus:outline-none focus:ring-2 focus:ring-muted-green"
          />
        </div>
        <div>
          <label className="block mb-1 font-medium text-deep-green">Comment</label>
          <textarea
            name="content"
            value={form.content}
            onChange={handleChange}
            rows="3"
            required
            className="w-full px-3 py-2 rounded border border-deep-green focus:outline-none focus:ring-2 focus:ring-muted-green"
          ></textarea>
        </div>
        <button
          type="submit"
          className="bg-deep-green text-pale-yellow px-4 py-2 rounded hover:bg-muted-green transition"
        >
          Submit Comment
        </button>
      </form>
    </div>
  );
};

export default CommentForm;
