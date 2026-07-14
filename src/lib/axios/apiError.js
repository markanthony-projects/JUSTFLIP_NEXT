import toast from "react-hot-toast";

export const handleApiError = (error) => {
    const msg = error?.response?.data || error || "Something went wrong";
    console.error("Error : \n", msg);
    throw error;
};
