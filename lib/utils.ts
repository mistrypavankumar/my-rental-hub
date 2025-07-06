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
