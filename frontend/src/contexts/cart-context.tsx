import { createContext, useCallback, useEffect, useState } from "react";

interface CartContextType {
    cartItems: any[];
    addToCart: (item: any) => void;
    removeFromCart: (itemId: string) => void;
    clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CartProvider = ({ children }: { children: React.ReactNode }) => {
    const [cartItems, setCartItems] = useState<any[]>([]);

    const addToCart = (item: any) => {
        // Call api to set new item into cart
        setCartItems((prevItems) => [...prevItems, item]);
    };

    const removeFromCart = (itemId: string) => {
        // Call api to remove item from cart
        setCartItems((prevItems) => prevItems.filter(item => item.id !== itemId));
    };

    const clearCart = () => {
        // Call api to clear cart items
        setCartItems([]);
    };

    const fetchCartItems = useCallback(() => {
        // Call api to get cart items
    }, []);

    useEffect(() => {
        void fetchCartItems();
    }, [fetchCartItems]);

    return (
        <CartContext.Provider value={{
            cartItems,
            addToCart,
            removeFromCart,
            clearCart
        }}>
            {children}
        </CartContext.Provider>
    )
}

export { CartContext, CartProvider };