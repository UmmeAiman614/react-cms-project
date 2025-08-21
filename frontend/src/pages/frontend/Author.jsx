// src/pages/frontend/Author.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { FaUser, FaTags, FaCalendarAlt } from "react-icons/fa";
import api from "../../api/api";

// Components
import Header from "../../components/frontend/Header";
import Footer from "../../components/frontend/Footer";
import SidebarWidget from "../../components/frontend/SidebarWidget";
import Pagination from "../../components/frontend/Pagination";

const Author = () => {
  const { name } = useParams(); // author ID or slug
  const [author, setAuthor] = useState({});
  const [articles, setArticles] = useState([]);
  const [latestNews, setLatestNews] = useState([]);
  const [categories, setCategories] = useState([]);
  const [pagination, setPagination] = useState({ currentPage: 1, totalPages: 1 });
  const [loading, setLoading] = useState(true);

  const API_BASE = "http://localhost:3000/uploads/";

  const fetchAuthorArticles = async (page = 1) => {
    try {
      setLoading(true);
      const res = await api.get(`/author/${name}?page=${page}`);
      console.log("Author API response:", res.data);

      setAuthor(res.data.author || {});
      setArticles(res.data.data?.data || []);
      setPagination({
        currentPage: res.data.data?.currentPage || 1,
        totalPages: res.data.data?.totalPages || 1,
      });
      setLatestNews(res.data.latestNews || []);
      setCategories(res.data.categories || []);
    } catch (err) {
      console.error("Error fetching author articles:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAuthorArticles();
  }, [name]);

  const handlePageChange = (page) => {
    fetchAuthorArticles(page);
  };

  return (
    <div className="flex flex-col min-h-screen bg-bgMain">
      <Header categories={categories} latestNews={latestNews} />

      <main className="bg-pale-yellow flex flex-col lg:flex-row gap-8 container mx-auto px-4 py-8 flex-grow">
        {/* Author Info and Articles */}
        <div className="flex-1 space-y-6">
          {loading ? (
            <p>Loading...</p>
          ) : (
            <>
              <h2 className="page-heading text-3xl font-bold bg-bgCard p-4">
                Author: {author.fullname}
              </h2>

              {articles.length === 0 ? (
                <p>No articles found.</p>
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
                          src={`${API_BASE}${article.image}`}
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
                        <div className="text-sm text-muted-green mb-3 flex flex-wrap gap-4 items-center">
                          {/* Category clickable */}
                          <span className="flex items-center gap-1">
                            <FaTags />{" "}
                            {article.category && (
                              <a
                                href={`/category/${article.category.slug}`}
                                className="hover:text-deep-green transition"
                              >
                                {article.category.name}
                              </a>
                            )}
                          </span>

                          {/* Author unclickable */}
                          <span className="flex items-center gap-1">
                            <FaUser /> {article.author?.fullname}
                          </span>

                          {/* Date */}
                          <span className="flex items-center gap-1">
                            <FaCalendarAlt />{" "}
                            {date.toLocaleDateString("en-US", {
                              weekday: "long",
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })}
                          </span>
                        </div>

                        {/* Content snippet */}
                        <div className="text-sm text-muted-green mb-4 flex-grow">
                          {article.content?.replace(/<[^>]+>/g, "").slice(0, 150)}...
                        </div>

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
              <div className="mt-6">
                <Pagination
                  currentPage={pagination.currentPage}
                  totalPages={pagination.totalPages}
                  onPageChange={handlePageChange}
                />
              </div>
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

export default Author;
