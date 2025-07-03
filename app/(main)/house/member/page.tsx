"use client";

import React, { useState } from "react";

const Page = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    houseId: "",
    role: "tenant",
    stayInSharedRoom: false,
  });

  const [message, setMessage] = useState("");

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    if (name === "stayInSharedRoom") {
      setFormData((prev) => ({
        ...prev,
        [name]: value === "true",
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");

    try {
      const response = await fetch("/api/v1/houses/member", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.error || "Failed to add member");

      setMessage("✅ Member added successfully!");
    } catch (error: any) {
      setMessage(`❌ ${error.message}`);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 border rounded shadow">
      <h2 className="text-xl font-semibold mb-4">Add New Member</h2>

      <form onSubmit={handleSubmit} className="grid gap-4">
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={formData.name}
          onChange={handleInputChange}
          required
          className="border p-2 rounded"
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleInputChange}
          required
          className="border p-2 rounded"
        />

        <input
          type="tel"
          name="phone"
          placeholder="Phone"
          value={formData.phone}
          onChange={handleInputChange}
          required
          className="border p-2 rounded"
        />

        <input
          type="text"
          name="houseId"
          placeholder="House ID"
          value={formData.houseId}
          onChange={handleInputChange}
          required
          className="border p-2 rounded"
        />

        <select
          name="role"
          value={formData.role}
          onChange={handleInputChange}
          className="border p-2 rounded"
        >
          <option value="owner">Owner</option>
          <option value="tenant">Tenant</option>
        </select>

        <select
          name="stayInSharedRoom"
          value={formData.stayInSharedRoom.toString()}
          onChange={handleInputChange}
          className="border p-2 rounded"
        >
          <option value="true">Staying in Shared Room</option>
          <option value="false">Staying in Single Room</option>
        </select>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Add Member
        </button>

        {message && <p className="mt-2">{message}</p>}
      </form>
    </div>
  );
};

export default Page;
