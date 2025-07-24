"use client";

import { MemberProps, PaymentProps, RentProps } from "@/lib/constants";
import {
  convertCentsToDollars,
  convertDollarsToCents,
  setInLocalStorage,
} from "@/lib/utils";
import { generatePayment, getPaymentsByRentId } from "@/services/rentServices";
import React, { useEffect, useState } from "react";
import { RiLoader5Fill } from "react-icons/ri";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { IoClose } from "react-icons/io5";
import { getMembersByHouseId } from "@/services/houseServices";

const ModalToGeneratePayment = ({
  rentData,
  month,
  rentId,
  activeHouse,
  setOpenModel,
}: {
  rentData: RentProps | null;
  month: string;
  setOpenModel: React.Dispatch<React.SetStateAction<boolean>>;
  rentId: string;
  activeHouse?: { houseName: string; houseId: string; defaultPrice: number };
}) => {
  const router = useRouter();
  const { houses } = useSelector((state: RootState) => state.house);
  const [paymentData, setPaymentData] = useState<PaymentProps[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [allMembers, setAllMembers] = useState<MemberProps[]>([]);

  useEffect(() => {
    if (!activeHouse) {
      setLoading(false);
      return;
    }
  }, [activeHouse]);

  useEffect(() => {
    const fetchPayments = async () => {
      if (!rentId) return;

      try {
        const response = await getPaymentsByRentId(rentId);

        if (response.status !== 200) {
          throw new Error("Failed to fetch payment records");
        }

        if (response.data.payments.length > 0) {
          setPaymentData(response.data.payments);
          setInLocalStorage("rentId", rentId);
          router.push(`/rents/${rentId}/manage`);
        }
      } catch (error) {
        console.error("Error fetching payment records:", error);
        setLoading(false);
      }
    };

    fetchPayments();
  }, [rentId, router]);

  useEffect(() => {
    const fetchMembers = async () => {
      if (!activeHouse) return;

      try {
        const response = await getMembersByHouseId(activeHouse.houseId);

        if (response.status === 200) {
          setAllMembers(response.data.members);
        }
      } catch (error) {
        console.error("Error fetching members:", error);
      }
    };

    if (activeHouse?.houseId) {
      fetchMembers();
    }
  }, [activeHouse]);

  const activeHouseData = houses.find(
    (house) => house._id === activeHouse?.houseId
  );

  const activeHouseMembers = activeHouseData?.tenants;
  const actutalHouseRent = activeHouseData?.defaultPrice || 0;

  const singleRoomRent = activeHouseData?.singleRoomRent || 0;

  const allSingleRoomMembers = allMembers.filter(
    (member) => member.stayInSharedRoom === false
  );

  const allSharedRoomMembers = allMembers.filter(
    (member) => member.stayInSharedRoom === true
  );

  const totalSingleRoomRent = singleRoomRent * allSingleRoomMembers.length;

  const totalSharedRoomRent =
    actutalHouseRent! - convertDollarsToCents(totalSingleRoomRent);

  const getHouseSplitByMember = (memberId: string) => {
    const member = allMembers.find((m) => m._id === memberId);
    if (!member) return 0;

    if (member.stayInSharedRoom) {
      return convertCentsToDollars(
        totalSharedRoomRent / allSharedRoomMembers.length
      );
    } else {
      return totalSingleRoomRent / allSingleRoomMembers.length;
    }
  };

  const handleGeneratePayment = async () => {
    try {
      if (!rentId || !activeHouseMembers || activeHouseMembers.length === 0) {
        throw new Error("No members found for this house");
      }

      const gasSplit =
        convertDollarsToCents(rentData!.gas / activeHouseMembers.length) || 0;
      const electricitySplit =
        convertDollarsToCents(
          rentData!.electricity / activeHouseMembers.length
        ) || 0;
      const internetSplit =
        convertDollarsToCents(rentData!.internet / activeHouseMembers.length) ||
        0;
      const waterSplit =
        convertDollarsToCents(rentData!.water / activeHouseMembers.length) || 0;

      activeHouseMembers.forEach((id) => {
        const paymentDetails = {
          rentId,
          memberId: id,
          houseId: activeHouse?.houseId || "",
          month,
          houseRent: getHouseSplitByMember(id),
          gas: convertCentsToDollars(gasSplit),
          electricity: convertCentsToDollars(electricitySplit),
          internet: convertCentsToDollars(internetSplit),
          water: convertCentsToDollars(waterSplit),
          paid: false,
        };

        setLoading(true);

        generatePayment(paymentDetails)
          .then((response) => {
            if (response.status === 201) {
              setPaymentData((prev) => [...prev, response.data.payment]);
            }

            router.push(`/rents/${rentId}/manage`);
          })
          .catch((error) => {
            console.error("Error generating payment:", error);
          });
      });
    } catch (error) {
      console.error("Error generating payment:", error);
    }
  };

  if (loading) {
    return (
      <div className="fixed backdrop-blur-md z-40 inset-0 top-0 left-0 bg-primary/80 min-h-screen w-full ">
        <div>
          <div
            className={`w-[min(500px,90%)] mx-auto mt-20 bg-white p-6 rounded-lg shadow-lg ${
              paymentData.length > 0 ? "h-[200px] overflow-y-auto" : "h-[200px]"
            }`}
          >
            <div className="flex flex-col justify-center items-center h-full">
              <p>Redirecting...</p>
              <RiLoader5Fill size={50} className="animate-spin text-primary" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed backdrop-blur-md z-40 inset-0 top-0 left-0 bg-primary/80 min-h-screen w-full ">
      <div>
        <div
          className={`w-[min(500px,90%)] mx-auto flex flex-col justify-between group relative mt-20 bg-white p-6 rounded-lg shadow-lg ${
            paymentData.length > 0 ? "h-[200px] overflow-y-auto" : "h-[200px]"
          }`}
        >
          <IoClose
            onClick={() => setOpenModel(false)}
            className="text-2xl absolute top-3 right-6 cursor-pointer hidden group-hover:block transition-all duration-300"
          />

          <div>
            <h2 className="text-2xl font-bold">
              Generate {month} Month Payment
            </h2>
            <p className="mb-4">
              Please review the Rent details before generating the payment.
            </p>
          </div>

          <button
            onClick={handleGeneratePayment}
            className="bg-primary-light hover:bg-primary text-white py-2 px-4 rounded block ml-auto cursor-pointer"
          >
            Generate Payment
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalToGeneratePayment;
