import { useToastStore } from "../stores/toast.store";

const createHandler = (type) => (message = "") => {
    const { addToast } = useToastStore.getState();
    addToast?.({
        id: Date.now(),
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