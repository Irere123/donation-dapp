# Web3 Donation dApp

A decentralized application built with Hardhat, Ethers.js, and React that allows users to send ETH donations to others on the Sepolia testnet.

## Features

- Connect to MetaMask wallet
- Send ETH donations to any Ethereum address
- Include personal messages with donations
- View donation history
- Modern UI with TailwindCSS

## Project Structure

```
├── contracts/           # Smart contracts
│   └── Donation.sol     # Main donation contract
├── scripts/             # Deployment scripts
│   └── deploy.js        # Script to deploy the contract
├── frontend/            # React frontend
│   ├── public/          # Static files
│   └── src/             # React source code
│       ├── components/  # React components
│       └── artifacts/   # Contract ABIs (generated after compilation)
├── hardhat.config.js    # Hardhat configuration
└── .env-example         # Example environment variables
```

## Prerequisites

- Node.js >= 14
- MetaMask browser extension
- Sepolia testnet ETH (can be obtained from a faucet)

## Setup Instructions

1. Clone the repository:
   ```
   git clone <repository-url>
   cd web3-donation-dapp
   ```

2. Install dependencies:
   ```
   npm install
   cd frontend
   npm install
   ```

3. Create a `.env` file in the root directory:
   ```
   cp .env-example .env
   ```

4. Add your private key and an Infura/Alchemy Sepolia RPC URL to the `.env` file:
   ```
   SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/YOUR_INFURA_PROJECT_ID
   PRIVATE_KEY=your_wallet_private_key
   ```

5. Compile the smart contracts:
   ```
   npx hardhat compile
   ```

6. Deploy to Sepolia testnet:
   ```
   npx hardhat run scripts/deploy.js --network sepolia
   ```

7. Update the contract address in `frontend/src/App.js`:
   ```javascript
   const contractAddress = 'DEPLOYED_CONTRACT_ADDRESS';
   ```

8. Start the React development server:
   ```
   cd frontend
   npm start
   ```

9. Open your browser and navigate to `http://localhost:3000`

## Using the dApp

1. Connect your MetaMask wallet (make sure it's on Sepolia testnet)
2. Enter the recipient's Ethereum address
3. Specify the amount of ETH to donate
4. Add an optional personal message
5. Click "Send Donation"
 