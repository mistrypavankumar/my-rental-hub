import CreateHouseForm from "@/components/CreateHouseForm";
import { createHouseImg } from "@/public/assets";
import Image from "next/image";
import React from "react";

const House = () => {
  const initialFormData = {
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
  };

  return (
    <div className="min-h-dvh py-5 w-[90%] mx-auto">
      <h1 className="text-xl font-bold text-primary">Create a New House</h1>
      <p className="text-sm text-gray-500  mb-10">
        Fill out the form below to add a new house.
      </p>
      <div className="flex flex-col md:flex-row items-center justify-between gap-10">
        <div className="w-full md:max-w-[600px]">
          <CreateHouseForm
            submitLabel="Create House"
            initialFormData={initialFormData}
          />
        </div>
        <div className="w-full flex items-center justify-center">
          <Image
            src={createHouseImg}
            alt="Create House"
            height={700}
            width={700}
          />
        </div>
      </div>
    </div>
  );
};

export default House;
