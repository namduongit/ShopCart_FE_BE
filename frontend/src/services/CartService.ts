import { api } from "../libs/api"
import type { CartDto } from "../libs/dto/CartDto";
import type { Response } from "../libs/response";

const CartService = {
    /** Lấy danh sách giỏ hàng của user đang đăng nhập */
    async GetCart() {
        const response = await api.get<Response<CartDto[]>>("/api/carts/");
        return response.data;
    },

    /** Thêm sản phẩm vào giỏ hoặc tăng số lượng */
    async AddToCart(data: { productId: number; quantity: number }) {
        const response = await api.post<Response<CartDto>>("/api/carts/add", data);
        return response.data;
    },

    /** Giảm số lượng / xóa khỏi giỏ hàng */
    async RemoveFromCart(data: { productId: number; quantity: number }) {
        const response = await api.post<Response<CartDto | null>>("/api/carts/remove", data);
        return response.data;
    },
    /** Xóa toàn bộ giỏ hàng của user trên server */
    async ClearCart() {
        const response = await api.delete<Response<null>>("/api/carts/clear");
        return response.data;
    },
}

export default CartService;
