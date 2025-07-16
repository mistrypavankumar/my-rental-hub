"use client";

import { showErrorMessage } from "@/lib/utils";
// import { RootState } from "@/redux/store";
import { createHouse } from "@/services/houseServices";
import React, { useState } from "react";
import toast from "react-hot-toast";
// import { useSelector } from "react-redux";

const Page = () => {
  // const { user } = useSelector((state: RootState) => state.auth);

  const [formData, setFormData] = useState({
    name: "",
    address: {
      street: "",
      city: "",
      state: "",
      zipCode: "",
    },
    ownerName: "",
    ownerPhone: "",
    defaultPrice: 0,
    utilitiesIncluded: false,
    paymentDueDate: "",
    lateFeePerDay: 0,
    rooms: 0,
    singleRoomRent: 0,
    sharedRoomRent: 0,
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target as HTMLInputElement;
    const checked = (e.target as HTMLInputElement).checked;

    if (name.startsWith("address.")) {
      const addressField = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        address: {
          ...prev.address,
          [addressField]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]:
          type === "checkbox"
            ? checked
            : type === "number"
            ? Number(value)
            : value,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await createHouse(formData);

      if (response.status === 201) {
        toast.success("House is created successfully");
      }
    } catch (error) {
      showErrorMessage(error as Error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-md">
        <h2 className="text-2xl font-bold text-center mb-6 text-blue-700">
          Create New House
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="House Name"
            className="w-full border px-4 py-2 rounded"
            required
          />

          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              name="address.street"
              value={formData.address.street}
              onChange={handleInputChange}
              placeholder="Street"
              className="border px-4 py-2 rounded"
              required
            />
            <input
              type="text"
              name="address.city"
              value={formData.address.city}
              onChange={handleInputChange}
              placeholder="City"
              className="border px-4 py-2 rounded"
              required
            />
            <input
              type="text"
              name="address.state"
              value={formData.address.state}
              onChange={handleInputChange}
              placeholder="State"
              className="border px-4 py-2 rounded"
              required
            />
            <input
              type="text"
              name="address.zipCode"
              value={formData.address.zipCode}
              onChange={handleInputChange}
              placeholder="Zip Code"
              className="border px-4 py-2 rounded"
              required
            />
          </div>

          <input
            type="text"
            name="ownerName"
            value={formData.ownerName}
            onChange={handleInputChange}
            placeholder="Owner Name"
            className="w-full border px-4 py-2 rounded"
            required
          />

          <input
            type="text"
            name="ownerPhone"
            value={formData.ownerPhone}
            onChange={handleInputChange}
            placeholder="Owner Phone (+1856...)"
            className="w-full border px-4 py-2 rounded"
            required
          />

          <input
            type="number"
            name="defaultPrice"
            value={formData.defaultPrice}
            onChange={handleInputChange}
            placeholder="Default Rent Price"
            className="w-full border px-4 py-2 rounded"
            required
          />

          <label className="flex items-center space-x-2 text-sm">
            <input
              type="checkbox"
              name="utilitiesIncluded"
              checked={formData.utilitiesIncluded}
              onChange={handleInputChange}
              className="accent-blue-600"
            />
            <span>Utilities Included</span>
          </label>

          <input
            type="date"
            name="paymentDueDate"
            value={formData.paymentDueDate.toString().substring(0, 10)}
            onChange={handleInputChange}
            className="w-full border px-4 py-2 rounded"
            required
          />

          <input
            type="number"
            name="lateFeePerDay"
            value={formData.lateFeePerDay}
            onChange={handleInputChange}
            placeholder="Late Fee Per Day"
            className="w-full border px-4 py-2 rounded"
            required
          />

          <input
            type="number"
            name="rooms"
            value={formData.rooms}
            onChange={handleInputChange}
            placeholder="Total Rooms"
            className="w-full border px-4 py-2 rounded"
            required
          />

          <div className="grid grid-cols-2 gap-4">
            <input
              type="number"
              name="singleRoomRent"
              value={formData.singleRoomRent}
              onChange={handleInputChange}
              placeholder="Single Room Rent"
              className="border px-4 py-2 rounded"
            />
            <input
              type="number"
              name="sharedRoomRent"
              value={formData.sharedRoomRent}
              onChange={handleInputChange}
              placeholder="Shared Room Rent"
              className="border px-4 py-2 rounded"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded font-semibold"
          >
            Create House
          </button>
        </form>
      </div>
    </div>
  );
};

export default Page;
