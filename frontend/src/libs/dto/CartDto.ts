import type { CartProductDto } from "./CartProductDto";

export type CartDto = {
    id: number;
    quantity: number;
    total: number;
    product: CartProductDto;
}