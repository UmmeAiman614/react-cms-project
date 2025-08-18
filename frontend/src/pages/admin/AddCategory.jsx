import React, { useState } from "react";
import Layout from "../../components/admin/Layout";
import api from "../../api/api";
import { useNavigate } from "react-router-dom";

const AddCategory = () => {
  const navigate = useNavigate();
  const [category, setCategory] = useState({
    name: "",
    description: "",
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setCategory({ ...category, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/admin/add-category", category);
      navigate("/admin/categories");
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to add category");
    }
  };

  return (
    <Layout>
      <div className="container mx-auto p-4 max-w-2xl">
        <h1 className="text-3xl font-bold text-center mb-6">Add New Category</h1>

        <div className="bg-light-mint shadow-lg rounded-lg p-6">
          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4" autoComplete="off">
            {/* Category Name */}
            <div>
              <label htmlFor="name" className="block font-semibold">
                Category Name
              </label>
              <input
                type="text"
                name="name"
                id="name"
                value={category.name}
                onChange={handleChange}
                placeholder="Category Name"
                required
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-muted-green"
              />
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block font-semibold">
                Description
              </label>
              <textarea
                name="description"
                id="description"
                value={category.description}
                onChange={handleChange}
                rows="4"
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-muted-green"
              />
            </div>

            {/* Submit */}
            <div className="text-center">
              <button
                type="submit"
                className="bg-muted-green text-white px-5 py-2 rounded hover:bg-deep-green transition"
              >
                Save
              </button>
            </div>
          </form>

          {/* Error Message */}
          {error && <div className="mt-4 text-red-600 font-semibold">{error}</div>}
        </div>
      </div>
    </Layout>
  );
};

export default AddCategory;
