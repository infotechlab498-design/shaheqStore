'use client';

import * as React from 'react';
import Link from 'next/link';
import { Trash2, ShoppingCart, ArrowRight, ShieldCheck, Truck } from 'lucide-react';
import { CatalogImage } from '@/components/shared/catalog-image';
import { Button } from '@/components/ui/button';
import { Breadcrumb } from '@/components/ui/breadcrumb';
import { EmptyState } from '@/components/ui/empty-state';
import { formatPKR } from '@/lib/utils/currency';
import { siteConfig } from '@/lib/config/site';
import { useCart } from '@/lib/stores/cart-store';

export default function CartPage() {
  const { items, subtotal, updateQuantity, removeItem } = useCart();
  const shippingFee = subtotal >= siteConfig.shipping.freeShippingThreshold || subtotal === 0
    ? 0
    : siteConfig.shipping.standardShippingFee;
  const total = subtotal + (items.length > 0 ? shippingFee : 0);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Breadcrumbs */}
      <Breadcrumb
        items={[
          { label: 'Home', href: '/' },
          { label: 'Shop', href: '/shop' },
          { label: 'Shopping Cart' },
        ]}
      />

      <div className="border-b border-zinc-200 pb-4">
        <h1 className="type-page text-zinc-900">
          Hardware Shopping Cart
        </h1>
        <p className="type-small text-zinc-500 mt-1">
          Review staged flight hardware, composite panels, and order dispatch fees.
        </p>
      </div>

      {items.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: Cart Items List */}
          <div className="lg:col-span-8 space-y-4">
            <div className="rounded-lg border border-zinc-200 bg-white divide-y divide-zinc-200 overflow-hidden shadow-xs">
              {items.map((item) => (
                <div key={item.id} className="p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="relative h-18 w-18 shrink-0 overflow-hidden rounded-md border border-zinc-200 bg-zinc-100">
                      <CatalogImage
                        src={item.imageUrl}
                        seed={item.sku}
                        alt={item.productName}
                        fill
                        sizes="72px"
                        className="object-cover"
                      />
                    </div>
                    <div className="space-y-1">
                      <span className="text-[10px] font-mono text-zinc-500">
                        SKU: {item.sku}
                      </span>
                      <h3 className="font-semibold text-zinc-900 text-sm leading-snug">
                        {item.productName}
                      </h3>
                      {item.variantName && (
                        <span className="inline-block text-xs font-mono text-amber-700 font-semibold bg-amber-50 px-1.5 py-0.5 rounded-xs border border-amber-200">
                          {item.variantName}
                        </span>
                      )}
                      <p className="text-xs font-mono text-zinc-600 sm:hidden">
                        Unit: {formatPKR(item.unitPrice)}
                      </p>
                    </div>
                  </div>

                  {/* Quantity and Price calculation */}
                  <div className="flex items-center justify-between w-full sm:w-auto gap-6 pt-2 sm:pt-0 border-t sm:border-t-0 border-zinc-100">
                    <div className="flex items-center border border-zinc-300 rounded-md bg-white">
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.id, -1)}
                        className="h-8 w-8 flex items-center justify-center text-zinc-600 hover:bg-zinc-100 font-mono text-sm"
                      >
                        -
                      </button>
                      <span className="w-10 text-center font-mono font-bold text-xs text-zinc-900">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.id, 1)}
                        className="h-8 w-8 flex items-center justify-center text-zinc-600 hover:bg-zinc-100 font-mono text-sm"
                      >
                        +
                      </button>
                    </div>

                    <div className="text-right font-mono">
                      <span className="text-sm font-bold text-zinc-900 block">
                        {formatPKR(item.unitPrice * item.quantity)}
                      </span>
                      <span className="text-[10px] text-zinc-500 hidden sm:block">
                        {formatPKR(item.unitPrice)} each
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => removeItem(item.id)}
                      className="p-1.5 text-zinc-400 hover:text-rose-600 transition-colors"
                      title="Remove item"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between text-xs font-mono text-zinc-500 pt-2">
              <Link href="/shop" className="hover:text-zinc-900 underline">
                ← Continue Shopping Hardware
              </Link>
              <span>Prices in PKR inclusive of standard packaging</span>
            </div>
          </div>

          {/* Right: Order Summary */}
          <div className="lg:col-span-4">
            <div className="rounded-lg border border-zinc-200 bg-white p-6 shadow-xs space-y-5">
              <h3 className="font-mono text-sm font-bold uppercase tracking-wider text-zinc-900 border-b border-zinc-100 pb-3">
                Order Summary
              </h3>

              <div className="space-y-3 font-mono text-xs">
                <div className="flex justify-between text-zinc-600">
                  <span>Subtotal</span>
                  <span className="font-semibold text-zinc-900">{formatPKR(subtotal)}</span>
                </div>
                <div className="flex justify-between text-zinc-600">
                  <span>Estimated Courier Shipping</span>
                  <span className="font-semibold text-zinc-900">
                    {shippingFee === 0 ? 'Free Shipping' : formatPKR(shippingFee)}
                  </span>
                </div>
                <div className="flex justify-between text-zinc-600">
                  <span>Sales Tax / GST</span>
                  <span className="font-semibold text-zinc-900">Calculated at Checkout</span>
                </div>

                <div className="border-t border-zinc-200 pt-3 flex justify-between text-sm font-bold text-zinc-950">
                  <span>Total Amount</span>
                  <span>{formatPKR(total)}</span>
                </div>
              </div>

              <Link href="/checkout" className="block">
                <Button
                  variant="accent"
                  size="lg"
                  className="w-full font-mono text-xs uppercase tracking-wider"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>

              <div className="pt-2 border-t border-zinc-100 space-y-2 text-[11px] font-mono text-zinc-500">
                <div className="flex items-center gap-2 text-zinc-700">
                  <Truck className="h-4 w-4 text-amber-600" />
                  <span>Dispatched via TCS / Leopard Courier</span>
                </div>
                <div className="flex items-center gap-2 text-zinc-700">
                  <ShieldCheck className="h-4 w-4 text-emerald-600" />
                  <span>Raast / IBFT, COD & Card Payments</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <EmptyState
          icon={<ShoppingCart className="h-6 w-6" />}
          title="Your shopping cart is currently empty"
          description="Browse our catalog of precision LiPo batteries, carbon fiber sheets, and UAV motors to add hardware to your cart."
          actionLabel="Explore Hardware Catalog"
          onAction={() => {
            window.location.href = '/shop';
          }}
        />
      )}
    </div>
  );
}
