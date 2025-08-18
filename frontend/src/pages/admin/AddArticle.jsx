import React, { useEffect, useState } from "react";
import Layout from "../../components/admin/Layout";
import api from "../../api/api";

const AddArticle = () => {
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    category: "",
    image: null,
  });
  const [error, setError] = useState("");

  useEffect(() => {
    // Fetch categories from backend
    const fetchCategories = async () => {
      try {
        const res = await api.get("/admin/categories");
        setCategories(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchCategories();
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      setFormData({ ...formData, image: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = new FormData();
      data.append("title", formData.title);
      data.append("content", formData.content);
      data.append("category", formData.category);
      data.append("image", formData.image);

      await api.post("/admin/add-article", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("Article added successfully!");
      setFormData({ title: "", content: "", category: "", image: null });
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Something went wrong!");
    }
  };

  return (
    <Layout>
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold text-center mb-6">Add New Article</h1>

        <div className="bg-bgCard shadow-lg rounded-lg p-6">
          {error && (
            <div className="mb-4 text-red-600 font-semibold">{error}</div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="article_title" className="block font-semibold">
                Title
              </label>
              <input
                type="text"
                name="title"
                id="article_title"
                value={formData.title}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent"
                required
              />
            </div>

            <div>
              <label htmlFor="article_content" className="block font-semibold">
                Description
              </label>
              <textarea
                name="content"
                id="article_content"
                value={formData.content}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent"
                rows={6}
                required
              />
            </div>

            <div>
              <label htmlFor="article_category" className="block font-semibold">
                Category
              </label>
              <select
                name="category"
                id="article_category"
                value={formData.category}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent"
                required
              >
                <option value="">Select Category</option>
                {categories.map((cat) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="article_image" className="block font-semibold">
                Article Image
              </label>
              <input
                type="file"
                name="image"
                id="article_image"
                onChange={handleChange}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent"
                required
              />
            </div>

            <div className="text-center">
              <button
                type="submit"
                className="bg-accent text-white px-5 py-2 rounded hover:bg-textPrimary transition"
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

export default AddArticle;
