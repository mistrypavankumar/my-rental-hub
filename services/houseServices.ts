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
