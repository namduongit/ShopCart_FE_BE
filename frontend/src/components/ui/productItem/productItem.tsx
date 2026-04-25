import { useState } from "react";
import Button from "../button/button";

export interface ProductItemData {
    id: number;
    name: string;
    brand: string;
    price: number;
    stock: number;
    specs: string[];
}

interface ProductItemProps {
    product: ProductItemData;
    onAddToCart: (product: ProductItemData, quantity: number) => void;
}

const ProductItem = ({ product, onAddToCart }: ProductItemProps) => {
    const [quantity, setQuantity] = useState<number>(1);

    return (
        <div className="flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-transform duration-200 hover:-translate-y-1 hover:shadow-lg">
            <div className="mb-4 flex items-center justify-between">
                <span className="rounded-full bg-sky-100 px-3 py-1 text-xs font-semibold text-sky-700">
                    {product.brand}
                </span>
            </div>

            <div className="mb-5 rounded-2xl bg-sky-600 p-5 text-white">
                <p className="text-xs uppercase tracking-[0.3em] text-sky-200">PC Gaming</p>
                <h2 className="mt-3 text-xl font-bold">{product.name}</h2>
                <p className="mt-4 text-3xl font-black">{product.price.toLocaleString()}đ</p>
            </div>

            <ul className="mb-6 flex-1 space-y-3 text-sm text-slate-600">
                {product.specs.map(spec => (
                    <li key={spec} className="flex items-start gap-3">
                        <span className="text-sky-600">
                            <i className="fa-solid fa-microchip"></i>
                        </span>
                        <span>{spec}</span>
                    </li>
                ))}
            </ul>
            <div className="flex items-center gap-2">
                <div className="w-24">
                    <input
                        data-testid={`quantity-input-${product.id}`}
                        type="number"
                        min="1"
                        max={product.stock}
                        defaultValue={quantity}
                        placeholder="SL"
                        onChange={(e) => setQuantity(Number(e.currentTarget.value))}
                        required
                        className="h-10 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-900 outline-none transition-colors placeholder:text-slate-400 focus:border-sky-500 focus:ring-2 focus:ring-sky-200"
                    />
                </div>
                <Button
                    data-testid={`add-to-cart-btn-${product.id}`}
                    onClick={() => onAddToCart(product, quantity)}
                    className="inline-flex h-10 flex-1 items-center justify-center gap-2 rounded-lg bg-sky-600 px-4 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-200 focus:ring-offset-2"
                >
                    <i className="fa-solid fa-cart-plus text-xs"></i>
                    Thêm vào giỏ hàng
                </Button>
            </div>
        </div>
    );
}

export default ProductItem
