// src/pages/admin/Categories.jsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Layout from "../../components/admin/Layout";
import { getAllCategories, deleteCategory } from "../../api/api";

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState("");

  // Fetch categories on mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getAllCategories();
        // 🔥 Check if backend returns { categories: [...] }
        setCategories(Array.isArray(data) ? data : data.categories || []);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch categories");
      }
    };
    fetchCategories();
  }, []);

  // Delete category
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure to delete this category?")) return;

    try {
      await deleteCategory(id);
      setCategories(categories.filter((cat) => cat._id !== id));
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete category");
    }
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto">
        {/* Header & Add Button */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <i className="fa fa-list"></i> All Categories
          </h1>
          <Link
            to="/admin/categories/add"
            className="bg-muted-green text-white px-4 py-2 rounded hover:bg-deep-green transition w-full md:w-auto text-center"
          >
            Add Category
          </Link>
        </div>

        {error && <div className="text-red-600 mb-4">{error}</div>}

        {/* Categories Table */}
        <div className="flex justify-center">
          <div className="bg-light-mint rounded-lg shadow p-4 max-w-full md:max-w-[1200px] overflow-x-auto md:overflow-x-hidden">
            <table className="min-w-[600px] w-full border-collapse">
              <thead>
                <tr className="bg-muted-green text-white">
                  <th className="p-2 border">S.No.</th>
                  <th className="p-2 border">Name</th>
                  <th className="p-2 border">Description</th>
                  <th className="p-2 border">Actions</th>
                </tr>
              </thead>
              <tbody>
                {categories.map((category, index) => (
                  <tr
                    key={category._id}
                    className={index % 2 === 0 ? "bg-light-mint" : "bg-[#C2E8C5]"}
                  >
                    <td className="p-2 border text-center">{index + 1}</td>
                    <td className="p-2 border">{category.name}</td>
                    <td className="p-2 border">{category.description}</td>
                    <td className="p-2 border text-center flex justify-center gap-2">
                      <Link
                        to={`/admin/categories/update/${category._id}`}
                        className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 transition"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(category._id)}
                        className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700 transition"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
                {categories.length === 0 && (
                  <tr>
                    <td colSpan={4} className="p-4 text-center text-textPrimary">
                      No categories found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Categories;
