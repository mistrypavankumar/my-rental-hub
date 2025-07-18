"use client";

import { RootState } from "@/redux/store";
import React from "react";
import { useSelector } from "react-redux";

const Page = () => {
  const { activeHouse } = useSelector((state: RootState) => state.house);

  console.log("Active House:", activeHouse);

  return <div>{activeHouse?.houseId}</div>;
};

export default Page;
