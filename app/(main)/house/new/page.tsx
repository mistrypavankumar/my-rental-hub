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
  };

  return (
    <div className="w-[90%] mx-auto my-10">
      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="text-2xl font-bold">Create a New House</h1>
          <p className="text-gray-600">
            {" "}
            Fill out the form below to add a new house.
          </p>
        </div>
      </div>
      <div className="flex flex-col md:flex-row items-center justify-around gap-10">
        <div className="w-full md:max-w-[600px]">
          <CreateHouseForm
            submitLabel="Create House"
            initialFormData={initialFormData}
          />
        </div>
        <div className="w-fit flex items-center justify-center">
          {" "}
          <Image
            src={createHouseImg}
            alt="Create House"
            height={900}
            width={600}
          />
        </div>
      </div>
    </div>
  );
};

export default House;
