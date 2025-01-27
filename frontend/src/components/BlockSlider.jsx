// src/components/BlockSlider.jsx

import React from "react";
import { Card, CardContent } from "./ui/card";

export default function BlockSlider({
                                        blocks,
                                        handleBlockClick,
                                        selectedBlock,
                                    }) {
    return (
        <div className="w-full">
            <h2 className="text-xl font-semibold mb-3 text-center text-gray-800">
                Blockchain Timeline
            </h2>

            {/* Scrollable timeline */}
            <div className="overflow-x-auto">
                <div className="flex flex-row items-center space-x-4 p-4 min-w-max border border-gray-300 bg-gray-100 rounded-lg shadow-sm">
                    {blocks.map((block) => (
                        <div
                            key={block.number}
                            className="flex flex-col items-center cursor-pointer"
                            onClick={() => handleBlockClick(block)}
                        >
                            <div className="w-16 h-20 bg-white border border-gray-300 rounded-md flex items-end justify-center shadow-sm relative overflow-hidden">
                                <div
                                    className="absolute bottom-0 left-0 w-full bg-blue-400"
                                    style={{
                                        height:
                                            block.gasLimit > 0
                                                ? `${(block.gasUsed / block.gasLimit) * 100}%`
                                                : "0%",
                                    }}
                                ></div>
                            </div>
                            <p className="mt-1 text-xs text-gray-600">#{block.number}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Selected block details */}
            {selectedBlock && (
                <Card className="mt-4 border border-gray-200 rounded-lg shadow-sm bg-white">
                    <CardContent className="p-6">
                        <h3 className="text-xl font-semibold text-center text-gray-800 mb-4">
                            Block Details
                        </h3>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left text-gray-700">
                                <tbody>
                                <tr className="border-b last:border-b-0">
                                    <th className="py-2 pr-4 font-medium text-gray-900">Number:</th>
                                    <td className="py-2">{selectedBlock.number}</td>
                                </tr>
                                <tr className="border-b last:border-b-0">
                                    <th className="py-2 pr-4 font-medium text-gray-900">Hash:</th>
                                    <td className="py-2 break-all">{selectedBlock.hash}</td>
                                </tr>
                                <tr>
                                    <th className="py-2 pr-4 font-medium text-gray-900">Timestamp:</th>
                                    <td className="py-2">
                                        {new Date(Number(selectedBlock.timestamp) * 1000).toLocaleString()}
                                    </td>
                                </tr>
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
