import type { OrderItemDto } from "../../libs/dto/OrderItemDto";

export type CouponCustom = {
    code: string;
    type: "FIXED" | "PER";
    value: number;
}

export const calculateOrderPrice = (
    items: OrderItemDto[],
    coupon?: CouponCustom,
    shippingFee: number = 0
) => {
    const subtotal = items.reduce((acc, item) => acc + item.product.price * item.quantity, 0);

    let discount = 0;
    if (coupon) {
        if (coupon.type === "FIXED") {
            discount = coupon.value;
        }
        if (coupon.type === "PER") {
            discount = Math.ceil(subtotal * (coupon.value / 100));
        }
    }

    // Đảm bảo discount không vượt quá subtotal
    discount = Math.min(discount, subtotal);

    const total = subtotal - discount + shippingFee;

    return {
        subtotal,
        discount,
        shipping: shippingFee,
        total: Math.max(0, total)
    };
};

export const checkInventoryAvailability = (requestedQuantity: number, stockAvailable: number): boolean => {
    return requestedQuantity > 0 && requestedQuantity <= stockAvailable;
};
