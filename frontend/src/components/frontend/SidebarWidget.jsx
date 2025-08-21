import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../api/api";

// Import React Icons
import { FaTag, FaUser, FaCalendar } from "react-icons/fa";

const SidebarWidget = () => {
  const [latestNews, setLatestNews] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchLatestNews = async () => {
      try {
        const res = await api.get("/", { params: { limit: 5 } });
        setLatestNews(res.data.data?.data || []);
      } catch (err) {
        console.error("Error fetching latest news:", err);
      }
    };

    const fetchCategories = async () => {
      try {
        const res = await api.get("/admin/category");
        setCategories(res.data || []);
      } catch (err) {
        console.error("Error fetching categories:", err);
      }
    };

    fetchLatestNews();
    fetchCategories();
  }, []);

  return (
    <div className="w-full space-y-6">
      {/* Search Box */}
      <div className="bg-light-mint rounded-2xl p-4 shadow-md">
        <h4 className="text-lg font-semibold text-deep-green mb-2">Search</h4>
        <form
          className="flex flex-col sm:flex-row gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            window.location.href = `/search?search=${encodeURIComponent(
              searchQuery
            )}`;
          }}
        >
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 px-3 py-2 rounded-lg border border-deep-green bg-white text-deep-green placeholder-muted-green focus:outline-none focus:ring-2 focus:ring-deep-green"
            placeholder="Search..."
          />
          <button
            type="submit"
            className="px-4 py-2 rounded-lg bg-deep-green text-white hover:bg-muted-green transition"
          >
            Search
          </button>
        </form>
      </div>

      {/* Recent Posts */}
      <div className="bg-pale-yellow rounded-2xl p-4 shadow-md space-y-4">
        <h4 className="text-lg font-semibold text-deep-green mb-2">
          Recent Posts
        </h4>
        {latestNews.length > 0 ? (
          latestNews.map((news) => {
            const date = new Date(news.createdAt);
            return (
              <div
                key={news._id}
                className="flex flex-col sm:flex-row gap-3 border-b border-light-mint pb-3 last:border-0"
              >
                <Link
                  className="sm:w-1/3 flex-shrink-0"
                  to={`/single/${news._id}`}
                >
                  <img
                    src={`http://localhost:3000/uploads/${news.image}`}
                    alt={news.title}
                    className="w-full h-24 object-cover rounded-lg"
                  />
                </Link>
                <div className="flex-1 flex flex-col justify-between">
                  <h5 className="font-medium text-deep-green">
                    <Link
                      to={`/single/${news._id}`}
                      className="hover:text-muted-green transition"
                    >
                      {news.title}
                    </Link>
                  </h5>

                  {/* Category, Author, Date with React Icons */}
                  <div className="text-sm text-muted-green flex flex-wrap gap-2">
                    {news.category && (
                      <span className="flex items-center gap-1">
                        <FaTag className="text-deep-green w-3 h-3" />
                        <Link
                          to={`/category/${news.category._id}`}
                          className="hover:text-deep-green transition"
                        >
                          {news.category.name}
                        </Link>
                      </span>
                    )}
                    {news.author && (
                      <span className="flex items-center gap-1">
                        <FaUser className="text-deep-green w-3 h-3" />
                        <Link
                          to={`/author/${news.author._id}`}
                          className="hover:text-deep-green transition"
                        >
                          {news.author.fullname}
                        </Link>
                      </span>
                    )}
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

                  <Link
                    to={`/single/${news._id}`}
                    className="mt-2 inline-block text-white bg-deep-green px-3 py-1 rounded-lg text-sm hover:bg-muted-green transition"
                  >
                    Read more
                  </Link>
                </div>
              </div>
            );
          })
        ) : (
          <p className="text-muted-green">No articles found.</p>
        )}
      </div>
    </div>
  );
};

export default SidebarWidget;
