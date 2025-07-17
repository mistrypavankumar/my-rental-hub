"use client";

import React from "react";
import { FaCubes, FaHouseChimney } from "react-icons/fa6";
import { HiUserGroup } from "react-icons/hi";

const Page = () => {
  return (
    <div className="min-h-dvh py-5 w-[90%] mx-auto">
      <h1 className="text-xl font-bold text-primary">Dashboard</h1>
      <p className="text-sm text-gray-500">
        Overview of your properties and their status.
      </p>

      <div className="grid grid-cols-4 gap-4 mt-10">
        <AnalyticsCard
          title="House Rent"
          value="$2850"
          icon={<FaHouseChimney />}
        />

        <AnalyticsCard title="Total Rooms" value="5" icon={<FaCubes />} />

        <AnalyticsCard
          title="Total Members"
          value="12"
          icon={<HiUserGroup />}
        />

        <AnalyticsCard
          title="Total Rents History"
          value="12"
          icon={<HiUserGroup />}
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
    <div className="bg-white border-2 border-gray-200 p-4 rounded-lg shadow-md flex flex-col gap-4">
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
