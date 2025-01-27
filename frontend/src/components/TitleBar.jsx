import React from "react";
import MetaMaskLogin from "./MetaMaskLogin";
import LoanForm from "./LoanForm";

export default function TitleBar() {
    return (
        <header className="w-full bg-gray-200 shadow-md px-6 py-4 flex flex-col items-center">
            <h1 className="text-4xl font-bold text-center text-gray-800">Loan Exchange</h1>
            <div className="mt-4 flex items-center space-x-4">
                <MetaMaskLogin />
                <LoanForm />
            </div>
        </header>
    );
}
