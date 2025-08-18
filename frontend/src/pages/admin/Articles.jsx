import React, { useEffect, useState } from "react";
import Layout from "../../components/admin/Layout";
import api from "../../api/api";
import { useNavigate } from "react-router-dom";

const Articles = () => {
  const [articles, setArticles] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const res = await api.get("/admin/articles"); // update endpoint as per backend
        setArticles(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchArticles();
  }, []);

  const deleteArticle = async (id) => {
    if (window.confirm("Are you sure to delete this Article?")) {
      try {
        await api.delete(`/admin/delete-article/${id}`);
        setArticles((prev) => prev.filter((article) => article._id !== id));
      } catch (err) {
        alert("Failed to delete article.");
        console.error(err);
      }
    }
  };

  return (
    <Layout>
      <div className="container mx-auto p-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <i className="fa fa-file-text"></i> All Articles
          </h1>
          <button
            onClick={() => navigate("/admin/add-article")}
            className="bg-muted-green text-white px-4 py-2 rounded hover:bg-deep-green transition w-full md:w-auto text-center"
          >
            Add New Article
          </button>
        </div>

        <div className="bg-light-mint rounded-lg shadow p-4 overflow-x-auto">
          <table className="min-w-full border border-gray-300">
            <thead>
              <tr className="bg-muted-green text-white">
                <th className="px-4 py-2">S.No.</th>
                <th className="px-4 py-2">Title</th>
                <th className="px-4 py-2">Category</th>
                <th className="px-4 py-2">Date</th>
                <th className="px-4 py-2">Author</th>
                <th className="px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {articles.map((article, index) => (
                <tr
                  key={article._id}
                  className={`text-deep-green ${
                    index % 2 === 0 ? "bg-light-mint" : "bg-pale-yellow"
                  } hover:bg-muted-green hover:text-white transition`}
                >
                  <td className="px-4 py-2 text-center">{index + 1}</td>
                  <td className="px-4 py-2">{article.title}</td>
                  <td className="px-4 py-2">{article.category?.name}</td>
                  <td className="px-4 py-2">
                    {new Date(article.createdAt).toDateString()}
                  </td>
                  <td className="px-4 py-2">{article.author?.fullname}</td>
                  <td className="px-4 py-2 flex gap-2 justify-center">
                    <button
                      onClick={() => navigate(`/admin/update-article/${article._id}`)}
                      className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 transition"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteArticle(article._id)}
                      className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700 transition"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {articles.length === 0 && (
            <p className="text-center mt-4 text-deep-green font-semibold">
              No articles found.
            </p>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Articles;
