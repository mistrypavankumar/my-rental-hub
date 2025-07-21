"use client";

import CustomInputField from "@/components/CustomInputField";
import RentRecord from "@/components/RentRecord";
import { RentProps } from "@/lib/constants";
import { showErrorMessage } from "@/lib/utils";
import { RootState } from "@/redux/store";
import { createRent, updateRentById } from "@/services/houseServices";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";

const Page = () => {
  const { activeHouse } = useSelector((state: RootState) => state.house);

  const [refreshKey, setRefreshKey] = useState(0);
  const [formMode, setFormMode] = useState("create");

  const currentMonthDate = new Date().toISOString().split("T")[0];

  const [formData, setFormData] = useState<RentProps>({
    houseId: activeHouse?.houseId || "",
    month: currentMonthDate,
    houseRent: activeHouse?.defaultPrice || 0,
    gas: 0,
    electricity: 0,
    internet: 0,
    water: 0,
    totalRent: 0,
    splitAmount: 0,
    lateFeeApplied: false,
    lateFeeAmount: 0,
    reasonForLateFee: "",
  });

  useEffect(() => {
    if (activeHouse) {
      setFormData((prev) => ({
        ...prev,
        houseId: activeHouse?.houseId,
        month: currentMonthDate,
        houseRent: activeHouse?.defaultPrice || 0,
      }));
    }
  }, [activeHouse, currentMonthDate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const totalRent =
    Number(formData.houseRent) +
    Number(formData.gas) +
    Number(formData.electricity) +
    Number(formData.internet) +
    Number(formData.water);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      let response = null;

      if (formMode === "create") {
        response = await createRent(formData);
      } else if (formMode === "edit") {
        response = await updateRentById(formData._id!, formData);
      }

      if (response!.status !== 201 && response!.status !== 200) {
        throw new Error(
          `Failed to ${formMode === "create" ? "create" : "update"} rent record`
        );
      }

      toast.success(
        `Rent record ${
          formMode === "create" ? "created" : "updated"
        } successfully`
      );

      setRefreshKey((prev) => prev + 1);
      setFormData({
        houseId: activeHouse?.houseId || "",
        month: currentMonthDate,
        houseRent: activeHouse?.defaultPrice || 0,
        gas: 0,
        electricity: 0,
        internet: 0,
        water: 0,
        totalRent: 0,
        splitAmount: 0,
        lateFeeApplied: false,
        lateFeeAmount: 0,
        reasonForLateFee: "",
      });

      setFormMode("create");
    } catch (err) {
      showErrorMessage(err as Error);
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
              label="Gas"
            />

            <CustomInputField
              name="electricity"
              value={formData.electricity}
              onChange={handleInputChange}
              placeholder="Electricity"
              label="Electricity"
            />

            <CustomInputField
              name="internet"
              value={formData.internet}
              onChange={handleInputChange}
              placeholder="Internet"
              label="Internet"
            />

            <CustomInputField
              name="water"
              value={formData.water}
              onChange={handleInputChange}
              placeholder="Water"
              label="Water"
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
              {formMode === "create"
                ? "Create Rent Record"
                : "Update Rent Record"}
            </button>
          </form>
        </div>
        <div className="w-full min-h-screen">
          <RentRecord
            key={refreshKey}
            activeHouse={activeHouse}
            setFormData={setFormData}
            setFormMode={setFormMode}
          />
        </div>
      </div>
    </div>
  );
};

export default Page;
