import React from "react";

const Pagination = ({ totalPages, currentPage, handlePageChange }) => (
  <div className="flex justify-center mt-8 space-x-2">
    <button
      className={`w-10 h-10 rounded-full ${
        currentPage === 1
          ? "bg-gray-300 cursor-not-allowed"
          : "bg-primary text-white hover:bg-hover-background"
      }`}
      disabled={currentPage <= 1}
      onClick={() => handlePageChange(currentPage - 1)}
    >
      &laquo;
    </button>
    {[...Array(totalPages)].map((_, index) => (
      <button
        key={index}
        className={`w-10 h-10 rounded-full ${
          currentPage === index + 1
            ? "bg-primary text-white hover:bg-hover-background"
            : "bg-gray-200 text-gray-700"
        }`}
        onClick={() => handlePageChange(index + 1)}
      >
        {index + 1}
      </button>
    ))}
    <button
      className={`w-10 h-10 rounded-full ${
        currentPage >= totalPages
          ? "bg-gray-300 cursor-not-allowed"
          : "bg-primary text-white hover:bg-hover-background"
      }`}
      disabled={currentPage >= totalPages}
      onClick={() => handlePageChange(currentPage + 1)}
    >
      &raquo;
    </button>
  </div>
);

export default Pagination;
