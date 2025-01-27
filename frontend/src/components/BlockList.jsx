// src/components/BlockList.jsx

import React, { useState } from "react";
import { Card, CardContent } from "./ui/card";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function BlockList({ blocks, handleBlockClick }) {
    const [currentPage, setCurrentPage] = useState(1);
    const blocksPerPage = 5;

    // Calculate pagination
    const indexOfLastBlock = currentPage * blocksPerPage;
    const indexOfFirstBlock = indexOfLastBlock - blocksPerPage;
    const currentBlocks = blocks.slice(indexOfFirstBlock, indexOfLastBlock);
    const totalPages = Math.ceil(blocks.length / blocksPerPage);

    return (
        <div className="flex flex-col items-center w-full max-w-4xl mt-4">
            <h2 className="text-xl font-semibold mb-3 text-center text-gray-800">
                Block List
            </h2>

            {currentBlocks.map((block) => (
                <div key={block.number} className="flex items-center w-full mb-2">
                    <Card
                        className="w-full border border-gray-200 rounded-lg shadow-sm bg-white cursor-pointer hover:bg-gray-50 transition-colors"
                        onClick={() => handleBlockClick(block)}
                    >
                        <CardContent className="flex flex-row items-center justify-between w-full p-3">
                            <p className="text-sm font-medium text-gray-700">#{block.number}</p>
                            <p className="text-xs text-gray-600">
                                {block.hash.substring(0, 10)}...
                            </p>
                            <p className="text-xs text-gray-600">
                                Txns: {block.transactions.length}
                            </p>
                        </CardContent>
                    </Card>
                </div>
            ))}

            {/* Pagination Controls */}
            <div className="flex items-center justify-center mt-4 space-x-2">
                <button
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="p-2 text-gray-700 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
                >
                    <ChevronLeft className="h-5 w-5" />
                </button>

                <span className="text-sm text-gray-600">
          Page {currentPage} of {totalPages}
        </span>

                <button
                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="p-2 text-gray-700 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
                >
                    <ChevronRight className="h-5 w-5" />
                </button>
            </div>
        </div>
    );
}
