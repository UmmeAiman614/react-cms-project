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

  useEffect(() => {
    // Fetch article
    const fetchArticle = async () => {
      try {
        const res = await api.get(`/admin/article/${id}`);
        setArticle(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    // Fetch categories
    const fetchCategories = async () => {
      try {
        const res = await api.get("/admin/categories");
        setCategories(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchArticle();
    fetchCategories();
  }, [id]);

  const handleChange = (e) => {
    setArticle({ ...article, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    setSelectedImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", article.title);
    formData.append("content", article.content);
    formData.append("category", article.category);
    if (selectedImage) {
      formData.append("image", selectedImage);
    }

    try {
      await api.put(`/admin/update-article/${id}`, formData);
      navigate("/admin/article");
    } catch (err) {
      console.error(err);
      alert("Failed to update article");
    }
  };

  return (
    <Layout>
      <div className="container mx-auto p-4 max-w-4xl">
        <h1 className="text-3xl font-bold text-center mb-6">Update Article</h1>
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

            {/* Description */}
            <div>
              <label htmlFor="content" className="block font-semibold">
                Description
              </label>
              <textarea
                name="content"
                id="content"
                value={article.content}
                onChange={handleChange}
                rows="5"
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
              >
                <option value="" disabled>
                  Select Category
                </option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Image */}
            <div>
              <label className="block font-semibold">Article Image</label>
              {article.image && (
                <img
                  src={`/uploads/${article.image}`}
                  alt="Article"
                  className="mb-3 w-32 sm:w-40 border-2 border-muted-green rounded-md"
                />
              )}
              <input
                type="file"
                name="image"
                onChange={handleImageChange}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-muted-green"
              />
            </div>

            {/* Submit */}
            <div className="text-center">
              <button
                type="submit"
                className="bg-muted-green text-white px-5 py-2 rounded hover:bg-deep-green transition"
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

export default UpdateArticle;
