import { getWeb3, getDeployer } from "./web3.service.js";
import fs from "fs";
import path from "path";

const CONTRACTS = {};

// -------------------- Load ABI JSON --------------------
const loadJSON = (filename) => {
  const filePath = path.resolve("./blockchain/artifacts/contracts", filename);

  return JSON.parse(fs.readFileSync(filePath, "utf-8"));
};
/*
const FarmerMarket = loadJSON(
  "./artifacts/contracts/FarmerMarket.sol/FarmerMarket.json"
);
const ProductTracking = loadJSON(
  "./artifacts/contracts/ProductTracking.sol/ProductTracking.json"
);
*/
// Load contract ABIs
const FarmNetOrder = loadJSON("FarmNetOrder.sol/FarmNetOrder.json");
const OrderVerifier = loadJSON("OrderVerifier.sol/OrderVerifier.json");
const ProductTracking = loadJSON("ProductTracking.sol/ProductTracking.json");
/*
export const initContracts = async () => {
  const web3 = getWeb3();
  const deployer = getDeployer();
  const farmerMarketAddress = process.env.FARMER_MARKET_ADDRESS;
  const productTrackingAddress = process.env.PRODUCT_TRACKING_ADDRESS;

  if (!farmerMarketAddress || !productTrackingAddress)
    throw new Error("Contract addresses missing from .env");

  CONTRACTS.FarmerMarket = new web3.eth.Contract(FarmerMarket.abi, farmerMarketAddress, {
    from: deployer.address
  });

  CONTRACTS.ProductTracking = new web3.eth.Contract(ProductTracking.abi, productTrackingAddress, {
    from: deployer.address
  });

  console.log("✅ Blockchain contracts initialized");
};
*/

export const initContracts = async () => {
  const web3 = getWeb3();
  const deployer = getDeployer();

  const farmNetOrderAddress = process.env.FARMER_MARKET_ADDRESS; // same env var used
  const orderVerifierAddress = process.env.ORDER_VERIFIER_ADDRESS;
  const productTrackingAddress = process.env.PRODUCT_TRACKING_ADDRESS;

  if (!farmNetOrderAddress || !orderVerifierAddress || !productTrackingAddress)
    throw new Error("⚠️ Missing one or more contract addresses in .env");

  CONTRACTS.FarmNetOrder = new web3.eth.Contract(FarmNetOrder.abi, farmNetOrderAddress, {
    from: deployer.address,
  });

  CONTRACTS.OrderVerifier = new web3.eth.Contract(OrderVerifier.abi, orderVerifierAddress, {
    from: deployer.address,
  });

  CONTRACTS.ProductTracking = new web3.eth.Contract(ProductTracking.abi, productTrackingAddress, {
    from: deployer.address,
  });

  console.log("✅ Blockchain contracts initialized successfully");
};

/*
export const addProduct = async (name, price) => {
  const contract = CONTRACTS.FarmerMarket;
  return contract.methods.addProduct(name, price).send();
};

export const buyProduct = async (productId, priceWei) => {
  const contract = CONTRACTS.FarmerMarket;
  return contract.methods.buyProduct(productId).send({ value: priceWei });
};

export const trackProduct = async (name, origin) => {
  const contract = CONTRACTS.ProductTracking;
  return contract.methods.registerProduct(name, origin).send();
};
*/
// -------------------- FarmerMarket Functions --------------------
export const addProduct = async (name, price) => {
  const { FarmerMarket } = CONTRACTS;
  const deployer = getDeployer();

  console.log("🟢 Adding product on blockchain...");
  const tx = await FarmerMarket.methods.addProduct(name, price).send({
    from: deployer.address,
  });
  console.log("✅ Product added:", tx.transactionHash);
  return tx;
};

export const buyProduct = async (productId, priceWei) => {
  const { FarmerMarket } = CONTRACTS;
  const deployer = getDeployer();

  console.log("🟢 Buying product on blockchain...");
  const tx = await FarmerMarket.methods.buyProduct(productId).send({
    from: deployer.address,
    value: priceWei,
  });
  console.log("✅ Product purchased:", tx.transactionHash);
  return tx;
};

// -------------------- ProductTracking Functions --------------------
export const trackProduct = async (name, origin) => {
  const { ProductTracking } = CONTRACTS;
  const deployer = getDeployer();

  console.log("🟢 Registering product on blockchain...");
  const tx = await ProductTracking.methods.registerProduct(name, origin).send({
    from: deployer.address,
  });
  console.log("✅ Product tracked:", tx.transactionHash);
  return tx;
};

// -------------------- 🧩 Add Blockchain Order --------------------
export const createBlockchainOrder = async (buyer, seller, productId, amount) => {
  const { FarmerMarket } = CONTRACTS;
  const deployer = getDeployer();
  const web3 = getWeb3();

  try {
    console.log("🟢 Creating order on blockchain...");

    // Ensure amount is in Wei (if it's not already)
    const amountWei = web3.utils.toWei(amount.toString(), "ether");

    // Send transaction
    const tx = await FarmerMarket.methods
      .createOrder(buyer, seller, productId, amountWei)
      .send({ from: deployer.address });

    // Check for event logs
    let orderId = null;
    if (tx.events && tx.events.OrderCreated && tx.events.OrderCreated.returnValues) {
      orderId = tx.events.OrderCreated.returnValues.orderId;
    }

    console.log("✅ Blockchain order created:", tx.transactionHash);

    return {
      txHash: tx.transactionHash,
      orderId,
    };
  } catch (error) {
    console.error("❌ Error creating blockchain order:", error);
    throw error;
  }
};

// -------------------- ⚙️ Auto-initialize when imported --------------------
(async () => {
  try {
    await initContracts(); // 🧩 ADD THIS
  } catch (err) {
    console.error("⚠️ Failed to initialize contracts:", err.message);
  }
})();
