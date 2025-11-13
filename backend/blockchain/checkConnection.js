 import { ethers } from "ethers";
import dotenv from "dotenv";
dotenv.config();

const INFURA_API_KEY = process.env.INFURA_API_KEY;
const PRIVATE_KEY = process.env.PRIVATE_KEY;

// Connect to Sepolia testnet via Infura
const provider = new ethers.JsonRpcProvider(`https://sepolia.infura.io/v3/${INFURA_API_KEY}`);

// Create a wallet instance from private key
const wallet = new ethers.Wallet(PRIVATE_KEY, provider);

// Function to check connection
export const checkConnection = async () => {
  try {
    const network = await provider.getNetwork();
    console.log("✅ Connected to network:", network.name);
    console.log("💳 Wallet address:", wallet.address);

    const balance = await provider.getBalance(wallet.address);
    console.log("💰 Balance (ETH):", ethers.formatEther(balance));
  } catch (error) {
    console.error("❌ Error connecting to blockchain:", error);
  }
};

// Run directly if called from terminal
if (process.argv[1].includes("checkConnection.js")) {
  checkConnection();
}
