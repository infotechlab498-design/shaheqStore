'use client';

import Link from 'next/link';
import { Heart, ShoppingCart } from 'lucide-react';
import { Product } from '@/types/product';
import { formatPKR } from '@/lib/utils/currency';
import {
  productCompareAt,
  productDiscountPercent,
  productImage,
  productKeySpecs,
  productStockBadge,
} from '@/lib/utils/product-display';
import { CatalogImage } from '@/components/shared/catalog-image';
import { useCart } from '@/lib/stores/cart-store';
import { useWishlist } from '@/lib/stores/wishlist-store';
import { cn } from '@/lib/utils';

export function HomepageProductCard({
  product,
  className,
}: {
  product: Product;
  className?: string;
}) {
  const { addItem } = useCart();
  const { hasItem, toggleItem } = useWishlist();
  const specs = productKeySpecs(product);
  const image = productImage(product);
  const inStock = product.stock > 0 && product.status !== 'OUT_OF_STOCK';
  const saved = hasItem(product.id);
  const compareAt = productCompareAt(product, product.basePrice);
  const discount = productDiscountPercent(product, product.basePrice);
  const stockBadge = productStockBadge(product);

  return (
    <div className={cn(
      'bg-white border border-slate-200 rounded-xl overflow-hidden flex flex-col hover:shadow-lg hover:border-slate-300 transition-all group',
      className
    )}>
      <div className="relative h-48 w-full bg-white overflow-hidden border-b border-slate-100">
        <div className="absolute top-2.5 left-2.5 z-10 flex flex-col gap-1">
          {discount ? (
            <span className="bg-rose-600 text-white type-tiny font-semibold px-2 py-0.5 rounded tracking-tight w-fit">
              -{discount}%
            </span>
          ) : null}
          <span
            className={`type-tiny font-semibold px-2 py-0.5 rounded tracking-tight w-fit ${
              stockBadge.tone === 'emerald'
                ? 'bg-emerald-600 text-white'
                : stockBadge.tone === 'rose'
                  ? 'bg-rose-600 text-white'
                  : 'bg-[#073574] text-white'
            }`}
          >
            {stockBadge.label}
          </span>
        </div>
        <button
          type="button"
          onClick={() =>
            toggleItem({
              productId: product.id,
              slug: product.slug,
              name: product.name,
              sku: product.sku,
              price: product.basePrice,
              imageUrl: image,
            })
          }
          className="absolute top-2.5 right-2.5 z-10 w-8 h-8 rounded-full bg-white/95 border border-slate-200 flex items-center justify-center"
          aria-label={saved ? 'Remove from saved items' : 'Save item'}
        >
          <Heart className={`w-4 h-4 ${saved ? 'fill-rose-600 text-rose-600' : 'text-slate-400'}`} />
        </button>
        <Link href={`/products/${product.slug}`} className="relative block w-full h-full">
          <CatalogImage
            src={image}
            seed={product.sku}
            alt={product.name}
            fill
            sizes="320px"
            className="object-contain p-4 group-hover:scale-105 transition-transform duration-300"
          />
        </Link>
      </div>

      <div className="p-4 flex-1 flex flex-col">
        <div className="flex items-center justify-between type-tiny text-slate-500 mb-1">
          <span className="font-medium uppercase tracking-wide text-blue-900">{product.brand || 'ALPHA TECH'}</span>
          <span>SKU: {product.sku}</span>
        </div>
        <Link href={`/products/${product.slug}`}>
          <h3 className="type-card-title text-[#073574] hover:text-blue-700 line-clamp-2 min-h-10">
            {product.name}
          </h3>
        </Link>
        {specs.length > 0 && (
          <div className="grid grid-cols-2 gap-x-3 gap-y-1.5 my-3 type-tiny">
            {specs.map((spec) => (
              <div key={spec.label} className="leading-tight">
                <span className="text-slate-500">{spec.label}: </span>
                <span className="font-bold text-slate-800">{spec.value}</span>
              </div>
            ))}
          </div>
        )}

        <div className="mt-auto pt-3 border-t border-slate-100 space-y-3">
          <div className="flex items-baseline gap-2">
            <div className="type-price text-[#073574]">{formatPKR(product.basePrice)}</div>
            {compareAt ? (
              <div className="type-price-old text-slate-400">{formatPKR(compareAt)}</div>
            ) : null}
          </div>
          <button
            type="button"
            disabled={!inStock}
            onClick={() =>
              addItem({
                productId: product.id,
                productName: product.name,
                sku: product.sku,
                unitPrice: product.basePrice,
                quantity: 1,
                imageUrl: image,
              })
            }
            className="w-full bg-[#073574] hover:bg-[#062A63] disabled:opacity-40 text-white px-3 py-2.5 rounded-md type-button transition-colors flex items-center justify-center gap-1.5"
          >
            <ShoppingCart className="w-3.5 h-3.5" />
            <span>Add to Cart</span>
          </button>
        </div>
      </div>
    </div>
  );
}
