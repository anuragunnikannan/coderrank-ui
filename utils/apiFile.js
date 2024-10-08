import axios from "axios";
import Cookies from "js-cookie";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL

export const api = axios.create({
    baseURL: BASE_URL,
    headers: {
        "Content-Type": 'application/json',
    },
    withCredentials: true
});

api.interceptors.response.use(response => response, async (error) => {
    const originalRequest = error.config;
    if (error?.response?.status === 401 && !originalRequest._retry && originalRequest.url !== "/renew-token") {
        originalRequest._retry = true;
        try {
            const res = await api.post("/renew-token")
            api.defaults.headers.common["Authorization"] = `Bearer ${res?.data?.access_token}`;
            originalRequest._retry = false;
            return api(originalRequest);
        }
        catch (error) {
            return Promise.reject(error);
        }
    }
    else if (error?.response?.status === 401 && originalRequest.url === "/renew-token") {
        Cookies.remove("isLoggedIn");
        window.location.replace("/");
    }
    else {
        return Promise.reject(error);
    }
})