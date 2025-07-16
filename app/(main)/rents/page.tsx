"use client";

import React, { useState } from "react";

const Page = () => {
  const [formData, setFormData] = useState({
    houseId: "",
    month: "",
    houseRent: "",
    gas: "",
    electricity: "",
    internet: "",
    water: "",
    totalRent: "",
    splitAmount: "",
    lateFeeApplied: false,
    lateFeeAmount: "",
    reasonForLateFee: "",
  });

  const [message, setMessage] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const currentMonthDate = new Date().toISOString().split("T")[0];

  const totalRent =
    Number(formData.houseRent) +
    Number(formData.gas) +
    Number(formData.electricity) +
    Number(formData.internet) +
    Number(formData.water);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");

    try {
      const response = await fetch("/api/v1/houses/rent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          month: currentMonthDate,
          houseRent: Number(formData.houseRent),
          gas: Number(formData.gas),
          electricity: Number(formData.electricity),
          internet: Number(formData.internet),
          water: Number(formData.water),
          totalRent: totalRent,
        }),
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.error || "Failed to create rent");

      setMessage("✅ Rent record created successfully");
    } catch (err) {
      console.error("Error creating rent record:", err);
      setMessage(`❌ ${err instanceof Error ? err.message : "Unknown error"}`);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 mt-10 border rounded shadow">
      <h2 className="text-xl font-semibold mb-4">Create Rent Record</h2>

      <form onSubmit={handleSubmit} className="grid gap-3">
        <input
          type="text"
          name="houseId"
          value={formData.houseId}
          onChange={handleInputChange}
          placeholder="House ID"
          required
          className="border p-2 rounded"
        />
        <input
          type="date"
          name="month"
          value={currentMonthDate}
          placeholder="Month"
          required
          className="border p-2 rounded bg-gray-200"
          disabled
        />
        <input
          type="text"
          name="houseRent"
          value={formData.houseRent}
          onChange={handleInputChange}
          placeholder="House Rent"
          className="border p-2 rounded"
        />
        <input
          type="text"
          name="gas"
          value={formData.gas}
          onChange={handleInputChange}
          placeholder="Gas"
          className="border p-2 rounded"
        />
        <input
          type="text"
          name="electricity"
          value={formData.electricity}
          onChange={handleInputChange}
          placeholder="Electricity"
          className="border p-2 rounded"
        />
        <input
          type="text"
          name="internet"
          value={formData.internet}
          onChange={handleInputChange}
          placeholder="Internet"
          className="border p-2 rounded"
        />
        <input
          type="text"
          name="water"
          value={formData.water}
          onChange={handleInputChange}
          placeholder="Water"
          className="border p-2 rounded"
        />
        <input
          type="text"
          name="totalRent"
          value={`$${totalRent}`}
          placeholder="Total Rent"
          className="border p-2 rounded bg-gray-200"
          disabled
        />

        <button type="submit" className="bg-blue-600 text-white py-2 rounded">
          Create Rent
        </button>

        {message && <p className="mt-2">{message}</p>}
      </form>
    </div>
  );
};

export default Page;
