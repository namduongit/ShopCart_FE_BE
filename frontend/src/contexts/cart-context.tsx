import { createContext, useCallback, useContext, useEffect, useState } from "react";
import type { CartDto } from "../libs/dto/CartDto";
import CartService from "../services/CartService";
import { AuthContext } from "./auth-context";
import { useExecute } from "../hooks/useExecute";

interface CartContextType {
    cartItems: CartDto[];
    loading: boolean;
    /** Thêm sản phẩm vào giỏ (gọi API add, sau đó reload) */
        addToCart: (productId: number, quantity: number) => Promise<void>;
    /** Giảm/xóa sản phẩm khỏi giỏ (gọi API remove, sau đó reload) */
    removeFromCart: (productId: number, quantity: number) => Promise<void>;
    /** Xóa toàn bộ giỏ hàng trên server và client */
    clearCart: () => Promise<void>;
    /** Tải lại giỏ hàng từ server */
    fetchCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CartProvider = ({ children }: { children: React.ReactNode }) => {
    const { GetCart, AddToCart, RemoveFromCart, ClearCart } = CartService;
    const { query: queryListCart, loading } = useExecute<CartDto[]>();
    const { query: queryAddCart } = useExecute<CartDto>();
    const { query: queryRemoveCart } = useExecute<CartDto | null>();
    const { query: queryClearCart } = useExecute<null>();
    const [cartItems, setCartItems] = useState<CartDto[]>([]);
    const authContext = useContext(AuthContext);

    const fetchCart = useCallback(async () => {
        // Chỉ gọi API khi đã đăng nhập
        if (!authContext?.isAuthenticated) return;
        await queryListCart(() => GetCart(), {
            issueNetwork: true,
            onSuccess(data) {
                setCartItems(data || []);
            },
        })
    }, [authContext?.isAuthenticated]);

    // Tải giỏ hàng khi trạng thái auth thay đổi
    useEffect(() => {
        void fetchCart();
    }, [fetchCart]);

    const addToCart = async (productId: number, quantity: number) => {
        await queryAddCart(() => AddToCart({ productId, quantity }), {
            issueNetwork: true,
        });
        await fetchCart();
    };

    const removeFromCart = async (productId: number, quantity: number) => {
        await queryRemoveCart(() => RemoveFromCart({ productId, quantity }), {
            issueNetwork: true,
        });
        await fetchCart();
    };

    const clearCart = async () => {
        await queryClearCart(() => ClearCart(), { issueNetwork: true });
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