'use client';

import Link from 'next/link';
import { X, Trash2 } from 'lucide-react';
import { useCart } from '@/lib/stores/cart-store';
import { formatPKR } from '@/lib/utils/currency';
import { siteConfig } from '@/lib/config/site';
import { CatalogImage } from '@/components/shared/catalog-image';

export function MiniCart() {
  const { items, itemCount, subtotal, isMiniCartOpen, setMiniCartOpen, updateQuantity, removeItem } = useCart();
  const shipping =
    subtotal >= siteConfig.shipping.freeShippingThreshold || subtotal === 0
      ? 0
      : siteConfig.shipping.standardShippingFee;

  if (!isMiniCartOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50" onClick={() => setMiniCartOpen(false)}>
      <aside
        className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl flex flex-col animate-slide-left"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between">
          <h3 className="font-extrabold text-sm text-[#073574] uppercase">Your order cart ({itemCount})</h3>
          <button type="button" onClick={() => setMiniCartOpen(false)} className="p-2 rounded hover:bg-slate-100" aria-label="Close cart">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {items.length === 0 ? (
            <p className="text-sm text-slate-500">Your shopping cart is empty.</p>
          ) : (
            items.map((item) => (
              <div key={item.id} className="flex gap-3 border-b border-slate-100 pb-4">
                <div className="relative h-16 w-16 shrink-0 rounded border border-slate-200 overflow-hidden bg-slate-50">
                  <CatalogImage src={item.imageUrl} seed={item.sku} alt={item.productName} fill sizes="64px" className="object-contain p-0.5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-[#073574] line-clamp-2">{item.productName}</p>
                  <p className="text-[10px] font-mono text-slate-500">SKU: {item.sku}</p>
                  <div className="mt-2 flex items-center justify-between">
                    <div className="flex items-center border border-slate-300 rounded">
                      <button type="button" className="w-7 h-7" onClick={() => updateQuantity(item.id, -1)}>-</button>
                      <span className="w-7 text-center text-xs font-bold">{item.quantity}</span>
                      <button type="button" className="w-7 h-7" onClick={() => updateQuantity(item.id, 1)}>+</button>
                    </div>
                    <span className="text-xs font-extrabold">{formatPKR(item.unitPrice * item.quantity)}</span>
                    <button type="button" onClick={() => removeItem(item.id)} className="text-slate-400 hover:text-rose-600">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {items.length > 0 && (
          <div className="p-5 border-t border-slate-200 space-y-3 text-xs">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="font-bold">{formatPKR(subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span>Courier</span>
              <span className="font-bold">{shipping === 0 ? 'Free' : formatPKR(shipping)}</span>
            </div>
            <div className="flex justify-between text-sm font-extrabold text-[#073574]">
              <span>Total</span>
              <span>{formatPKR(subtotal + shipping)}</span>
            </div>
            <Link
              href="/checkout"
              onClick={() => setMiniCartOpen(false)}
              className="block text-center bg-[#073574] text-white py-3 rounded text-xs font-bold uppercase"
            >
              Proceed to checkout
            </Link>
            <Link
              href="/cart"
              onClick={() => setMiniCartOpen(false)}
              className="block text-center border border-slate-200 py-2 rounded text-xs font-semibold"
            >
              View cart
            </Link>
          </div>
        )}
      </aside>
    </div>
  );
}
