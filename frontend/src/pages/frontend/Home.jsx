// src/pages/frontend/Home.jsx
import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { getHomeArticles } from "../../api/api";
import Pagination from "../../components/frontend/Pagination";
import Layout from "../../components/frontend/Layout";
import SidebarWidget from "../../components/frontend/SidebarWidget";

// Icons
import { FaTag, FaUser, FaCalendar } from "react-icons/fa";

const Home = () => {
  const [articles, setArticles] = useState([]);
  const [paginatedData, setPaginatedData] = useState(null);
  const [latestNews, setLatestNews] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();

  const API_BASE = "http://localhost:3000/uploads/";

  useEffect(() => {
    const fetchArticles = async () => {
      setLoading(true);
      try {
        const query = Object.fromEntries([...searchParams]);
        const res = await getHomeArticles(query);

        if (res.success) {
          setArticles(res.data?.data || []);
          setPaginatedData(res.data || null);
          setLatestNews(res.latestNews || []); // optional if API sends it
          setCategories(res.categories || []); // optional if API sends it
        }
      } catch (error) {
        console.error("Error fetching articles:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, [searchParams]);

  const handlePageChange = (page) => {
    const params = Object.fromEntries([...searchParams]);
    params.page = page;
    // Update URL or refetch based on params
    // This example just refetches
  };

  return (
    <Layout>
      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6 text-deep-green">Latest Articles</h1>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Articles */}
          <div className="flex-1 flex flex-col gap-6">
            {loading ? (
              <p className="text-muted-green">Loading articles...</p>
            ) : articles.length === 0 ? (
              <p className="text-muted-green">No articles found.</p>
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

                      {/* Category, Author, Date with icons */}
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
            {paginatedData && (
              <div className="mt-10">
                <Pagination
                  paginatedData={paginatedData}
                  query={Object.fromEntries([...searchParams])}
                  onPageChange={handlePageChange}
                />
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:w-80 flex-shrink-0">
            <SidebarWidget latestNews={latestNews} categories={categories} />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Home;
