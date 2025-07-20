"server";

import { HouseRequest } from "@/lib/constants";
import axios from "axios";

export async function createHouse(formData: HouseRequest) {
  try {
    const res = await axios.post("/api/v1/houses", formData, {
      withCredentials: true,
    });

    return res;
  } catch (err) {
    throw err;
  }
}

export async function getHouses() {
  try {
    const res = await axios.get("/api/v1/houses", {
      withCredentials: true,
    });

    return res;
  } catch (err) {
    throw err;
  }
}

export async function getHouseById(houseId: string) {
  try {
    const res = await axios.get(`/api/v1/houses/${houseId}`, {
      withCredentials: true,
    });

    return res;
  } catch (err) {
    throw err;
  }
}

export async function updateHouse(houseId: string, formData: HouseRequest) {
  try {
    const res = await axios.put(`/api/v1/houses/${houseId}`, formData, {
      withCredentials: true,
    });

    return res;
  } catch (err) {
    throw err;
  }
}
