import axios from "axios";
import toast from "react-hot-toast";

export const showErrorMessage = (error: Error) => {
  if (axios.isAxiosError(error)) {
    const message =
      error.response?.data?.error || "Something went wrong. Please try again.";
    toast.error(message);
  } else {
    toast.error("Unexpected error occurred.");
  }
};

export const setInLocalStorage = (key: string, value: string) => {
  try {
    localStorage.setItem(key, value);
  } catch (error) {
    console.error("Failed to set item in localStorage:", error);
  }
};

export const getFromLocalStorage = (key: string) => {
  try {
    return localStorage.getItem(key);
  } catch (error) {
    console.error("Failed to get item from localStorage:", error);
    return null;
  }
};

export const getObjectFromLocalStorage = (key: string) => {
  const value = getFromLocalStorage(key);
  if (value) {
    try {
      return JSON.parse(value);
    } catch (error) {
      console.error("Failed to parse JSON from localStorage:", error);
      return null;
    }
  }
  return null;
};
