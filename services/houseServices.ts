"server";

import { HouseRequest, MemberProps, RentProps } from "@/lib/constants";
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

export async function deleteHouse(houseId: string) {
  try {
    const res = await axios.delete(`/api/v1/houses/${houseId}`, {
      withCredentials: true,
    });

    return res;
  } catch (err) {
    throw err;
  }
}

export async function createMember(formData: MemberProps) {
  try {
    const res = await axios.post("/api/v1/houses/member", formData, {
      withCredentials: true,
    });

    return res;
  } catch (err) {
    throw err;
  }
}

export async function updateMemberById(
  memberId: string,
  formData: MemberProps
) {
  try {
    const res = await axios.put(`/api/v1/houses/member/${memberId}`, formData, {
      withCredentials: true,
    });

    return res;
  } catch (err) {
    throw err;
  }
}

export async function getMembersByHouseId(houseId: string) {
  try {
    const res = await axios.get(`/api/v1/houses/member?houseId=${houseId}`, {
      withCredentials: true,
    });

    return res;
  } catch (err) {
    throw err;
  }
}

export async function deleteMemberById(memberId: string) {
  try {
    const res = await axios.delete(`/api/v1/houses/member/${memberId}`, {
      withCredentials: true,
    });

    return res;
  } catch (err) {
    throw err;
  }
}

export async function createRent(formData: RentProps) {
  try {
    const res = await axios.post("/api/v1/houses/rent", formData, {
      withCredentials: true,
    });

    return res;
  } catch (err) {
    throw err;
  }
}

export async function getRentsByHouseId(houseId: string) {
  try {
    const res = await axios.get(`/api/v1/houses/rent?houseId=${houseId}`, {
      withCredentials: true,
    });

    return res;
  } catch (err) {
    throw err;
  }
}

export async function updateRentById(rentId: string, formData: RentProps) {
  console.log("Updating rent with ID:", rentId, "and data:", formData);

  try {
    const res = await axios.put(`/api/v1/houses/rent/${rentId}`, formData, {
      withCredentials: true,
    });

    return res;
  } catch (err) {
    throw err;
  }
}

export async function deleteRentById(rentId: string) {
  try {
    const res = await axios.delete(`/api/v1/houses/rent/${rentId}`, {
      withCredentials: true,
    });

    return res;
  } catch (err) {
    throw err;
  }
}
