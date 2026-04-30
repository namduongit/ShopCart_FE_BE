import type { MessageType } from "../notificate-context";

const getTextColor = (type: MessageType) => {
    return type === "success" ? "text-green-700" :
        type === "warning" ? "text-yellow-700" :
            type === "error" ? "text-red-700" : "text-blue-700";
}

const getBorderColor = (type: MessageType) => {
    return type === "success" ? "border-green-700" :
        type === "warning" ? "border-yellow-600" :
            type === "error" ? "border-red-600" : "border-blue-600";
}

const getBackgroundColor = (type: MessageType) => {
    return type === "success" ? "bg-green-100" :
        type === "warning" ? "bg-yellow-100" :
            type === "error" ? "bg-red-100" : "bg-blue-100";
}

export { getTextColor, getBorderColor, getBackgroundColor };