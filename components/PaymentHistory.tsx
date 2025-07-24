import React from "react";

const PaymentHistory = () => {
  return (
    <div className="my-20">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Payment History</h1>
        <p className="text-2xl font-bold">Total Amount: $2000</p>
      </div>

      <div>
        {[
          {
            name: "John Doe",
            amount: 200,
            date: "2023-10-01",
          },
        ].map((payment, index) => (
          <div
            key={index}
            className="flex justify-between items-center p-3 border rounded-md"
          >
            <div>
              <h2 className="text-[16px] font-bold">{payment.name}</h2>
              <p className="text-[14px] text-gray-500 font-semibold">
                {payment.date}
              </p>
            </div>
            <h2 className="text-[16px] font-bold">${payment.amount}</h2>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PaymentHistory;
