// src/components/ContractDetail.jsx

import React from "react";

export default function ContractDetail({ contractData, onClose }) {
    if (!contractData) return null;

    const {
        contractAddress,
        blockNumber,
        txHash,
        status,
        borrowerName,
        borrowerPhone,
        borrowerEmail,
        borrowerPhysicalAddress,
        loanAmount,
        loanType,
        loanDesiredTimeline,
    } = contractData;

    return (
        <div className="mt-6 w-full p-6 border border-gray-300 rounded-lg shadow-md bg-white">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-800">Contract Details</h2>
                <button
                    onClick={onClose}
                    className="px-3 py-1 bg-gray-600 text-white text-sm rounded hover:bg-gray-700 transition-colors"
                >
                    Close
                </button>
            </div>

            <p className="text-sm text-gray-600 mb-4 break-all">
                Contract Address: {contractAddress}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
                <div>
                    <h3 className="font-semibold mb-2">Block Info</h3>
                    <p>Block Number: {blockNumber}</p>
                    <p className="break-all">Tx Hash: {txHash}</p>
                    <p>Status: {status}</p>
                </div>

                <div>
                    <h3 className="font-semibold mb-2">Borrower</h3>
                    <p>Name: {borrowerName}</p>
                    <p>Phone: {borrowerPhone}</p>
                    <p>Email: {borrowerEmail}</p>
                    <p>Address: {borrowerPhysicalAddress}</p>
                </div>

                <div>
                    <h3 className="font-semibold mb-2">Loan</h3>
                    <p>Amount: {loanAmount ? loanAmount.toString() : "100,000,000"}</p>
                    <p>Type: {loanType}</p>
                    <p>Desired Timeline (Unix): {loanDesiredTimeline}</p>
                </div>
            </div>
        </div>
    );
}
