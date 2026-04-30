import { api } from "../libs/api"
import type { ProductDto } from "../libs/dto/ProductDto"
import type { Response } from "../libs/response";

const ProductService = {
    async GetAllProducts() {
        const response = await api.get<Response<ProductDto[]>>("/w-version/api/products/");
        return response.data;
    }
}

export default ProductService;