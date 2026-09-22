'use client';

import Link from 'next/link';
import { Heart, Trash2 } from 'lucide-react';
import { Breadcrumb } from '@/components/ui/breadcrumb';
import { useWishlist } from '@/lib/stores/wishlist-store';
import { formatPKR } from '@/lib/utils/currency';
import { CatalogImage } from '@/components/shared/catalog-image';

export default function SavedPage() {
  const { items, removeItem } = useWishlist();

  return (
    <div className="store-shell py-8 space-y-8">
      <Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'Saved items' }]} />
      <div className="border-b border-slate-200 pb-4">
        <h1 className="type-page text-[#073574]">Saved hardware</h1>
        <p className="text-xs text-slate-500 mt-1">{items.length} item{items.length === 1 ? '' : 's'} kept for later.</p>
      </div>

      {items.length === 0 ? (
        <div className="rounded-xl border border-slate-200 bg-white p-10 text-center">
          <Heart className="w-8 h-8 text-slate-300 mx-auto mb-3" />
          <p className="text-sm text-slate-600">Your saved list is empty.</p>
          <Link href="/shop" className="inline-block mt-4 text-xs font-bold text-[#073574] underline">
            Browse the catalog
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((item) => (
            <div key={item.productId} className="rounded-xl border border-slate-200 bg-white p-4 flex gap-4">
              <Link href={`/products/${item.slug}`} className="relative h-20 w-20 shrink-0 rounded border border-slate-200 overflow-hidden bg-slate-50">
                <CatalogImage src={item.imageUrl} seed={item.sku} alt={item.name} fill sizes="80px" className="object-contain p-1" />
              </Link>
              <div className="min-w-0 flex-1">
                <Link href={`/products/${item.slug}`} className="text-sm font-bold text-[#073574] line-clamp-2">
                  {item.name}
                </Link>
                <p className="text-[11px] font-mono text-slate-500 mt-1">SKU: {item.sku}</p>
                <div className="mt-3 flex items-center justify-between">
                  <span className="text-sm font-extrabold">{formatPKR(item.price)}</span>
                  <button type="button" onClick={() => removeItem(item.productId)} className="text-slate-400 hover:text-rose-600" aria-label={`Remove ${item.name}`}>
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
