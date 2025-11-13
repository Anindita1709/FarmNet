import 'dotenv/config';
import Web3 from 'web3';

const web3 = new Web3(process.env.RPC_URL);
const acc = web3.eth.accounts.privateKeyToAccount(process.env.PRIVATE_KEY);
console.log("✅ Deployer address:", acc.address);
