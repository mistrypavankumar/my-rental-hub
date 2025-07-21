"use client";

import CustomInputField from "@/components/CustomInputField";
import MemberRecord from "@/components/MemberRecord";
import { MemberProps } from "@/lib/constants";
import { showErrorMessage } from "@/lib/utils";
import { RootState } from "@/redux/store";
import { createMember, updateMemberById } from "@/services/houseServices";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";

const Page = () => {
  const { activeHouse } = useSelector((state: RootState) => state.house);
  const [refreshKey, setRefreshKey] = useState(0);
  const [formMode, setFormMode] = useState("create");

  const [formData, setFormData] = useState<MemberProps>({
    _id: "",
    name: "",
    email: "",
    phone: "",
    houseId: "",
    role: "tenant",
    stayInSharedRoom: false,
  });

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

    try {
      let response = null;

      if (formMode === "create") {
        response = await createMember(formData);
      } else if (formMode === "edit") {
        response = await updateMemberById(formData._id!, formData);
      }

      if (response!.status !== 201 && response!.status !== 200) {
        throw new Error(
          `Failed to ${formMode === "create" ? "create" : "update"} member`
        );
      }

      toast.success(
        `Member ${formMode === "create" ? "added" : "updated"} successfully!`
      );
      setRefreshKey((prev) => prev + 1);

      setFormData({
        name: "",
        email: "",
        phone: "",
        houseId: activeHouse?.houseId || "",
        role: "tenant",
        stayInSharedRoom: false,
      });

      setFormMode("create");
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
              value={formData.stayInSharedRoom!.toString()}
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
              {formMode === "create" ? "Add Member" : "Update Member"}
            </button>
          </form>
        </div>

        <div className="w-full min-h-screen">
          <MemberRecord
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
