import { useState } from "react";
import ProductItem, { type ProductItemData } from "../../components/ui/productItem/productItem";

interface CartItem extends ProductItemData {
    quantity: number;
}

const computerProducts: ProductItemData[] = [
    {
        id: 0,
        name: "PC Xé Gió",
        brand: "GearVN",
        price: 16000000,
        stock: 10,
        specs: ["Intel Core i7", "RTX 4060", "16GB DDR5 RAM", "1TB NVMe SSD", "Hệ điều hành Arch Linux với DWM"],
    },
    {
        id: 1,
        name: "PC Chiến Thần",
        brand: "GearVN",
        price: 15000000,
        stock: 10,
        specs: ["Intel Core i7", "RTX 4060", "16GB DDR5 RAM", "1TB NVMe SSD", "Hệ điều hành Arch Linux với DWM"],
    },
    {
        id: 2,
        name: "PC Titan",
        brand: "GearVN",
        price: 23000000,
        stock: 10,
        specs: ["AMD Ryzen 7", "RTX 4070", "32GB DDR5 RAM", "2TB NVMe SSD", "Hệ điều hành Arch Linux với DWM"],
    },
    {
        id: 3,
        name: "PC Arch",
        brand: "GearVN",
        price: 12370000,
        stock: 10,
        specs: ["Intel Core i5", "RTX 4050", "16GB RAM", "512GB NVMe SSD", "Hệ điều hành Arch Linux với DWM"],
    },
    {
        id: 4,
        name: "PC Hủy Diệt",
        brand: "GearVN",
        price: 21490000,
        stock: 10,
        specs: ["AMD Ryzen 9", "RTX 4080", "32GB DDR5 RAM", "2TB Gen4 SSD", "Hệ điều hành Arch Linux với DWM"],
    },
];

const ProductPage = () => {
    const [cartItems, setCartItems] = useState<CartItem[]>([]);

    const handleAddToCart = (product: ProductItemData, quantity: number) => {
        const itemQuantity = Number.isFinite(quantity) && quantity > 0 ? quantity : 1;

        setCartItems(currentItems => {
            const existingItem = currentItems.find(item => item.id === product.id);

            if (existingItem) {
                return currentItems.map((item) =>
                    item.id === product.id
                        ? { ...item, quantity: item.quantity + itemQuantity }
                        : item
                );
            }

            return [...currentItems, { ...product, quantity: itemQuantity }];
        });
    };

    const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

    return (
        <div className="min-h-screen bg-linear-to-br from-slate-100 via-white to-sky-100 px-4 py-10">
            <div className="mx-auto max-w-7xl">
                <div className="mb-8 flex flex-col gap-4 rounded-3xl bg-linear-to-br from-blue-100 to-blue-200 px-8 py-10 text-white shadow-2xl md:flex-row md:items-center md:justify-between">
                    <div>
                        <p className="text-sm font-bold uppercase tracking-[0.35em] text-blue-700">Shop máy tính</p>
                        <h1 className="mt-3 text-4xl font-black text-blue-500">Trang sản phẩm</h1>
                    </div>
                </div>

                <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
                    <section className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                        {computerProducts.map(product => (
                                <ProductItem
                                    key={product.id}
                                    product={product}
                                    onAddToCart={handleAddToCart}
                                />
                            )
                        )}
                    </section>

                    <aside className="h-fit rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl font-bold text-slate-900">Giỏ hàng</h2>
                            <span className="rounded-full bg-sky-100 px-3 py-1 text-xs font-semibold text-sky-700">
                                Số lượng: {totalItems}
                            </span>
                        </div>

                        {cartItems.length === 0 ? (
                            <p className="mt-6 text-sm text-slate-500">
                                Giỏ hàng đang trống. Thêm sản phẩm vào để thấy nó ở đây
                            </p>
                        ) : (
                            <div className="mt-6 space-y-4">
                                {cartItems.map((item) => (
                                    <div key={item.id} className="rounded-2xl bg-slate-50 p-4">
                                        <div className="flex items-start justify-between gap-4">
                                            <div>
                                                <p className="font-semibold text-slate-900">{item.name}</p>
                                                <p className="text-sm text-slate-500">{item.brand}</p>
                                            </div>
                                            <p className="text-sm font-semibold text-sky-700">x{item.quantity}</p>
                                        </div>
                                        <p className="mt-3 text-sm text-slate-600">
                                            {item.price.toLocaleString()}đ mỗi bộ
                                        </p>
                                    </div>
                                ))}

                                <div className="border-t border-slate-200 pt-4">
                                    <div className="flex items-center justify-between text-sm text-slate-500">
                                        <span>Tổng số lượng</span>
                                        <span>{totalItems}</span>
                                    </div>
                                    <div className="mt-2 flex items-center justify-between text-lg font-bold text-slate-900">
                                        <span>Thành tiền</span>
                                        <span>{totalPrice.toLocaleString()}đ</span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </aside>
                </div>
            </div>
        </div>
    );
}

export default ProductPage;
