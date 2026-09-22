'use client';

import * as React from 'react';

export interface CartLine {
  id: string;
  productId: string;
  variantId?: string;
  productName: string;
  variantName?: string;
  sku: string;
  unitPrice: number;
  quantity: number;
  imageUrl: string;
}

interface CartContextValue {
  items: CartLine[];
  itemCount: number;
  subtotal: number;
  isMiniCartOpen: boolean;
  setMiniCartOpen: (open: boolean) => void;
  addItem: (line: Omit<CartLine, 'id'> & { quantity?: number }) => void;
  updateQuantity: (id: string, delta: number) => void;
  removeItem: (id: string) => void;
  clear: () => void;
}

const STORAGE_KEY = 'alpha-tech-cart';
const CartContext = React.createContext<CartContextValue | undefined>(undefined);

function lineId(productId: string, variantId?: string): string {
  return variantId ? `${productId}:${variantId}` : productId;
}

function readStoredCart(): CartLine[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as CartLine[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = React.useState<CartLine[]>([]);
  const [isMiniCartOpen, setMiniCartOpen] = React.useState(false);
  const [hydrated, setHydrated] = React.useState(false);

  React.useEffect(() => {
    setItems(readStoredCart());
    setHydrated(true);
  }, []);

  React.useEffect(() => {
    if (!hydrated) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items, hydrated]);

  const addItem = React.useCallback((line: Omit<CartLine, 'id'> & { quantity?: number }) => {
    const id = lineId(line.productId, line.variantId);
    const quantity = line.quantity ?? 1;
    setItems((prev) => {
      const existing = prev.find((item) => item.id === id);
      if (existing) {
        return prev.map((item) =>
          item.id === id ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      return [...prev, { ...line, id, quantity }];
    });
    setMiniCartOpen(true);
  }, []);

  const updateQuantity = React.useCallback((id: string, delta: number) => {
    setItems((prev) =>
      prev
        .map((item) =>
          item.id === id ? { ...item, quantity: item.quantity + delta } : item
        )
        .filter((item) => item.quantity > 0)
    );
  }, []);

  const removeItem = React.useCallback((id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const clear = React.useCallback(() => setItems([]), []);

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);

  const value = React.useMemo(
    () => ({
      items,
      itemCount,
      subtotal,
      isMiniCartOpen,
      setMiniCartOpen,
      addItem,
      updateQuantity,
      removeItem,
      clear,
    }),
    [items, itemCount, subtotal, isMiniCartOpen, addItem, updateQuantity, removeItem, clear]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const context = React.useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
}
