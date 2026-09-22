'use client';

import * as React from 'react';

export interface WishlistItem {
  productId: string;
  slug: string;
  name: string;
  sku: string;
  price: number;
  imageUrl: string;
}

interface WishlistContextValue {
  items: WishlistItem[];
  count: number;
  isOpen: boolean;
  setOpen: (open: boolean) => void;
  hasItem: (productId: string) => boolean;
  toggleItem: (item: WishlistItem) => void;
  removeItem: (productId: string) => void;
}

const STORAGE_KEY = 'alpha-tech-wishlist';
const WishlistContext = React.createContext<WishlistContextValue | undefined>(undefined);

function readStored(): WishlistItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? (JSON.parse(raw) as WishlistItem[]) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = React.useState<WishlistItem[]>([]);
  const [isOpen, setOpen] = React.useState(false);
  const [hydrated, setHydrated] = React.useState(false);

  React.useEffect(() => {
    setItems(readStored());
    setHydrated(true);
  }, []);

  React.useEffect(() => {
    if (!hydrated) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items, hydrated]);

  const hasItem = React.useCallback(
    (productId: string) => items.some((item) => item.productId === productId),
    [items]
  );

  const toggleItem = React.useCallback((item: WishlistItem) => {
    setItems((prev) => {
      const exists = prev.some((entry) => entry.productId === item.productId);
      return exists ? prev.filter((entry) => entry.productId !== item.productId) : [...prev, item];
    });
  }, []);

  const removeItem = React.useCallback((productId: string) => {
    setItems((prev) => prev.filter((item) => item.productId !== productId));
  }, []);

  const value = React.useMemo(
    () => ({ items, count: items.length, isOpen, setOpen, hasItem, toggleItem, removeItem }),
    [items, isOpen, hasItem, toggleItem, removeItem]
  );

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
}

export function useWishlist(): WishlistContextValue {
  const context = React.useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within WishlistProvider');
  }
  return context;
}
