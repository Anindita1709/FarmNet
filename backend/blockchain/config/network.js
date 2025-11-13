import dotenv from "dotenv";
import Web3 from "web3";

dotenv.config();

// Load RPC URL and Private Key from .env
const NETWORK_URL = process.env.RPC_URL || "https://rpc-mumbai.maticvigil.com";
let PRIVATE_KEY = process.env.PRIVATE_KEY;

// Basic validation
if (!NETWORK_URL || !PRIVATE_KEY) {
  console.error("❌ Missing RPC_URL or PRIVATE_KEY in .env");
  process.exit(1);
}

// Ensure private key starts with 0x
if (!PRIVATE_KEY.startsWith("0x")) {
  PRIVATE_KEY = "0x" + PRIVATE_KEY;
}

// Initialize Web3
const web3 = new Web3(new Web3.providers.HttpProvider(NETWORK_URL));

let account;
try {
  account = web3.eth.accounts.wallet.add(PRIVATE_KEY);
  console.log("✅ Account loaded:", account.address);
} catch (err) {
  console.error("❌ Failed to load account. Check PRIVATE_KEY.");
  console.error(err.message);
  process.exit(1);
}

// Export separately for cleaner imports
export { web3, account };
