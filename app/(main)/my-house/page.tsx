"use client";

import CreateHouseForm from "@/components/CreateHouseForm";
import Loader from "@/components/Loader/Loader";
import { House } from "@/lib/constants";
import { convertCentsToDollars, showErrorMessage } from "@/lib/utils";
import { houseImg } from "@/public/assets";
import { RootState } from "@/redux/store";
import { getHouseById } from "@/services/houseServices";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const Page = () => {
  const { activeHouse } = useSelector((state: RootState) => state.house);

  const [isLoading, setIsLoading] = useState(false);

  const [initialFormData, setInitialFormData] = useState<House | undefined>();

  const houseId = activeHouse?.houseId;

  useEffect(() => {
    let timeout: NodeJS.Timeout;

    const fetchInitialData = async () => {
      setIsLoading(true);
      setInitialFormData(undefined);

      try {
        const response = await getHouseById(houseId || "");
        if (response.status === 200) {
          setInitialFormData(response.data.house);
        }
      } catch (error) {
        showErrorMessage(error as Error);
      } finally {
        timeout = setTimeout(() => {
          setIsLoading(false);
        }, 500);
      }
    };

    if (houseId) {
      fetchInitialData();
    }

    return () => {
      clearTimeout(timeout);
    };
  }, [houseId]);

  if (isLoading || !initialFormData) {
    return <Loader />;
  }

  return (
    <div className="w-[90%] mx-auto my-10">
      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="text-2xl font-bold">My House</h1>
          <p className="text-gray-600">Manage your existing house details.</p>
        </div>
      </div>
      <div className="flex flex-col md:flex-row items-center justify-around gap-10">
        <div className="w-full md:max-w-[600px]">
          <CreateHouseForm
            submitLabel="Update House"
            initialFormData={{
              ...initialFormData,
              defaultPrice: convertCentsToDollars(initialFormData.defaultPrice),
            }}
          />
        </div>
        <div className="w-fit flex items-center justify-center">
          <Image
            src={houseImg}
            loading="lazy"
            alt="House"
            decoding="async"
            data-nimg="1"
            width={900}
            height={600}
          />
        </div>
      </div>
    </div>
  );
};

export default Page;
