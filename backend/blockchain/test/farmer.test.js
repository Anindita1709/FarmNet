import { getWeb3, getDeployer } from "../services/web3.service.js";
import FarmerMarket from "../contracts/FarmerMarket.json" assert { type: "json" };

(async () => {
  const web3 = getWeb3();
  const deployer = getDeployer();

  const contract = new web3.eth.Contract(FarmerMarket.abi);
  const instance = await contract
    .deploy({ data: FarmerMarket.bytecode })
    .send({ from: deployer.address, gas: 3000000 });

  console.log("✅ Deployed test contract at:", instance.options.address);

  const tx = await instance.methods.addProduct("Tomatoes", web3.utils.toWei("0.01", "ether")).send({ from: deployer.address });
  console.log("🧾 Product added, tx:", tx.transactionHash);

  const product = await instance.methods.getProduct(1).call();
  console.log("🌾 Product #1:", product);
})();
