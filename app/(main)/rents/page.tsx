"use client";

import CustomInputField from "@/components/CustomInputField";
import { RootState } from "@/redux/store";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";

const Page = () => {
  const { activeHouse } = useSelector((state: RootState) => state.house);

  const [formData, setFormData] = useState({
    houseId: activeHouse?.houseId || "",
    month: "",
    houseRent: activeHouse?.defaultPrice || 0,
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

      toast.success("✅ Rent record created successfully");
    } catch (err) {
      console.error("Error creating rent record:", err);
      toast.error(`${err instanceof Error ? err.message : "Unknown error"}`);
    }
  };

  return (
    <div className="w-[90%] mx-auto my-7">
      <div className="flex flex-col md:flex-row justify-around gap-20">
        <div className="w-full md:max-w-[600px]">
          <div className="mb-6">
            <h2 className="text-2xl font-bold">Create Rent Record</h2>
            <p className="text-gray-600 mb-10">
              Fill in the details below to create a new rent record.
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-4 w-full md:max-w-[600px]"
          >
            <CustomInputField
              name="houseName"
              value={activeHouse?.houseName || ""}
              disabled
            />

            <CustomInputField
              type="date"
              name="month"
              value={currentMonthDate}
              disabled
            />

            <CustomInputField
              type="text"
              name="houseRent"
              value={"$" + formData.houseRent}
              disabled
            />

            <CustomInputField
              name="gas"
              value={formData.gas}
              onChange={handleInputChange}
              placeholder="Gas"
            />

            <CustomInputField
              name="electricity"
              value={formData.electricity}
              onChange={handleInputChange}
              placeholder="Electricity"
            />

            <CustomInputField
              name="internet"
              value={formData.internet}
              onChange={handleInputChange}
              placeholder="Internet"
            />

            <CustomInputField
              name="water"
              value={formData.water}
              onChange={handleInputChange}
              placeholder="Water"
            />

            <CustomInputField
              name="totalRent"
              value={`$${totalRent}`}
              placeholder="Total Rent"
              disabled
            />

            <button
              type="submit"
              className="w-full bg-primary-light hover:bg-primary transition-colors duration-300 cursor-pointer text-white py-2 rounded font-semibold"
            >
              Create Rent
            </button>

            {message && <p className="mt-2">{message}</p>}
          </form>
        </div>
        <div className="w-full min-h-screen">
          <div className="mb-6">
            <h1 className="text-2xl font-bold">History of Rents - {3}</h1>
          </div>
          <div className="w-full md:w-[90%] mx-auto flex flex-col gap-4 h-screen overflow-y-auto">
            {[...Array(3)].map((_, index) => (
              <div
                key={index}
                className="border-2 border-gray-300 rounded-md p-3 bg-white shadow-lg flex justify-between items-center"
              >
                <div>
                  <h1 className="text-xl font-bold">
                    {activeHouse?.houseName || "Unknown House"}
                  </h1>
                  <p className="text-gray-600">07/20/2025</p>
                </div>
                <div>
                  <div className="flex flex-col items-end justify-end">
                    <h2 className="text-xl font-bold text-green-700">$3500</h2>
                    <div className="flex gap-3 text-gray-500">
                      <p className="hover:underline cursor-pointer text-blue-600 font-medium">
                        Edit
                      </p>{" "}
                      |{" "}
                      <p className="hover:underline cursor-pointer text-red-500 font-medium">
                        Delete
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
