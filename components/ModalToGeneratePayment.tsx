"use client";

import { MemberProps, PaymentProps, RentProps } from "@/lib/constants";
import {
  convertCentsToDollars,
  convertDollarsToCents,
  showErrorMessage,
} from "@/lib/utils";

import { generatePayment, updateRentById } from "@/services/rentServices";
import React, { useEffect, useState } from "react";
import { RiLoader5Fill } from "react-icons/ri";
import { useRouter } from "next/navigation";
import { IoClose } from "react-icons/io5";
import { getHouseById, getMembersByHouseId } from "@/services/houseServices";

const ModalToGeneratePayment = ({
  rentData,
  month,
  rentId,
  activeHouse,
  setOpenModel,
  isRentGenerated,
}: {
  rentData: RentProps | null;
  month: string;
  setOpenModel: React.Dispatch<React.SetStateAction<boolean>>;
  rentId: string;
  isRentGenerated: boolean;
  activeHouse?: { houseName: string; houseId: string; defaultPrice: number };
}) => {
  const router = useRouter();
  const [paymentData, setPaymentData] = useState<PaymentProps[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [allMembers, setAllMembers] = useState<MemberProps[]>([]);

  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [activeHouseData, setActiveHouseData] = useState<{
    houseId: string;
    actualHouseRent: number;
    singleRoomRent: number;
    activeHouseMembers: string[];
  }>({
    houseId: "",
    actualHouseRent: 0,
    singleRoomRent: 0,
    activeHouseMembers: [],
  });

  useEffect(() => {
    if (!activeHouse) return;

    const fetchHouseByHouseId = async (houseId: string) => {
      try {
        const response = await getHouseById(houseId);
        if (response.status === 200) {
          const { house } = response.data;

          console.log("House data:", house);

          setActiveHouseData({
            houseId: house._id,
            actualHouseRent: house.defaultPrice || 0,
            singleRoomRent: house.singleRoomRent || 0,
            activeHouseMembers: house.tenants || [],
          });
        }
      } catch (error) {
        showErrorMessage(error as Error);
      }
    };

    fetchHouseByHouseId(activeHouse.houseId);
  }, [activeHouse]);

  useEffect(() => {
    const fetchMembers = async () => {
      if (!activeHouse) return;

      try {
        const response = await getMembersByHouseId(activeHouse.houseId);

        if (response.status === 200) {
          setAllMembers(response.data.members);
        }
      } catch (error) {
        showErrorMessage(error as Error);
      }
    };

    fetchMembers();
  }, [activeHouse]);

  useEffect(() => {
    if (isRentGenerated || (!loading && !isGenerating)) {
      router.push(`/rents/${rentId}/manage`);
    }
  }, [isRentGenerated, loading, isGenerating, rentId, router]);

  const allSingleRoomMembers = allMembers.filter(
    (member) => member.stayInSharedRoom === false
  );

  const allSharedRoomMembers = allMembers.filter(
    (member) => member.stayInSharedRoom === true
  );

  const totalSingleRoomRent =
    activeHouseData.singleRoomRent * allSingleRoomMembers.length;

  const totalSharedRoomRent =
    activeHouseData.actualHouseRent -
    convertDollarsToCents(totalSingleRoomRent);

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
    setIsGenerating(true);
    try {
      if (!rentId || activeHouseData.activeHouseMembers.length === 0) {
        throw new Error("No members found for this house");
      }

      const gasSplit =
        convertDollarsToCents(
          rentData!.gas / activeHouseData.activeHouseMembers.length
        ) || 0;
      const electricitySplit =
        convertDollarsToCents(
          rentData!.electricity / activeHouseData.activeHouseMembers.length
        ) || 0;
      const internetSplit =
        convertDollarsToCents(
          rentData!.internet / activeHouseData.activeHouseMembers.length
        ) || 0;
      const waterSplit =
        convertDollarsToCents(
          rentData!.water / activeHouseData.activeHouseMembers.length
        ) || 0;

      activeHouseData.activeHouseMembers.forEach((id) => {
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

        // const totalRent =
        //   paymentDetails.houseRent +
        //   paymentDetails.gas +
        //   paymentDetails.electricity +
        //   paymentDetails.internet +
        //   paymentDetails.water;

        // allMembers.forEach(async (member) => {
        //   if (member._id === id) {
        //     const message = `Hello ${member.name},\n\nYour rent for the month of ${month} is ready. Your rent of this month is $${totalRent}.\n\nThank you!`;

        //     await sendMessageToMember(member.phone, message);
        //   }
        // });

        generatePayment(paymentDetails)
          .then(async (response) => {
            if (response.status === 201) {
              setPaymentData((prev) => [...prev, response.data.payment]);
            }

            await updateRentById(rentId, {
              isRentGenerated: true,
            });

            router.push(`/rents/${rentId}/manage`);
            setLoading(false);
          })
          .catch((error) => {
            console.error("Error generating payment:", error);
          });
      });
    } catch (error) {
      console.error("Error generating payment:", error);
    }
  };

  if (isRentGenerated || !loading || isGenerating) {
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
