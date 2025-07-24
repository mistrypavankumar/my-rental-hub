"use client";

import { MemberProps, PaymentProps } from "@/lib/constants";
import { convertCentsToDollars, convertDollarsToCents } from "@/lib/utils";
import React, { useMemo, useState } from "react";
import toast from "react-hot-toast";

interface paymentAmountProps {
  amount: string;
  memberId: string;
  paymentId: string;
}

const MemberRentList = ({
  rentPaymentData,
  membersData,
}: {
  rentPaymentData: PaymentProps[];
  membersData: MemberProps[];
}) => {
  const [isSelectMemberId, setIsSelectMemberId] = useState<string>("");
  const [paymentAmount, setPaymentAmount] = useState<paymentAmountProps>({
    amount: "",
    memberId: "",
    paymentId: "",
  });

  const sumOfHouseRent = useMemo(() => {
    return rentPaymentData.reduce((total, member) => {
      return total + (convertDollarsToCents(member.houseRent) || 0);
    }, 0);
  }, [rentPaymentData]);

  const sumOfGas = useMemo(() => {
    return rentPaymentData.reduce((total, member) => {
      return total + (convertDollarsToCents(member.gas) || 0);
    }, 0);
  }, [rentPaymentData]);

  const sumOfElectricity = useMemo(() => {
    return rentPaymentData.reduce((total, member) => {
      return total + (convertDollarsToCents(member.electricity) || 0);
    }, 0);
  }, [rentPaymentData]);

  const sumOfInternet = useMemo(() => {
    return rentPaymentData.reduce((total, member) => {
      return total + (convertDollarsToCents(member.internet) || 0);
    }, 0);
  }, [rentPaymentData]);

  const sumOfWater = useMemo(() => {
    return rentPaymentData.reduce((total, member) => {
      return total + (convertDollarsToCents(member.water) || 0);
    }, 0);
  }, [rentPaymentData]);

  const totalRent =
    sumOfHouseRent + sumOfGas + sumOfElectricity + sumOfInternet + sumOfWater;

  const sumOfRemainingAmounts = useMemo(() => {
    return rentPaymentData.reduce((total, member) => {
      return total + (convertDollarsToCents(member.remainingAmount!) || 0);
    }, 0);
  }, [rentPaymentData]);

  const getMemberById = (memberId: string) => {
    const member = membersData.find((m) => m._id === memberId);
    return member
      ? {
          name: member.name,
          isSharedRoom: member.stayInSharedRoom,
        }
      : null;
  };

  const handleSelectMember = (paymentId: string, memberId: string) => {
    if (isSelectMemberId === memberId) {
      setIsSelectMemberId("");
      setPaymentAmount({
        amount: "",
        memberId: "",
        paymentId: "",
      });
    } else {
      setIsSelectMemberId(memberId);
      const selectedMember = rentPaymentData.find(
        (member) => member.memberId === memberId
      );

      if (selectedMember) {
        setPaymentAmount({
          amount: selectedMember?.remainingAmount?.toString() || "",
          memberId: memberId,
          paymentId: paymentId,
        });
      }
    }
  };

  const handleUpdatePayment = async () => {
    if (!paymentAmount.memberId || !paymentAmount.paymentId) {
      toast.error("Please select a member to update payment");
      return;
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Member Rent Management</h2>

      <div className="overflow-x-auto">
        <table className="w-full border border-primary text-sm">
          <thead className="bg-primary-light text-white">
            <tr>
              <th className="p-4 border border-primary">Select</th>
              <th className="p-4 border border-primary">Member Name</th>
              <th className="p-4 border border-primary text-nowrap">
                Single/Shared Room
              </th>
              <th className="p-4 border border-primary text-nowrap">
                House Rent
              </th>
              <th className="p-4 border border-primary text-nowrap">Gas</th>
              <th className="p-4 border border-primary text-nowrap">
                Electricity
              </th>
              <th className="p-4 border border-primary text-nowrap">
                Internet
              </th>
              <th className="p-4 border border-primary text-nowrap">Water</th>
              <th className="p-4 border border-primary text-nowrap">Total</th>
              <th className="p-4 border border-primary text-nowrap">
                Remaining
              </th>
              <th className="p-4 border border-primary">Paid</th>
            </tr>
          </thead>
          <tbody>
            {rentPaymentData.map((member, index) => {
              const _member = getMemberById(member.memberId);

              return (
                <tr key={index} className="text-center">
                  <td className="p-2 border">
                    <input
                      type="checkbox"
                      className="w-4 h-4"
                      checked={isSelectMemberId === member.memberId || false}
                      onChange={() =>
                        handleSelectMember(member._id!, member.memberId)
                      }
                    />
                  </td>
                  <td className="p-2 border text-left text-nowrap font-semibold">
                    {_member!.name}
                  </td>
                  <td
                    className={`p-2 border border-primary text-nowrap font-semibold ${
                      _member!.isSharedRoom ? "text-primary" : "text-red-600"
                    }`}
                  >
                    {_member!.isSharedRoom ? "Shared Room" : "Single Room"}
                  </td>
                  <td className="p-2 border">${member.houseRent}</td>
                  <td className="p-2 border">${member.gas}</td>
                  <td className="p-2 border">${member.electricity}</td>
                  <td className="p-2 border">${member.internet}</td>
                  <td className="p-2 border">${member.water}</td>
                  <td className="p-2 border font-semibold">
                    ${member.totalRent}
                  </td>
                  <td className="p-2 border border-primary text-red-600 font-semibold">
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
              <td
                className="p-2 border text-center text-[18px] font-bold"
                colSpan={3}
              >
                Total Amount
              </td>
              <td className="p-2 border text-center font-bold text-[18px]">
                ${convertCentsToDollars(sumOfHouseRent)}
              </td>
              <td className="p-2 border text-center font-bold text-[18px]">
                ${convertCentsToDollars(sumOfGas)}
              </td>
              <td className="p-2 border text-center font-bold text-[18px]">
                ${convertCentsToDollars(sumOfElectricity)}
              </td>
              <td className="p-2 border text-center font-bold text-[18px]">
                ${convertCentsToDollars(sumOfInternet)}
              </td>
              <td className="p-2 border text-center font-bold text-[18px]">
                ${convertCentsToDollars(sumOfWater)}
              </td>
              <td className="p-2 border text-center font-bold text-[18px]">
                ${convertCentsToDollars(totalRent)}
              </td>
              <td className="p-2 border text-center border-primary font-bold text-[18px] text-red-600">
                ${convertCentsToDollars(sumOfRemainingAmounts)}
              </td>
              <td className="p-2 border text-center"></td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className="mt-6 flex justify-between items-end">
        <div>
          <h3 className="text-lg font-bold">Payment Summary</h3>
          <p>Total Rent: ${convertCentsToDollars(totalRent)}</p>
          <p>
            Remaining Amounts: ${convertCentsToDollars(sumOfRemainingAmounts)}
          </p>
        </div>
        <div>
          <input
            type="number"
            placeholder="Enter payment amount"
            value={paymentAmount.amount}
            onChange={(e) =>
              setPaymentAmount({ ...paymentAmount, amount: e.target.value })
            }
            className="border-b-2 border-primary outline-none focus:border-primary-light p-2"
          />
          <button
            onClick={handleUpdatePayment}
            className="ml-4 px-4 py-2 bg-primary hover:bg-primary-light transition-colors duration-300 text-white rounded cursor-pointer"
          >
            Update Payment
          </button>
        </div>
      </div>
    </div>
  );
};

export default MemberRentList;
