"use client";

import { showErrorMessage } from "@/lib/utils";
import { createHouse } from "@/services/houseServices";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import toast from "react-hot-toast";

const CreateHouseForm = () => {
  const router = useRouter();
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
        router.replace("/dashboard");
      }
    } catch (error) {
      showErrorMessage(error as Error);
    }
  };
  return (
    <div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <CustomInputField
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          placeholder="House Name*"
          required
        />

        <div className="grid grid-cols-2 gap-4">
          <CustomInputField
            name="address.street"
            value={formData.address.street}
            onChange={handleInputChange}
            placeholder="Street*"
            required
          />
          <CustomInputField
            type="text"
            name="address.city"
            value={formData.address.city}
            onChange={handleInputChange}
            placeholder="City*"
            required
          />
          <CustomInputField
            type="text"
            name="address.state"
            value={formData.address.state}
            onChange={handleInputChange}
            placeholder="State*"
            required
          />
          <CustomInputField
            type="text"
            name="address.zipCode"
            value={formData.address.zipCode}
            onChange={handleInputChange}
            placeholder="Zip Code*"
            required
          />
        </div>

        <CustomInputField
          type="text"
          name="ownerName"
          value={formData.ownerName}
          onChange={handleInputChange}
          placeholder="Owner Name*"
          required
        />

        <CustomInputField
          type="text"
          name="ownerPhone"
          value={formData.ownerPhone}
          onChange={handleInputChange}
          placeholder="Owner Phone (+1856...)*"
          required
        />

        <CustomInputField
          type="number"
          name="defaultPrice"
          value={formData.defaultPrice}
          onChange={handleInputChange}
          placeholder="Default Rent Price"
          required
          label="Default Rent Price"
        />

        <label className="flex items-center space-x-2 text-sm">
          <input
            type="checkbox"
            name="utilitiesIncluded"
            checked={formData.utilitiesIncluded}
            onChange={handleInputChange}
            className="accent-primary"
          />
          <span>Utilities Included</span>
        </label>

        <CustomInputField
          type="date"
          name="paymentDueDate"
          value={formData.paymentDueDate.toString().substring(0, 10)}
          onChange={handleInputChange}
          label="Payment Due Date"
          required
        />

        <CustomInputField
          type="number"
          name="lateFeePerDay"
          value={formData.lateFeePerDay}
          onChange={handleInputChange}
          placeholder="Late Fee Per Day"
          label="Late Fee Per Day"
          required
        />

        <CustomInputField
          type="number"
          name="rooms"
          value={formData.rooms}
          onChange={handleInputChange}
          placeholder="Total Rooms"
          label="Total Rooms"
          required
        />

        <div className="grid grid-cols-2 gap-4">
          <CustomInputField
            type="number"
            name="singleRoomRent"
            value={formData.singleRoomRent}
            onChange={handleInputChange}
            placeholder="Single Room Rent"
            label="Single Room Rent"
          />
          <CustomInputField
            type="number"
            name="sharedRoomRent"
            value={formData.sharedRoomRent}
            onChange={handleInputChange}
            placeholder="Shared Room Rent"
            label="Shared Room Rent"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-primary-light hover:bg-primary transition-colors duration-300 cursor-pointer text-white py-2 rounded font-semibold"
        >
          Create House
        </button>
      </form>
    </div>
  );
};

export default CreateHouseForm;

interface CustomInputFieldProps {
  value: string | number;
  type?: string;
  name: string;
  placeholder?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  label?: string;
}

const CustomInputField = ({
  value,
  type = "text",
  name,
  placeholder,
  onChange,
  required = false,
  label,
}: CustomInputFieldProps) => {
  return (
    <div className="relative">
      <label
        htmlFor={name}
        className="absolute top-[-10px] left-[12px] bg-white block text-sm font-medium text-gray-700"
      >
        {label}
        {label && <span className="text-red-500">{required ? "*" : ""}</span>}
      </label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full border border-gray-400 px-4 py-2 rounded"
        required={required}
      />
    </div>
  );
};
