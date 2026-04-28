import axios from "axios";

export const Api = () => {
    const API_ENDPOINT = import.meta.env.VITE_API_ENDPOINT || "http://localhost:8080";

    const api = axios.create({
        baseURL: API_ENDPOINT,
        // Enable sending cookies with requests
        withCredentials: true,
    });

    api.interceptors.request.use((config => {
        // You can add any custom headers or authentication tokens here if needed
        return config;
    }), error => {
        return Promise.reject(error);
    });

    api.interceptors.response.use((response) => {
        return response;
    }, error => {
        // Handle errors globally if needed
        return Promise.reject(error);
    });
    
    return api;
}