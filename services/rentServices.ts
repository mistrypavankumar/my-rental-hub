"server";

import { PaymentProps, RentProps } from "@/lib/constants";
import axios from "axios";

export async function createRent(formData: RentProps) {
  try {
    const res = await axios.post("/api/v1/houses/rents", formData, {
      withCredentials: true,
    });

    return res;
  } catch (err) {
    throw err;
  }
}

export async function getRentsByHouseId(houseId: string) {
  try {
    const res = await axios.get(`/api/v1/houses/rents?houseId=${houseId}`, {
      withCredentials: true,
    });

    return res;
  } catch (err) {
    throw err;
  }
}

export async function updateRentById(
  rentId: string,
  formData: RentProps | Partial<RentProps>
) {
  console.log("Updating rent with ID:", rentId, "and data:", formData);

  try {
    const res = await axios.put(
      `/api/v1/houses/rents/rent?rentId=${rentId}`,
      formData,
      {
        withCredentials: true,
      }
    );

    return res;
  } catch (err) {
    throw err;
  }
}

export async function deleteRentById(rentId: string) {
  try {
    const res = await axios.delete(
      `/api/v1/houses/rents/rent?rentId=${rentId}`,
      {
        withCredentials: true,
      }
    );

    return res;
  } catch (err) {
    throw err;
  }
}

export const getRentByRentId = async (rentId: string) => {
  try {
    const res = await axios.get(`/api/v1/houses/rents/rent?rentId=${rentId}`);
    return res;
  } catch (error) {
    throw error;
  }
};

export const generatePayment = async (paymentBody: PaymentProps) => {
  try {
    const res = await axios.post(
      `/api/v1/houses/rents/rent/payment?rentId=${paymentBody.rentId}`,
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
    const res = await axios.get(
      `/api/v1/houses/rents/rent/payment?rentId=${rentId}`,
      {
        params: { memberId },
      }
    );

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
      `/api/v1/houses/rents/rent/payment?rentId=${paymentBody.rentId}`,
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
      `/api/v1/houses/rents/rent/payment-history?rentId=${rentId}`
    );
    return res;
  } catch (error) {
    throw error;
  }
};
