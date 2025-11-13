import Web3 from "web3";
import FarmNetOrderABI from "../contracts/FarmNetOrder.json";
import OrderVerifierABI from "../contracts/OrderVerifier.json";
import ProductTrackingABI from "../contracts/ProductTracking.json";
import deployedContracts from "../contracts/deployedContracts.json";

let web3;

// Initialize Web3
if (typeof window !== "undefined" && window.ethereum) {
  // Use MetaMask provider if available
  web3 = new Web3(window.ethereum);
  console.log("🦊 Connected using MetaMask provider");
} else {
  // Fallback to Sepolia RPC (from deployment)
  // Make sure you replace YOUR_API_KEY with your Alchemy/Infura key if needed
  /*
  web3 = new Web3(deployedContracts.NetworkRpc || "https://eth-sepolia.alchemyapi.io/v2/YOUR_API_KEY");
  */
  web3 = new Web3(deployedContracts.Network || "http://127.0.0.1:8545");
  console.log("🌐 Using fallback provider:", deployedContracts.NetworkRpc || "http://127.0.0.1:8545");
}

// Connect wallet (MetaMask)
export const connectWallet = async () => {
  if (window.ethereum) {
    try {
      const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
      console.log("🔗 Connected account:", accounts[0]);
      return accounts[0];
    } catch (err) {
      console.error("User denied account access", err);
      return null;
    }
  } else {
    alert("Please install MetaMask!");
    return null;
  }
};

// Contract instances
export const FarmNetOrderContract = new web3.eth.Contract(
  FarmNetOrderABI.abi,
  deployedContracts.FarmNetOrder
);

export const OrderVerifierContract = new web3.eth.Contract(
  OrderVerifierABI.abi,
  deployedContracts.OrderVerifier
);

export const ProductTrackingContract = new web3.eth.Contract(
  ProductTrackingABI.abi,
  deployedContracts.ProductTracking
);

// Get web3 instance
export const getWeb3 = () => web3;
