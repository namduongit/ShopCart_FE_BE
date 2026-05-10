export type Coupon = {
    type: 'PERCENTAGE' | 'FIXED';
    value: number;
};

export type OrderItem = {
    price: number;
    quantity: number;
};

export const calculateOrderPrice = (
    items: OrderItem[],
    coupon?: Coupon,
    shippingFee: number = 0
) => {
    const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
    
    let discount = 0;
    if (coupon) {
        if (coupon.type === 'PERCENTAGE') {
            discount = subtotal * (coupon.value / 100);
        } else {
            discount = coupon.value;
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
