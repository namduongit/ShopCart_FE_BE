import type { AxiosRequestConfig, Method } from "axios";
import { Api } from "../libs/api";
import { useState } from "react";

type QueryOption = {
    path: string;
    method: Method 
}

export const useExecute = <T>() => {
    const api = Api();

    const [loading, setLoading] = useState<boolean>(false);

    const query = (
        option: QueryOption,
        data?: any
    ) => {
        try {
            setLoading(true);
            const config = {
                url: option.path,
                method: option.method,
                data: data
            } as AxiosRequestConfig;
            setLoading(false);
            return api.request<T>(config);

        } catch (error: unknown) {

            setLoading(false);
        }
    }

    return { query, loading };
}