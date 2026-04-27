"use client";
import { createContext, useContext, useEffect, useMemo, useReducer, useState } from "react";
import { CART_KEY } from "@/lib/storage";

export type CartItem = {
  key: string;
  productId: string;
  name: string;
  price: number;
  imageUrl?: string;
  flavor?: string;
  size?: string;
  quantity: number;
};

type Action =
  | { type: "ADD"; item: Omit<CartItem, "key" | "quantity"> & { quantity?: number } }
  | { type: "REMOVE"; key: string }
  | { type: "QTY"; key: string; qty: number }
  | { type: "CLEAR" }
  | { type: "SET"; items: CartItem[] };

function reducer(state: CartItem[], a: Action): CartItem[] {
  switch (a.type) {
    case "SET":
      return a.items;
    case "ADD": {
      const key = `${a.item.productId}-${a.item.flavor || ""}-${a.item.size || ""}`;
      const existing = state.find((i) => i.key === key);
      if (existing) return state.map((i) => (i.key === key ? { ...i, quantity: i.quantity + (a.item.quantity || 1) } : i));
      return [...state, { ...a.item, key, quantity: a.item.quantity || 1 }];
    }
    case "REMOVE":
      return state.filter((i) => i.key !== a.key);
    case "QTY":
      return state.map((i) => (i.key === a.key ? { ...i, quantity: Math.max(1, a.qty) } : i));
    case "CLEAR":
      return [];
  }
}

type AddItemInput = Omit<CartItem, "key" | "quantity"> & { quantity?: number };

type Ctx = {
  cart: CartItem[];
  cartTotal: number;
  cartCount: number;
  cartOpen: boolean;
  setCartOpen: (v: boolean) => void;
  addToCart: (item: AddItemInput) => void;
  removeFromCart: (key: string) => void;
  updateQty: (key: string, qty: number) => void;
  clearCart: () => void;
};
const CartContext = createContext<Ctx | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, dispatch] = useReducer(reducer, []);
  const [cartOpen, setCartOpen] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(CART_KEY);
      if (raw) dispatch({ type: "SET", items: JSON.parse(raw) });
    } catch {}
  }, []);
  useEffect(() => {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
  }, [cart]);

  const value = useMemo<Ctx>(
    () => ({
      cart,
      cartOpen,
      setCartOpen,
      cartTotal: cart.reduce((s, i) => s + i.price * i.quantity, 0),
      cartCount: cart.reduce((s, i) => s + i.quantity, 0),
      addToCart: (item) => {
        dispatch({ type: "ADD", item });
        setCartOpen(true);
      },
      removeFromCart: (key) => dispatch({ type: "REMOVE", key }),
      updateQty: (key, qty) => dispatch({ type: "QTY", key, qty }),
      clearCart: () => dispatch({ type: "CLEAR" }),
    }),
    [cart, cartOpen]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be inside CartProvider");
  return ctx;
}
