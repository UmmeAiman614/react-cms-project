// src/pages/admin/AddArticle.jsx
import React, { useState, useEffect } from "react";
import { useQuill } from "react-quilljs";
import "quill/dist/quill.snow.css";
import Layout from "../../components/admin/Layout";
import { useNavigate } from "react-router-dom";
import api from "../../api/api";

const AddArticle = () => {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [image, setImage] = useState(null);
  const [categories, setCategories] = useState([]);
  const [content, setContent] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { quill, quillRef } = useQuill();

  useEffect(() => {
    if (quill) {
      quill.on("text-change", () => {
        setContent(quill.root.innerHTML);
      });
    }
  }, [quill]);

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get("/admin/category", { withCredentials: true });
        setCategories(res.data.categories || []);
      } catch (err) {
        console.error("Failed to load categories:", err);
        setError("Failed to load categories");
      }
    };
    fetchCategories();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!title || !content || !category || !image) {
      setError("All fields are required");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("title", title);
      formData.append("content", content);
      formData.append("category", category);
      formData.append("image", image);

      // Send request with cookies
      const res = await api.post("/admin/add-article", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true, // ensures cookies are sent
      });

      console.log("Article added:", res.data.article);

      // Reset form
      setTitle("");
      setContent("");
      setCategory("");
      setImage(null);
      if (quill) quill.setContents([]);

      navigate("/admin/articles");
    } catch (err) {
      console.error("Error adding article:", err);
      setError(err.response?.data?.message || "Failed to add article");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <main className="bg-bgMain text-textPrimary min-h-screen flex flex-col p-4">
        <div className="max-w-4xl mx-auto w-full">
          <h1 className="text-3xl font-bold text-center mb-6">Add New Article</h1>
          <div className="bg-light-mint shadow-lg rounded-lg p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block font-semibold">Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold mb-2">Description</label>
                <div
                  ref={quillRef}
                  className="bg-white min-h-[200px] border border-gray-300 rounded p-2"
                />
              </div>

              <div>
                <label className="block font-semibold">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent"
                  required
                >
                  <option value="" disabled>
                    Select Category
                  </option>
                  {categories.map((cat) => (
                    <option key={cat._id} value={cat._id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold">Article Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setImage(e.target.files[0])}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent"
                  required
                />
              </div>

              <div className="text-center pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-muted-green text-white px-5 py-2 rounded hover:bg-deep-green transition disabled:opacity-50"
                >
                  {loading ? "Saving..." : "Save Article"}
                </button>
              </div>

              {error && (
                <div className="mt-4 text-red-600 font-semibold text-center">
                  {error}
                </div>
              )}
            </form>
          </div>
        </div>
      </main>
    </Layout>
  );
};

export default AddArticle;
