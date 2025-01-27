// src/components/ContractTable.jsx

import React, { useState } from "react";
import { Card, CardContent } from "./ui/card";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function ContractTable({ contracts, onContractClick }) {
    const [currentPage, setCurrentPage] = useState(1);
    const contractsPerPage = 5;

    // Group contracts by status
    const groupedByStatus = contracts.reduce((acc, c) => {
        if (!acc[c.status]) acc[c.status] = [];
        acc[c.status].push(c);
        return acc;
    }, {});

    return (
        <Card className="w-full mt-6 bg-white border border-gray-300 rounded-lg shadow-sm">
            <CardContent className="p-4">
                <h2 className="text-xl font-semibold mb-4 text-center text-gray-800">
                    All Contracts
                </h2>

                {Object.keys(groupedByStatus).length === 0 ? (
                    <p className="text-sm text-gray-600 text-center">
                        No contracts found.
                    </p>
                ) : (
                    Object.entries(groupedByStatus).map(([status, items]) => {
                        // Pagination for each status group
                        const indexOfLastContract = currentPage * contractsPerPage;
                        const indexOfFirstContract = indexOfLastContract - contractsPerPage;
                        const currentContracts = items.slice(
                            indexOfFirstContract,
                            indexOfLastContract
                        );
                        const totalPages = Math.ceil(items.length / contractsPerPage);

                        return (
                            <div key={status} className="mb-6">
                                <h3 className="text-lg font-medium mb-2 text-center text-gray-700">
                                    {status} ({items.length})
                                </h3>
                                <div className="overflow-x-auto">
                                    <table className="min-w-full border-collapse text-sm">
                                        <thead>
                                        <tr className="border-b border-gray-200 bg-gray-100">
                                            <th className="py-2 px-3 text-left font-medium text-gray-700">
                                                Contract Address
                                            </th>
                                            <th className="py-2 px-3 text-left font-medium text-gray-700">
                                                Block
                                            </th>
                                            <th className="py-2 px-3 text-left font-medium text-gray-700">
                                                Tx Hash
                                            </th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {currentContracts.map((c) => (
                                            <tr
                                                key={c.txHash}
                                                className="border-b border-gray-200 cursor-pointer hover:bg-gray-50 transition-colors"
                                                onClick={() => onContractClick(c)}
                                            >
                                                <td className="py-2 px-3 break-all text-gray-700">
                                                    {c.contractAddress}
                                                </td>
                                                <td className="py-2 px-3 text-gray-700">
                                                    {c.blockNumber}
                                                </td>
                                                <td className="py-2 px-3 break-all text-gray-700">
                                                    {c.txHash}
                                                </td>
                                            </tr>
                                        ))}
                                        </tbody>
                                    </table>
                                </div>

                                {/* Pagination Controls */}
                                <div className="flex items-center justify-center mt-3 space-x-2">
                                    <button
                                        onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                                        disabled={currentPage === 1}
                                        className="p-2 text-gray-700 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
                                    >
                                        <ChevronLeft className="h-4 w-4" />
                                    </button>

                                    <span className="text-xs text-gray-600">
                    Page {currentPage} of {totalPages}
                  </span>

                                    <button
                                        onClick={() =>
                                            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                                        }
                                        disabled={currentPage === totalPages}
                                        className="p-2 text-gray-700 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
                                    >
                                        <ChevronRight className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>
                        );
                    })
                )}
            </CardContent>
        </Card>
    );
}
