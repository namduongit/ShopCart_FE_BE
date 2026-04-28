import type { AxiosRequestConfig, Method } from "axios";
import { Api } from "../libs/api";

type QueryOption = {
    path: string;
    method: Method 
}

export const useExecute = <T>() => {
    const api = Api();

    const query = (
        option: QueryOption,
        data?: any
    ) => {
        try {
            const config = {
                url: option.path,
                method: option.method,
                data: data
            } as AxiosRequestConfig;

            return api.request<T>(config);

        } catch (error: unknown) {

        }
    }

    return { query };
}