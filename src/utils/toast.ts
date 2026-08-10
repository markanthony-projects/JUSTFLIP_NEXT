import { useToastStore } from "../stores/toast.store";

const createHandler = (type: "success" | "error" | "warn" | "info") => (message: string = "") => {
    const { addToast } = useToastStore.getState();
    addToast?.({
        message,
        type,
    });
};

export const toast = {
    success: createHandler("success"),
    error: createHandler("error"),
    warn: createHandler("warn"),
    info: createHandler("info"),
};