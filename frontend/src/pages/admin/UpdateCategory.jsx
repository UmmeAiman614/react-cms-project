// src/pages/admin/UpdateCategory.jsx
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Layout from "../../components/admin/Layout";
import { getAllCategories, updateCategory } from "../../api/api";

const UpdateCategory = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Fetch the category data when component mounts
  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const data = await getAllCategories();
        // ✅ Ensure we always extract the array
        const categories = data.categories || data;

        console.log("Fetched categories:", categories);

        const category = categories.find(
          (c) => c._id === id || c.id === id
        );

        if (category) {
          setFormData({
            name: category.name || "",
            description: category.description || "",
          });
        } else {
          setError("Category not found");
        }
      } catch (err) {
        console.error("Error fetching categories:", err);
        setError(err.response?.data?.message || "Failed to fetch category");
      }
    };

    fetchCategory();
  }, [id]);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const response = await updateCategory(id, formData);
      setSuccess(response.message || "Category updated successfully!");
      navigate("/admin/categories");
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <Layout>
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-deep-green">
          Modify Category
        </h1>

        <div className="bg-light-mint rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4 text-deep-green">
            Update Category
          </h2>

          {error && <div className="mb-4 text-red-600">{error}</div>}
          {success && <div className="mb-4 text-green-600">{success}</div>}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block font-medium mb-1 text-deep-green">
                Category Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Category Name"
                className="w-full px-4 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-muted-green"
                required
              />
            </div>

            <div>
              <label className="block font-medium mb-1 text-deep-green">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Category Description"
                className="w-full px-4 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-muted-green"
              />
            </div>

            <div>
              <button
                type="submit"
                className="bg-muted-green text-white px-6 py-2 rounded hover:bg-deep-green transition"
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
