import Web3 from "web3";
import dotenv from "dotenv";

dotenv.config();

let web3;
let deployer;

export const getWeb3 = () => {
  if (!web3) {
    const RPC_URL = process.env.RPC_URL;
    if (!RPC_URL) throw new Error("Missing RPC_URL in .env");
    web3 = new Web3(new Web3.providers.HttpProvider(RPC_URL));
  }
  return web3;
};

export const getDeployer = () => {
  if (!deployer) {
    let PRIVATE_KEY = process.env.PRIVATE_KEY;
    if (!PRIVATE_KEY) throw new Error("Missing PRIVATE_KEY in .env");

    if (!PRIVATE_KEY.startsWith("0x")) PRIVATE_KEY = "0x" + PRIVATE_KEY;

    const web3Instance = getWeb3();
    deployer = web3Instance.eth.accounts.privateKeyToAccount(PRIVATE_KEY);
    web3Instance.eth.accounts.wallet.add(deployer);
    web3Instance.eth.defaultAccount = deployer.address;

    console.log(`🔗 Using Sepolia deployer: ${deployer.address}`);
  }
  return deployer;
};
