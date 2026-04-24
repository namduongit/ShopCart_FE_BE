import Button from "../button/button";

export interface ProductItemData {
    id: number;
    name: string;
    brand: string;
    price: number;
    specs: string[];
}

interface ProductItemProps {
    product: ProductItemData;
    onAddToCart: (product: ProductItemData) => void;
}

const ProductItem = ({ product, onAddToCart }: ProductItemProps) => {
    return (
        <div className="flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-transform duration-200 hover:-translate-y-1 hover:shadow-lg">
            <div className="mb-4 flex items-center justify-between">
                <span className="rounded-full bg-sky-100 px-3 py-1 text-xs font-semibold text-sky-700">
                    {product.brand}
                </span>
            </div>

            <div className="mb-5 rounded-2xl bg-linear-to-br from-slate-950 via-slate-800 to-sky-700 p-5 text-white">
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

            <Button
                onClick={() => onAddToCart(product)}
                className="mt-auto rounded-xl bg-sky-600 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-sky-700"
            >
                Thêm vào giỏ hàng
            </Button>
        </div>
    );
}

export default ProductItem
