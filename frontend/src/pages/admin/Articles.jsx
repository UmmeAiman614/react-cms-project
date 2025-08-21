// src/pages/admin/AllArticles.jsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Layout from "../../components/admin/Layout";
import { getAllArticles, deleteArticle } from "../../api/api";

const AllArticles = () => {
  const [articles, setArticles] = useState([]);
  const [error, setError] = useState("");

  // Fetch articles on mount
  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const data = await getAllArticles(); // backend returns array directly
        setArticles(Array.isArray(data) ? data : []);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch articles");
      }
    };
    fetchArticles();
  }, []);

  // Delete article
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure to delete this article?")) return;

    try {
      await deleteArticle(id);
      setArticles(articles.filter((a) => a._id !== id));
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete article");
    }
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto">
        {/* Header & Add Button */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <h1 className="text-3xl font-bold flex items-center gap-2 text-deep-green">
            <i className="fa fa-file-text"></i> All Articles
          </h1>
          <Link
            to="/admin/articles/add"
            className="bg-muted-green text-white px-4 py-2 rounded hover:bg-deep-green transition w-full md:w-auto text-center"
          >
            Add New Article
          </Link>
        </div>

        {error && <div className="text-red-600 mb-4">{error}</div>}

        {/* Articles Table */}
        <div className="flex justify-center">
          <div className="bg-light-mint rounded-lg shadow p-4 max-w-full md:max-w-[1200px] overflow-x-auto md:overflow-x-hidden">
            <table className="min-w-[800px] w-full border-collapse">
              <thead>
                <tr className="bg-muted-green text-white">
                  <th className="p-2 border">S.No.</th>
                  <th className="p-2 border">Title</th>
                  <th className="p-2 border">Category</th>
                  <th className="p-2 border">Date</th>
                  <th className="p-2 border">Author</th>
                  <th className="p-2 border">Actions</th>
                </tr>
              </thead>
              <tbody>
                {articles.length > 0 ? (
                  articles.map((article, index) => (
                    <tr
                      key={article._id}
                      className={index % 2 === 0 ? "bg-light-mint" : "bg-pale-yellow"}
                    >
                      <td className="p-2 border text-center">{index + 1}</td>
                      <td className="p-2 border">{article.title}</td>
                      <td className="p-2 border">{article.category?.name || "-"}</td>
                      <td className="p-2 border">
                        {new Date(article.createdAt).toLocaleDateString()}
                      </td>
                      <td className="p-2 border">{article.author?.fullname || "-"}</td>
                      <td className="p-2 border text-center flex justify-center gap-2">
                        <Link
                          to={`/admin/articles/update/${article._id}`}
                          className="bg-deep-green text-white px-3 py-1 rounded text-sm hover:bg-muted-green transition"
                        >
                          Edit
                        </Link>
                        <button
                          onClick={() => handleDelete(article._id)}
                          className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700 transition"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="p-4 text-center text-deep-green">
                      No articles found.
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

export default AllArticles;
