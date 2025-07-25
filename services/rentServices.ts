"server";

import { PaymentProps } from "@/lib/constants";
import axios from "axios";

export const getRentByRentId = async (rentId: string) => {
  try {
    const res = await axios.get(`/api/v1/houses/rent/${rentId}`);
    return res;
  } catch (error) {
    throw error;
  }
};

export const generatePayment = async (paymentBody: PaymentProps) => {
  try {
    const res = await axios.post(
      `/api/v1/houses/rent/${paymentBody.rentId}/payment`,
      paymentBody
    );

    return res;
  } catch (error) {
    throw error;
  }
};

export const getPaymentsByRentId = async (
  rentId: string,
  memberId?: string
) => {
  try {
    const res = await axios.get(`/api/v1/houses/rent/${rentId}/payment`, {
      params: { memberId },
    });

    return res;
  } catch (error) {
    throw error;
  }
};

export const updatePayment = async (paymentBody: {
  paymentId: string;
  houseId: string;
  memberId: string;
  rentId: string;
  paidAmount: number;
  remainingAmount: number;
}) => {
  try {
    const res = await axios.put(
      `/api/v1/houses/rent/${paymentBody.rentId}/payment`,
      paymentBody
    );

    return res;
  } catch (error) {
    throw error;
  }
};

export const getPaymentHistoryByRentId = async (rentId: string) => {
  try {
    const res = await axios.get(
      `/api/v1/houses/rent/${rentId}/payment-history`
    );
    return res;
  } catch (error) {
    throw error;
  }
};
