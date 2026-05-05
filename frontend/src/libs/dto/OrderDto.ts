import type { OrderCouponDto } from "./OrderCouponDto";
import type { OrderItemDto } from "./OrderItemDto";
import type { UserDto } from "./UserDto";

export type OrderDto = {
    id: number;
    fullName: string;
    address: string;
    status: string;
    paymentMethod: string;
    paymentStatus: string;
    totalAmount: number;
    shippingFee: number;
    totalQuantity: number;
    user: UserDto;
    items: OrderItemDto[];
    coupon: OrderCouponDto;
}