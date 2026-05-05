import { createContext, useCallback, useContext, useEffect, useState } from "react";
import type { CartDto } from "../libs/dto/CartDto";
import CartService from "../services/cartService";
import { AuthContext } from "./auth-context";

interface CartContextType {
    cartItems: CartDto[];
    loading: boolean;
    /** Thêm sản phẩm vào giỏ (gọi API add, sau đó reload) */
    addToCart: (productId: number, quantity: number) => Promise<void>;
    /** Giảm/xóa sản phẩm khỏi giỏ (gọi API remove, sau đó reload) */
    removeFromCart: (productId: number, quantity: number) => Promise<void>;
    /** Xóa toàn bộ giỏ hàng trên client (dùng khi logout) */
    clearCart: () => void;
    /** Tải lại giỏ hàng từ server */
    fetchCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CartProvider = ({ children }: { children: React.ReactNode }) => {
    const [cartItems, setCartItems] = useState<CartDto[]>([]);
    const [loading, setLoading] = useState(false);
    const authContext = useContext(AuthContext);

    const fetchCart = useCallback(async () => {
        // Chỉ gọi API khi đã đăng nhập
        if (!authContext?.isAuthenticated) return;
        try {
            setLoading(true);
            const result = await CartService.GetCart();
            setCartItems(result.data ?? []);
        } catch {
            // lỗi bỏ qua — useExecute xử lý ở tầng component
        } finally {
            setLoading(false);
        }
    }, [authContext?.isAuthenticated]);

    // Tải giỏ hàng khi trạng thái auth thay đổi
    useEffect(() => {
        void fetchCart();
    }, [fetchCart]);

    const addToCart = async (productId: number, quantity: number) => {
        await CartService.AddToCart({ productId, quantity });
        await fetchCart();
    };

    const removeFromCart = async (productId: number, quantity: number) => {
        await CartService.RemoveFromCart({ productId, quantity });
        await fetchCart();
    };

    const clearCart = () => {
        setCartItems([]);
    };

    return (
        <CartContext.Provider value={{
            cartItems,
            loading,
            addToCart,
            removeFromCart,
            clearCart,
            fetchCart,
        }}>
            {children}
        </CartContext.Provider>
    );
};

export { CartContext, CartProvider };