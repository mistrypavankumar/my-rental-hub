"use client";

import { showErrorMessage } from "@/lib/utils";
import { createHouse } from "@/services/houseServices";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import toast from "react-hot-toast";
import CustomInputField from "./CustomInputField";
import { House } from "@/lib/constants";

const CreateHouseForm = ({
  initialFormData,
  submitLabel,
}: {
  initialFormData: House;
  submitLabel: string;
}) => {
  const router = useRouter();
  const [formData, setFormData] = useState(initialFormData);

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
          {submitLabel}
        </button>
      </form>
    </div>
  );
};

export default CreateHouseForm;
