export type Product = {
    id: number;
    mainImageUrl: string;
    imageUrls: string[];
    name: string;
    slug: string;
    stockQuantity: string;
    attributes: Record<string, any>;
    price: number;
    status: ProductStatus;
}

export type ProductStatus = "ACTIVE" | "INACTIVE";