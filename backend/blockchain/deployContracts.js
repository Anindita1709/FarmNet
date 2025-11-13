/*
import dotenv from "dotenv";
import Web3 from "web3";
import fs from "fs";
import path from "path";

dotenv.config({ path: "./.env" });

let { RPC_URL, PRIVATE_KEY } = process.env;

// ------------------ Validation ------------------
if (!RPC_URL || !PRIVATE_KEY) {
  console.error("❌ Missing RPC_URL or PRIVATE_KEY in .env");
  process.exit(1);
}
if (!PRIVATE_KEY.startsWith("0x")) PRIVATE_KEY = "0x" + PRIVATE_KEY;

// ------------------ Setup ------------------
const web3 = new Web3(new Web3.providers.HttpProvider(RPC_URL));
const account = web3.eth.accounts.privateKeyToAccount(PRIVATE_KEY);
web3.eth.accounts.wallet.add(account);
web3.eth.defaultAccount = account.address;

console.log("✅ Account loaded:", account.address);

// ------------------ Helper ------------------
function loadJSON(filename) {
  const filePath = path.resolve("./artifacts/contracts", filename);
  if (!fs.existsSync(filePath)) {
    throw new Error(`❌ Missing: ${filePath}`);
  }
  return JSON.parse(fs.readFileSync(filePath, "utf-8"));
}

const FarmerMarket = loadJSON("FarmerMarket.sol/FarmerMarket.json");
const ProductTracking = loadJSON("ProductTracking.sol/ProductTracking.json");

// ------------------ Deploy ------------------
async function deploy() {
  const chainId = await web3.eth.getChainId();
  console.log(`🌐 Connected to chain: ${chainId}`);
  console.log("🚀 Deploying from:", account.address);

  // Deploy FarmerMarket
  const FarmerMarketContract = new web3.eth.Contract(FarmerMarket.abi);
  const gas1 = await FarmerMarketContract.deploy({ data: FarmerMarket.bytecode }).estimateGas();
  const farmerMarket = await FarmerMarketContract.deploy({
    data: FarmerMarket.bytecode,
  }).send({ from: account.address, gas: gas1 + 100000 });
  console.log("✅ FarmerMarket deployed at:", farmerMarket.options.address);

  // Deploy ProductTracking
  const ProductTrackingContract = new web3.eth.Contract(ProductTracking.abi);
  const gas2 = await ProductTrackingContract.deploy({ data: ProductTracking.bytecode }).estimateGas();
  const productTracking = await ProductTrackingContract.deploy({
    data: ProductTracking.bytecode,
  }).send({ from: account.address, gas: gas2 + 100000 });
  console.log("✅ ProductTracking deployed at:", productTracking.options.address);

  // Save addresses
  fs.writeFileSync(
    "./deployedContracts.json",
    JSON.stringify(
      {
        FarmerMarket: farmerMarket.options.address,
        ProductTracking: productTracking.options.address,
        Network: chainId,
      },
      null,
      2
    )
  );
  console.log("📁 Saved deployed addresses to deployedContracts.json");
}

deploy().catch((err) => console.error("❌ Deployment failed:", err));
*/

import dotenv from "dotenv";
import Web3 from "web3";
import fs from "fs";
import path from "path";

dotenv.config({ path: "./.env" });

let { RPC_URL, PRIVATE_KEY } = process.env;

// ------------------ Validation ------------------
if (!RPC_URL || !PRIVATE_KEY) {
  console.error("❌ Missing RPC_URL or PRIVATE_KEY in .env");
  process.exit(1);
}
if (!PRIVATE_KEY.startsWith("0x")) PRIVATE_KEY = "0x" + PRIVATE_KEY;

// ------------------ Setup ------------------
const web3 = new Web3(new Web3.providers.HttpProvider(RPC_URL));
const account = web3.eth.accounts.privateKeyToAccount(PRIVATE_KEY);
web3.eth.accounts.wallet.add(account);
web3.eth.defaultAccount = account.address;

console.log("✅ Account loaded:", account.address);

// ------------------ Helper ------------------
function loadJSON(contractName) {
  const filePath = path.resolve(`./artifacts/contracts/${contractName}.sol/${contractName}.json`);
  if (!fs.existsSync(filePath)) {
    throw new Error(`❌ Missing: ${filePath}`);
  }
  return JSON.parse(fs.readFileSync(filePath, "utf-8"));
}

// Load only existing contracts
const FarmNetOrder = loadJSON("FarmNetOrder");
const OrderVerifier = loadJSON("OrderVerifier");
const ProductTracking = loadJSON("ProductTracking");

// ------------------ Deploy ------------------
async function deploy() {
  const chainId = await web3.eth.getChainId();
  console.log(`🌐 Connected to chain: ${chainId}`);
  console.log("🚀 Deploying from:", account.address);

  const deployed = {};

  // Function to deploy any contract
  /*
  const deployContract = async (contractJSON, name) => {
    const contract = new web3.eth.Contract(contractJSON.abi);
    const gas = await contract.deploy({ data: contractJSON.bytecode }).estimateGas();
    const instance = await contract.deploy({ data: contractJSON.bytecode }).send({
      from: account.address,
      gas: gas + 100000,
    });
    console.log(`✅ ${name} deployed at:`, instance.options.address);
    deployed[name] = instance.options.address;
  };
  */
 const deployContract = async (contractJSON, name) => {
  const contract = new web3.eth.Contract(contractJSON.abi);
  const gas = await contract.deploy({ data: contractJSON.bytecode }).estimateGas();
  const gasLimit = Number(gas) + 100000; // convert BigInt
  const instance = await contract.deploy({ data: contractJSON.bytecode }).send({
    from: account.address,
    gas: gasLimit,
  });
  console.log(`✅ ${name} deployed at:`, instance.options.address);
  deployed[name] = instance.options.address;
};

  await deployContract(FarmNetOrder, "FarmNetOrder");
  await deployContract(OrderVerifier, "OrderVerifier");
  await deployContract(ProductTracking, "ProductTracking");

  // Save addresses (convert chainId to Number to avoid JSON BigInt error)
fs.writeFileSync(
  "./deployedContracts.json",
  JSON.stringify({ ...deployed, Network: Number(chainId) }, null, 2)
);
console.log("📁 Saved deployed addresses to deployedContracts.json");
}

deploy().catch((err) => console.error("❌ Deployment failed:", err));
