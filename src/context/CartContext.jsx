/**
 * Cart Context — provides cart state globally.
 * Mirrors Flutter's CartController with online cart support.
 */
import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { useAuth } from './AuthContext';
import * as cartApi from '../api/services/cart';

const CartContext = createContext(null);

export function CartProvider({ children }) {
    const { isLoggedIn, isGuest } = useAuth();
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(false);

    const itemCount = items.reduce((sum, i) => sum + (i.quantity || 1), 0);
    const subtotal = items.reduce((sum, i) => sum + (i.price || 0) * (i.quantity || 1), 0);

    // Load cart from server
    const loadCart = useCallback(async () => {
        if (!isLoggedIn && !isGuest) return;
        try {
            setLoading(true);
            const data = await cartApi.fetchCartList();
            setItems(Array.isArray(data) ? data : data?.carts || data?.data || []);
        } catch (err) {
            console.warn('Failed to load cart:', err.message);
        } finally {
            setLoading(false);
        }
    }, [isLoggedIn, isGuest]);

    useEffect(() => {
        loadCart();
    }, [loadCart]);

    const addItem = useCallback(async (body) => {
        const data = await cartApi.addToCart(body);
        await loadCart(); // refresh
        return data;
    }, [loadCart]);

    const updateItem = useCallback(async (body) => {
        const data = await cartApi.updateCartItem(body);
        await loadCart();
        return data;
    }, [loadCart]);

    const removeItem = useCallback(async (cartId) => {
        await cartApi.removeCartItem(cartId);
        await loadCart();
    }, [loadCart]);

    const clearCart = useCallback(async () => {
        await cartApi.removeAllCart();
        setItems([]);
    }, []);

    return (
        <CartContext.Provider value={{
            items,
            loading,
            itemCount,
            subtotal,
            addItem,
            updateItem,
            removeItem,
            clearCart,
            refreshCart: loadCart,
        }}>
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const ctx = useContext(CartContext);
    if (!ctx) throw new Error('useCart must be used within CartProvider');
    return ctx;
}
