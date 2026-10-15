"use client";

import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState,
} from "react";
import {
    addCartItem,
    clearCart as clearCartRequest,
    getCart,
    isUnauthorizedError,
    removeCartItem,
    toCart,
    updateCartItem,
} from "@/api/cart.service";
import { AUTH_CHANGE_EVENT } from "@/hooks/use-current-user";
import type { Cart } from "@/types/cart.types";
import type { Product } from "@/types/product.types";

type CartContextValue = {
    cart: Cart;
    /** Ném lỗi nếu thất bại (kể cả 401 khi chưa đăng nhập) để nút bấm xử lý. */
    addItem: (product: Product, quantity?: number) => Promise<void>;
    updateQuantity: (productId: string, quantity: number) => Promise<void>;
    removeItem: (productId: string) => Promise<void>;
    clearCart: () => Promise<void>;
    refreshCart: () => Promise<void>;
    itemCount: number;
    loading: boolean;
    loggedIn: boolean;
    error: string | null;
};

const CartContext = createContext<CartContextValue | null>(null);
const emptyCart: Cart = { id: "empty-cart", items: [], total: 0 };

function messageOf(error: unknown, fallback: string) {
    return error instanceof Error ? error.message : fallback;
}

export function CartProvider({ children }: { children: React.ReactNode }) {
    const [cart, setCart] = useState<Cart>(emptyCart);
    const [loading, setLoading] = useState(true);
    const [loggedIn, setLoggedIn] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Tải giỏ hàng từ server: GET /api/cart  ->  CartServlet.doGet
    const refreshCart = useCallback(async () => {
        try {
            setCart(toCart(await getCart()));
            setLoggedIn(true);
            setError(null);
        } catch (requestError) {
            // 401 = chưa đăng nhập -> giỏ trống, không coi là lỗi
            setCart(emptyCart);
            setLoggedIn(false);
            setError(
                isUnauthorizedError(requestError)
                    ? null
                    : messageOf(requestError, "Không thể tải giỏ hàng."),
            );
        } finally {
            setLoading(false);
        }
    }, []);

    // Tải khi mở web, và tải lại mỗi khi đăng nhập / đăng xuất
    useEffect(() => {
        void refreshCart();
        const handleAuthChange = () => {
            void refreshCart();
        };
        window.addEventListener(AUTH_CHANGE_EVENT, handleAuthChange);
        return () => window.removeEventListener(AUTH_CHANGE_EVENT, handleAuthChange);
    }, [refreshCart]);

    // POST /api/cart/items  ->  CartServlet.doPost
    const addItem = useCallback(async (product: Product, quantity = 1) => {
        const productId = Number(product.id);
        if (!Number.isSafeInteger(productId)) {
            throw new Error("Sản phẩm không có ID hợp lệ.");
        }
        setCart(toCart(await addCartItem(productId, quantity)));
        setLoggedIn(true);
        setError(null);
    }, []);

    // PUT /api/cart/items/{itemId}  ->  CartServlet.doPut
    const updateQuantity = useCallback(
        async (productId: string, quantity: number) => {
            const item = cart.items.find((entry) => entry.product.id === productId);
            if (item?.itemId === undefined) return;

            const nextQuantity = Math.max(quantity, 1);
            if (nextQuantity === item.quantity) return;

            try {
                setCart(toCart(await updateCartItem(item.itemId, nextQuantity)));
                setError(null);
            } catch (requestError) {
                setError(messageOf(requestError, "Không thể cập nhật số lượng."));
            }
        },
        [cart.items],
    );

    // DELETE /api/cart/items/{itemId}  ->  CartServlet.doDelete
    const removeItem = useCallback(
        async (productId: string) => {
            const item = cart.items.find((entry) => entry.product.id === productId);
            if (item?.itemId === undefined) return;

            try {
                setCart(toCart(await removeCartItem(item.itemId)));
                setError(null);
            } catch (requestError) {
                setError(messageOf(requestError, "Không thể xóa sản phẩm."));
            }
        },
        [cart.items],
    );

    // DELETE /api/cart/clear  ->  CartServlet.doDelete
    const clearCart = useCallback(async () => {
        if (!loggedIn) {
            setCart(emptyCart);
            return;
        }
        try {
            setCart(toCart(await clearCartRequest()));
            setError(null);
        } catch (requestError) {
            setError(messageOf(requestError, "Không thể xóa giỏ hàng."));
        }
    }, [loggedIn]);

    const itemCount = cart.items.reduce((sum, item) => sum + item.quantity, 0);

    const value = useMemo(
        () => ({
            cart,
            addItem,
            updateQuantity,
            removeItem,
            clearCart,
            refreshCart,
            itemCount,
            loading,
            loggedIn,
            error,
        }),
        [
            addItem,
            cart,
            clearCart,
            error,
            itemCount,
            loading,
            loggedIn,
            refreshCart,
            removeItem,
            updateQuantity,
        ],
    );

    return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
    const context = useContext(CartContext);

    if (!context) {
        throw new Error("useCart must be used within CartProvider");
    }

    return context;
}