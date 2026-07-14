"use client";

import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

export default function Pagination({ currentPage = 1, totalPages = 1, totalItems = 0, limit = 10, onPageChange, onLimitChange, }) {
    const handlePageChange = (page) => {
        if (page < 1 || page > totalPages || page === currentPage) return;
        onPageChange(page);
    };

    const getPages = () => {
        const pages = [];
        if (totalPages <= 5) {
            for (let i = 1; i <= totalPages; i++) pages.push(i);
            return pages;
        }

        if (currentPage > 2) {
            pages.push(1);
            if (currentPage > 3) pages.push("...");
        }

        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
            if (i > 0 && i <= totalPages) pages.push(i);
        }

        if (currentPage < totalPages - 1) {
            if (currentPage < totalPages - 2) pages.push("...");
            pages.push(totalPages);
        }

        return pages;
    };

    const startItem = totalItems === 0 ? 0 : (currentPage - 1) * limit + 1;
    const endItem = Math.min(currentPage * limit, totalItems);

    return (
        <div className="w-full px-2 py-1 my-2    flex flex-col md:flex-row items-center justify-between gap-3">

            <div className="text-sm text-gray-600">
                Showing{" "}
                <span className="font-semibold">{startItem}</span>–
                <span className="font-semibold">{endItem}</span> of{" "}
                <span className="font-semibold">{totalItems}</span>
            </div>

            <div className="flex items-center gap-1">

                <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-2 py-2 rounded-lg border border-gray-300 bg-white hover:bg-gray-100 disabled:opacity-40"
                >
                    <FiChevronLeft />
                </button>

                {getPages().map((page, index) =>
                    page === "..." ? (
                        <span key={`dots-${index}`} className="px-2 text-gray-400">
                            ...
                        </span>
                    ) : (
                        <button
                            key={page}
                            onClick={() => handlePageChange(page)}
                            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all
              ${currentPage === page
                                    ? "bg-gradient-to-r from-[#002B5B] to-blue-600 text-white shadow-md scale-105"
                                    : "bg-white border border-gray-300 hover:bg-gray-100"
                                }`}
                        >
                            {page}
                        </button>
                    )
                )}


                <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="px-2 py-2 rounded-lg border border-gray-300 bg-white hover:bg-gray-100 disabled:opacity-40"
                >
                    <FiChevronRight />
                </button>
            </div>


            <div className="flex items-center gap-2 text-sm">
                <span className="text-gray-500">Rows per page:</span>

                <select
                    value={limit}
                    onChange={(e) => {
                        const newLimit = Number(e.target.value);
                        onLimitChange(newLimit);
                        onPageChange(1);
                    }}
                    className="border border-gray-300 rounded px-2 py-1 bg-white focus:ring-2 focus:ring-blue-100"
                >
                    {[10, 15, 25, 50].map((size) => (
                        <option key={size} value={size}>
                            {size}
                        </option>
                    ))}
                </select>
            </div>
        </div>
    );
}