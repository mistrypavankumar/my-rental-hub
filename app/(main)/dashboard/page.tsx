"use client";

import { convertCentsToDollars } from "@/lib/utils";
import { RootState } from "@/redux/store";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { FaHistory } from "react-icons/fa";
import { FaCubes, FaHouseChimney } from "react-icons/fa6";
import { HiUserGroup } from "react-icons/hi";
import { useSelector } from "react-redux";

const Page = () => {
  const router = useRouter();
  const { houses, activeHouse } = useSelector(
    (state: RootState) => state.house
  );

  const activeHouseDetails = houses.find(
    (house) => house._id === activeHouse?.houseId
  );

  const [analysisData, setAnalysisData] = useState({
    totalRooms: 0,
    totalMembers: 0,
    totalRent: 0,
  });

  useEffect(() => {
    if (activeHouseDetails) {
      setAnalysisData({
        totalRooms: activeHouseDetails.rooms || 0,
        totalMembers: activeHouseDetails.tenants?.length || 0,
        totalRent: convertCentsToDollars(activeHouseDetails.defaultPrice) || 0,
      });
    }
  }, [activeHouseDetails, router]);

  const { totalRooms, totalMembers, totalRent } = analysisData;

  return (
    <div className="min-h-dvh py-5 w-[90%] mx-auto">
      {!activeHouseDetails && (
        <div className="flex flex-col items-center justify-center gap-5 mb-10 bg-red-100 p-5 rounded-lg">
          <p className="text-red-600 text-lg">
            Please create a new house to get started. Go to profile dropdown and
            click on <span className="font-semibold underline">New House</span>.
          </p>
        </div>
      )}

      <h1 className="text-xl font-bold text-primary">Dashboard</h1>
      <p className="text-sm text-gray-500">
        Overview of your properties and their status.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-10">
        <AnalyticsCard
          title="House Rent"
          value={`$${totalRent}`}
          icon={<FaHouseChimney />}
        />

        <AnalyticsCard
          title="Total Rooms"
          value={totalRooms.toString()}
          icon={<FaCubes />}
        />

        <AnalyticsCard
          title="Total Members"
          value={totalMembers.toString()}
          icon={<HiUserGroup />}
        />

        <AnalyticsCard
          title="Total Rents History"
          value="12"
          icon={<FaHistory />}
        />
      </div>
    </div>
  );
};

export default Page;

const AnalyticsCard = ({
  title,
  value,
  icon,
}: {
  title: string;
  value: string;
  icon: React.ReactNode;
}) => {
  return (
    <div className="bg-white border-2 border-gray-200 p-4 rounded-lg shadow-md flex flex-col gap-4 h-[150px]">
      <div className="text-2xl flex items-center justify-between w-full">
        <h3 className="text-lg font-semibold text-gray-500">{title}</h3>
        <span className="w-7 h-7 border-2 border-gray-500 rounded-lg text-lg flex items-center justify-center text-gray-500">
          {icon}
        </span>
      </div>
      <div>
        <p className="text-3xl font-bold text-primary">{value}</p>
      </div>
    </div>
  );
};
