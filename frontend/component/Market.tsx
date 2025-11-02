

"use client";
import React, { useState, useEffect } from "react";

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

const MarketFilter: React.FC = () => {
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
  const [date, setDate] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // ✅ Fetch all states on initial load
  const fetchAllStates = async () => {
    try {
      const response = await fetch(FILTER_URL);
      const result = await response.json();
      const filters = result.filters || {};
      const states = filters.states || [];

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

  // ✅ Fetch dependent dropdown data
  const fetchDependentOptions = async (updatedFilters: Filters) => {
    try {
      const queryParams = new URLSearchParams();
      Object.entries(updatedFilters).forEach(([key, value]) => {
        if (value) queryParams.append(key, value);
      });

      const response = await fetch(`${FILTER_URL}?${queryParams.toString()}`);
      const result = await response.json();
      const filters = result.filters || {};

      // Use plural keys as returned from backend
      setFilterOptions({
        state: filters.states || filterOptions.state,
        district: filters.districts || filterOptions.district,
        market: filters.markets || filterOptions.market,
        commodity: filters.commodities || filterOptions.commodity,
        variety: filters.varieties || filterOptions.variety,
        grade: filters.grades || filterOptions.grade,
      });

      if (result.fetchDate) setDate(result.fetchDate);
    } catch (error) {
      console.error("Error fetching dependent filters:", error);
    }
  };

  // ✅ Fetch data table for current selections
 const fetchData = async () => {
  setLoading(true);
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value) params.append(key, value);
  });

  try {
    const res = await fetch(`${BASE_URL}?${params.toString()}`);
    const result = await res.json();

    // ✅ Append new records to previous ones (if any)
    setData((prevData) => {
      if (!prevData) return result; // if no previous data
      return {
        ...result,
        records: [...prevData.records, ...result.records],
      };
    });

    // ✅ Only one fetchedDate declaration
    const fetchedDate = result.updated_date || new Date().toISOString();
    setDate(fetchedDate);

  } catch (err) {
    console.error("Error fetching data:", err);
  }
  setLoading(false);
};

  // ✅ On mount: fetch all states
  useEffect(() => {
    fetchAllStates();
  }, []);

  // ✅ Fetch next level options when selection changes
  useEffect(() => {
    if (filters.state && !filters.district) {
      fetchDependentOptions({ state: filters.state } as Filters);
    } else if (filters.state && filters.district && !filters.market) {
      fetchDependentOptions({
        state: filters.state,
        district: filters.district,
      } as Filters);
    } else if (filters.state && filters.district && filters.market && !filters.commodity) {
      fetchDependentOptions({
        state: filters.state,
        district: filters.district,
        market: filters.market,
      } as Filters);
    } else if (filters.state && filters.district && filters.market && filters.commodity && !filters.variety) {
      fetchDependentOptions({
        state: filters.state,
        district: filters.district,
        market: filters.market,
        commodity: filters.commodity,
      } as Filters);
    } else if (filters.state && filters.district && filters.market && filters.commodity && filters.variety && !filters.grade) {
      fetchDependentOptions({
        state: filters.state,
        district: filters.district,
        market: filters.market,
        commodity: filters.commodity,
        variety: filters.variety,
      } as Filters);
    }
  }, [filters.state, filters.district, filters.market, filters.commodity, filters.variety]);

  // ✅ Handle dropdown change and reset dependent selections
  const handleChange = (key: keyof Filters, value: string) => {
    setFilters((prev) => {
      const updated = { ...prev, [key]: value };

      if (key === "state") {
        updated.district = "";
        updated.market = "";
        updated.commodity = "";
        updated.variety = "";
        updated.grade = "";
      } else if (key === "district") {
        updated.market = "";
        updated.commodity = "";
        updated.variety = "";
        updated.grade = "";
      } else if (key === "market") {
        updated.commodity = "";
        updated.variety = "";
        updated.grade = "";
      } else if (key === "commodity") {
        updated.variety = "";
        updated.grade = "";
      } else if (key === "variety") {
        updated.grade = "";
      }

      return updated;
    });
  };

  return (
    <div className="p-6 font-inter">
      <h1 className="text-2xl font-bold mb-4">Local Market Data</h1>

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
              <option key={`${key}-${option}-${i}`} value={option}>
                {option}
              </option>
            ))}
          </select>
        ))}
      </div>

      {/* Fetch Button */}
      <button
        className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition"
        onClick={fetchData}
        disabled={loading}
      >
        {loading ? "Loading..." : "Fetch Data"}
      </button>

      {/* Date Display */}
      <p className="mt-4 text-gray-700">
        Data last updated on:{" "}
        {date ? new Date(date).toLocaleString("en-IN") : "No date available"}
      </p>

      {/* Data Table */}
      <div className="mt-6 overflow-x-auto">
        {data ? (
          data.records.length > 0 ? (
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
                    <td className="border px-4 py-2">
                      {item.Modal_x0020_Price / 100}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="mt-4 text-gray-600">No data available</p>
          )
        ) : null}
      </div>
    </div>
  );
};

export default MarketFilter;
