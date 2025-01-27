import React from "react";
import TitleBar from "./components/TitleBar.jsx";
import BlockchainExplorer from "./components/BlockchainExplorer.jsx";

export default function App() {
    return (
        <div className="min-h-screen bg-gray-100 flex flex-col">
            <TitleBar />
            <main className="flex-grow p-8">
                <BlockchainExplorer />
            </main>
        </div>
    );
}
