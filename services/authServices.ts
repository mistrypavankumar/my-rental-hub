"server";

import { LoginProps, LoginResponseProps, RegisterProps } from "@/lib/constants";
import axios from "axios";

export async function loginUser(
  formData: LoginProps
): Promise<LoginResponseProps | any> {
  try {
    const res = await axios.post("/api/v1/auth/login", formData);
    return res;
  } catch (err) {
    throw err;
  }
}

export async function registerUser(formData: RegisterProps) {
  try {
    const res = await axios.post("/api/v1/auth/register", formData);
    return res;
  } catch (err) {
    throw err;
  }
}
