import type { CartDto } from "../../libs/dto/CartDto";

export const validateCartItem = (quantity: number | null | undefined, stock: number) => {
    if (quantity === null || quantity === undefined || Number.isNaN(Number(quantity))) {
        return { isValid: false, message: "Quantity is required" };
    }
    if (quantity <= 0) {
        return { isValid: false, message: "Quantity must be greater than 0" };
    }
    if (quantity > stock) {
        return { isValid: false, message: "Quantity exceeds stock" };
    }
    return { isValid: true, message: "Valid" };
};

export const calculateCartTotal = (cartItems: CartDto[], discountCode?: string): number => {
    if (!cartItems || cartItems.length === 0) {
        return 0;
    }

    let total = cartItems.reduce((acc, item) => {
        return acc + item.total;
    }, 0);

    if (discountCode === "DISCOUNT10") {
        total = total * 0.9;
    } else if (discountCode === "DISCOUNT20") {
        total = total * 0.8;
    }

    return total;
};
