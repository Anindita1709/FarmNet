/*
import pkg from "hardhat";
const { ethers } = pkg;

async function main() {
  console.log("🚀 Deploying OrderVerifier contract...");

  const OrderVerifier = await ethers.getContractFactory("OrderVerifier");
  const orderVerifier = await OrderVerifier.deploy();

  await orderVerifier.waitForDeployment();
  console.log("✅ Contract deployed successfully!");
  console.log("📜 Contract address:", await orderVerifier.getAddress());
}

main().catch((error) => {
  console.error("❌ Deployment failed:", error);
  process.exitCode = 1;
});
*/
// SPDX-License-Identifier: MIT

import dotenv from "dotenv";
import Web3 from "web3";
import fs from "fs";
import path from "path";

dotenv.config({ path: "./.env" });

// 🔹 Load RPC URL & Private Key
const RPC_URL = process.env.RPC_URL;
let PRIVATE_KEY = process.env.PRIVATE_KEY;

if (!RPC_URL || !PRIVATE_KEY) {
  console.error("❌ Missing RPC_URL or PRIVATE_KEY in .env file");
  process.exit(1);
}

if (!PRIVATE_KEY.startsWith("0x")) PRIVATE_KEY = "0x" + PRIVATE_KEY;

// 🔹 Setup Web3 Provider
const web3 = new Web3(new Web3.providers.HttpProvider(RPC_URL));

// 🔹 Load Account
const account = web3.eth.accounts.privateKeyToAccount(PRIVATE_KEY);
web3.eth.accounts.wallet.add(account);
web3.eth.defaultAccount = account.address;

console.log("🚀 Deploying contracts using:", account.address);

// ✅ Helper to load compiled contract artifact
const loadArtifact = (filePath) => {
  const fullPath = path.resolve(`./artifacts/contracts/${filePath}`);
  return JSON.parse(fs.readFileSync(fullPath, "utf8"));
};

// ✅ Load compiled ABIs & bytecodes
const FarmNetOrder = loadArtifact("FarmNetOrder.sol/FarmNetOrder.json");
const OrderVerifier = loadArtifact("OrderVerifier.sol/OrderVerifier.json");
const ProductTracking = loadArtifact("ProductTracking.sol/ProductTracking.json");

async function deployContracts() {
  console.log("📦 Starting smart contract deployment...\n");

  // 1️⃣ Deploy FarmNetOrder
  console.log("🚀 Deploying FarmNetOrder...");
  const farmNetOrderInstance = await new web3.eth.Contract(FarmNetOrder.abi)
    .deploy({ data: FarmNetOrder.bytecode })
    .send({ from: account.address, gas: 3000000 });
  console.log("✅ FarmNetOrder deployed at:", farmNetOrderInstance.options.address);

  // 2️⃣ Deploy OrderVerifier
  console.log("\n🚀 Deploying OrderVerifier...");
  const orderVerifierInstance = await new web3.eth.Contract(OrderVerifier.abi)
    .deploy({ data: OrderVerifier.bytecode })
    .send({ from: account.address, gas: 3000000 });
  console.log("✅ OrderVerifier deployed at:", orderVerifierInstance.options.address);

  // 3️⃣ Deploy ProductTracking
  console.log("\n🚀 Deploying ProductTracking...");
  const productTrackingInstance = await new web3.eth.Contract(ProductTracking.abi)
    .deploy({ data: ProductTracking.bytecode })
    .send({ from: account.address, gas: 3000000 });
  console.log("✅ ProductTracking deployed at:", productTrackingInstance.options.address);

  // ✅ Save deployed contract addresses for frontend
  const deployedAddresses = {
    FarmNetOrder: farmNetOrderInstance.options.address,
    OrderVerifier: orderVerifierInstance.options.address,
    ProductTracking: productTrackingInstance.options.address,
  };

  fs.writeFileSync("./deployedContracts.json", JSON.stringify(deployedAddresses, null, 2));
  console.log("\n💾 Contract addresses saved to deployedContracts.json ✅");
  
  try {
  fs.writeFileSync("../../frontend/src/contracts/deployedContracts.json", JSON.stringify(deployedAddresses, null, 2));
  console.log("\n💾 Contract addresses saved to:");
} catch (err) {
  console.warn("⚠️ Could not update frontend deployedContracts.json:", err.message);
}

  console.log("\n🎉 Deployment complete!");
}

// Run deployment
deployContracts().catch((err) => {
  console.error("❌ Deployment failed:", err);
});
// scripts/deploy.js
/*
import dotenv from "dotenv";
import Web3 from "web3";
import fs from "fs";
import path from "path";

dotenv.config({ path: "./.env" });

// 🔹 Load RPC URL & Private Key
const RPC_URL = process.env.RPC_URL;
let PRIVATE_KEY = process.env.PRIVATE_KEY;

if (!RPC_URL || !PRIVATE_KEY) {
  console.error("❌ Missing RPC_URL or PRIVATE_KEY in .env file");
  process.exit(1);
}

if (!PRIVATE_KEY.startsWith("0x")) PRIVATE_KEY = "0x" + PRIVATE_KEY;

// 🔹 Setup Web3 Provider
const web3 = new Web3(new Web3.providers.HttpProvider(RPC_URL));

// 🔹 Load Account
const account = web3.eth.accounts.privateKeyToAccount(PRIVATE_KEY);
web3.eth.accounts.wallet.add(account);
web3.eth.defaultAccount = account.address;

console.log("🚀 Deploying contracts using:", account.address);

// ✅ Helper: Load compiled contract artifact
function loadArtifact(relativePath) {
  const artifactPath = path.resolve(`./artifacts/contracts/${relativePath}`);
  if (!fs.existsSync(artifactPath)) {
    console.error(`❌ Artifact not found: ${artifactPath}`);
    process.exit(1);
  }
  return JSON.parse(fs.readFileSync(artifactPath, "utf8"));
}

// ✅ Load compiled ABIs & bytecodes
const FarmNetOrder = loadArtifact("FarmNetOrder.sol/FarmNetOrder.json");
const OrderVerifier = loadArtifact("OrderVerifier.sol/OrderVerifier.json");
const ProductTracking = loadArtifact("ProductTracking.sol/ProductTracking.json");

async function deployContracts() {
  console.log("\n📦 Starting smart contract deployment...\n");

  // 1️⃣ Deploy FarmNetOrder
  console.log("🚀 Deploying FarmNetOrder...");
  const farmNetOrder = await new web3.eth.Contract(FarmNetOrder.abi)
    .deploy({ data: FarmNetOrder.bytecode })
    .send({ from: account.address, gas: 3000000 });
  console.log("✅ FarmNetOrder deployed at:", farmNetOrder.options.address);

  // 2️⃣ Deploy OrderVerifier
  console.log("\n🚀 Deploying OrderVerifier...");
  const orderVerifier = await new web3.eth.Contract(OrderVerifier.abi)
    .deploy({ data: OrderVerifier.bytecode })
    .send({ from: account.address, gas: 3000000 });
  console.log("✅ OrderVerifier deployed at:", orderVerifier.options.address);

  // 3️⃣ Deploy ProductTracking
  console.log("\n🚀 Deploying ProductTracking...");
  const productTracking = await new web3.eth.Contract(ProductTracking.abi)
    .deploy({ data: ProductTracking.bytecode })
    .send({ from: account.address, gas: 3000000 });
  console.log("✅ ProductTracking deployed at:", productTracking.options.address);

  // ✅ Save deployed contract addresses for frontend
  const deployedContracts = {
    FarmNetOrder: farmNetOrder.options.address,
    OrderVerifier: orderVerifier.options.address,
    ProductTracking: productTracking.options.address,
  };

  // ✅ Write JSON inside frontend for direct import
  const frontendDir = path.resolve("./frontend/src/backend");
  if (!fs.existsSync(frontendDir)) fs.mkdirSync(frontendDir, { recursive: true });

  const outputPath = path.join(frontendDir, "deployedContracts.json");
  fs.writeFileSync(outputPath, JSON.stringify(deployedContracts, null, 2));

  console.log(`\n💾 Contract addresses saved to: ${outputPath}`);
  console.log("🎉 Deployment complete!\n");
}

// Run deployment
deployContracts().catch((err) => {
  console.error("❌ Deployment failed:", err);
});
*/