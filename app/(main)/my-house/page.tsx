"use client";

import CreateHouseForm from "@/components/CreateHouseForm";
import Loader from "@/components/Loader";
import { House } from "@/lib/constants";
import { showErrorMessage } from "@/lib/utils";
import { houseImg } from "@/public/assets";
import { RootState } from "@/redux/store";
import { getHouseById } from "@/services/houseServices";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const Page = () => {
  const { activeHouse } = useSelector((state: RootState) => state.house);

  const [initialFormData, setInitialFormData] = useState<House>();

  const houseId = activeHouse?.houseId;

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const response = await getHouseById(houseId || "");
        if (response.status === 200) {
          setInitialFormData(response.data.house);
        }
      } catch (error) {
        showErrorMessage(error as Error);
      }
    };

    if (houseId) {
      fetchInitialData();
    }
  }, [houseId]);

  if (!initialFormData) {
    return <Loader />;
  }

  return (
    <div className="w-[90%] mx-auto my-10">
      <div>
        <h1 className="text-2xl font-bold">My House</h1>
        <p className="text-gray-600 mb-10">
          Manage your existing house details.
        </p>
      </div>
      <div className="flex flex-col md:flex-row items-center justify-between gap-10">
        <div className="w-full md:max-w-[600px]">
          <CreateHouseForm
            submitLabel="Update House"
            initialFormData={initialFormData as House}
          />
        </div>
        <div className="w-full flex items-center justify-center">
          <Image src={houseImg} alt="House" width={900} height={600} />
        </div>
      </div>
    </div>
  );
};

export default Page;
