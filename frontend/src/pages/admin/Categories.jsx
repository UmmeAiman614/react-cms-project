import React, { useEffect, useState } from "react";
import Layout from "../../components/admin/Layout";
import api from "../../api/api";
import { Link } from "react-router-dom";

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await api.get("/admin/categories");
      setCategories(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const deleteCategory = async (id) => {
    if (window.confirm("Are you sure to delete this Category?")) {
      try {
        await api.delete(`/admin/delete-category/${id}`);
        setCategories(categories.filter((cat) => cat._id !== id));
      } catch (err) {
        if (err.response && err.response.status === 400) {
          alert(err.response.data.message);
        } else {
          alert("Failed to delete category.");
        }
      }
    }
  };

  return (
    <Layout>
      <div className="container mx-auto p-4 max-w-7xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <i className="fa fa-gears"></i> All Categories
          </h1>
          <Link
            to="/admin/add-category"
            className="bg-muted-green text-white px-4 py-2 rounded hover:bg-deep-green transition w-full md:w-auto text-center"
          >
            Add New Category
          </Link>
        </div>

        <div className="flex justify-center">
          <div className="bg-light-mint rounded-lg shadow p-4 overflow-x-auto w-full">
            {loading ? (
              <p className="text-deep-green font-semibold text-center">Loading...</p>
            ) : (
              <table className="min-w-full border border-gray-300">
                <thead>
                  <tr className="bg-muted-green text-white">
                    <th className="px-4 py-2">S.No.</th>
                    <th className="px-4 py-2">Category Name</th>
                    <th className="px-4 py-2">Slug</th>
                    <th className="px-4 py-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {categories.map((cat, idx) => (
                    <tr
                      key={cat._id}
                      className={`${idx % 2 === 0 ? "bg-light-mint" : "bg-pale-yellow"} text-deep-green hover:bg-muted-green hover:text-white transition`}
                    >
                      <td className="border px-4 py-2 text-center">{idx + 1}</td>
                      <td className="border px-4 py-2">{cat.name}</td>
                      <td className="border px-4 py-2">{cat.slug}</td>
                      <td className="border px-4 py-2 flex justify-center gap-2">
                        <Link
                          to={`/admin/update-category/${cat._id}`}
                          className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 transition"
                        >
                          Edit
                        </Link>
                        <button
                          onClick={() => deleteCategory(cat._id)}
                          className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700 transition"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Categories;
