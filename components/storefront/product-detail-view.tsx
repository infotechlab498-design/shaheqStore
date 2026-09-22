'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ShoppingCart,
  ShieldCheck,
  Truck,
  Check,
  CheckCircle2,
  FileText,
  Clock,
  Minus,
  Plus,
  MessageSquare,
  Heart,
} from 'lucide-react';
import { formatPKR } from '@/lib/utils/currency';
import { STOCK_STATUS_CONFIG } from '@/lib/constants';
import { Breadcrumb } from '@/components/ui/breadcrumb';
import { Product, ProductVariant } from '@/types/product';
import { useCart } from '@/lib/stores/cart-store';
import { useWishlist } from '@/lib/stores/wishlist-store';
import { productCompareAt, productImage, productKeySpecs } from '@/lib/utils/product-display';
import { HomepageProductCard } from '@/components/storefront/homepage-product-card';
import { CatalogImage } from '@/components/shared/catalog-image';
import { safeCatalogSrc } from '@/lib/utils/catalog-image';
import { siteConfig } from '@/lib/config/site';

interface ProductDetailViewProps {
  product: Product;
  relatedProducts?: Product[];
}

type DetailTab = 'description' | 'specifications' | 'shipping';

export function ProductDetailView({ product, relatedProducts = [] }: ProductDetailViewProps) {
  const router = useRouter();
  const { addItem } = useCart();
  const { hasItem, toggleItem } = useWishlist();
  const [selectedVariant, setSelectedVariant] = React.useState<ProductVariant | null>(() => {
    return product.hasVariants && product.variants.length > 0 ? product.variants[0] : null;
  });
  const [quantity, setQuantity] = React.useState(1);
  const [selectedImageIndex, setSelectedImageIndex] = React.useState(0);
  const [addedToast, setAddedToast] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState<DetailTab>('description');

  const currentPrice = selectedVariant ? selectedVariant.price : product.basePrice;
  const currentSku = selectedVariant ? selectedVariant.sku : product.sku;
  const currentStock = selectedVariant ? selectedVariant.stock : product.stock;
  const currentStatus = selectedVariant ? selectedVariant.status : product.status;
  const stockConfig = STOCK_STATUS_CONFIG[currentStatus] || STOCK_STATUS_CONFIG.IN_STOCK;
  const compareAt = productCompareAt(product, currentPrice);
  const gallery = (product.images.length > 0
    ? product.images
    : [{ id: 'fallback', url: productImage(product), alt: product.name, isPrimary: true, displayOrder: 1 }]
  ).map((image) => ({
    ...image,
    url: safeCatalogSrc(image.url, `${product.sku}-${image.id}`),
  }));
  const specs = productKeySpecs(product);
  const inStock = currentStock > 0 && currentStatus !== 'OUT_OF_STOCK';
  const saved = hasItem(product.id);

  const addCurrentItem = () => {
    addItem({
      productId: product.id,
      variantId: selectedVariant?.id,
      productName: product.name,
      variantName: selectedVariant?.name,
      sku: currentSku,
      unitPrice: currentPrice,
      quantity,
      imageUrl: gallery[selectedImageIndex]?.url || productImage(product),
    });
  };

  const handleAddToCart = () => {
    addCurrentItem();
    setAddedToast(true);
    window.setTimeout(() => setAddedToast(false), 3000);
  };

  const handleBuyNow = () => {
    addCurrentItem();
    router.push('/checkout');
  };

  return (
    <div className="bg-[#F8FAFC]">
      <div className="store-shell py-6 sm:py-8 space-y-10">
        <Breadcrumb
          items={[
            { label: 'Home', href: '/' },
            { label: 'Shop', href: '/shop' },
            { label: product.category.name, href: `/shop?category=${product.category.slug}` },
            { label: product.name },
          ]}
        />

        <section className="grid grid-cols-1 lg:grid-cols-12 items-start" style={{ gap: 'var(--hero-gap)' }}>
          <div className="lg:col-span-6 space-y-3">
            <div className="relative aspect-square w-full overflow-hidden rounded-xl border border-slate-200 bg-white">
              <CatalogImage
                src={gallery[selectedImageIndex]?.url || productImage(product)}
                seed={product.sku}
                alt={gallery[selectedImageIndex]?.alt || product.name}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority
                className="object-contain p-6 sm:p-10"
              />
              <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                <span className="rounded bg-[#073574] px-2 py-1 text-[10px] font-extrabold uppercase tracking-wider text-white">
                  {product.category.name}
                </span>
                {inStock && (
                  <span className="rounded bg-emerald-600 px-2 py-1 text-[10px] font-bold uppercase text-white">
                    {currentStock} in stock
                  </span>
                )}
              </div>
            </div>

            <div className="flex gap-2 overflow-x-auto no-scrollbar">
              {gallery.map((img, idx) => (
                <button
                  key={img.id}
                  type="button"
                  onClick={() => setSelectedImageIndex(idx)}
                  className={`relative h-16 w-16 sm:h-20 sm:w-20 shrink-0 overflow-hidden rounded-md border bg-white ${
                    selectedImageIndex === idx
                      ? 'border-[#073574] ring-2 ring-[#073574]/20'
                      : 'border-slate-200 opacity-70 hover:opacity-100'
                  }`}
                >
                  <CatalogImage src={img.url} seed={`${product.sku}-${img.id}`} alt={img.alt} fill sizes="80px" className="object-contain p-1.5" />
                </button>
              ))}
            </div>
          </div>

          <div className="lg:col-span-6 space-y-5">
            <div>
              <div className="flex items-center gap-2 text-xs">
                <span className="type-tiny font-medium text-[#073574]">{product.brand || 'ALPHA TECH'}</span>
                <span className="text-slate-300">/</span>
                <span className="type-tiny text-slate-500">SKU: {currentSku}</span>
              </div>
              <h1 className="mt-2 type-page text-[#073574]">
                {product.name}
              </h1>
              <p className="mt-3 type-body text-slate-600 max-w-2xl">
                {product.shortDescription}
              </p>
            </div>

            <div className="flex flex-wrap items-baseline gap-3">
              <span className="type-price text-[#073574]">{formatPKR(currentPrice)}</span>
              {compareAt && (
                <span className="type-price-old text-slate-400">{formatPKR(compareAt)}</span>
              )}
              <span className={`text-xs font-semibold ${inStock ? 'text-emerald-600' : 'text-rose-600'}`}>
                • {stockConfig.label}
              </span>
            </div>

            {specs.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 rounded-lg border border-slate-200 bg-white p-4">
                {specs.map((spec) => (
                  <div key={spec.label} className="flex justify-between gap-3 py-1.5 border-b border-slate-100 text-xs last:border-0 sm:last:border-b">
                    <span className="text-slate-500">{spec.label}</span>
                    <span className="font-semibold text-slate-800 text-right">{spec.value}</span>
                  </div>
                ))}
              </div>
            )}

            {product.hasVariants && product.variants.length > 0 && (
              <div className="space-y-2">
                <div className="text-[11px] font-extrabold uppercase tracking-wider text-[#073574]">
                  Select specification
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {product.variants.map((variant) => {
                    const selected = selectedVariant?.id === variant.id;
                    return (
                      <button
                        key={variant.id}
                        type="button"
                        onClick={() => setSelectedVariant(variant)}
                        className={`rounded-md border p-3 text-left ${
                          selected
                            ? 'border-[#073574] bg-[#EAF2FF] ring-1 ring-[#073574]'
                            : 'border-slate-200 bg-white hover:border-slate-300'
                        }`}
                      >
                        <span className="block text-xs font-bold text-[#073574]">{variant.name}</span>
                        <span className="block text-xs font-semibold text-slate-700 mt-1">{formatPKR(variant.price)}</span>
                        <span className="block text-[10px] text-slate-500 mt-0.5">{variant.stock} available</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="space-y-3 pt-2 border-t border-slate-200">
              <div className="flex flex-col sm:flex-row items-stretch gap-3">
                <div className="flex items-center border border-slate-300 rounded-md overflow-hidden bg-white">
                  <button
                    type="button"
                    onClick={() => setQuantity((value) => Math.max(1, value - 1))}
                    disabled={quantity <= 1}
                    className="h-11 w-11 flex items-center justify-center bg-slate-50 hover:bg-slate-100 disabled:opacity-40"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-12 text-center text-sm font-bold text-slate-800">{quantity}</span>
                  <button
                    type="button"
                    onClick={() => setQuantity((value) => Math.min(Math.max(currentStock, 1), value + 1))}
                    disabled={!inStock || quantity >= currentStock}
                    className="h-11 w-11 flex items-center justify-center bg-slate-50 hover:bg-slate-100 disabled:opacity-40"
                    aria-label="Increase quantity"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
                <button
                  type="button"
                  onClick={handleAddToCart}
                  disabled={!inStock}
                  className="flex-1 inline-flex items-center justify-center gap-2 rounded-md bg-[#073574] hover:bg-[#062A63] disabled:opacity-40 text-white px-4 py-3 text-xs font-bold uppercase tracking-wide"
                >
                  <ShoppingCart className="w-4 h-4" />
                  Add to Cart
                </button>
                <button
                  type="button"
                  onClick={handleBuyNow}
                  disabled={!inStock}
                  className="inline-flex items-center justify-center rounded-md bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 text-white px-4 py-3 text-xs font-bold uppercase tracking-wide"
                >
                  Buy Now
                </button>
                <button
                  type="button"
                  onClick={() =>
                    toggleItem({
                      productId: product.id,
                      slug: product.slug,
                      name: product.name,
                      sku: currentSku,
                      price: currentPrice,
                      imageUrl: gallery[selectedImageIndex]?.url || productImage(product),
                    })
                  }
                  className="inline-flex items-center justify-center rounded-md border border-slate-300 bg-white px-3 py-3 text-slate-600 hover:bg-slate-50"
                  aria-label={saved ? 'Remove from saved items' : 'Save item'}
                >
                  <Heart className={`w-4 h-4 ${saved ? 'fill-rose-600 text-rose-600' : ''}`} />
                </button>
              </div>

              {addedToast && (
                <div className="flex items-center justify-between rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs text-emerald-900">
                  <span className="inline-flex items-center gap-2">
                    <Check className="h-4 w-4" />
                    Added {quantity}x {product.name} to cart.
                  </span>
                  <Link href="/cart" className="font-bold underline">View cart</Link>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-slate-600">
                <div className="flex items-center gap-2">
                  <Truck className="w-3.5 h-3.5 text-blue-700" />
                  {product.shippingNotes || `TCS / Leopard dispatch · ${siteConfig.shipping.standardDeliveryEstimate}`}
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  Batch-inspected hardware · GST invoice on dispatch
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="rounded-xl border border-slate-200 bg-white overflow-hidden">
          <div className="flex flex-wrap border-b border-slate-200">
            {([
              ['description', 'Description'],
              ['specifications', 'Technical specifications'],
              ['shipping', 'Shipping & handling'],
            ] as const).map(([id, label]) => (
              <button
                key={id}
                type="button"
                onClick={() => setActiveTab(id)}
                className={`px-4 sm:px-5 py-3 text-xs font-bold uppercase tracking-wider ${
                  activeTab === id ? 'text-[#073574] border-b-2 border-[#073574]' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          <div className="p-5 sm:p-6">
            {activeTab === 'description' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-8 space-y-4">
                  <p className="text-sm text-slate-700 leading-relaxed">{product.description}</p>
                  {specs.length > 0 && (
                    <ul className="space-y-2">
                      {Object.entries(product.technicalSpecifications)
                        .filter(([key]) => key !== 'Merch' && key !== 'CompareAtPrice')
                        .slice(0, 6)
                        .map(([label, value]) => (
                          <li key={label} className="flex items-start gap-2 text-sm text-slate-600">
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                            <span><strong className="text-slate-800">{label}:</strong> {String(value)}</span>
                          </li>
                        ))}
                    </ul>
                  )}
                </div>
                <aside className="lg:col-span-4 rounded-lg border border-slate-200 bg-[#F8FAFC] p-4 space-y-3">
                  <h3 className="text-sm font-black text-[#073574]">Need a custom CNC or CAD cut?</h3>
                  <p className="text-xs text-slate-600">
                    Upload drawings or request a DFM quote for plates, mounts, and production parts.
                  </p>
                  <Link
                    href={`/quote?product=${product.slug}`}
                    className="inline-flex items-center justify-center w-full rounded-md bg-[#073574] text-white px-3 py-2 text-xs font-bold uppercase"
                  >
                    Request instant quote
                  </Link>
                  <a
                    href={`https://wa.me/${siteConfig.contact.whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent(`Need engineering support for ${product.name} (${currentSku})`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700"
                  >
                    <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
                    WhatsApp engineer
                  </a>
                </aside>
              </div>
            )}

            {activeTab === 'specifications' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2 text-sm">
                {Object.entries(product.technicalSpecifications)
                  .filter(([key]) => key !== 'Merch')
                  .map(([key, value]) => (
                    <div key={key} className="flex justify-between gap-4 py-2 border-b border-slate-100">
                      <span className="text-slate-500">{key}</span>
                      <span className="font-semibold text-slate-800 text-right">{String(value)}</span>
                    </div>
                  ))}
              </div>
            )}

            {activeTab === 'shipping' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-slate-600">
                <div className="rounded-lg border border-slate-200 p-4 space-y-2">
                  <div className="flex items-center gap-2 font-bold text-[#073574]">
                    <Truck className="w-4 h-4" />
                    Courier dispatch
                  </div>
                  <p>{product.shippingNotes || 'Tracked overland shipping via TCS, Leopard, M&P, and Trax.'}</p>
                  <p className="text-xs text-slate-500">Standard delivery: {siteConfig.shipping.standardDeliveryEstimate}</p>
                </div>
                <div className="rounded-lg border border-slate-200 p-4 space-y-2">
                  <div className="flex items-center gap-2 font-bold text-[#073574]">
                    <FileText className="w-4 h-4" />
                    Compatibility & handling
                  </div>
                  <p>{product.compatibilityNotes || 'Compatible with standard industrial mounting and electronics interfaces.'}</p>
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <Clock className="w-3.5 h-3.5" />
                    Free courier over {formatPKR(siteConfig.shipping.freeShippingThreshold)}
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>

        {relatedProducts.length > 0 && (
          <section className="space-y-5">
            <div className="flex items-end justify-between gap-3">
              <div>
                <div className="type-eyebrow text-blue-700"> complementary hardware</div>
                <h2 className="type-section text-[#073574] uppercase">
                  Hardware & tooling for {product.category.name}
                </h2>
              </div>
              <Link href={`/shop?category=${product.category.slug}`} className="text-xs font-bold text-[#073574]">
                View category
              </Link>
            </div>
            <div className="product-grid">
              {relatedProducts.map((item) => (
                <HomepageProductCard key={item.id} product={item} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
