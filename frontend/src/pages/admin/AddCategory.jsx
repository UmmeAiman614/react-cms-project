// src/pages/AddCategory.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/api"; // your backend API instance

const AddCategory = () => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setError("");
      await api.post("/admin/add-category", formData, { withCredentials: true }); // backend route
      // ✅ redirect to categories page after success
      navigate("/admin/categories");
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong.");
    }
  };

  return (
    <main className="bg-pale-yellow text-deep-green min-h-screen flex flex-col p-4">
      <div className="max-w-2xl mx-auto w-full">
        <h1 className="text-3xl font-bold text-center mb-6">Add New Category</h1>

        <div className="bg-light-mint shadow-lg rounded-lg p-6">
          {/* Form Start */}
          <form onSubmit={handleSubmit} autoComplete="off" className="space-y-4">
            {/* Category Name */}
            <div>
              <label
                htmlFor="category_name"
                className="block font-semibold mb-1"
              >
                Category Name
              </label>
              <input
                type="text"
                name="name"
                id="category_name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Category Name"
                required
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-muted-green"
              />
            </div>

            {/* Description */}
            <div>
              <label
                htmlFor="category_description"
                className="block font-semibold mb-1"
              >
                Description
              </label>
              <textarea
                name="description"
                id="category_description"
                rows="4"
                value={formData.description}
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
                Save
              </button>
            </div>
          </form>
          {/* /Form End */}

          {/* Error message */}
          {error && (
            <div className="mt-4 text-red-600 font-medium text-center">
              {error}
            </div>
          )}
        </div>
      </div>
    </main>
  );
};

export default AddCategory;
