import CreateHouseForm from "@/components/CreateHouseForm";
import { createHouseImg } from "@/public/assets";
import Image from "next/image";
import React from "react";

const House = () => {
  return (
    <div className="min-h-dvh py-5 w-[90%] mx-auto">
      <h1 className="text-xl font-bold text-primary">Create a New House</h1>
      <p className="text-sm text-gray-500">
        Fill out the form below to add a new house.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-7 py-5">
        <div>
          <CreateHouseForm />
        </div>
        <div>
          <Image src={createHouseImg} alt="Create House" />
        </div>
      </div>
    </div>
  );
};

export default House;
