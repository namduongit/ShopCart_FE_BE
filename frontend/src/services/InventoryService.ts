import { api } from "../libs/api"
import type { Response } from "../libs/response";

export type CheckStockItem = {
    productId: number;
    quantity: number;
}

export type CheckStockRequest = {
    items: CheckStockItem[]
}

const InventoryService = {
    async CheckStock(request: CheckStockRequest) {
        const response = await api.post<Response<boolean>>(
            '/api/inventories/checkStock',
            request
        );
        return response.data;
    },
}

export default InventoryService;