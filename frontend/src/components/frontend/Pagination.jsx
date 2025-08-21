import React from "react";
import { Link } from "react-router-dom";

const Pagination = ({ paginatedData, query }) => {
  if (!paginatedData) return null;

  const {
    currentPage,
    totalPages,
    hasPrevPage,
    hasNextPage,
    prevPage,
    nextPage,
    limit,
  } = paginatedData;

  // ✅ Build query string dynamically, keep existing params
  const buildQuery = (page) => {
    const params = new URLSearchParams(query || {});
    params.set("page", page);
    params.set("limit", limit || 10);
    return `?${params.toString()}`;
  };

  return (
    <nav className="mt-6 flex justify-center flex-wrap gap-2">
      {/* Previous Button */}
      <Link
        to={hasPrevPage ? buildQuery(prevPage) : "#"}
        className={`px-4 py-2 rounded-lg border transition ${
          hasPrevPage
            ? "bg-deep-green text-pale-yellow border-deep-green hover:bg-muted-green"
            : "bg-light-mint text-muted-green cursor-not-allowed opacity-60"
        }`}
      >
        Previous
      </Link>

      {/* Page Numbers */}
      {Array.from({ length: totalPages }, (_, i) => {
        const pageNum = i + 1;
        const isActive = currentPage === pageNum;
        return (
          <Link
            key={pageNum}
            to={buildQuery(pageNum)}
            className={`px-4 py-2 rounded-lg border transition ${
              isActive
                ? "bg-deep-green text-pale-yellow border-deep-green"
                : "bg-pale-yellow text-deep-green border-light-mint hover:bg-muted-green hover:text-pale-yellow"
            }`}
          >
            {pageNum}
          </Link>
        );
      })}

      {/* Next Button */}
      <Link
        to={hasNextPage ? buildQuery(nextPage) : "#"}
        className={`px-4 py-2 rounded-lg border transition ${
          hasNextPage
            ? "bg-deep-green text-pale-yellow border-deep-green hover:bg-muted-green"
            : "bg-light-mint text-muted-green cursor-not-allowed opacity-60"
        }`}
      >
        Next
      </Link>
    </nav>
  );
};

export default Pagination;
