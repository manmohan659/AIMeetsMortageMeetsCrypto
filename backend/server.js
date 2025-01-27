/*******************************************************
 * server.js
 *******************************************************/
const express = require('express');
const { Configuration, OpenAIApi } = require('openai');
const { exec } = require('child_process');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

// 1) Initialize Express
const app = express();
app.use(express.json());
app.use(cors());

// 2) Configure OpenAI
const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY, // Load your key from .env or set it here
});
const openai = new OpenAIApi(configuration);

/*******************************************************
 * (Optional) Hardcoded data for testing
 *******************************************************/
const loanData = { /* ... */ };
const loanData2 = { /* ... */ };

/**
 * Helper function to remove markdown fences (``` etc.)
 */
function stripMarkdownFences(text) {
    return text
        .replace(/```(\w+)?/g, '') // Remove ```solidity, ```js, etc.
        .replace(/```/g, '')
        .trim();
}

/**
 * Helper: Convert "YYYY-MM-DD" to Unix timestamp
 */
function dateToUnixTimestamp(dateString) {
    return Math.floor(new Date(dateString).getTime() / 1000);
}

// Test route
app.get('/test', (req, res) => {
    res.json({ message: 'Server is running!' });
});


/*******************************************************
 * 4) Generate & Deploy Route (ACTUAL DEPLOY)
 *******************************************************/
app.post('/auto-deploy', async (req, res) => {
    try {
        // *******************************
        // Use the user's POSTed data here
        // *******************************
        const { contractName, borrower, loanDetails } = req.body;

        // Convert user’s desired timeline to Unix timestamp
        const unixTimestamp = dateToUnixTimestamp(loanDetails.desiredTimeline);

        const prompt = `You are a highly skilled Solidity dev. Below is a base template for a "CustomMortgageLoan" contract:

"""
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract CustomMortgageLoan_1737937994398 {
    enum Status { Pending, Approved, Rejected, Repaid }
    Status public status;

    struct Contact {
        string phone;
        string email;
        string physicalAddress;
    }

    struct Borrower {
        string name;
        Contact contact;
    }

    struct Loan {
        uint256 amount;
        string loanType;
        uint256 desiredTimeline;
    }

    Borrower public borrower;
    Loan public loan;
    address public admin;

    constructor() {
        admin = msg.sender;
        borrower = Borrower({
            name: "Alice",
            contact: Contact({
                phone: "+1-777-888-9999",
                email: "alice@example.com",
                physicalAddress: "789 Main Street, Metropolis, NY, 10001"
            })
        });
        loan = Loan({
            amount: 500000,
            loanType: "Refinance Loan",
            desiredTimeline: 1792022400
        });
        status = Status.Pending;
    }

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can perform this action");
        _;
    }

    function approveLoan() public onlyAdmin {
        status = Status.Approved;
    }

    function rejectLoan() public onlyAdmin {
        status = Status.Rejected;
    }

    function repayLoan() public onlyAdmin {
        status = Status.Repaid;
    }

    function getBorrowerName() public view returns (string memory) {
        return borrower.name;
    }

    function getBorrowerPhone() public view returns (string memory) {
        return borrower.contact.phone;
    }

    function getBorrowerEmail() public view returns (string memory) {
        return borrower.contact.email;
    }

    function getBorrowerPhysicalAddress() public view returns (string memory) {
        return borrower.contact.physicalAddress;
    }

    function getLoanAmount() public view returns (uint256) {
        return loan.amount;
    }

    function getLoanType() public view returns (string memory) {
        return loan.loanType;
    }

    function getLoanDesiredTimeline() public view returns (uint256) {
        return loan.desiredTimeline;
    }
}
"""

Rewrite this entire contract as follows:
1. Rename the contract to "CustomMortgageLoan".
2. In the constructor, replace the hardcoded defaults with the following:
   - borrower.name -> "${borrower.name}"
   - borrower.contact.phone -> "${borrower.contact.phone}"
   - borrower.contact.email -> "${borrower.contact.email}"
   - borrower.contact.physicalAddress -> "${borrower.contact.physicalAddress}"
   - loan.amount -> ${loanDetails.loanAmount}
   - loan.loanType -> "${loanDetails.loanType}"
   - loan.desiredTimeline -> ${unixTimestamp}
3. Do NOT wrap your answer in triple backticks. 
4. Return ONLY the updated Solidity code, with no extra text or commentary.
`;


        const gptResponse = await openai.createChatCompletion({
            model: 'gpt-4',
            messages: [{ role: 'user', content: prompt }],
            temperature: 0
        });

        let solidityCode = gptResponse.data.choices[0].message.content.trim();
        solidityCode = stripMarkdownFences(solidityCode);

        // (B) Write .sol file with unique name
        const timestamp = Date.now();
        const uniqueContractName = `CustomMortgageLoan_${timestamp}`;
        const contractsDir = path.join(__dirname, 'contracts');

        if (!fs.existsSync(contractsDir)) {
            fs.mkdirSync(contractsDir, { recursive: true });
        }

        const solFileName = `${uniqueContractName}.sol`;
        const solFilePath = path.join(contractsDir, solFileName);

        // Replace "contract CustomMortgageLoan" with the new contract name
        const updatedCode = solidityCode.replace(
            /contract\s+CustomMortgageLoan\b/g,
            `contract ${uniqueContractName}`
        );

        fs.writeFileSync(solFilePath, updatedCode, 'utf-8');
        console.log(`[SERVER] Wrote new Solidity file: ${solFileName}`);

        // (C) Create migration file
        const migrationsDir = path.join(__dirname, 'migrations');
        if (!fs.existsSync(migrationsDir)) {
            fs.mkdirSync(migrationsDir, { recursive: true });
        }

        const migrationFileName = `${timestamp}_deploy_${uniqueContractName}.js`;
        const migrationFilePath = path.join(migrationsDir, migrationFileName);

        const migrationContent = `
const ${uniqueContractName} = artifacts.require("${uniqueContractName}");

module.exports = function (deployer) {
  deployer.deploy(${uniqueContractName});
};
`;
        fs.writeFileSync(migrationFilePath, migrationContent, 'utf-8');
        console.log(`[SERVER] Wrote new migration file: ${migrationFileName}`);

        // (D) Run truffle compile & migrate
        const truffleCmd = 'truffle compile && truffle migrate --reset --network development';
        exec(truffleCmd, { cwd: __dirname }, (err, stdout, stderr) => {
            if (err) {
                console.error('[SERVER] Deployment error:', stderr);
                return res.status(500).json({ error: 'Failed to compile or deploy contract' });
            }

            console.log('[SERVER] Truffle stdout:\n', stdout);

            // Attempt to parse contract address from logs
            const match = stdout.match(/contract address:\s+(0x[a-fA-F0-9]+)/);
            const contractAddress = match ? match[1] : null;

            if (!contractAddress) {
                return res.status(200).json({
                    contractAddress: '0x0000000000000000000000000000000000000000',
                    info: 'Contract deployed but no address found in logs.'
                });
            }

            return res.json({ contractAddress });
        });

    } catch (error) {
        console.error('[SERVER] Error in auto-deploy route:', error);
        return res.status(500).json({ error: error.message });
    }
});

// 5) Start Server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`[SERVER] Listening on port ${PORT}`);
});
