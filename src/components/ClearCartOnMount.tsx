"use client";
import { useEffect } from "react";
import { useCart } from "@/context/CartProvider";

export default function ClearCartOnMount() {
  const { clearCart } = useCart();
  useEffect(() => {
    clearCart();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return null;
}
