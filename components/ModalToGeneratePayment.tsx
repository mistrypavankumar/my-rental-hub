"use client";

import { PaymentProps, RentProps } from "@/lib/constants";
import { setInLocalStorage } from "@/lib/utils";
import { generatePayment, getPaymentsByRentId } from "@/services/rentServices";
import React, { useEffect, useState } from "react";
import { RiLoader5Fill } from "react-icons/ri";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

const ModalToGeneratePayment = ({
  rentData,
  month,
  rentId,
  activeHouse,
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

  const activeHouseMembers = houses.find(
    (house) => house._id === activeHouse?.houseId
  )?.tenants;

  const handleGeneratePayment = async () => {
    try {
      if (!rentId || !activeHouseMembers || activeHouseMembers.length === 0) {
        throw new Error("No members found for this house");
      }

      const houseRentSplit =
        rentData!.houseRent / activeHouseMembers.length || 0;

      const gasSplit = rentData!.gas / activeHouseMembers!.length || 0;
      const electricitySplit =
        rentData!.electricity / activeHouseMembers!.length || 0;
      const internetSplit =
        rentData!.internet / activeHouseMembers!.length || 0;
      const waterSplit = rentData!.water / activeHouseMembers!.length || 0;

      activeHouseMembers.forEach((id) => {
        const paymentDetails = {
          rentId,
          memberId: id,
          houseId: activeHouse?.houseId || "",
          month,
          houseRent: houseRentSplit,
          gas: gasSplit,
          electricity: electricitySplit,
          internet: internetSplit,
          water: waterSplit,
          remainingAmount: 0,
          paid: false,
        };

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
              paymentData.length > 0 ? "h-[200px] overflow-y-auto" : "h-auto"
            }`}
          >
            <div className="flex flex-col justify-center items-center h-full">
              <p>Redirecting...</p>
              <RiLoader5Fill size={50} className="animate-spin" />
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
          className={`w-[min(500px,90%)] mx-auto mt-20 bg-white p-6 rounded-lg shadow-lg ${
            paymentData.length > 0 ? "h-[200px] overflow-y-auto" : "h-auto"
          }`}
        >
          <h2 className="text-2xl font-bold">Generate {month} Month Payment</h2>
          <p className="mb-4">
            Click the button below to generate the payment for the month of{" "}
            {month}.
          </p>

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
