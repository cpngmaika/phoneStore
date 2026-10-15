"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { isUnauthorizedError } from "@/api/cart.service";
import { Button } from "@/components/ui/Button";
import { useCart } from "@/hooks/cart.hooks";
import type { Product } from "@/types/product.types";

export function AddToCartButton({ product }: { product: Product }) {
    const router = useRouter();
    const { addItem } = useCart();
    const [added, setAdded] = useState(false);
    const [pending, setPending] = useState(false);
    const [message, setMessage] = useState<string | null>(null);
    const disabled = product.status !== "ACTIVE";

    async function handleAdd() {
        setPending(true);
        setMessage(null);
        try {
            // Gọi POST /api/cart/items  ->  CartServlet.doPost
            await addItem(product);
            setAdded(true);
        } catch (error) {
            if (isUnauthorizedError(error)) {
                // Chưa đăng nhập -> chuyển sang trang đăng nhập
                router.push("/login");
                return;
            }
            setMessage(
                error instanceof Error ? error.message : "Không thể thêm vào giỏ hàng.",
            );
        } finally {
            setPending(false);
        }
    }

    return (
        <div className="space-y-3">
            <Button
                type="button"
                disabled={disabled || pending}
                onClick={handleAdd}
                className="h-12 w-full rounded-lg bg-primary px-6 text-sm font-semibold text-white transition hover:bg-primary-dark disabled:cursor-not-allowed disabled:bg-border-strong"
            >
                {disabled
                    ? "Out of stock"
                    : pending
                        ? "Adding..."
                        : added
                            ? "Added to cart"
                            : "Add to Cart"}
            </Button>
            {message ? (
                <p role="alert" className="text-sm text-red-700">
                    {message}
                </p>
            ) : null}
            {added ? (
                <Link
                    href="/cart"
                    className="flex h-12 w-full items-center justify-center rounded-lg border border-border bg-surface px-6 text-sm font-semibold text-text transition hover:border-border-strong"
                >
                    View Cart
                </Link>
            ) : null}
        </div>
    );
}