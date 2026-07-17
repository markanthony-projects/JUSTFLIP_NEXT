import toast from "react-hot-toast";

// export const handleApiError = (error) => {
//     const msg = error?.response?.data || error || "Something went wrong";
//     console.error("Error : \n", msg);
//     throw error;
// };


export const handleApiError = (error) => {
  const message =
    error?.response?.data?.message ||
    error?.response?.data?.error ||
    error.message ||
    "Something went wrong";

  throw new Error(message);
};