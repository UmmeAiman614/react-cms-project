import React, { useEffect, useState } from "react";
import Layout from "../../components/admin/Layout";
import api from "../../api/api";
import { useParams, useNavigate } from "react-router-dom";

const UpdateArticle = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [article, setArticle] = useState({
    title: "",
    content: "",
    category: "",
    image: "",
  });

  const [categories, setCategories] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [loadingData, setLoadingData] = useState(true);
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [error, setError] = useState("");

  // Fetch article & categories
 // Fetch article & categories
useEffect(() => {
  const fetchArticle = async () => {
    try {
      const res = await api.get(`/admin/update-article/${id}`, {
        withCredentials: true,
      });

      // log response to check structure
      console.log("UpdateArticle response:", res.data);

      const { article, categories } = res.data;

      setArticle({
        title: article?.title || "",
        content: article?.content || "",
        category: article?.category?._id || "",
        image: article?.image || "",
      });

      // Ensure categories is always an array
      setCategories(Array.isArray(categories) ? categories : []);
    } catch (err) {
      console.error("Failed to load article:", err);
      setError("Failed to load article or categories");
    } finally {
      setLoadingData(false);
    }
  };

  fetchArticle();
}, [id]);


  const handleChange = (e) => {
    setArticle({ ...article, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    setSelectedImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoadingSubmit(true);

    try {
      const formData = new FormData();
      formData.append("title", article.title);
      formData.append("content", article.content);
      formData.append("category", article.category);

      if (selectedImage) {
        formData.append("image", selectedImage);
      }

      // ✅ consistent backend route
      await api.put(`/admin/update-article/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });

      navigate("/admin/articles");
    } catch (err) {
      console.error("Update failed:", err);
      setError(err.response?.data?.message || "Failed to update article");
    } finally {
      setLoadingSubmit(false);
    }
  };

  if (loadingData) return <div className="p-4 text-center">Loading article...</div>;

  return (
    <Layout>
      <div className="container mx-auto p-4 max-w-4xl">
        <h1 className="text-3xl font-bold text-center mb-6">Update Article</h1>

        {error && (
          <div className="text-red-600 font-semibold text-center mb-4">{error}</div>
        )}

        <div className="bg-light-mint shadow-lg rounded-lg p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Title */}
            <div>
              <label htmlFor="title" className="block font-semibold">
                Title
              </label>
              <input
                type="text"
                name="title"
                id="title"
                value={article.title}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-muted-green"
                required
              />
            </div>

            {/* Content */}
            <div>
              <label htmlFor="content" className="block font-semibold">
                Description
              </label>
              <textarea
                name="content"
                id="content"
                value={article.content}
                onChange={handleChange}
                rows="6"
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-muted-green"
                required
              />
            </div>

            {/* Category */}
            <div>
              <label htmlFor="category" className="block font-semibold">
                Category
              </label>
              <select
                name="category"
                id="category"
                value={article.category}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-muted-green"
                required
              >
                <option value="" disabled>
                  Select Category
                </option>
                {categories.map((cat) => (
                  <option key={cat._id || cat.id} value={cat._id || cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Image */}
            <div>
              <label className="block font-semibold">Article Image</label>
              {article.image && !selectedImage && (
                <img
                  src={`/uploads/${article.image}`}
                  alt="Article"
                  className="mb-3 w-32 sm:w-40 border-2 border-muted-green rounded-md"
                />
              )}
              {selectedImage && (
                <img
                  src={URL.createObjectURL(selectedImage)}
                  alt="Selected"
                  className="mb-3 w-32 sm:w-40 border-2 border-muted-green rounded-md"
                />
              )}
              <input
                type="file"
                name="image"
                accept="image/*"
                onChange={handleImageChange}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-muted-green"
              />
            </div>

            {/* Submit */}
            <div className="text-center">
              <button
                type="submit"
                className="bg-muted-green text-white px-5 py-2 rounded hover:bg-deep-green transition disabled:opacity-50"
                disabled={loadingSubmit}
              >
                {loadingSubmit ? "Updating..." : "Update"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default UpdateArticle;
