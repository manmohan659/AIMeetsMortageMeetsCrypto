// src/components/BlockchainExplorer.jsx

import React, { useState, useEffect } from "react";
import Web3 from "web3";
import { Card, CardContent } from "./ui/card";
import BlockSlider from "./BlockSlider";
import BlockList from "./BlockList";
import ContractTable from "./ContractTable";
import ContractDetail from "./ContractDetail";

// Extended ABI for your Mortgage Loan contract with the additional getters
// If you change your contract, ensure this ABI stays in sync.
const FULL_LOAN_ABI = [
    {
        inputs: [],
        name: "status",
        outputs: [{ internalType: "uint8", name: "", type: "uint8" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "getBorrowerName",
        outputs: [{ internalType: "string", name: "", type: "string" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "getBorrowerPhone",
        outputs: [{ internalType: "string", name: "", type: "string" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "getBorrowerEmail",
        outputs: [{ internalType: "string", name: "", type: "string" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "getBorrowerPhysicalAddress",
        outputs: [{ internalType: "string", name: "", type: "string" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "getLoanAmount",
        outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "getLoanType",
        outputs: [{ internalType: "string", name: "", type: "string" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "getLoanDesiredTimeline",
        outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
        stateMutability: "view",
        type: "function",
    },
];

// Minimal ABI (just for scanning for 'status'), if you still want it:
const LOAN_ABI_MINIMAL = [
    {
        constant: true,
        inputs: [],
        name: "status",
        outputs: [{ name: "", type: "uint8" }],
        payable: false,
        stateMutability: "view",
        type: "function",
    },
];

// Helper to map numeric status to readable text
function parseLoanStatus(statusValue) {
    const s = parseInt(statusValue, 10);
    switch (s) {
        case 0:
            return "Pending";
        case 1:
            return "Approved";
        case 2:
            return "Rejected";
        case 3:
            return "Repaid";
        default:
            return "Unknown";
    }
}

export default function BlockchainExplorer() {
    const [blocks, setBlocks] = useState([]);
    const [selectedBlock, setSelectedBlock] = useState(null);
    const [contracts, setContracts] = useState([]);

    // For slider
    const [sliderValue, setSliderValue] = useState(0);
    const numberOfBlocksToShow = 5;

    // For contract detail
    const [selectedContractDetails, setSelectedContractDetails] = useState(null);

    useEffect(() => {
        loadBlockchainData();
    }, []);

    const loadBlockchainData = async () => {
        try {
            const web3 = new Web3("http://localhost:7545");
            const latestBlockNumber = await web3.eth.getBlockNumber();

            const blockData = [];
            const tempContracts = [];

            // Fetch the last 20 blocks
            for (
                let i = Number(latestBlockNumber);
                i >= Math.max(0, Number(latestBlockNumber) - 20);
                i--
            ) {
                const block = await web3.eth.getBlock(i, true);
                if (!block) continue;

                const blockNumber = Number(block.number);
                const gasUsed = Number(block.gasUsed);
                const gasLimit = Number(block.gasLimit);
                const timestamp = Number(block.timestamp);

                const contractTxs = [];

                // Check each transaction in the block
                for (let tx of block.transactions) {
                    if (!tx.to) {
                        const receipt = await web3.eth.getTransactionReceipt(tx.hash);
                        if (receipt && receipt.contractAddress) {
                            contractTxs.push({
                                ...tx,
                                contractAddress: receipt.contractAddress,
                            });

                            // Attempt to read 'status' if code is present
                            try {
                                const code = await web3.eth.getCode(receipt.contractAddress);
                                if (code && code !== "0x") {
                                    const instance = new web3.eth.Contract(
                                        LOAN_ABI_MINIMAL,
                                        receipt.contractAddress
                                    );
                                    const rawStatus = await instance.methods.status().call();
                                    const statusText = parseLoanStatus(rawStatus);

                                    tempContracts.push({
                                        blockNumber,
                                        txHash: tx.hash,
                                        contractAddress: receipt.contractAddress,
                                        status: statusText,
                                    });
                                }
                            } catch (err) {
                                console.error("Error reading contract status:", err);
                            }
                        }
                    }
                }

                blockData.push({
                    number: blockNumber,
                    hash: block.hash,
                    gasUsed,
                    gasLimit,
                    timestamp,
                    transactions: block.transactions,
                    contractTxs,
                });
            }

            // Earliest block at the top
            setBlocks(blockData.reverse());
            setContracts(tempContracts);
        } catch (error) {
            console.error("Error loading blockchain data:", error);
        }
    };

    const handleBlockClick = (block) => {
        setSelectedBlock(block);
    };

    // When the user clicks on a row in the Contract Table:
    const handleContractClick = async (contractObj) => {
        const { contractAddress, blockNumber, txHash, status } = contractObj;

        // fetch extended details from the chain
        try {
            const web3 = new Web3("http://localhost:7545");
            const instance = new web3.eth.Contract(FULL_LOAN_ABI, contractAddress);

            // read each field
            const borrowerName = await instance.methods.getBorrowerName().call();
            const borrowerPhone = await instance.methods.getBorrowerPhone().call();
            const borrowerEmail = await instance.methods.getBorrowerEmail().call();
            const borrowerPhysicalAddress =
                await instance.methods.getBorrowerPhysicalAddress().call();

            const loanAmount = await instance.methods.getLoanAmount().call();
            const loanType = await instance.methods.getLoanType().call();
            const loanDesiredTimeline =
                await instance.methods.getLoanDesiredTimeline().call();

            const details = {
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
            };

            setSelectedContractDetails(details);
        } catch (err) {
            console.error("Error fetching contract details:", err);
        }
    };

    // Hide/close the detail panel
    const handleCloseDetail = () => {
        setSelectedContractDetails(null);
    };

    return (
        <div className="p-8 min-h-screen flex flex-col items-center bg-gray-50">
            <Card className="w-full max-w-6xl shadow-md border border-gray-300 rounded-lg p-8 bg-white">
                <CardContent className="flex flex-col items-center">
                    <h1 className="text-2xl font-bold mb-8 text-center text-gray-800">
                        Blockchain Explorer &amp; Contracts
                    </h1>

                    {/* TOP SECTION: Block slider */}
                    <BlockSlider
                        blocks={blocks}
                        sliderValue={sliderValue}
                        setSliderValue={setSliderValue}
                        numberOfBlocksToShow={numberOfBlocksToShow}
                        handleBlockClick={handleBlockClick}
                        selectedBlock={selectedBlock}
                    />

                    {/* MIDDLE SECTION: Block list */}
                    <BlockList blocks={blocks} handleBlockClick={handleBlockClick} />

                    {/* BOTTOM SECTION: Contract table (grouped by status) */}
                    <ContractTable
                        contracts={contracts}
                        onContractClick={handleContractClick}
                    />

                    {/* NEW: Contract Detail panel (shown if selectedContractDetails is not null) */}
                    {selectedContractDetails && (
                        <ContractDetail
                            contractData={selectedContractDetails}
                            onClose={handleCloseDetail}
                        />
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
