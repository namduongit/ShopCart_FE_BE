export type Cart = {
    productId: number;
    productName: string;
    quantity: number;
    totalPrice: number;
}

export type CartDetail = {
    carts: Cart[];
    totalQuantity: number;
    totalPrice: number;
}