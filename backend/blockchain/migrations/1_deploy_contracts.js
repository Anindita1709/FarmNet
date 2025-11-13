/*import { web3, account } from "../config/network.js";
import fs from "fs";
import path from "path";

// Load compiled contract JSON
const loadJSON = (filename) => {
  const filePath = path.resolve("./contracts", filename);
  return JSON.parse(fs.readFileSync(filePath, "utf-8"));
};

//const FarmerMarket = loadJSON("FarmerMarket.json");
//const ProductTracking = loadJSON("ProductTracking.json");

const FarmerMarket = loadJSON(
  "./artifacts/contracts/FarmerMarket.sol/FarmerMarket.json"
);
const ProductTracking = loadJSON(
  "./artifacts/contracts/ProductTracking.sol/ProductTracking.json"
);
async function deploy() {
  console.log("🚀 Deploying contracts from:", account.address);

  // Deploy FarmerMarket
  const FarmerMarketContract = new web3.eth.Contract(FarmerMarket.abi);
  const farmerMarket = await FarmerMarketContract.deploy({
    data: FarmerMarket.bytecode
  }).send({ from: account.address, gas: 3000000 });

  // Deploy ProductTracking
  const ProductTrackingContract = new web3.eth.Contract(ProductTracking.abi);
  const productTracking = await ProductTrackingContract.deploy({
    data: ProductTracking.bytecode
  }).send({ from: account.address, gas: 3000000 });

  console.log("✅ FarmerMarket deployed at:", farmerMarket.options.address);
  console.log("✅ ProductTracking deployed at:", productTracking.options.address);

  // Save deployed addresses
  fs.writeFileSync(
    "./deployedContracts.json",
    JSON.stringify(
      {
        FarmerMarket: farmerMarket.options.address,
        ProductTracking: productTracking.options.address
      },
      null,
      2
    )
  );
}

deploy().catch((err) => {
  console.error("❌ Deployment failed:", err);
});
*/

import hre from "hardhat";

async function main() {
  const FarmerMarket = await hre.ethers.getContractFactory("FarmerMarket");
  const farmerMarket = await FarmerMarket.deploy();
  await farmerMarket.waitForDeployment();
  console.log("✅ FarmerMarket deployed to:", await farmerMarket.getAddress());

  const ProductTracking = await hre.ethers.getContractFactory("ProductTracking");
  const productTracking = await ProductTracking.deploy();
  await productTracking.waitForDeployment();
  console.log("✅ ProductTracking deployed to:", await productTracking.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
