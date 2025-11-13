// hardhat.config.js
import "@nomicfoundation/hardhat-toolbox";
import 'dotenv/config';

const config = {
  solidity: "0.8.20",
  networks: {
    sepolia: {
      url: process.env.RPC_URL, // Infura/Alchemy Sepolia URL
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
    },
    localhost: {
      url: "http://127.0.0.1:8545",
    },
  },
};

export default config;
