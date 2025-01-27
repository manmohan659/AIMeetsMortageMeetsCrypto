# Loan Exchange Platform

A blockchain-powered loan exchange platform that enhances efficiency and transparency in the lending process. It connects borrowers and lenders seamlessly through smart contracts deployed on the blockchain.

## Features

- **Decentralized Loan Exchange:** Borrowers can submit loan applications, and lenders can easily find investment opportunities.
- **Smart Contract Automation:** Loan agreements are automatically verified and deployed on the blockchain.
- **Blockchain Explorer:** View recent blocks, transactions, and contract details in an intuitive interface.
- **MetaMask Integration:** Secure login and transactions using MetaMask wallet.
- **User-Friendly UI:** A responsive and accessible interface for borrowers and lenders.

## Tech Stack

- **Frontend:** React, TailwindCSS
- **Backend:** Node.js (for contract deployment)
- **Blockchain:** Ethereum (via Web3.js)
- **UI Components:** ShadCN, Lucide-React

## Project Structure

```
src/
│-- components/
│   │-- TitleBar.jsx          # Application header with MetaMask login and Loan form
│   │-- BlockchainExplorer.jsx # Main blockchain data explorer component
│   │-- BlockSlider.jsx        # Block slider for quick navigation
│   │-- BlockList.jsx          # Paginated list of blocks
│   │-- ContractTable.jsx      # Displays deployed loan contracts
│   │-- ContractDetail.jsx     # Detailed view of a selected contract
│   │-- LoanForm.jsx           # Loan application form for borrowers
│   │-- MetaMaskLogin.jsx      # MetaMask wallet connection component
│-- App.jsx                    # Main app component
│-- main.jsx                    # Entry point
│-- index.css                   # Global styles
```

## Getting Started

### Prerequisites

Ensure you have the following installed:

- Node.js (v16+)
- MetaMask browser extension
- Ganache (or any Ethereum testnet)

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/loan-exchange.git
   cd loan-exchange
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the development server:

   ```bash
   npm run dev
   ```

4. Run a local Ethereum blockchain (e.g., Ganache) and update the blockchain provider in `BlockchainExplorer.jsx`:

   ```js
   const web3 = new Web3("http://localhost:7545");
   ```

5. Open the app in your browser:

   ```
   http://localhost:5173
   ```

## Usage

1. Connect your MetaMask wallet.
2. Apply for a loan through the form.
3. Track blockchain activity via the explorer.
4. View and manage loan contracts.

## Future Enhancements

- Implement interest rate calculations and repayment tracking.
- Add support for multiple loan types and terms.
- Improve contract management and borrower credit assessment.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request.

## License

This project is licensed under the MIT License.

---
