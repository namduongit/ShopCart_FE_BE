import type { ProductInventoryDto } from "./ProductInventoryDto";

export type ProductDto = {
    id: number;
    mainImageUrl: string;
    imageUrls: string[];
    name: string;
    description: string;
    slug: string;
    attributes: Record<string, any>
    price: number;
    status: string;
    inventory: ProductInventoryDto;
}