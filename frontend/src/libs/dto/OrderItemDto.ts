import type { OrderItemProductDto } from "./OrderItemProductDto";

export type OrderItemDto = {
    id: number;
    product: OrderItemProductDto;
    quantity: number;
    total: number;
}