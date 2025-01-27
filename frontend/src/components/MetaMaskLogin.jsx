// src/components/MetaMaskLogin.jsx

import React, { useState, useEffect } from "react";

export default function MetaMaskLogin() {
    const [account, setAccount] = useState(null);
    const [isConnected, setIsConnected] = useState(false);

    async function connectWallet() {
        if (window.ethereum) {
            try {
                const accounts = await window.ethereum.request({
                    method: "eth_requestAccounts",
                });
                setAccount(accounts[0]);
                setIsConnected(true);
            } catch (error) {
                console.error("User denied account access:", error);
            }
        } else {
            alert("MetaMask is not installed. Please install it to use this feature.");
        }
    }

    function disconnectWallet() {
        setAccount(null);
        setIsConnected(false);
    }

    useEffect(() => {
        if (window.ethereum) {
            function handleAccountsChanged(accounts) {
                if (accounts.length > 0) {
                    setAccount(accounts[0]);
                    setIsConnected(true);
                } else {
                    setAccount(null);
                    setIsConnected(false);
                }
            }

            window.ethereum.on("accountsChanged", handleAccountsChanged);
            window.ethereum.on("disconnect", disconnectWallet);

            return () => {
                if (window.ethereum.removeListener) {
                    window.ethereum.removeListener("accountsChanged", handleAccountsChanged);
                    window.ethereum.removeListener("disconnect", disconnectWallet);
                }
            };
        }
    }, []);

    return (
        <div className="flex items-center space-x-2">
            {isConnected ? (
                <>
                    <div className="text-sm font-medium text-gray-700">
                        {account
                            ? `Connected: ${account.slice(0, 6)}...${account.slice(-4)}`
                            : "Connected"}
                    </div>
                    <button
                        onClick={disconnectWallet}
                        className="px-3 py-1 bg-gray-600 text-white text-sm rounded hover:bg-gray-700 transition-colors"
                    >
                        Disconnect
                    </button>
                </>
            ) : (
                <button
                    onClick={connectWallet}
                    className="px-4 py-2 bg-gray-600 text-white text-sm font-medium rounded hover:bg-gray-700 transition-colors"
                >
                    Connect MetaMask
                </button>
            )}
        </div>
    );
}
