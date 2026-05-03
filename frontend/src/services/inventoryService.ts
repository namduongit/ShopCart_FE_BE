import { api } from "../libs/api"
import type { Response } from "../libs/response";

const InventoryService = {
    async checkStock(productId: number, quantity: number) {
        const response = await api.get<Response<boolean>>(
            `/w-version/inventory/${productId}/check`,
            {
                params: { quantity }
            }
        );

        return response.data;
    }
}