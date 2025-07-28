"use client";

import Loader from "@/components/Loader/Loader";
import MemberRentList from "@/components/MemberRentList";
import PaymentHistory from "@/components/PaymentHistory";
import { MemberProps, PaymentProps, RentProps } from "@/lib/constants";
import { showErrorMessage } from "@/lib/utils";
import { getMembersByHouseId } from "@/services/houseServices";
import { getPaymentsByRentId, getRentByRentId } from "@/services/rentServices";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

const Page = () => {
  const params = useParams();

  const [rentData, setRentData] = useState<RentProps>();
  const [rentPaymentData, setRentPaymentData] = useState<PaymentProps[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [membersData, setMembersData] = useState<MemberProps[]>([]);
  const [refreshPage, setRefreshPage] = useState<number>(0);

  useEffect(() => {
    const fetchPaymentData = async () => {
      try {
        if (!params.rentId) {
          toast.error("No rent ID found in local storage");
          return;
        }

        const response = await Promise.all([
          getPaymentsByRentId(params?.rentId as string),
          getRentByRentId(params.rentId as string),
        ]);

        if (response[0].status !== 200 || response[1].status !== 200) {
          throw new Error("Failed to fetch rent or payment data");
        }

        setRentPaymentData(response[0].data.payments);
        setRentData(response[1].data.rent);
      } catch (error) {
        showErrorMessage(error as Error);
      }
    };

    fetchPaymentData();
  }, [params.rentId, refreshPage]);

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const response = await getMembersByHouseId(rentData?.houseId || "");

        if (response.status !== 200) {
          throw new Error("Failed to fetch members");
        }

        setMembersData(response.data.members as MemberProps[]);
      } catch (error) {
        console.error("Error fetching member name:", error);
        return "Unknown Member";
      } finally {
        setLoading(false);
      }
    };

    if (rentData?.houseId) {
      fetchMembers();
    }
  }, [rentData?.houseId]);

  if (loading) return <Loader />;

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <MemberRentList
        rentPaymentData={rentPaymentData}
        membersData={membersData!}
        setRefreshPage={setRefreshPage}
      />

      <PaymentHistory
        rentId={params.rentId as string}
        membersData={membersData}
        refreshPage={refreshPage}
      />
    </div>
  );
};

export default Page;
