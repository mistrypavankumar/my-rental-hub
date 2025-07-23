"use client";

import React, { useEffect, useState } from "react";

const initialRentData = [
  {
    memberId: "64d2f6a5a4567c001234abcd",
    houseId: "64d2f6c3a4567c001234efgh",
    rentId: "64d2f6e8a4567c001234ijkl",
    houseRent: 500,
    gas: 40,
    electricity: 60,
    internet: 30,
    water: 20,
    totalRent: 650,
    paidAmount: 300,
    remainingAmount: 350,
    paid: false,
    notified: false,
  },
  {
    memberId: "64d2f6a5a4567c001234mnop",
    houseId: "64d2f6c3a4567c001234qrst",
    rentId: "64d2f6e8a4567c001234uvwx",
    houseRent: 600,
    gas: 50,
    electricity: 70,
    internet: 40,
    water: 30,
    totalRent: 790,
    paidAmount: 400,
    remainingAmount: 390,
    paid: false,
    notified: false,
  },
];

const Page = () => {
  const [singleRoomRent, setSingleRoomRent] = useState(1000);
  const [sharedRoomRent, setSharedRoomRent] = useState(700);
  const [rentData, setRentData] = useState(initialRentData);
  const [isSelectMemberId, setIsSelectMemberId] = useState<string>("");

  useEffect(() => {});

  const handlePaidAmountChange = (index: number, value: number) => {
    const updated = [...rentData];
    updated[index].paidAmount = value;
    updated[index].isPaid = value >= calculateTotal(updated[index]);
    setRentData(updated);
  };

  const handleFullPaid = (index: number) => {
    const updated = [...rentData];
    updated[index].paidAmount = calculateTotal(updated[index]);
    updated[index].isPaid = true;
    setRentData(updated);
  };

  const calculateTotal = (member: (typeof rentData)[number]) => {
    return (
      member.houseRent +
      member.gas +
      member.electricity +
      (member.internet ?? 0) +
      (member.water ?? 0)
    );
  };

  console.log(isSelectMemberId);

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Set Room Rent</h2>

      <div className="flex flex-wrap gap-4 mb-10">
        <div>
          <label className="block font-medium mb-1">Total House Rent ($)</label>
          <input
            type="number"
            value={singleRoomRent}
            onChange={(e) => setSingleRoomRent(Number(e.target.value))}
            className="border px-3 py-2 rounded w-40"
          />
        </div>
        <div>
          <label className="block font-medium mb-1">Single Room Rent (₹)</label>
          <input
            type="number"
            value={singleRoomRent}
            onChange={(e) => setSingleRoomRent(Number(e.target.value))}
            className="border px-3 py-2 rounded w-40"
          />
        </div>
        <div>
          <label className="block font-medium mb-1">Shared Room Rent (₹)</label>
          <input
            type="number"
            value={sharedRoomRent}
            onChange={(e) => setSharedRoomRent(Number(e.target.value))}
            className="border px-3 py-2 rounded w-40"
          />
        </div>
      </div>

      <h2 className="text-2xl font-bold mb-4">Member Rent Collection</h2>
      <table className="w-full border border-gray-300 text-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2 border">Select</th>
            <th className="p-2 border">Member Name</th>
            <th className="p-2 border">House Rent</th>
            <th className="p-2 border">Gas</th>
            <th className="p-2 border">Electricity</th>
            <th className="p-2 border">Internet</th>
            <th className="p-2 border">Water</th>
            <th className="p-2 border">Total</th>
            <th className="p-2 border">Paid Amount</th>
            <th className="p-2 border">Remaining</th>
            <th className="p-2 border">Paid</th>
            <th className="p-2 border">Action</th>
          </tr>
        </thead>
        <tbody>
          {rentData.map((member, index) => {
            const total = calculateTotal(member);
            const remaining = total - member.paidAmount;

            return (
              <tr key={index} className="text-center">
                <td className="p-2 border">
                  <input
                    type="checkbox"
                    className="form-checkbox"
                    checked={isSelectMemberId === member.memberId || false}
                    onChange={() => setIsSelectMemberId(member.memberId)}
                  />
                </td>
                <td className="p-2 border">User Name</td>
                <td className="p-2 border">₹{member.houseRent}</td>
                <td className="p-2 border">₹{member.gas}</td>
                <td className="p-2 border">₹{member.electricity}</td>
                <td className="p-2 border">₹{member.internet}</td>
                <td className="p-2 border">₹{member.water}</td>
                <td className="p-2 border font-semibold">₹{total}</td>
                <td className="p-2 border">
                  <input
                    type="number"
                    value={member.paidAmount}
                    onChange={(e) =>
                      handlePaidAmountChange(index, Number(e.target.value))
                    }
                    className="border px-2 py-1 w-24"
                  />
                </td>
                <td className="p-2 border text-red-600">
                  ₹{remaining > 0 ? remaining : 0}
                </td>
                <td className="p-2 border">
                  {member.isPaid ? (
                    <span className="text-green-600 font-semibold">Yes</span>
                  ) : (
                    <span className="text-yellow-600 font-semibold">No</span>
                  )}
                </td>
                <td className="p-2 border">
                  {!member.isPaid && (
                    <button
                      onClick={() => handleFullPaid(index)}
                      className="bg-blue-600 text-white px-2 py-1 rounded text-xs"
                    >
                      Full Paid
                    </button>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default Page;
