"use client";

import {
  convertDollarsToCents,
  setObjectInLocalStorage,
  showErrorMessage,
} from "@/lib/utils";
import {
  createHouse,
  deleteHouse,
  updateHouse,
} from "@/services/houseServices";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import CustomInputField from "./CustomInputField";
import { House } from "@/lib/constants";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { setLoading } from "@/redux/slices/authSlice";
import { setPrefetchHouses } from "@/redux/slices/houseSlice";

const CreateHouseForm = ({
  initialFormData,
  submitLabel,
}: {
  initialFormData: House;
  submitLabel: string;
}) => {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const [formData, setFormData] = useState(initialFormData);
  const [customSingleRoomRent, setCustomSingleRoomRent] = useState(
    formData.singleRoomRent
  );

  useEffect(() => {
    if (customSingleRoomRent) {
      setFormData((prev) => ({
        ...prev,
        singleRoomRent: customSingleRoomRent,
      }));

      return;
    }

    if (formData.rooms > 0 && formData.defaultPrice > 0) {
      setFormData((prev) => ({
        ...prev,
        singleRoomRent: prev.defaultPrice / (prev.rooms || 1) || 0,
      }));
    }
  }, [formData.rooms, formData.defaultPrice, customSingleRoomRent]);

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
      dispatch(setLoading(true));

      if (submitLabel === "Update House") {
        const response = await updateHouse(formData._id!, {
          ...formData,
          defaultPrice: convertDollarsToCents(formData.defaultPrice),
          singleRoomRent: customSingleRoomRent || formData.singleRoomRent,
        });

        if (response.status === 200) {
          toast.success("House is updated successfully");

          router.replace("/dashboard");
        }
      } else if (submitLabel === "Create House") {
        const response = await createHouse({
          ...formData,
          defaultPrice: convertDollarsToCents(formData.defaultPrice),
        });

        if (response.status === 201) {
          toast.success("House is created successfully");
          router.replace("/dashboard");
        }
      }
    } catch (error) {
      showErrorMessage(error as Error);
    } finally {
      dispatch(setLoading(false));
      dispatch(setPrefetchHouses(true));

      // set the active house in local storage
      setObjectInLocalStorage("activeHouse", {
        houseId: formData._id!,
        houseName: formData.name,
        defaultPrice: formData.defaultPrice || 0,
      });
    }
  };

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault();

    if (!formData._id) {
      toast.error("House ID is missing");
      return;
    }

    try {
      const res = await deleteHouse(formData._id);

      if (res.status === 200) {
        toast.success("House deleted successfully");
        setObjectInLocalStorage("activeHouse", {});
        router.replace("/dashboard");
      }

      dispatch(setPrefetchHouses(true));
      dispatch(setLoading(false));
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
          placeholder="Default Monthly Rent Price"
          required
          label="Default Monthly Rent Price"
        />

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

        <div className="grid grid-cols-2 gap-4">
          <CustomInputField
            type="number"
            name="rooms"
            value={formData.rooms}
            onChange={handleInputChange}
            placeholder="Total Rooms"
            label="Total Rooms"
            required
          />
          <CustomInputField
            type="number"
            name="singleRoomRent"
            value={customSingleRoomRent || formData.singleRoomRent}
            onChange={(e) => setCustomSingleRoomRent(Number(e.target.value))}
            placeholder="Single Room Rent"
            label="Single Room Rent"
          />
        </div>

        <div className="flex items-center justify-between gap-10">
          <button
            type="submit"
            className="w-full bg-primary-light hover:bg-primary transition-colors duration-300 cursor-pointer text-white py-2 rounded font-semibold"
          >
            {submitLabel}
          </button>

          {submitLabel === "Update House" && (
            <button
              onClick={handleDelete}
              className="w-full bg-red-600 hover:bg-red-500 transition-colors duration-300 cursor-pointer text-white py-2 rounded font-semibold"
            >
              Delete House
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default CreateHouseForm;
