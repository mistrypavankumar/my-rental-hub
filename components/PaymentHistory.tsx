import { MemberProps, PaymentHistoryProps } from "@/lib/constants";
import { convertCentsToDollars, convertDollarsToCents } from "@/lib/utils";
import { getPaymentHistoryByRentId } from "@/services/rentServices";
import React, { useEffect, useMemo, useState } from "react";

const PaymentHistory = ({
  rentId,
  membersData,
  refreshPage,
}: {
  rentId: string;
  membersData: MemberProps[];
  refreshPage: number;
}) => {
  const [history, setHistory] = useState<PaymentHistoryProps[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchPaymentHistory = async () => {
      try {
        const response = await getPaymentHistoryByRentId(rentId);
        setHistory(response.data.paymentHistory);
      } catch (error) {
        console.error("Error fetching payment history:", error);
      }
    };

    fetchPaymentHistory();
  }, [rentId, refreshPage]);

  useEffect(() => {
    if (history.length > 0) {
      setLoading(false);
    }
  }, [history]);

  const getMemberById = (memberId: string) => {
    return membersData.find((member) => member._id === memberId);
  };

  const totalAmountReceived = useMemo(
    () =>
      history.reduce(
        (acc, payment) =>
          acc + (convertDollarsToCents(payment.paidAmount) || 0),
        0
      ),
    [history]
  );

  return (
    <div className="my-20">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Payment History</h1>
        <p className="text-2xl font-bold">
          Total Amount: $
          {totalAmountReceived > 0
            ? convertCentsToDollars(totalAmountReceived)
            : "---"}
        </p>
      </div>

      {!loading && (
        <div>
          {history.map((payment, index) => {
            const member = getMemberById(payment.memberId);
            return (
              <div
                key={index}
                className="flex justify-between items-center p-3 border border-gray-400 rounded-md mb-2"
              >
                <div>
                  <h2 className="text-[16px] font-bold">
                    {member?.name || "Unknown Member"}
                  </h2>
                  <p className="text-[14px] text-gray-500 font-semibold">
                    {payment.createdAt?.split("T")[0] || "Unknown Date"}
                  </p>
                </div>
                <div className="flex flex-col items-end">
                  <p className="text-[16px] font-bold">
                    Paid Amount:{" "}
                    <span className="text-green-600">
                      ${payment.paidAmount}
                    </span>
                  </p>
                  <p className="text-[14px] text-gray-500">
                    Remaining Amount: ${payment.remainingAmount}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default PaymentHistory;
