// src/pages/frontend/Category.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getArticlesByCategory } from "../../api/api";

// Components
import Header from "../../components/frontend/Header";
import Footer from "../../components/frontend/Footer";
import SidebarWidget from "../../components/frontend/SidebarWidget";
import Pagination from "../../components/frontend/Pagination";

// Icons
import { FaTag, FaUser, FaCalendar } from "react-icons/fa";

const Category = () => {
  const { name } = useParams(); // category slug from route
  const [category, setCategory] = useState({});
  const [articles, setArticles] = useState([]);
  const [latestNews, setLatestNews] = useState([]);
  const [categories, setCategories] = useState([]);
  const [pagination, setPagination] = useState({ currentPage: 1, totalPages: 1 });
  const [loading, setLoading] = useState(true);

  const fetchCategoryArticles = async (page = 1) => {
    try {
      setLoading(true);
      const data = await getArticlesByCategory(name, { page });
      console.log("Category API response:", data);

      setCategory(data.category || {});
      setArticles(data.data?.data || []);
      setPagination({
        currentPage: data.data?.currentPage || 1,
        totalPages: data.data?.totalPages || 1,
      });
      setLatestNews(data.latestNews || []);
      setCategories(data.categories || []);
    } catch (err) {
      console.error("Error fetching category articles:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategoryArticles();
  }, [name]);

  const handlePageChange = (page) => {
    fetchCategoryArticles(page);
  };

  return (
    <div className="flex flex-col min-h-screen bg-bgMain">
      <Header categories={categories} latestNews={latestNews} />

      <main className="bg-pale-yellow flex flex-col lg:flex-row gap-8 container mx-auto px-4 py-8 flex-grow">
        {/* Category Info and Articles */}
        <div className="flex-1 space-y-6">
          {loading ? (
            <p>Loading...</p>
          ) : (
            <>
              {/* Category heading - not clickable */}
              <h2 className="page-heading text-3xl font-bold bg-bgCard p-4">
                {category.name || "Category"}
              </h2>

              {articles.length === 0 ? (
                <p className="text-muted-green">No articles found.</p>
              ) : (
                articles.map((article) => {
                  const date = new Date(article.createdAt);
                  return (
                    <div
                      key={article._id}
                      className="flex flex-col md:flex-row bg-pale-yellow shadow-md rounded-2xl border border-light-mint overflow-hidden hover:shadow-lg transition"
                    >
                      {/* Article Image */}
                      {article.image ? (
                        <img
                          src={`http://localhost:3000/uploads/${article.image}`}
                          alt={article.title}
                          className="w-full md:w-1/3 h-56 object-cover"
                        />
                      ) : (
                        <div className="w-full md:w-1/3 h-56 bg-light-mint flex items-center justify-center text-deep-green">
                          No Image
                        </div>
                      )}

                      {/* Article Content */}
                      <div className="p-5 flex flex-col flex-grow">
                        <h2 className="text-xl font-bold text-deep-green mb-2">
                          {article.title}
                        </h2>

                        {/* Category, Author, Date */}
                        <div className="text-sm text-muted-green mb-2 flex flex-wrap gap-4">
                          {/* Category not clickable */}
                          {article.category && (
                            <span className="flex items-center gap-1">
                              <FaTag className="text-deep-green w-3 h-3" />
                              {article.category.name}
                            </span>
                          )}

                          {/* Author clickable */}
                          {article.author && (
                            <span className="flex items-center gap-1">
                              <FaUser className="text-deep-green w-3 h-3" />
                              <a
                                href={`/author/${article.author._id}`}
                                className="hover:text-deep-green transition"
                              >
                                {article.author.fullname}
                              </a>
                            </span>
                          )}

                          {/* Date */}
                          <span className="flex items-center gap-1">
                            <FaCalendar className="text-deep-green w-3 h-3" />
                            {date.toLocaleDateString("en-US", {
                              weekday: "short",
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            })}
                          </span>
                        </div>

                        <p className="text-sm text-muted-green mb-4 flex-grow">
                          {article.content?.replace(/<[^>]+>/g, "").slice(0, 150)}...
                        </p>

                        <a
                          href={`/single/${article._id}`}
                          className="self-start px-4 py-2 bg-deep-green text-pale-yellow rounded-lg font-semibold hover:bg-muted-green transition"
                        >
                          Read More
                        </a>
                      </div>
                    </div>
                  );
                })
              )}

              {/* Pagination */}
              <Pagination
                currentPage={pagination.currentPage}
                totalPages={pagination.totalPages}
                onPageChange={handlePageChange}
              />
            </>
          )}
        </div>

        {/* Sidebar */}
        <div className="md:w-1/3 flex-shrink-0">
          <SidebarWidget latestNews={latestNews} categories={categories} />
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Category;
