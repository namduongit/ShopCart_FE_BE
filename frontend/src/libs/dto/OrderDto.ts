import type { OrderCouponDto } from "./OrderCouponDto";
import type { OrderItemDto } from "./OrderItemDto";
import type { UserDto } from "./UserDto";

export type OrderDto = {
    id: number;
    fullName: string;
    address: string;
    status: string;
    totalAmount: number;
    totalQuantity: number;
    user: UserDto;
    items: OrderItemDto[];
    coupon: OrderCouponDto;
}