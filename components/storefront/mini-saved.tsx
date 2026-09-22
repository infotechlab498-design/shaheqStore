'use client';

import Link from 'next/link';
import { Heart, Trash2, X } from 'lucide-react';
import { useWishlist } from '@/lib/stores/wishlist-store';
import { formatPKR } from '@/lib/utils/currency';
import { CatalogImage } from '@/components/shared/catalog-image';

export function MiniSaved() {
  const { items, count, isOpen, setOpen, removeItem } = useWishlist();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50" onClick={() => setOpen(false)}>
      <aside
        className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl flex flex-col animate-slide-left"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between">
          <h3 className="font-extrabold text-sm text-[#073574] uppercase inline-flex items-center gap-2">
            <Heart className="w-4 h-4" />
            Saved items ({count})
          </h3>
          <button type="button" onClick={() => setOpen(false)} className="p-2 rounded hover:bg-slate-100" aria-label="Close saved items">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {items.length === 0 ? (
            <p className="text-sm text-slate-500">No saved hardware yet. Use the heart on any product to keep it here.</p>
          ) : (
            items.map((item) => (
              <div key={item.productId} className="flex gap-3 border-b border-slate-100 pb-4">
                <Link href={`/products/${item.slug}`} onClick={() => setOpen(false)} className="relative h-16 w-16 shrink-0 rounded border border-slate-200 overflow-hidden bg-slate-50">
                  <CatalogImage src={item.imageUrl} seed={item.sku} alt={item.name} fill sizes="64px" className="object-contain p-0.5" />
                </Link>
                <div className="flex-1 min-w-0">
                  <Link href={`/products/${item.slug}`} onClick={() => setOpen(false)} className="text-xs font-bold text-[#073574] line-clamp-2">
                    {item.name}
                  </Link>
                  <p className="text-[10px] font-mono text-slate-500">SKU: {item.sku}</p>
                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-xs font-extrabold">{formatPKR(item.price)}</span>
                    <button type="button" onClick={() => removeItem(item.productId)} className="text-slate-400 hover:text-rose-600" aria-label={`Remove ${item.name}`}>
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
        {items.length > 0 && (
          <div className="p-5 border-t border-slate-200">
            <Link
              href="/saved"
              onClick={() => setOpen(false)}
              className="block text-center bg-[#073574] text-white py-3 rounded text-xs font-bold uppercase"
            >
              View saved list
            </Link>
          </div>
        )}
      </aside>
    </div>
  );
}
