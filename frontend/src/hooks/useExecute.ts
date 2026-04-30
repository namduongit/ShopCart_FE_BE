import { useContext, useState } from "react";
import type { Response } from "../libs/response";
import { NotificateContext } from "../contexts/notificate-context";
import { AxiosError } from "axios";

type ErrorType = string | Record<string, any>;

export const useExecute = <T>() => {
    const notificationContext = useContext(NotificateContext);

    const [loading, setLoading] = useState<boolean>(false);
    const [data, setData] = useState<T | undefined>(undefined);
    const [errors, setErrors] = useState<ErrorType | undefined>(undefined);

    /**
     * 
     * * issueNetwork used in action login, register,... that isn't a content page (home, product,...). Can custom if u want
     */
    const query = async (
        func: () => Promise<Response<T>>,
        opts: {
            issueNetwork?: boolean,
            onSuccess?: (data?: T) => void,
            onError?: () => void
        }
    ) => {
        try {
            setLoading(true);
            const result = await func();

            setData(result.data);
            opts?.onSuccess?.(result.data);
        }
        catch (error: unknown) {
            opts?.onError?.();
            if (error instanceof AxiosError) {
                const response = error.response;
                console.log(response)
                // Network error or Server doesn't response
                if (!response && opts?.issueNetwork) {
                    await notificationContext?.showConfirmAlert({
                        type: "error",
                        title: "Server đang gặp sự cố",
                        message: "Server đang gặp sự cố khi vận hành. Bạn hãy thử lại thao tác này sau. Cảm ơn sự thông cảm vì sự bất tiện này.",
                    });
                }
                else {
                    const data = response?.data as Response<T>;
                    const errors = data.errors;
                    console.log("Error type is AxiosError: ", errors)

                    if (typeof (errors) == "string") {
                        if (errors === "Invalid request body format") {
                            await notificationContext?.showConfirmAlert({
                                type: "warning",
                                title: "Vui lòng gửi thông tin",
                                message: "Bạn chưa gửi thông tin để chúng tôi có thể xử lý. Vui lòng gửi và thực hiện lại thao tác.",
                            });
                        }

                        // Show toast
                        else {
                            notificationContext?.showToast({
                                id: Date.now(),
                                type: "warning",
                                title: "Cảnh báo",
                                message: errors,
                            });
                        }
                    }

                    else if (typeof (errors) == "object") {
                        console.log("into here")
                        setErrors(errors);
                    }
                }
            } else {

            }
        }
        finally {
            setLoading(false);
        }
    }

    return {
        query,
        data, errors, loading
    };
}