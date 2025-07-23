"use client";

import Loader from "@/components/Loader/Loader";
import { MemberProps, PaymentProps, RentProps } from "@/lib/constants";
import {
  convertCentsToDollars,
  convertDollarsToCents,
  showErrorMessage,
} from "@/lib/utils";
import { getMembersByHouseId } from "@/services/houseServices";
import { getPaymentsByRentId, getRentByRentId } from "@/services/rentServices";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

const Page = () => {
  const params = useParams();

  const [rentData, setRentData] = useState<RentProps>();
  const [rentPaymentData, setRentPaymentData] = useState<PaymentProps[]>([]);
  const [isSelectMemberId, setIsSelectMemberId] = useState<string>("");
  const [membersData, setMembersData] = useState<MemberProps[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

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
  }, [params.rentId]);

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

  const sumOfHouseRent = () => {
    return rentPaymentData.reduce((total, member) => {
      return total + (convertDollarsToCents(member.houseRent) || 0);
    }, 0);
  };

  const sumOfGas = () => {
    return rentPaymentData.reduce((total, member) => {
      return total + (convertDollarsToCents(member.gas) || 0);
    }, 0);
  };

  const sumOfElectricity = () => {
    return rentPaymentData.reduce((total, member) => {
      return total + (convertDollarsToCents(member.electricity) || 0);
    }, 0);
  };

  const sumOfInternet = () => {
    return rentPaymentData.reduce((total, member) => {
      return total + (convertDollarsToCents(member.internet) || 0);
    }, 0);
  };

  const sumOfWater = () => {
    return rentPaymentData.reduce((total, member) => {
      return total + (convertDollarsToCents(member.water) || 0);
    }, 0);
  };

  const totalRent =
    sumOfHouseRent() +
    sumOfGas() +
    sumOfElectricity() +
    sumOfInternet() +
    sumOfWater();

  const sumOfRemainingAmounts = () => {
    return rentPaymentData.reduce((total, member) => {
      return total + (convertDollarsToCents(member.remainingAmount!) || 0);
    }, 0);
  };

  const getMemberNameById = (memberId: string) => {
    const member = membersData.find((m) => m._id === memberId);
    return member ? member.name : "Unknown Member";
  };

  const handleSelectMember = (memberId: string) => {
    if (isSelectMemberId === memberId) {
      setIsSelectMemberId("");
    } else {
      setIsSelectMemberId(memberId);
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Member Rent Management</h2>
      <table className="w-full border border-gray-300 text-sm">
        <thead className="bg-primary-light text-white">
          <tr>
            <th className="p-4 border">Select</th>
            <th className="p-4 border">Member Name</th>
            <th className="p-4 border">House Rent</th>
            <th className="p-4 border">Gas</th>
            <th className="p-4 border">Electricity</th>
            <th className="p-4 border">Internet</th>
            <th className="p-4 border">Water</th>
            <th className="p-4 border">Total</th>
            <th className="p-4 border">Remaining</th>
            <th className="p-4 border">Paid</th>
          </tr>
        </thead>
        <tbody>
          {rentPaymentData.map((member, index) => {
            const memberName = getMemberNameById(member.memberId);

            return (
              <tr key={index} className="text-center">
                <td className="p-2 border">
                  <input
                    type="checkbox"
                    className="w-4 h-4"
                    checked={isSelectMemberId === member.memberId || false}
                    onChange={() => handleSelectMember(member.memberId)}
                  />
                </td>
                <td className="p-2 border text-left">{memberName}</td>
                <td className="p-2 border">${member.houseRent}</td>
                <td className="p-2 border">${member.gas}</td>
                <td className="p-2 border">${member.electricity}</td>
                <td className="p-2 border">${member.internet}</td>
                <td className="p-2 border">${member.water}</td>
                <td className="p-2 border font-semibold">
                  ${member.totalRent}
                </td>
                <td className="p-2 border text-red-600 font-semibold">
                  ${member.remainingAmount}
                </td>
                <td className="p-2 border">
                  {member.paid ? (
                    <span className="text-green-600 font-semibold">Yes</span>
                  ) : (
                    <span className="text-yellow-600 font-semibold">No</span>
                  )}
                </td>
              </tr>
            );
          })}
          <tr>
            <td className="p-2 border"></td>
            <td className="p-2 border"></td>
            <td className="p-2 border text-center font-bold">
              ${convertCentsToDollars(sumOfHouseRent())}
            </td>
            <td className="p-2 border text-center font-bold">
              ${convertCentsToDollars(sumOfGas())}
            </td>
            <td className="p-2 border text-center font-bold">
              ${convertCentsToDollars(sumOfElectricity())}
            </td>
            <td className="p-2 border text-center font-bold">
              ${convertCentsToDollars(sumOfInternet())}
            </td>
            <td className="p-2 border text-center font-bold">
              ${convertCentsToDollars(sumOfWater())}
            </td>
            <td className="p-2 border text-center font-bold">
              ${convertCentsToDollars(totalRent)}
            </td>
            <td className="p-2 border text-center font-bold text-red-600">
              ${convertCentsToDollars(sumOfRemainingAmounts())}
            </td>
            <td className="p-2 border text-center"></td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default Page;
