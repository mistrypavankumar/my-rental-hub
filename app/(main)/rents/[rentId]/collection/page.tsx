"use client";

import React, { useState } from "react";

const initialRentData = [
  {
    name: "Alice Johnson",
    houseRent: 1000,
    gas: 100,
    electricity: 200,
    internet: 80,
    water: 50,
    paidAmount: 1430,
    isPaid: true,
  },
  {
    name: "Bob Smith",
    houseRent: 700,
    gas: 100,
    electricity: 200,
    internet: 80,
    water: 50,
    paidAmount: 800,
    isPaid: false,
  },
];

const Page = () => {
  const [singleRoomRent, setSingleRoomRent] = useState(1000);
  const [sharedRoomRent, setSharedRoomRent] = useState(700);
  const [rentData, setRentData] = useState(initialRentData);

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
                <td className="p-2 border">{member.name}</td>
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
