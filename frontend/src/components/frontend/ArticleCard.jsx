import React from "react";
import { Link } from "react-router-dom";

const ArticleCard = ({ article, excerptLength = 100 }) => {
  const date = article?.createdAt ? new Date(article.createdAt) : null;

  return (
    <div className="bg-bgCard rounded-lg shadow-md overflow-hidden md:flex flex-col md:flex-row">
      {/* Image */}
      <Link className="block md:w-1/3" to={`/single/${article._id}`}>
        <img
          src={
            article?.image
              ? `http://localhost:3000/uploads/${article.image}`
              : "/images/placeholder.jpg" // fallback image
          }
          alt={article?.title || "Article Image"}
          className="w-full h-48 md:h-full object-cover"
        />
      </Link>

      {/* Content */}
      <div className="p-4 md:w-2/3 flex flex-col justify-between">
        <div>
          <h3 className="text-xl font-bold mb-2">
            <Link
              to={`/single/${article._id}`}
              className="hover:text-accent transition"
            >
              {article?.title || "Untitled Article"}
            </Link>
          </h3>

          {/* Meta info */}
          <div className="text-sm mb-2 flex flex-wrap gap-4 text-gray-600">
            <span>
              <i className="fa fa-tags"></i>{" "}
              {article?.category ? (
                <Link
                  to={`/category/${article.category.slug}`}
                  className="hover:text-accent transition"
                >
                  {article.category.name}
                </Link>
              ) : (
                "Uncategorized"
              )}
            </span>

            <span>
              <i className="fa fa-user"></i>{" "}
              {article?.author ? (
                <Link
                  to={`/author/${article.author._id}`}
                  className="hover:text-accent transition"
                >
                  {article.author.fullname}
                </Link>
              ) : (
                "Anonymous"
              )}
            </span>

            <span>
              <i className="fa fa-calendar"></i>{" "}
              {date
                ? date.toLocaleDateString("en-US", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })
                : "No date"}
            </span>
          </div>

          {/* Excerpt */}
          <p className="mb-2">
            {article?.content
              ? article.content.substring(0, excerptLength) + "..."
              : "No content available."}
          </p>
        </div>

        {/* Read More */}
        <div className="mt-auto">
          <Link
            to={`/single/${article._id}`}
            className="inline-block mt-2 bg-accent text-white px-4 py-2 rounded hover:bg-textPrimary transition"
          >
            Read More
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ArticleCard;
