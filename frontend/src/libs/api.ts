import axios, { AxiosError, type AxiosResponse } from "axios";

const Api = () => {
    const API_ENDPOINT = import.meta.env.VITE_API_ENDPOINT || "http://localhost:8080";

    const api = axios.create({
        baseURL: API_ENDPOINT,
        // Enable sending cookies with requests
        withCredentials: true,
    });

    api.interceptors.request.use((config => {
        return config;
    }), error => {
        return Promise.reject(error);
    });

    api.interceptors.response.use((response: AxiosResponse<any, any, {}>) => {
        return response;
    }, (error: AxiosError) => {
        return Promise.reject(error);
    });
    
    return api;
}

export const api = Api();

