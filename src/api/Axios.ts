import axios, {
    AxiosError,
    AxiosHeaders,
    AxiosInstance,
    InternalAxiosRequestConfig,
} from "axios";
import { useUserStore } from "@/store/userStore";

const API_BASE =
    (
        process.env.NEXT_PUBLIC_API_BASE ||
        process.env.NEXT_PUBLIC_API_BASE_LOCAL ||
        "http://13.114.84.210:18000"
    ).replace(/\/+$/, "");

const apiClient: AxiosInstance = axios.create({
    baseURL: API_BASE,
    withCredentials: true,
});

export const authClient = axios.create({
    baseURL: API_BASE,
    withCredentials: false,
});

const refreshClient = axios.create({
    baseURL: API_BASE,
    withCredentials: true,
});

apiClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
    const headers = (config.headers ?? new AxiosHeaders()) as AxiosHeaders;
    const isFormData = config.data instanceof FormData;

    if (
        config.method?.toUpperCase() !== "GET" &&
        !headers.has("Content-Type") &&
        !isFormData
    ) {
        headers.set("Content-Type", "application/json");
    }

    const token = useUserStore.getState().accessToken;
    if (token) headers.set("Authorization", `Bearer ${token}`);
    config.headers = headers;
    return config;
});

let isRefreshing = false;
let hasShownExpiryAlert = false;
type RetryConfig = InternalAxiosRequestConfig & { _retry?: boolean };
let pendingQueue: Array<{
    resolve: (token: string) => void;
    reject: (err: unknown) => void;
}> = [];

const processQueue = (error: unknown, token: string | null = null) => {
    pendingQueue.forEach(({ resolve, reject }) => {
        if (token) resolve(token);
        else reject(error);
    });
    pendingQueue = [];
};

const notifyTokenExpired = () => {
    if (hasShownExpiryAlert) return;
    hasShownExpiryAlert = true;
    if (typeof window !== "undefined") {
        alert("토큰이 만료되었습니다. 다시 로그인 해주세요.");
    }
};

export const resetTokenExpiryAlert = () => {
    hasShownExpiryAlert = false;
};

export const refreshAccessToken = async () => {
    if (isRefreshing) {
        return new Promise<string>((resolve, reject) => {
            pendingQueue.push({ resolve, reject });
        });
    }
    isRefreshing = true;
    try {
        const { data } = await refreshClient.post<{ accessToken?: string }>(
            "/api/auth/refresh",
            {}
        );
        const newAccess = data?.accessToken;
        if (!newAccess) throw new Error("No accessToken from refresh");
        useUserStore.getState().setAccessToken(newAccess);
        processQueue(null, newAccess);
        return newAccess;
    } catch (err) {
        processQueue(err, null);
        await useUserStore.getState().logout();
        notifyTokenExpired();
        if (typeof window !== "undefined") {
            window.location.href = "/login";
        }
        throw err;
    } finally {
        isRefreshing = false;
    }
};

apiClient.interceptors.response.use(
    (res) => res,
    async (error: AxiosError) => {
        const status = error?.response?.status;
        const original = error.config as RetryConfig | undefined;
        if (!original) return Promise.reject(error);

        if (status === 401 && !original?._retry) {
            original._retry = true;

            try {
                const newAccess = await refreshAccessToken();
                const headers = (original.headers ?? new AxiosHeaders()) as AxiosHeaders;
                headers.set("Authorization", `Bearer ${newAccess}`);
                original.headers = headers;
                return apiClient(original);
            } catch (err) {
                notifyTokenExpired();
                return Promise.reject(err);
            }
        }

        return Promise.reject(error);
    }
);

export default apiClient;
