import { createContext, useEffect, useRef, useState } from "react"
import { getBackgroundColor, getBorderColor, getTextColor } from "./helpers/toast";

export type MessageType = "notification" | "success" | "warning" | "error";

type ConfirmAlertContent = {
    type: MessageType;
    title: string;
    message: string;
}

type ToastType = {
    id: number,
    type: MessageType,
    title: string;
    message: string
}

interface NotificateContextType {
    showToast: (toast: ToastType) => void
    showConfirmAlert: (content: ConfirmAlertContent) => Promise<boolean>;
}

const NotificateContext = createContext<NotificateContextType | undefined>(undefined);

const NotificateProvider = ({ children }: { children: React.ReactNode }) => {
    // Toast state
    const [toasts, setToasts] = useState<ToastType[]>([]);

    const showToast = (toast: ToastType) => {
        const id = Date.now();
        setToasts(prev => [...prev, toast]);

        setTimeout(() => closeToast(id), 3000);
    }

    const closeToast = (id: number) => {
        setToasts(toasts.filter(toast => toast.id !== id))
    }

    // Confirm state
    const confirmAlertRef = useRef<((value: boolean) => void) | null>(null);
    const [confirmAlertContent, setConfirmAlerContent] = useState<ConfirmAlertContent | null>(null);

    const showConfirmAlert = (content: ConfirmAlertContent): Promise<boolean> => {
        return new Promise((resolve) => {
            confirmAlertRef.current = resolve;
            setConfirmAlerContent(content);
        });
    }

    const closeConfirmAlert = (result: boolean = false) => {
        if (confirmAlertRef.current) {
            confirmAlertRef.current(result);
        }
        confirmAlertRef.current = null;
        setConfirmAlerContent(null);
    }

    useEffect(() => {
        // const test = async () => {
        //     const res = await showConfirmAlert({
        //         type: "warning",
        //         title: "Vui lòng gửi thông tin",
        //         message: "Bạn chưa gửi thông tin để chúng tôi có thể xử lý. Vui lòng gửi và thực hiện lại thao tác."
        //     });
        //     console.log(res)
        // }

        // test();
    }, []);

    return (
        <NotificateContext.Provider value={{
            showToast,
            showConfirmAlert
        }}>
            {/* Toast position */}
            {toasts.length > 0 && (
                <div className="fixed top-5 inset-e-5 w-60 h-15 space-y-2 z-100">
                    {toasts.map((toast, idx) => (
                        <div key={idx} className={`flex items-center ${getBackgroundColor(toast.type)} 
                            left-to-right shadow px-3 py-3 gap-2 border-s-4 ${getBorderColor(toast.type)}`}>
                            <div>
                                <div className={`w-4 h-4 rounded-full border-4 ${getBorderColor(toast.type)}`}></div>
                            </div>
                            <div className={`flex-1 ${getTextColor(toast.type)}`}>
                                <div className="flex justify-between">
                                    <h1 className="font-semibold text-lg">
                                        {toast.type === "success" && "Thành công"}
                                        {toast.type === "warning" && "Thất bại"}
                                        {toast.type === "error" && "Lỗi"}
                                        {toast.type === "notification" && "Thông báo"}
                                    </h1>
                                    <button className="text-gray-500" onClick={() => closeToast(toast.id)}>x</button>
                                </div>
                                <p className="text-sm">{toast.message}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Confirm alert content position */}
            {confirmAlertContent && (
                <div className="fixed top-0 left-0 min-h-screen w-full bg-gray-900/40 flex justify-center items-center z-100">
                    <div className="max-w-100 w-full bg-white rounded-lg shadow flex flex-col items-center">
                        <div className="flex flex-col items-center justify-center gap-5 px-10 py-8 text-center h-full w-full">
                            <div>
                                {confirmAlertContent.type === "success" && (
                                    <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
                                        <i className="fa-solid fa-circle-check text-green-500 text-3xl" />
                                    </div>
                                )}
                                {confirmAlertContent.type === "warning" && (
                                    <div className="w-16 h-16 rounded-full bg-yellow-100 flex items-center justify-center">
                                        <i className="fa-solid fa-triangle-exclamation text-yellow-500 text-3xl" />
                                    </div>
                                )}
                                {confirmAlertContent.type === "error" && (
                                    <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center">
                                        <i className="fa-solid fa-circle-exclamation text-red-500 text-3xl" />
                                    </div>
                                )}
                                {confirmAlertContent.type === "notification" && (
                                    <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center">
                                        <i className="fa-solid fa-circle-info text-blue-500 text-3xl" />
                                    </div>
                                )}
                            </div>

                            <div className="flex flex-col gap-1.5">
                                <h1 className="text-xl font-semibold text-gray-800 leading-snug">
                                    {confirmAlertContent.title}
                                </h1>
                                <span className="text-sm text-gray-500 leading-relaxed">
                                    {confirmAlertContent.message}
                                </span>
                            </div>
                            <div className="flex items-center gap-3">
                                <button className="px-7 py-2.5 rounded text-sm font-medium border border-red-400 text-red-500
                                        hover:bg-red-50 active:scale-95 transition-all duration-150"
                                    onClick={() => closeConfirmAlert(false)}>
                                    Hủy
                                </button>
                                <button className="px-7 py-2.5 rounded text-sm font-medium bg-blue-600 text-white border border-blue-600
                                        hover:bg-blue-700 active:scale-95 transition-all duration-150"
                                    onClick={() => closeConfirmAlert(true)}>
                                    Đồng ý
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {children}
        </NotificateContext.Provider>
    )
}

export { NotificateContext, NotificateProvider };