"use client";
import React, { useState, useEffect } from "react";
import { ProductTrackingContract, FarmNetOrderContract, getWeb3, connectWallet } from "../src/utils/web3.js";

const BASE_URL = "http://localhost:5000/market-data";
const FILTER_URL = "http://localhost:5000/market-filters";

interface RecordItem {
  State: string;
  District: string;
  Market: string;
  Commodity: string;
  Variety: string;
  Grade: string;
  Min_x0020_Price: string;
  Max_x0020_Price: string;
  Modal_x0020_Price: number;
}

interface BlockchainProduct {
  id: string;
  name: string;
  origin: string;
  farmer: string;
  delivered: boolean;
}

interface FilterOptions {
  state: string[];
  district: string[];
  market: string[];
  commodity: string[];
  variety: string[];
  grade: string[];
}

interface Filters {
  state: string;
  district: string;
  market: string;
  commodity: string;
  variety: string;
  grade: string;
}

const Market: React.FC = () => {
  const [filters, setFilters] = useState<Filters>({
    state: "",
    district: "",
    market: "",
    commodity: "",
    variety: "",
    grade: "",
  });

  const [filterOptions, setFilterOptions] = useState<FilterOptions>({
    state: [],
    district: [],
    market: [],
    commodity: [],
    variety: [],
    grade: [],
  });

  const [data, setData] = useState<{ records: RecordItem[] } | null>(null);
  const [blockchainProducts, setBlockchainProducts] = useState<BlockchainProduct[]>([]);
  const [date, setDate] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [account, setAccount] = useState<string | null>(null);

  // ---------------- Wallet connect ----------------
  const handleConnectWallet = async () => {
    const acc = await connectWallet();
    if (acc) setAccount(acc);
  };

  useEffect(() => {
    const initAccount = async () => {
      const web3 = getWeb3();
      const accounts = await web3.eth.getAccounts();
      if (accounts.length > 0) setAccount(accounts[0]);
    };
    initAccount();
  }, []);

  // ---------------- Fetch blockchain products ----------------
  const fetchBlockchainProducts = async () => {
    try {
      const countStr = await ProductTrackingContract.methods.productCount().call();
const count = Number(countStr); // convert string to number

const list: BlockchainProduct[] = [];
for (let i = 1; i <= count; i++) {
  const p:any = await ProductTrackingContract.methods.products(i).call();
  list.push({
    id: i.toString(),
    name: p.name,
    origin: p.origin,
    farmer: p.farmer,
    delivered: p.delivered,
  });
}
      setBlockchainProducts(list);
    } catch (err) {
      console.error("Error fetching blockchain products:", err);
    }
  };

  useEffect(() => {
    fetchBlockchainProducts();
  }, []);

  // ---------------- Place order ----------------
  /*
  const placeOrder = async (farmer: string, productName: string) => {
    if (!account) {
      alert("Please connect your wallet first!");
      return;
    }
    const web3 = getWeb3();
    try {
      await FarmNetOrderContract.methods
        .placeOrder(farmer, productName, 1) // Example: 1 unit
        .send({ from: account });
      alert("Order placed successfully!");
    } catch (err) {
      console.error(err);
      alert("Order failed. See console for details.");
    }
  };
*/
const placeOrder = async (farmer: string, productName: string, amount: number = 1) => {
  if (!account) {
    alert("Please connect your wallet first!");
    return;
  }

  if (amount <= 0) {
    alert("Cart is empty. Please select at least 1 unit.");
    return;
  }

  console.log("Placing order with details:", { account, farmer, productName, amount });

  try {
    // Call the smart contract
    const receipt = await FarmNetOrderContract.methods
      .placeOrder(farmer, productName, amount)
      .send({ from: account });

    console.log("Transaction successful:", receipt);
    alert(`Order for "${productName}" placed successfully!`);

  } catch (err: any) {
    console.error("Order failed:", err);
    if (err.message.includes("revert")) {
      alert("Smart contract rejected the order. Check quantity or farmer address.");
    } else {
      alert("Order failed. See console for details.");
    }
  }
};
  // ---------------- Local Market API ----------------
  const fetchAllStates = async () => {
    try {
      const response = await fetch(FILTER_URL);
      const result = await response.json();
      const states = result.filters?.states || [];
      setFilterOptions({
        state: states,
        district: [],
        market: [],
        commodity: [],
        variety: [],
        grade: [],
      });
      if (result.fetchDate) setDate(result.fetchDate);
    } catch (error) {
      console.error("Error fetching states:", error);
    }
  };

  const fetchDependentOptions = async (updatedFilters: Filters) => {
    try {
      const queryParams = new URLSearchParams();
      Object.entries(updatedFilters).forEach(([key, value]) => {
        if (value) queryParams.append(key, value);
      });
      const res = await fetch(`${FILTER_URL}?${queryParams.toString()}`);
      const result = await res.json();
      const filters = result.filters || {};
      setFilterOptions({
        state: filters.states || filterOptions.state,
        district: filters.districts || filterOptions.district,
        market: filters.markets || filterOptions.market,
        commodity: filters.commodities || filterOptions.commodity,
        variety: filters.varieties || filterOptions.variety,
        grade: filters.grades || filterOptions.grade,
      });
      if (result.fetchDate) setDate(result.fetchDate);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchData = async () => {
    setLoading(true);
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.append(key, value);
    });
    try {
      const res = await fetch(`${BASE_URL}?${params.toString()}`);
      const result = await res.json();
      setData((prev) => ({
        ...result,
        records: prev?.records ? [...prev.records, ...result.records] : result.records,
      }));
      setDate(result.updated_date || new Date().toISOString());
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchAllStates();
  }, []);

  // ---------------- Handle dropdown change ----------------
  const handleChange = (key: keyof Filters, value: string) => {
    setFilters((prev) => {
      const updated = { ...prev, [key]: value };
      if (key === "state") updated.district = updated.market = updated.commodity = updated.variety = updated.grade = "";
      if (key === "district") updated.market = updated.commodity = updated.variety = updated.grade = "";
      if (key === "market") updated.commodity = updated.variety = updated.grade = "";
      if (key === "commodity") updated.variety = updated.grade = "";
      if (key === "variety") updated.grade = "";
      return updated;
    });
  };

  // ---------------- Fetch dependent filters ----------------
  useEffect(() => {
    if (filters.state && !filters.district) fetchDependentOptions({ state: filters.state } as Filters);
    else if (filters.state && filters.district && !filters.market) fetchDependentOptions({ state: filters.state, district: filters.district } as Filters);
    else if (filters.state && filters.district && filters.market && !filters.commodity) fetchDependentOptions({ state: filters.state, district: filters.district, market: filters.market } as Filters);
    else if (filters.state && filters.district && filters.market && filters.commodity && !filters.variety)
      fetchDependentOptions({ state: filters.state, district: filters.district, market: filters.market, commodity: filters.commodity } as Filters);
    else if (filters.state && filters.district && filters.market && filters.commodity && filters.variety && !filters.grade)
      fetchDependentOptions({ state: filters.state, district: filters.district, market: filters.market, commodity: filters.commodity, variety: filters.variety } as Filters);
  }, [filters.state, filters.district, filters.market, filters.commodity, filters.variety]);

  return (
    <div className="p-6 font-inter">
      <h1 className="text-2xl font-bold mb-4">Market Data</h1>

      {/* Wallet Connect */}
      <div className="mb-4">
        {account ? (
          <p className="bg-green-600 text-white px-3 py-1 rounded w-fit">{account.substring(0, 6)}...{account.substring(account.length - 4)}</p>
        ) : (
          <button onClick={handleConnectWallet} className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600">
            Connect Wallet
          </button>
        )}
      </div>

      {/* Dropdown Filters */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        {(Object.keys(filters) as (keyof Filters)[]).map((key) => (
          <select
            key={key}
            value={filters[key]}
            onChange={(e) => handleChange(key, e.target.value)}
            className="border border-gray-300 p-2 rounded-md"
            disabled={key !== "state" && filterOptions[key].length === 0}
          >
            <option value="">Select {key}</option>
            {filterOptions[key]?.map((option, i) => (
              <option key={`${key}-${option}-${i}`} value={option}>{option}</option>
            ))}
          </select>
        ))}
      </div>

      {/* Fetch Button */}
      <button onClick={fetchData} className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 mb-4" disabled={loading}>
        {loading ? "Loading..." : "Fetch Local Market Data"}
      </button>

      {/* Data last updated */}
      <p className="mb-6 text-gray-700">Data last updated on: {date ? new Date(date).toLocaleString("en-IN") : "No date available"}</p>

      {/* ---------------- Local Market Data Table ---------------- */}
      {data && data.records.length > 0 && (
        <div className="overflow-x-auto mb-6">
          <h2 className="text-xl font-semibold mb-2">Local Market Products</h2>
          <table className="min-w-full bg-white border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="border px-4 py-2">State</th>
                <th className="border px-4 py-2">District</th>
                <th className="border px-4 py-2">Market</th>
                <th className="border px-4 py-2">Commodity</th>
                <th className="border px-4 py-2">Variety</th>
                <th className="border px-4 py-2">Grade</th>
                <th className="border px-4 py-2">Min Price</th>
                <th className="border px-4 py-2">Max Price</th>
                <th className="border px-4 py-2">Price / Kg</th>
              </tr>
            </thead>
            <tbody>
              {data.records.map((item, index) => (
                <tr key={index}>
                  <td className="border px-4 py-2">{item.State}</td>
                  <td className="border px-4 py-2">{item.District}</td>
                  <td className="border px-4 py-2">{item.Market}</td>
                  <td className="border px-4 py-2">{item.Commodity}</td>
                  <td className="border px-4 py-2">{item.Variety}</td>
                  <td className="border px-4 py-2">{item.Grade}</td>
                  <td className="border px-4 py-2">{item.Min_x0020_Price}</td>
                  <td className="border px-4 py-2">{item.Max_x0020_Price}</td>
                  <td className="border px-4 py-2">{item.Modal_x0020_Price / 100}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ---------------- Blockchain Products ---------------- */}
      {blockchainProducts.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Blockchain Products</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
           {blockchainProducts.map((p) => {
  const [qty, setQty] = useState<number>(1); // local quantity for each product

  return (
    <div key={p.id} className="border p-4 rounded shadow">
      <p><strong>Name:</strong> {p.name}</p>
      <p><strong>Origin:</strong> {p.origin}</p>
      <p><strong>Farmer:</strong> {p.farmer}</p>
      <p><strong>Delivered:</strong> {p.delivered.toString()}</p>

      {/* Quantity input */}
      <input
        type="number"
        min={1}
        value={qty}
        onChange={(e) => setQty(Number(e.target.value))}
        className="border p-1 rounded w-20 mt-2"
      />

      <button
        onClick={() => placeOrder(p.farmer, p.name, qty)}
        disabled={!account}
        className="mt-2 bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
      >
        Place Order
      </button>
    </div>
  )
})}

          </div>
        </div>
      )}
    </div>
  );
};

export default Market;
