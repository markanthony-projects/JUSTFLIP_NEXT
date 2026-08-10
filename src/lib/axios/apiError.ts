import toast from "react-hot-toast";

interface ErrorContext {
  service?: string;
  method?: string;
  params?: Record<string, any>;
}

export const handleApiError = (error: any, context?: ErrorContext) => {
  const message =
    error?.response?.data?.message ||
    error?.response?.data?.error ||
    error.message ||
    "Something went wrong";

  if (context) {
    console.error(`[${context.service}::${context.method}] API Error:`, message, "Params:", context.params);
  }

  throw new Error(message);
};