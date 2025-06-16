//TODO: API보조함수
import {AxiosError} from "axios";

export const handleApiError = (error: unknown, customMessage: string) => {
    if (error instanceof AxiosError) {
        throw new Error(error.response?.data?.error || customMessage);
    }

    if (error instanceof Error) {
        console.error(`❌ ${customMessage}:`, error.message);
        throw new Error(error.message);
    }
    throw new Error(customMessage);
};