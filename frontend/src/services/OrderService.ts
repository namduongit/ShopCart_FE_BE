import { api } from "../libs/api"
import type { OrderDto } from "../libs/dto/OrderDto";
import type { Response } from "../libs/response";

const OrderService = {
    /** Tạo đơn hàng mới từ giỏ hàng */
    async CreateOrder(data: {
        fullName?: string;
        phone: string;
        address: string;
        paymentMethod: string,
        couponCode?: string;
        items: { productId: number; quantity: number }[];
    }) {
        const response = await api.post<Response<OrderDto>>("/api/purchases/", data);
        return response.data;
    },

    /** Lấy tất cả đơn hàng của user hiện tại */
    async GetMyOrders() {
        const response = await api.get<Response<OrderDto[]>>("/api/purchases/");
        return response.data;
    },

    /** Lấy chi tiết một đơn hàng theo id */
    async GetOrderById(orderId: number) {
        const response = await api.get<Response<OrderDto>>(`/api/purchases/${orderId}`);
        return response.data;
    },
}

export default OrderService;
