import dotenv from "dotenv";
import Web3 from "web3";
import fs from "fs";
import path from "path";

dotenv.config({ path: "./.env" });

const RPC_URL = process.env.RPC_URL;
let PRIVATE_KEY = process.env.PRIVATE_KEY;

if (!RPC_URL || !PRIVATE_KEY) {
  console.error("❌ Missing RPC_URL or PRIVATE_KEY in .env");
  process.exit(1);
}

if (!PRIVATE_KEY.startsWith("0x")) PRIVATE_KEY = "0x" + PRIVATE_KEY;

// ✅ Setup Web3 provider
const web3 = new Web3(new Web3.providers.HttpProvider(RPC_URL));

// ✅ Load account
const account = web3.eth.accounts.privateKeyToAccount(PRIVATE_KEY);
web3.eth.accounts.wallet.add(account);
web3.eth.defaultAccount = account.address;

console.log("🚀 Deploying from:", account.address);

// ✅ Helper to load artifact JSON
const loadArtifact = (filePath) => {
  const fullPath = path.resolve(`./artifacts/contracts/${filePath}`);
  return JSON.parse(fs.readFileSync(fullPath, "utf8"));
};

// ✅ Load only from artifacts folder
const FarmNetOrder = loadArtifact("FarmNetOrder.sol/FarmNetOrder.json");
const OrderVerifier = loadArtifact("OrderVerifier.sol/OrderVerifier.json");
const ProductTracking = loadArtifact("ProductTracking.sol/ProductTracking.json");

async function deploy() {
  console.log("📦 Starting deployment...");

  // --- Deploy FarmNetOrder ---
  const FarmNetOrderContract = new web3.eth.Contract(FarmNetOrder.abi);
  const farmNetOrder = await FarmNetOrderContract.deploy({
    data: FarmNetOrder.bytecode,
  }).send({ from: account.address, gas: 3000000 });
  console.log("✅ FarmNetOrder deployed at:", farmNetOrder.options.address);

  // --- Deploy OrderVerifier ---
  const OrderVerifierContract = new web3.eth.Contract(OrderVerifier.abi);
  const orderVerifier = await OrderVerifierContract.deploy({
    data: OrderVerifier.bytecode,
  }).send({ from: account.address, gas: 3000000 });
  console.log("✅ OrderVerifier deployed at:", orderVerifier.options.address);

  // --- Deploy ProductTracking ---
  const ProductTrackingContract = new web3.eth.Contract(ProductTracking.abi);
  const productTracking = await ProductTrackingContract.deploy({
    data: ProductTracking.bytecode,
  }).send({ from: account.address, gas: 3000000 });
  console.log("✅ ProductTracking deployed at:", productTracking.options.address);

  // ✅ Save contract addresses for frontend
  const deployedAddresses = {
    FarmNetOrder: farmNetOrder.options.address,
    OrderVerifier: orderVerifier.options.address,
    ProductTracking: productTracking.options.address,
  };
  fs.writeFileSync("./deployedContracts.json", JSON.stringify(deployedAddresses, null, 2));

  console.log("💾 Addresses saved to deployedContracts.json");
}

deploy().catch((err) => console.error("❌ Deployment failed:", err));
