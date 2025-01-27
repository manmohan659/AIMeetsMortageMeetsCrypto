// src/components/LoanForm.jsx

import React, { useState } from "react";
import { Card, CardContent, CardFooter } from "./ui/card";

export default function LoanForm() {
    const [showForm, setShowForm] = useState(false);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [deployStatus, setDeployStatus] = useState(null);

    const [formData, setFormData] = useState({
        fullName: "",
        loanAmount: "",
        loanType: "",
        expectedInterestRate: "",
        desiredDate: "",
        physicalAddress: "",
        mobileNumber: "",
        email: "",
        incomeBracket: "",
    });

    function handleChange(e) {
        setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    }

    function handleSubmit(e) {
        e.preventDefault();
        setShowForm(false);
        setShowConfirmModal(true);
    }

    async function handleAgree() {
        setShowConfirmModal(false);

        const payload = {
            contractName: "MortgageLoan",
            borrower: {
                name: formData.fullName,
                contact: {
                    phone: formData.mobileNumber,
                    email: formData.email,
                    physicalAddress: formData.physicalAddress,
                },
            },
            loanDetails: {
                loanAmount: formData.loanAmount,
                loanType: formData.loanType,
                desiredTimeline: formData.desiredDate,
                interestRate: formData.expectedInterestRate,
                incomeBracket: formData.incomeBracket,
            },
        };

        try {
            const response = await fetch("http://localhost:4000/auto-deploy", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                throw new Error("Deployment failed.");
            }

            const data = await response.json();
            setDeployStatus(`Contract deployed! Address: ${data.contractAddress}`);
        } catch (err) {
            console.error(err);
            setDeployStatus("Error: " + err.message);
        }
    }

    function handleCancelConfirm() {
        setShowConfirmModal(false);
        setShowForm(true);
    }

    return (
        <div className="relative z-[9999]">
            {deployStatus && (
                <div className="fixed top-4 right-4 p-4 bg-gray-600 text-white rounded-lg shadow-lg z-[11000] text-sm">
                    {deployStatus}
                </div>
            )}

            {!showForm ? (
                <button
                    onClick={() => setShowForm(true)}
                    className="px-4 py-2 bg-gray-600 text-white text-sm font-medium rounded hover:bg-gray-700 transition-colors"
                >
                    Apply for Mortgage
                </button>
            ) : (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-[10000]">
                    <Card className="w-full max-w-2xl bg-white rounded-xl shadow-2xl">
                        <div className="flex justify-between items-center p-6 border-b border-gray-200">
                            <h2 className="text-xl font-bold text-gray-800">
                                Mortgage Application
                            </h2>
                            <button
                                onClick={() => setShowForm(false)}
                                className="text-gray-500 hover:text-gray-700 text-2xl"
                            >
                                &times;
                            </button>
                        </div>

                        <CardContent className="p-6">
                            <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-6">
                                <div className="col-span-2 lg:col-span-1">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Full Name
                                    </label>
                                    <input
                                        type="text"
                                        name="fullName"
                                        value={formData.fullName}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-gray-400 text-sm"
                                        required
                                    />
                                </div>

                                <div className="col-span-2 lg:col-span-1">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Loan Amount
                                    </label>
                                    <input
                                        type="number"
                                        name="loanAmount"
                                        value={formData.loanAmount}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-gray-400 text-sm"
                                        required
                                    />
                                </div>

                                <div className="col-span-2 lg:col-span-1">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Loan Type
                                    </label>
                                    <input
                                        type="text"
                                        name="loanType"
                                        value={formData.loanType}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-gray-400 text-sm"
                                        required
                                    />
                                </div>

                                <div className="col-span-2 lg:col-span-1">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Expected Interest Rate
                                    </label>
                                    <input
                                        type="text"
                                        name="expectedInterestRate"
                                        value={formData.expectedInterestRate}
                                        onChange={handleChange}
                                        placeholder="e.g. 5.5%"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-gray-400 text-sm"
                                        required
                                    />
                                </div>

                                <div className="col-span-2 lg:col-span-1">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Desired Date
                                    </label>
                                    <input
                                        type="date"
                                        name="desiredDate"
                                        value={formData.desiredDate}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-gray-400 text-sm"
                                    />
                                </div>

                                <div className="col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Physical Address
                                    </label>
                                    <input
                                        type="text"
                                        name="physicalAddress"
                                        value={formData.physicalAddress}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-gray-400 text-sm"
                                        required
                                    />
                                </div>

                                <div className="col-span-2 lg:col-span-1">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Mobile Number
                                    </label>
                                    <input
                                        type="tel"
                                        name="mobileNumber"
                                        value={formData.mobileNumber}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-gray-400 text-sm"
                                        required
                                    />
                                </div>

                                <div className="col-span-2 lg:col-span-1">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Email
                                    </label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-gray-400 text-sm"
                                        required
                                    />
                                </div>

                                <div className="col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Income Bracket
                                    </label>
                                    <select
                                        name="incomeBracket"
                                        value={formData.incomeBracket}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-gray-400 text-sm"
                                        required
                                    >
                                        <option value="">Select Income Bracket...</option>
                                        <option value="low">Low (Below $40,000)</option>
                                        <option value="middle">$40k - $120k</option>
                                        <option value="high">Above $120k</option>
                                    </select>
                                </div>
                            </form>
                        </CardContent>

                        <CardFooter className="flex justify-end gap-4 p-6 border-t border-gray-200 bg-gray-50">
                            <button
                                onClick={() => setShowForm(false)}
                                className="px-4 py-2 bg-gray-200 text-gray-700 text-sm rounded hover:bg-gray-300 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSubmit}
                                className="px-4 py-2 bg-gray-600 text-white text-sm font-medium rounded hover:bg-gray-700 transition-colors"
                            >
                                Submit Application
                            </button>
                        </CardFooter>

                        {deployStatus && (
                            <div className="p-4 bg-gray-50 border-t border-gray-200">
                                <p className="text-sm text-gray-700">{deployStatus}</p>
                            </div>
                        )}
                    </Card>
                </div>
            )}

            {showConfirmModal && (
                <div className="fixed inset-0 flex items-center justify-center z-[11000] bg-black bg-opacity-50">
                    <div className="bg-white p-6 rounded shadow-md w-80">
                        <h2 className="text-lg font-bold mb-4 text-gray-800">
                            Confirm Submission
                        </h2>
                        <p className="text-sm text-gray-700 mb-6">
                            By clicking "Agree," your loan request will be sent for contract
                            generation and deployment.
                        </p>
                        <div className="flex justify-end space-x-4">
                            <button
                                onClick={handleCancelConfirm}
                                className="px-4 py-2 text-sm bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleAgree}
                                className="px-4 py-2 text-sm bg-gray-600 text-white rounded hover:bg-gray-700"
                            >
                                Agree
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
