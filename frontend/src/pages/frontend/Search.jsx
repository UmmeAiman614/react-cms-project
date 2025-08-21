// src/pages/frontend/Search.jsx
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import api from "../../api/api";

// Components
import Header from "../../components/frontend/Header";
import Footer from "../../components/frontend/Footer";
import SidebarWidget from "../../components/frontend/SidebarWidget";
import Pagination from "../../components/frontend/Pagination";

// Icons
import { FaTag, FaUser, FaCalendar } from "react-icons/fa";

const Search = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const searchQuery = queryParams.get("search") || "";
  const page = parseInt(queryParams.get("page")) || 1;

  const [articles, setArticles] = useState([]);
  const [latestNews, setLatestNews] = useState([]);
  const [categories, setCategories] = useState([]);
  const [pagination, setPagination] = useState({ currentPage: 1, totalPages: 1 });
  const [loading, setLoading] = useState(true);

  const API_BASE = "http://localhost:3000/uploads/";

  const fetchSearchResults = async (pageNum = 1) => {
    try {
      setLoading(true);
      const res = await api.get(`/search?search=${searchQuery}&page=${pageNum}`);

      console.log("Search API response:", res.data); // log the response

      const articlesData = res.data.data?.data || [];
      const currentPage = res.data.data?.currentPage || 1;
      const totalPages = res.data.data?.totalPages || 1;
      const latestNewsData = res.data.latestNews || [];
      const categoriesData = res.data.categories || [];

      setArticles(articlesData);
      setPagination({ currentPage, totalPages });
      setLatestNews(latestNewsData);
      setCategories(categoriesData);
    } catch (err) {
      console.error("Error fetching search results:", err);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Fetch when search query OR page changes
  useEffect(() => {
    if (searchQuery) {
      fetchSearchResults(page);
    }
  }, [searchQuery, page]);

  return (
    <div className="flex flex-col min-h-screen bg-bgMain">
      <Header categories={categories} latestNews={latestNews} />

      <main className="bg-pale-yellow flex flex-col lg:flex-row gap-8 container mx-auto px-4 py-8 flex-grow">
        {/* Search Results */}
        <div className="flex-1 space-y-6">
          {loading ? (
            <p>Loading...</p>
          ) : (
            <>
              <h2 className="page-heading text-3xl font-bold bg-bgCard p-4">
                Search: {searchQuery}
              </h2>

              {articles.length === 0 ? (
                <p>No results found.</p>
              ) : (
                articles.map((article) => {
                  const date = new Date(article.createdAt);
                  return (
                    <div
                      key={article._id}
                      className="flex flex-col md:flex-row bg-pale-yellow shadow-md rounded-2xl border border-light-mint overflow-hidden hover:shadow-lg transition"
                    >
                      {/* Image */}
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

                      {/* Content */}
                      <div className="p-5 flex flex-col flex-grow">
                        <h2 className="text-xl font-bold text-deep-green mb-2">
                          {article.title}
                        </h2>

                        {/* Category, Author, Date */}
                        <div className="text-sm text-muted-green mb-2 flex flex-wrap gap-4">
                          {article.category && (
                            <span className="flex items-center gap-1">
                              <FaTag className="text-deep-green" />
                              <a
                                href={`/category/${article.category.slug}`}
                                className="hover:text-deep-green transition"
                              >
                                {article.category.name}
                              </a>
                            </span>
                          )}
                          {article.author && (
                            <span className="flex items-center gap-1">
                              <FaUser className="text-deep-green" />
                              <a
                                href={`/author/${article.author._id}`}
                                className="hover:text-deep-green transition"
                              >
                                {article.author.fullname}
                              </a>
                            </span>
                          )}
                          <span className="flex items-center gap-1">
                            <FaCalendar className="text-deep-green" />
                            {date.toLocaleDateString("en-US", {
                              weekday: "long",
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })}
                          </span>
                        </div>

                        {/* Content snippet */}
                        <p className="text-sm text-muted-green mb-4 flex-grow">
                          {article.content?.replace(/<[^>]+>/g, "").slice(0, 150)}...
                        </p>

                        {/* Read More */}
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
              {articles.length > 0 && (
                <Pagination paginatedData={{ 
                  currentPage: pagination.currentPage,
                  totalPages: pagination.totalPages,
                  hasPrevPage: pagination.currentPage > 1,
                  hasNextPage: pagination.currentPage < pagination.totalPages,
                  prevPage: pagination.currentPage - 1,
                  nextPage: pagination.currentPage + 1,
                  limit: 10
                }} query={{ search: searchQuery }} />
              )}
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

export default Search;
