import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Layout from "../../components/admin/Layout";
import api from "../../api/api";

const UpdateCategory = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [category, setCategory] = useState({
    name: "",
    description: ""
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategory();
  }, []);

  const fetchCategory = async () => {
    try {
      const res = await api.get(`/admin/category/${id}`);
      setCategory(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setCategory({ ...category, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/admin/update-category/${id}`, category);
      navigate("/admin/categories");
    } catch (err) {
      console.error(err);
      alert("Failed to update category.");
    }
  };

  if (loading) return <Layout><p className="text-deep-green font-semibold text-center mt-10">Loading...</p></Layout>;

  return (
    <Layout>
      <div className="container mx-auto p-4 max-w-2xl">
        <h1 className="text-3xl font-bold text-center mb-6">Update Category</h1>

        <div className="bg-light-mint shadow-lg rounded-lg p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Category Name */}
            <div>
              <label htmlFor="category_name" className="block font-semibold">Category Name</label>
              <input
                type="text"
                name="name"
                id="category_name"
                value={category.name}
                onChange={handleChange}
                placeholder="Category Name"
                required
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-muted-green"
              />
            </div>

            {/* Description */}
            <div>
              <label htmlFor="category_description" className="block font-semibold">Description</label>
              <textarea
                name="description"
                id="category_description"
                rows="4"
                value={category.description}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-muted-green"
              ></textarea>
            </div>

            {/* Submit Button */}
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

export default UpdateCategory;
