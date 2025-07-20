"use client";

import CustomInputField from "@/components/CustomInputField";
import { showErrorMessage } from "@/lib/utils";
import { RootState } from "@/redux/store";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const Page = () => {
  const { activeHouse } = useSelector((state: RootState) => state.house);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    houseId: "",
    role: "tenant",
    stayInSharedRoom: false,
  });

  const [message, setMessage] = useState("");

  useEffect(() => {
    if (activeHouse) {
      setFormData((prev) => ({
        ...prev,
        houseId: activeHouse?.houseId,
      }));
    }
  }, [activeHouse]);

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
    } catch (error) {
      showErrorMessage(error as Error);
    }
  };

  return (
    <div className="w-[90%] mx-auto my-7">
      <div className="flex flex-col md:flex-row justify-around gap-20">
        <div className="w-full md:max-w-[600px]">
          <div className="mb-6">
            <h2 className="text-2xl font-bold">Add New Member</h2>
            <p className="text-gray-600 mb-10">
              Fill in the details below to add a new member to your house.
            </p>
          </div>
          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-4 w-full md:max-w-[600px]"
          >
            <CustomInputField
              name="name"
              placeholder="Name"
              value={formData.name}
              onChange={handleInputChange}
              required
            />

            <CustomInputField
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Email"
              required
            />

            <CustomInputField
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              placeholder="Phone number"
              required
            />

            <CustomInputField
              name="houseName"
              value={activeHouse?.houseName || ""}
              disabled
            />

            <select
              name="role"
              value={formData.role}
              onChange={handleInputChange}
              className="w-full border border-gray-400 px-4 py-2 rounded outline-none"
            >
              <option value="owner">Owner</option>
              <option value="tenant">Tenant</option>
            </select>

            <select
              name="stayInSharedRoom"
              value={formData.stayInSharedRoom.toString()}
              onChange={handleInputChange}
              className="w-full border border-gray-400 px-4 py-2 rounded outline-none"
            >
              <option value="true">Staying in Shared Room</option>
              <option value="false">Staying in Single Room</option>
            </select>

            <button
              type="submit"
              className="w-full bg-primary-light hover:bg-primary transition-colors duration-300 cursor-pointer text-white py-2 rounded font-semibold"
            >
              Add Member
            </button>

            {message && <p className="mt-2">{message}</p>}
          </form>
        </div>

        <div className="w-full min-h-screen">
          <div className="mb-6">
            <h1 className="text-2xl font-bold">
              Members of {activeHouse?.houseName || "Unknown House"} - {3}
            </h1>
          </div>
          <div className="w-full md:w-[90%] mx-auto flex flex-col gap-4 h-screen overflow-y-auto">
            {[...Array(3)].map((_, index) => (
              <div
                key={index}
                className="border-2 border-gray-300 rounded-md p-3 bg-white shadow-lg flex justify-between items-center"
              >
                <div>
                  <h1 className="text-xl font-bold">Pavan Kumar</h1>
                  <p className="text-gray-600">07/20/2025</p>
                </div>
                <div>
                  <div className="flex flex-col items-end justify-end">
                    <h2 className="text-xl font-bold text-green-700">
                      Tenant | Single room
                    </h2>
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
