
"use client";
import { toast } from "react-toastify";
import { useCart } from "@/context/CartContext";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { ethers } from "ethers";
import OrderVerifierABI from "../../../../../backend/blockchain/artifacts/contracts/OrderVerifier.sol/OrderVerifier.json";
import deployedContracts from "@/contracts/deployedContracts.json";
const CONTRACT_ADDRESS = deployedContracts.OrderVerifier;

import { run as getPrice } from "../../../utils/gemini.js"; // Gemini AI utility


//const CONTRACT_ADDRESS = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";
interface Product {
  _id: string;
  productName: string;
  sellerId: string;
  quantity?: number;
}

interface AIResult {
  price: number;
  description: string;
}


interface OrderStep {
  message: string;
  status: "pending" | "success" | "error";
  txHash?: string;
  aiPrice?: number;
}

interface OrderResult {
  item: Product;
  success: boolean;
  error?: string;
  txHash?: string;
}


const CheckoutPage = () => {
  const { cart, clearCart } = useCart();
  const router = useRouter();

  const [isProcessing, setIsProcessing] = useState(false);
  const [signer, setSigner] = useState<ethers.Signer | null>(null);
  const [connectedAccount, setConnectedAccount] = useState<string | null>(null);
  const [userid, setUserid] = useState<string | null>(null);
  const [orderSteps, setOrderSteps] = useState<OrderStep[]>([]);

  const totalPrice = cart?.reduce((acc: number, item: any) => acc + item.productPrice, 0) ?? 0;
  const deliveryFee = 40;
  const grandTotal = totalPrice + deliveryFee;

  // ---------------- Load user from localStorage ----------------
  useEffect(() => {
    if (typeof window !== "undefined") {
      const user = localStorage.getItem("user");
      if (user) setUserid(JSON.parse(user)._id);
    }
  }, []);

  // ---------------- Connect MetaMask ----------------
  const connectWallet = async () => {
    if (!window.ethereum) {
      alert("Please install MetaMask!");
      return;
    }

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const signerInstance = await provider.getSigner();
      setSigner(signerInstance);

      const account = await signerInstance.getAddress();
      setConnectedAccount(account);
      console.log("Connected account:", account);
    } catch (err) {
      console.error("MetaMask connection failed:", err);
    }
  };

  useEffect(() => {
    connectWallet();
  }, []);

  // ---------------- Record order on blockchain ----------------
  /*
  const recordOrderOnBlockchain = async (orderId: string) => {
    if (!signer || !userid) return null;

    try {
      const contract = new ethers.Contract(CONTRACT_ADDRESS, OrderVerifierABI.abi, signer);
      const ethAmount = (grandTotal / 200000).toFixed(6);
      
     const tx = await contract.placeOrder(
  orderId.toString(), 
  `User: ${userid}, Amount: ${ethAmount} ETH`
);
*/
/*
const recordOrderOnBlockchain = async (orderId: string) => {
  try {
    if (typeof window === "undefined" || !window.ethereum) {
  throw new Error("MetaMask not detected");
}

const provider = new ethers.BrowserProvider(window.ethereum as any);

    const signer = await provider.getSigner();

    const contract = new ethers.Contract(
      CONTRACT_ADDRESS,
      OrderVerifierABI.abi,
      signer
    );

    const ethAmount = (grandTotal / 200000).toFixed(6);
console.log("✅ Contract instance:", contract);
console.log("🧾 Available functions:", Object.keys(contract.functions));

    const tx = await contract.verifyOrder(
      orderId.toString(),
      `User: ${userid}, Amount: ${ethAmount} ETH`
    );

    await tx.wait();
    return tx.hash;
  } catch (err) {
    console.error("❌ Blockchain transaction error:", err);
    return null;
  }
};

   */
  /*
  const recordOrderOnBlockchain = async (orderId: string) => {
  try {
    console.log("🧠 Starting blockchain order record...");
    
    if (typeof window === "undefined" || !window.ethereum) {
      throw new Error("MetaMask not detected");
    }

    console.log("1️⃣ Creating provider...");

    const provider = new ethers.BrowserProvider(window.ethereum as any);

     console.log("2️⃣ Getting signer...");
    const signer = await provider.getSigner();
    const signerAddress = await signer.getAddress();
console.log("3️⃣ Connected wallet:", signerAddress);
    console.log("✅ Connected wallet:", signerAddress);
    console.log("✅ Contract address:", CONTRACT_ADDRESS);


    const contract = new ethers.Contract(
      CONTRACT_ADDRESS,
      OrderVerifierABI.abi,
      signer
    );
console.log("🧾 ABI functions available:", OrderVerifierABI.abi.length);

    console.log("🔹 orderId:", orderId);
    console.log("🔹 userId:", userid);
    console.log("🔹 grandTotal:", grandTotal);

    const ethAmount = (grandTotal / 200000).toFixed(6);
    console.log("💰 ETH amount:", ethAmount);

    console.log("🚀 Calling verifyOrder...");
    const tx = await contract.verifyOrder(
      orderId.toString(),
      `User: ${userid}, Amount: ${ethAmount} ETH`
    );

    console.log("✅ TX sent:", tx.hash);
        console.log("🔟 Waiting for confirmation...");
    await tx.wait();
    console.log("✅ TX confirmed!");

    return tx.hash;
  } catch (err: any) {
    console.error("❌ Detailed blockchain error:", err);
    return null;
  }
};
 */
/*
const recordOrderOnBlockchain = async (orderId: string) => {
  try {
    console.log("🧠 Starting blockchain order record...");

    if (typeof window === "undefined" || !window.ethereum) {
      throw new Error("MetaMask not detected");
    }

    const provider = new ethers.BrowserProvider(window.ethereum as any);
    const signer = await provider.getSigner();
    const contract = new ethers.Contract(CONTRACT_ADDRESS, OrderVerifierABI.abi, signer);

    // Check if this orderId is already verified
    const alreadyVerified = await contract.isVerified(orderId);
    if (alreadyVerified) {
      console.warn(`⚠️ Order ${orderId} already verified. Skipping blockchain write.`);
      return null;
    }

    const ethAmount = (grandTotal / 200000).toFixed(6);
    const tx = await contract.verifyOrder(
      orderId.toString(),
      `User: ${userid}, Amount: ${ethAmount} ETH`
    );
    await tx.wait();

    console.log("✅ Transaction confirmed:", tx.hash);
    return tx.hash;
  } catch (err: any) {
    console.error("❌ Detailed blockchain error:", err);
    return null;
  }
};
*/
/*
const recordOrderOnBlockchain = async (orderId: string) => {
  try {
    console.log("🧠 Starting blockchain order record...");

    if (typeof window === "undefined" || !window.ethereum) {
      throw new Error("MetaMask not detected");
    }

    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const network = await provider.getNetwork();

    if (Number(network.chainId) !== 31337) {
  alert("⚠️ Please switch MetaMask to Localhost 8545 (Hardhat network)");
  return null;
}

    // ✅ Get latest contract address
    const contract = new ethers.Contract(CONTRACT_ADDRESS, OrderVerifierABI.abi, signer);

    // ✅ Verify contract actually has the function
    if (!contract.interface.getFunction("verifyOrder")) {
      throw new Error("ABI does not match deployed OrderVerifier contract");
    }

    // ✅ Check if already verified
    const alreadyVerified = await contract.isVerified(orderId);
    if (alreadyVerified) {
      console.warn(`⚠️ Order ${orderId} already verified. Skipping blockchain write.`);
      return null;
    }

    // ✅ Safe ethAmount conversion
    const safeGrandTotal = Number(grandTotal || 0);
    const ethAmount = (safeGrandTotal / 200000).toFixed(6);

    console.log("🔗 Sending tx for order:", orderId, "amount:", ethAmount);

    const tx = await contract.verifyOrder(
      orderId.toString(),
      `User: ${userid}, Amount: ${ethAmount} ETH`
    );
    const receipt = await tx.wait();

    console.log("✅ Transaction confirmed:", receipt.hash);
    return receipt.hash;
  } catch (err: any) {
    console.error("❌ Detailed blockchain error:", err);
    alert(`Blockchain error: ${err.message || err}`);
    return null;
  }
};
*/
/*
const recordOrderOnBlockchain = async (orderId: string) => {
  try {
    console.log("🧠 Starting blockchain order record...");

    if (typeof window === "undefined" || !window.ethereum) {
      throw new Error("MetaMask not detected");
    }

    

    const provider = new ethers.BrowserProvider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    const signer = await provider.getSigner();
    const network = await provider.getNetwork();
    console.log("Network:", network);

    if (Number(network.chainId) !== 31337) {
      alert("⚠️ Please switch MetaMask to Localhost 8545 (Hardhat network)");
      return null;
    }

    // ✅ Verify contract deployed
    const code = await provider.getCode(CONTRACT_ADDRESS);
    if (!code || code === "0x") {
      throw new Error(`No contract found at address: ${CONTRACT_ADDRESS}`);
    }

    // ✅ Create contract instance
    const contract = new ethers.Contract(CONTRACT_ADDRESS, OrderVerifierABI.abi, signer);

     console.log("Checking contract at:", CONTRACT_ADDRESS);
    console.log("Signer:", await signer.getAddress());

    // ✅ Check ABI function existence
    if (!contract.interface.getFunction("verifyOrder")) {
      throw new Error("ABI does not contain verifyOrder()");
    }

    // ✅ Check for duplicates
    const alreadyVerified = await contract.isVerified(orderId);
    console.log("isVerified?", alreadyVerified);
    if (alreadyVerified) {
      console.warn(`⚠️ Order ${orderId} already verified. Skipping blockchain write.`);
      return null;
    }

    // ✅ Compute ETH-equivalent amount
   
    const details = `Order from ${await signer.getAddress()} at ${new Date().toISOString()}`;
    console.log("Calling verifyOrder with:", orderId, details);

    const tx = await contract.verifyOrder(orderId.toString(), details);
    const receipt = await tx.wait();

    console.log("✅ Transaction confirmed:", receipt.hash);
    return receipt.hash;
  } catch (err: any) {
    console.error("❌ Blockchain error:", err);
    alert(`Blockchain error: ${err.message || err}`);
    return null;
  }
};
*/
const recordOrderOnBlockchain = async (orderId: string) => {
  try {
    console.log("🧠 Starting blockchain order record...");

    // 🦊 MetaMask check
    if (typeof window === "undefined" || !window.ethereum) {
      throw new Error("MetaMask not detected");
    }

    // 🧩 Clean orderId (handles Mongo ObjectId objects or weird types)
    const cleanOrderId =
      typeof orderId === "object"
        ? (orderId as any).$oid || JSON.stringify(orderId)
        : orderId.toString().replace(/[^a-zA-Z0-9]/g, "");

    console.log("🧩 Cleaned orderId:", cleanOrderId);

    if (!cleanOrderId || cleanOrderId.length < 5) {
      throw new Error("Invalid orderId passed to blockchain");
    }

    // 🔗 Connect to MetaMask + get signer
    const provider = new ethers.BrowserProvider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    const signer = await provider.getSigner();
    const network = await provider.getNetwork();
    console.log("🌐 Connected network:", network.name, "ChainId:", network.chainId.toString());

    // ✅ Ensure correct network
    if (Number(network.chainId) !== 31337) {
      alert("⚠️ Please switch MetaMask to Localhost 8545 (Hardhat network)");
      return null;
    }

    // 🏗️ Verify contract exists
    const code = await provider.getCode(CONTRACT_ADDRESS);
    if (!code || code === "0x") {
      throw new Error(`No contract found at address: ${CONTRACT_ADDRESS}`);
    }

    // 🧠 Load contract
    const contract = new ethers.Contract(CONTRACT_ADDRESS, OrderVerifierABI.abi, signer);

    console.log("🔗 Using contract at:", CONTRACT_ADDRESS);
    console.log("👛 Signer:", await signer.getAddress());

    // 🧩 Check ABI function
    if (!contract.interface.getFunction("verifyOrder")) {
      throw new Error("ABI missing verifyOrder()");
    }

    // 🔍 Check duplicate verification
    const alreadyVerified = await contract.isVerified(cleanOrderId);
    console.log("✅ Already verified?", alreadyVerified);

    if (alreadyVerified) {
      console.warn(`⚠️ Order ${cleanOrderId} already verified. Skipping blockchain write.`);
      return null;
    }

    // 📝 Prepare order details
    const details = `Order from ${await signer.getAddress()} at ${new Date().toISOString()}`;
    console.log("🚀 Calling verifyOrder with:", cleanOrderId, details);

    // 🧾 Execute smart contract call
    const tx = await contract.verifyOrder(cleanOrderId, details);
    console.log("📦 Transaction sent:", tx.hash);

    const receipt = await tx.wait();
    console.log("✅ Transaction confirmed:", receipt.hash);

    alert("🎉 Order successfully recorded on blockchain!");
    return receipt.hash;
  } catch (err: any) {
    console.error("❌ Blockchain error:", err);
    alert(`Blockchain error: ${err.message || err}`);
    return null;
  }
};


  // ---------------- Handle Place Order ----------------
  /*
  const handlePlaceOrder = async () => {
    if (!userid || !cart?.length) {
      toast.error("❌ Missing user or empty cart!");
      return;
    }
    if (!connectedAccount) {
      toast.error("Please connect your wallet!");
      return;
    }

    setIsProcessing(true);
    const steps: OrderStep[] = [];
    setOrderSteps([...steps]);

    try {
      for (const item of cart) {
        // Step 1: Save to backend
        const savingToast = toast.loading(`💾 Saving order for ${item.productName}...`);
        steps.push({ message: `Saving order for ${item.productName}...`, status: "pending" });
        setOrderSteps([...steps]);

        let orderData;
        try {
          const res = await fetch("http://localhost:5000/api/orders/addOrder", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              userid,
              sellerId: item.sellerId,
              productid: item._id,
              quantity: 1,
              address: "Rathinam Tech Park, Pollachi Main Road, Eachanari, Coimbatore, Tamil Nadu 641021",
            }),
          });

          if (!res.ok) throw new Error(`Backend error: ${res.status}`);
          //orderData = await res.json();
          const data = await res.json();
orderData = data.order; // ✅ make sure we extract the 'order' field
toast.update(savingToast, {
          render: `✅ Order for ${item.productName} saved!`,
          type: "success",
          isLoading: false,
          autoClose: 2000,
        });
          steps[steps.length - 1].status = "success";
          setOrderSteps([...steps]);
        } catch (err) {
          toast.update(savingToast, {
          render: `❌ Failed to save ${item.productName}`,
          type: "error",
          isLoading: false,
          autoClose: 3000,
        });
          steps[steps.length - 1].status = "error";
          setOrderSteps([...steps]);
          //alert("Error saving order to backend!");
          return;
        }

        // Step 2: Record on blockchain
        const blockchainToast = toast.loading(`🔗 Recording ${item.productName} on blockchain...`);
        steps.push({ message: `Recording order for ${item.productName} on blockchain...`, status: "pending" });
        setOrderSteps([...steps]);

        let txHash: string | null = null;
        try {
          txHash = await recordOrderOnBlockchain(orderData._id);
          if (!txHash) throw new Error("Blockchain transaction failed");

          toast.update(blockchainToast, {
          render: `✅ ${item.productName} verified on blockchain!`,
          type: "success",
          isLoading: false,
          autoClose: 2000,
        });

          steps[steps.length - 1].status = "success";
          steps[steps.length - 1].txHash = txHash;
          setOrderSteps([...steps]);
        } catch (err) {
          //console.error("❌ Blockchain error:", err);
          toast.update(blockchainToast, {
          render: `❌ Blockchain verification failed for ${item.productName}`,
          type: "error",
          isLoading: false,
          autoClose: 3000,
        });
          steps[steps.length - 1].status = "error";
          setOrderSteps([...steps]);
          //alert("Blockchain recording failed!");
          return;
        }

        // Step 3: Update backend with txHash
        const updateToast = toast.loading(`🔄 Updating backend with transaction hash...`);
        steps.push({ message: `Updating backend with blockchain transaction...`, status: "pending" });
        setOrderSteps([...steps]);

        try {
          const updateRes = await fetch(`http://localhost:5000/api/orders/updateOrderTx/${orderData._id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ transactionHash: txHash }),
          });

          if (!updateRes.ok) throw new Error(`Backend update error: ${updateRes.status}`);
          toast.update(updateToast, {
          render: `✅ Backend updated successfully!`,
          type: "success",
          isLoading: false,
          autoClose: 2000,
        });
          steps[steps.length - 1].status = "success";
          setOrderSteps([...steps]);
        } catch (err) {
          //console.error("❌ Backend update error:", err);
           toast.update(updateToast, {
          render: `❌ Failed to update backend!`,
          type: "error",
          isLoading: false,
          autoClose: 3000,
        });
          steps[steps.length - 1].status = "error";
          setOrderSteps([...steps]);
          //alert("Failed to update backend with blockchain transaction!");
          return;
        }
      }

      clearCart();
      //alert("🎉 Order placed and verified on blockchain!");
      toast.success("🎉 All orders placed and verified on blockchain successfully!");
      router.push("/landing");
    } catch (err) {
      console.error("❌ Unexpected error:", err);
      //alert("Unexpected error while placing order!");
      toast.error("Unexpected error while placing order!");
    } finally {
      setIsProcessing(false);
    }
  };*/


const handlePlaceOrder = async () => {
  if (!userid || !cart?.length) {
    toast.error("❌ Missing user or empty cart!");
    return;
  }
  if (!connectedAccount) {
    toast.error("Please connect your wallet!");
    return;
  }

  setIsProcessing(true);
  const steps: OrderStep[] = [];
  setOrderSteps([...steps]);

  const results: { item: any; success: boolean; error?: string; txHash?: string }[] = [];

  // Map each cart item to an async function
  const itemPromises = cart.map(async (item) => {
    let orderData;
    let txHash;

    // Step 1: Save to backend
    const savingToast = toast.loading(`💾 Saving order for ${item.productName}...`);
    steps.push({ message: `Saving order for ${item.productName}...`, status: "pending" });
    setOrderSteps([...steps]);

    try {
      const res = await fetch("http://localhost:5000/api/orders/addOrder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userid,
          sellerId: item.sellerId,
          productid: item._id,
          quantity: 1,
          address: "Rathinam Tech Park, Pollachi Main Road, Eachanari, Coimbatore, Tamil Nadu 641021",
        }),
      });

      if (!res.ok) throw new Error(`Backend error: ${res.status}`);
      const data = await res.json();
      orderData = data.order;

      toast.update(savingToast, {
        render: `✅ Order for ${item.productName} saved!`,
        type: "success",
        isLoading: false,
        autoClose: 2000,
      });
      steps[steps.length - 1].status = "success";
      setOrderSteps([...steps]);
    } catch (err: any) {
      toast.update(savingToast, {
        render: `❌ Failed to save ${item.productName}: ${err.message}`,
        type: "error",
        isLoading: false,
        autoClose: 3000,
      });
      steps[steps.length - 1].status = "error";
      setOrderSteps([...steps]);
      return { item, success: false, error: "Backend save failed" };
    }

    // Step 2: Record on blockchain
    const blockchainToast = toast.loading(`🔗 Recording ${item.productName} on blockchain...`);
    steps.push({ message: `Recording order for ${item.productName} on blockchain...`, status: "pending" });
    setOrderSteps([...steps]);

    try {
      txHash = await recordOrderOnBlockchain(orderData._id);
      if (!txHash) throw new Error("Blockchain transaction failed");

      toast.update(blockchainToast, {
        render: `✅ ${item.productName} verified on blockchain!`,
        type: "success",
        isLoading: false,
        autoClose: 2000,
      });
      steps[steps.length - 1].status = "success";
      steps[steps.length - 1].txHash = txHash;
      setOrderSteps([...steps]);
    } catch (err: any) {
      toast.update(blockchainToast, {
        render: `❌ Blockchain verification failed for ${item.productName}: ${err.message}`,
        type: "error",
        isLoading: false,
        autoClose: 3000,
      });
      steps[steps.length - 1].status = "error";
      setOrderSteps([...steps]);
      return { item, success: false, error: "Blockchain failed" };
    }

    // Step 3: Update backend with txHash
    const updateToast = toast.loading(`🔄 Updating backend with transaction hash...`);
    steps.push({ message: `Updating backend with blockchain transaction...`, status: "pending" });
    setOrderSteps([...steps]);

    try {
      const updateRes = await fetch(`http://localhost:5000/api/orders/updateOrderTx/${orderData._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ transactionHash: txHash }),
      });

      if (!updateRes.ok) throw new Error(`Backend update error: ${updateRes.status}`);
      toast.update(updateToast, {
        render: `✅ Backend updated successfully!`,
        type: "success",
        isLoading: false,
        autoClose: 2000,
      });
      steps[steps.length - 1].status = "success";
      setOrderSteps([...steps]);
      return { item, success: true, txHash };
    } catch (err: any) {
      toast.update(updateToast, {
        render: `❌ Failed to update backend: ${err.message}`,
        type: "error",
        isLoading: false,
        autoClose: 3000,
      });
      steps[steps.length - 1].status = "error";
      setOrderSteps([...steps]);
      return { item, success: false, error: "Backend update failed" };
    }
  });

  // Run all cart item operations in parallel
  const settledResults = await Promise.allSettled(itemPromises);

  settledResults.forEach((res) => {
    if (res.status === "fulfilled" && res.value) results.push(res.value);
    else if (res.status === "rejected") results.push({ item: null, success: false, error: res.reason });
  });

  

  // Show summary
  const failedOrders = results.filter(r => !r.success);
  if (failedOrders.length === 0) {
    toast.success("🎉 All orders placed and verified on blockchain successfully!");
  } else {
    toast.error(`⚠️ Some orders failed: ${failedOrders.map(f => f.item?.productName || "Unknown").join(", ")}`);
  }
  // Clear cart only for successfully placed items
  clearCart();

  setIsProcessing(false);
};

/*
const handlePlaceOrder = async (userid: string, cart: Product[], connectedAccount: string | null, setIsProcessing: (b: boolean) => void, setOrderSteps: (steps: OrderStep[]) => void, clearCart: () => void) => {
  if (!userid || !cart?.length) {
    toast.error("❌ Missing user or empty cart!");
    return;
  }
  if (!connectedAccount) {
    toast.error("Please connect your wallet!");
    return;
  }

  setIsProcessing(true);
  const steps: OrderStep[] = [];
  setOrderSteps([...steps]);

  const results: OrderResult[] = [];
  const router = useRouter();

  const itemPromises = cart.map(async (item) => {
    let orderData: any;
    let txHash: string | null = null;
    let aiPrice: number | null = null;

    // --- STEP 0: Get AI Price ---
    const priceToast = toast.loading(`🤖 Getting AI price for ${item.productName}...`);
    steps.push({ message: `Getting AI price for ${item.productName}...`, status: "pending" });
    setOrderSteps([...steps]);

    try {
      const aiResult: AIResult = await getPrice({
        name: item.productName,
        quantity: item.quantity || 1,
        location: "Coimbatore",
      });
      aiPrice = aiResult.price;

      toast.update(priceToast, {
        render: `✅ AI price for ${item.productName}: ₹${aiPrice}`,
        type: "success",
        isLoading: false,
        autoClose: 2000,
      });

      steps[steps.length - 1].status = "success";
      steps[steps.length - 1].aiPrice = aiPrice;
      setOrderSteps([...steps]);
    } catch (err: any) {
      toast.update(priceToast, {
        render: `❌ Failed to get AI price for ${item.productName}`,
        type: "error",
        isLoading: false,
        autoClose: 3000,
      });
      steps[steps.length - 1].status = "error";
      setOrderSteps([...steps]);
      return { item, success: false, error: "AI pricing failed" };
    }

    // --- STEP 1: Save to backend ---
    const savingToast = toast.loading(`💾 Saving order for ${item.productName}...`);
    steps.push({ message: `Saving order for ${item.productName}...`, status: "pending" });
    setOrderSteps([...steps]);

    try {
      const res = await fetch("http://localhost:5000/api/orders/addOrder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userid,
          sellerId: item.sellerId,
          productid: item._id,
          quantity: item.quantity || 1,
          aiPrice,
          address: "Rathinam Tech Park, Pollachi Main Road, Eachanari, Coimbatore, Tamil Nadu 641021",
        }),
      });
      if (!res.ok) throw new Error(`Backend error: ${res.status}`);
      const data = await res.json();
      orderData = data.order;

      toast.update(savingToast, {
        render: `✅ Order for ${item.productName} saved!`,
        type: "success",
        isLoading: false,
        autoClose: 2000,
      });

      steps[steps.length - 1].status = "success";
      setOrderSteps([...steps]);
    } catch (err: any) {
      toast.update(savingToast, {
        render: `❌ Failed to save ${item.productName}: ${err.message}`,
        type: "error",
        isLoading: false,
        autoClose: 3000,
      });
      steps[steps.length - 1].status = "error";
      setOrderSteps([...steps]);
      return { item, success: false, error: "Backend save failed" };
    }

    // --- STEP 2: Record on blockchain ---
    const blockchainToast = toast.loading(`🔗 Recording ${item.productName} on blockchain...`);
    steps.push({ message: `Recording order for ${item.productName} on blockchain...`, status: "pending" });
    setOrderSteps([...steps]);

    try {
      txHash = await recordOrderOnBlockchain(orderData._id);
      if (!txHash) throw new Error("Blockchain transaction failed");

      toast.update(blockchainToast, {
        render: `✅ ${item.productName} verified on blockchain!`,
        type: "success",
        isLoading: false,
        autoClose: 2000,
      });

      steps[steps.length - 1].status = "success";
      steps[steps.length - 1].txHash = txHash;
      setOrderSteps([...steps]);
    } catch (err: any) {
      toast.update(blockchainToast, {
        render: `❌ Blockchain verification failed for ${item.productName}: ${err.message}`,
        type: "error",
        isLoading: false,
        autoClose: 3000,
      });
      steps[steps.length - 1].status = "error";
      setOrderSteps([...steps]);
      return { item, success: false, error: "Blockchain failed" };
    }

    // --- STEP 3: Update backend with txHash ---
    const updateToast = toast.loading(`🔄 Updating backend with transaction hash...`);
    steps.push({ message: `Updating backend with blockchain transaction...`, status: "pending" });
    setOrderSteps([...steps]);

    try {
      const updateRes = await fetch(`http://localhost:5000/api/orders/updateOrderTx/${orderData._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ transactionHash: txHash }),
      });
      if (!updateRes.ok) throw new Error(`Backend update error: ${updateRes.status}`);

      toast.update(updateToast, {
        render: `✅ Backend updated successfully!`,
        type: "success",
        isLoading: false,
        autoClose: 2000,
      });

      steps[steps.length - 1].status = "success";
      setOrderSteps([...steps]);
      return { item, success: true, txHash };
    } catch (err: any) {
      toast.update(updateToast, {
        render: `❌ Failed to update backend: ${err.message}`,
        type: "error",
        isLoading: false,
        autoClose: 3000,
      });
      steps[steps.length - 1].status = "error";
      setOrderSteps([...steps]);
      return { item, success: false, error: "Backend update failed" };
    }
  });

  const settledResults = await Promise.allSettled(itemPromises);
  settledResults.forEach((res) => {
    if (res.status === "fulfilled" && res.value) results.push(res.value);
    else if (res.status === "rejected") results.push({ item: null, success: false, error: res.reason });
  });

  // Show summary
  const failedOrders = results.filter(r => !r.success);
  if (failedOrders.length === 0) {
    toast.success("🎉 All orders placed and verified on blockchain successfully!");
  } else {
    toast.error(`⚠️ Some orders failed: ${failedOrders.map(f => f.item?.productName || "Unknown").join(", ")}`);
  }

  // Clear cart
  clearCart();
  setIsProcessing(false);
};
*/

  const isReadyToOrder = userid && cart?.length > 0 && connectedAccount;

  return (
    <div className="font-inter m-12">
      <h1 className="text-2xl font-bold mb-4">🧾 Checkout</h1>

      {!cart || cart.length === 0 ? (
        <div className="text-gray-600 text-center">
          <p>Your cart is empty.</p>
          <button onClick={() => router.push("/landing")} className="mt-4 bg-green-600 text-white px-4 py-2 rounded-lg">
            Shop Now
          </button>
        </div>
      ) : (
        <>
          {/* Cart Items */}
          <div className="bg-green-100 p-6 rounded-md mb-6">
            {cart.map((item: any) => (
              <div key={item._id} className="flex justify-between border-b border-gray-300 py-2">
                <div>
                  <h2 className="font-semibold">{item.productName}</h2>
                  <p>₹{item.productPrice}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Payment Summary */}
          <div className="bg-green-100 p-6 rounded-md mb-6">
            <h2 className="text-lg font-bold mb-2">Payment Summary</h2>
            <p>Total Amount: ₹{totalPrice}</p>
            <p>Delivery Fee: ₹{deliveryFee}</p>
            <p className="font-bold text-lg mt-2">Grand Total: ₹{grandTotal}</p>
          </div>

          {/* Place Order Button */}
          <div className="text-center mb-6">
            <button
              onClick={handlePlaceOrder}
              disabled={!isReadyToOrder || isProcessing}
              className={`rounded-md text-white px-4 py-2 ${isProcessing ? "bg-gray-400 cursor-not-allowed" : "bg-black"}`}
            >
              {isProcessing ? "Processing..." : "Place Order (Blockchain)"}
            </button>
          </div>

          {/* Order Progress */}
          <div className="bg-gray-50 p-4 rounded-md">
            <h3 className="font-semibold mb-2">Order Progress</h3>
            {orderSteps.length === 0 && <p>No current orders...</p>}
            {orderSteps.map((step, index) => (
              <div key={index} className="flex justify-between items-center mb-1">
                <p>{step.message}</p>
                <span>
                  {step.status === "pending" && "⏳"}
                  {step.status === "success" && "✅"}
                  {step.status === "error" && "❌"}
                </span>
                {step.txHash && (
                  <a
                    href={`https://sepolia.etherscan.io/tx/${step.txHash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 ml-2"
                  >
                    View Tx
                  </a>
                )}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default CheckoutPage;
