import React from "react";

interface PaginationProps {
  currentPage: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalItems,
  itemsPerPage,
  onPageChange,
}) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startPage = Math.max(1, currentPage - 2);
  const endPage = Math.min(totalPages, startPage + 3);

  const pages: JSX.Element[] = [];
  if (startPage > 1) {
    pages.push(
      <button
        key={1}
        onClick={() => onPageChange(1)}
        className={`${
          1 === currentPage
            ? "bg-primary-100 text-white"
            : "bg-white text-gray-500"
        } py-1 px-3 rounded-lg shadow-md`}
      >
        1
      </button>
    );
    if (startPage > 2) {
      pages.push(
        <span key="start-ellipsis" className="py-1 px-3">
          ...
        </span>
      );
    }
  }

  for (let i = startPage; i <= endPage; i++) {
    pages.push(
      <button
        key={i}
        onClick={() => onPageChange(i)}
        disabled={i === currentPage}
        className={`${
          i === currentPage
            ? "bg-primary-100 text-white"
            : "bg-white text-gray-500"
        } py-1 px-3 rounded-lg shadow-md`}
      >
        {i}
      </button>
    );
  }

  if (endPage < totalPages) {
    if (endPage < totalPages - 1) {
      pages.push(
        <span key="end-ellipsis" className="py-1 px-3">
          ...
        </span>
      );
    }
    pages.push(
      <button
        key={totalPages}
        onClick={() => onPageChange(totalPages)}
        className={`${
          totalPages === currentPage
            ? "bg-primary-100 text-white"
            : "bg-white text-gray-500"
        } py-1 px-3 rounded-lg shadow-md`}
      >
        {totalPages}
      </button>
    );
  }

  return (
    <div className="py-2 flex gap-x-2">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="bg-white py-2 px-4 rounded-lg shadow-md text-gray-500"
      >
        Prev
      </button>
      {pages}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="bg-white py-2 px-4 rounded-lg shadow-md text-gray-500"
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;
