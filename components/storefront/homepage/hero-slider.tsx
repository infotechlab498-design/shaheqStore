'use client';

import * as React from 'react';
import Link from 'next/link';
import { ArrowRight, ChevronLeft, ChevronRight, FileText, Pause, Play, Zap } from 'lucide-react';
import { Product } from '@/types/product';
import { formatPKR } from '@/lib/utils/currency';
import { productImage, productKeySpecs, productStockBadge } from '@/lib/utils/product-display';
import { CatalogImage } from '@/components/shared/catalog-image';
import { useCart } from '@/lib/stores/cart-store';

const AUTO_MS = 5500;

const HEADLINES: Record<string, string> = {
  'power-systems': 'Power your next build',
  'raw-materials': 'Toray carbon in stock',
  'carbon-fiber': 'Toray carbon in stock',
  'propulsion-fpv': 'Race-ready propulsion',
  'drone-fpv': 'Race-ready propulsion',
  'hardware-fasteners': 'Grade 5 hardware kits',
  'robotics-actuators': 'Robotics-grade control',
  'additive-materials': 'Additive production parts',
  'tooling-bench': 'Bench-ready consumables',
};

function headlineFor(product: Product): string {
  return HEADLINES[product.category.slug] || product.name;
}

function kickerFor(product: Product): string {
  const spec = productKeySpecs(product)[0];
  return spec ? `${product.category.name} · ${spec.value}` : product.category.name;
}

export function HeroSlider({
  products,
  catalogCount,
  categoryCount,
}: {
  products: Product[];
  catalogCount: number;
  categoryCount: number;
}) {
  const { addItem } = useCart();
  const slides = React.useMemo(() => {
    const featured = products.filter((product) => product.isFeatured);
    const source = featured.length ? featured : products;
    return source.slice(0, 6);
  }, [products]);

  const [index, setIndex] = React.useState(0);
  const [paused, setPaused] = React.useState(false);
  const product = slides[index] || slides[0];

  const goTo = React.useCallback(
    (next: number) => {
      if (!slides.length) return;
      setIndex((next + slides.length) % slides.length);
    },
    [slides.length]
  );

  React.useEffect(() => {
    if (paused || slides.length < 2) return;
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }
    const timer = window.setInterval(() => {
      setIndex((current) => (current + 1) % slides.length);
    }, AUTO_MS);
    return () => window.clearInterval(timer);
  }, [paused, slides.length, index]);

  React.useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'ArrowRight') goTo(index + 1);
      if (event.key === 'ArrowLeft') goTo(index - 1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [goTo, index]);

  if (!product) return null;

  const specs = productKeySpecs(product).slice(0, 2);
  const stock = productStockBadge(product);
  const inStock = product.stock > 0 && product.status !== 'OUT_OF_STOCK';
  const specBadge = specs.map((spec) => spec.value).filter(Boolean).slice(0, 2).join(' ');

  const touchX = React.useRef(0);

  return (
    <section
      className="w-full bg-[#F4F7FB] md:bg-white border-b border-slate-200 overflow-hidden"
      aria-roledescription="carousel"
      aria-label="Featured hardware"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div
        className="md:hidden px-3 pb-3"
        onTouchStart={(event) => {
          touchX.current = event.touches[0]?.clientX || 0;
        }}
        onTouchEnd={(event) => {
          const dx = (event.changedTouches[0]?.clientX || 0) - touchX.current;
          if (dx > 48) goTo(index - 1);
          if (dx < -48) goTo(index + 1);
        }}
      >
        <div className="relative overflow-hidden rounded-2xl min-h-[17.5rem] bg-[#051C42] text-white">
          {slides.map((slide, slideIndex) => (
            <div
              key={slide.id}
              className={`absolute inset-0 transition-opacity duration-500 ${
                slideIndex === index ? 'opacity-100' : 'opacity-0'
              }`}
              aria-hidden={slideIndex !== index}
            >
              <CatalogImage
                src={productImage(slide)}
                seed={slide.sku}
                alt={slide.name}
                fill
                priority={slideIndex === 0}
                sizes="100vw"
                className="object-cover"
              />
            </div>
          ))}
          <div className="absolute inset-0 bg-[#051C42]/72" />
          <div className="relative z-10 flex flex-col justify-end min-h-[17.5rem] p-4">
            <div className="flex flex-wrap items-center gap-1.5 mb-3">
              {specBadge ? (
                <span className="inline-flex items-center gap-1 rounded-md bg-emerald-600 px-2 py-1 text-[10px] font-bold">
                  <Zap className="w-3 h-3" />
                  {specBadge}
                </span>
              ) : null}
              <span className="rounded-md bg-white/15 px-2 py-1 text-[10px] font-bold tracking-wide">
                ISO 9001 METROLOGY HUB
              </span>
            </div>
            <h1 className="text-[26px] leading-[1.08] font-extrabold uppercase tracking-tight">
              {headlineFor(product)}
            </h1>
            <p className="mt-2 text-[12px] leading-5 text-blue-100 line-clamp-2">
              {product.shortDescription}
            </p>
            <div className="mt-4 flex items-center gap-2">
              <Link
                href={`/shop?category=${product.category.slug}`}
                className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-lg bg-[#0B4A8F] hover:bg-[#073574] px-3 py-2.5 text-[12px] font-bold"
              >
                Shop {product.category.name} <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <Link
                href="/quote"
                className="shrink-0 inline-flex items-center justify-center rounded-lg bg-white text-[#073574] px-3.5 py-2.5 text-[12px] font-bold"
              >
                CAD Quote
              </Link>
            </div>
            {slides.length > 1 && (
              <div className="mt-3 flex items-center justify-center gap-1.5">
                {slides.map((slide, slideIndex) => (
                  <button
                    key={slide.id}
                    type="button"
                    aria-label={`Show ${slide.name}`}
                    onClick={() => goTo(slideIndex)}
                    className={`h-1.5 rounded-full transition-all ${
                      slideIndex === index ? 'w-5 bg-white' : 'w-1.5 bg-white/40'
                    }`}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="hidden md:block store-shell py-5 lg:py-6">
        <div className="hero-layout">
          <div key={product.id} className="space-y-3 hero-copy">
            <div className="inline-flex items-center gap-1.5 bg-[#EAF2FF] border border-blue-200/80 text-[#073574] px-2.5 py-0.5 rounded-sm type-eyebrow">
              <Zap className="w-3 h-3 text-blue-700" />
              {kickerFor(product)}
            </div>
            <h1 className="type-hero text-[#073574] uppercase">
              {headlineFor(product)}
            </h1>
            <p className="type-hero-desc text-slate-600 max-w-md">
              {product.shortDescription}
            </p>
            <div className="grid grid-cols-3 gap-2 py-1 max-w-sm">
              {[
                { label: 'In stock', value: String(product.stock), dot: inStock },
                { label: 'Category', value: product.category.name },
                { label: specs[0]?.label || 'Catalog', value: specs[0]?.value || String(catalogCount) },
              ].map((metric) => (
                <div key={metric.label} className="bg-slate-50 border border-slate-200 rounded px-2 py-1.5">
                  <div className="type-tiny uppercase text-slate-500 tracking-wider line-clamp-1">{metric.label}</div>
                  <div className="text-[13px] font-semibold text-[#073574] mt-0.5 flex items-center gap-1">
                    {metric.dot && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />}
                    <span className="line-clamp-1">{metric.value}</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex flex-wrap items-center gap-2 pt-0.5">
              <Link
                href={`/shop?category=${product.category.slug}`}
                className="bg-[#073574] hover:bg-[#062A63] text-white px-3.5 py-2 rounded-md type-button uppercase shadow-sm inline-flex items-center gap-1.5"
              >
                Shop {product.category.name} <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <Link
                href={`/products/${product.slug}`}
                className="bg-white hover:bg-slate-50 text-[#073574] border border-slate-300 px-3.5 py-2 rounded-md type-button uppercase inline-flex items-center gap-1.5"
              >
                <FileText className="w-3.5 h-3.5 text-blue-600" />
                Specs & Guide
              </Link>
            </div>
            <p className="type-tiny text-slate-400">
              Slide {index + 1} of {slides.length} · {categoryCount} live categories
            </p>
          </div>

          <div className="relative lg:justify-self-end w-full max-w-[34rem]">
            <div className="relative rounded-xl overflow-hidden bg-[#0A1A33] border border-slate-800 shadow-lg">
              <div className="hero-visual w-full max-w-none">
                {slides.map((slide, slideIndex) => (
                  <div
                    key={slide.id}
                    className={`absolute inset-0 transition-opacity duration-500 ${
                      slideIndex === index ? 'opacity-100 z-10' : 'opacity-0 z-0'
                    }`}
                    aria-hidden={slideIndex !== index}
                  >
                    <CatalogImage
                      src={productImage(slide)}
                      seed={slide.sku}
                      alt={slide.name}
                      fill
                      priority={slideIndex === 0}
                      sizes="(max-width: 1024px) 100vw, 544px"
                      className="object-cover"
                    />
                  </div>
                ))}
                <div className="absolute inset-0 bg-gradient-to-t from-[#061730] via-transparent to-transparent z-20 pointer-events-none" />
                <div className="absolute top-2.5 left-2.5 z-30 bg-black/70 text-white text-[10px] font-medium px-2 py-0.5 rounded-sm">
                  {product.sku}
                </div>
                <span className={`absolute top-2.5 right-2.5 z-30 text-[10px] font-semibold px-2 py-0.5 rounded ${
                  stock.tone === 'emerald' ? 'bg-emerald-600 text-white' : stock.tone === 'rose' ? 'bg-rose-600 text-white' : 'bg-[#073574] text-white'
                }`}>
                  {stock.label}
                </span>

                {slides.length > 1 && (
                  <>
                    <button
                      type="button"
                      onClick={() => goTo(index - 1)}
                      className="absolute left-2 top-1/2 -translate-y-1/2 z-30 h-7 w-7 rounded-full bg-white/90 text-[#073574] hover:bg-white shadow"
                      aria-label="Previous featured product"
                    >
                      <ChevronLeft className="w-4 h-4 mx-auto" />
                    </button>
                    <button
                      type="button"
                      onClick={() => goTo(index + 1)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 z-30 h-7 w-7 rounded-full bg-white/90 text-[#073574] hover:bg-white shadow"
                      aria-label="Next featured product"
                    >
                      <ChevronRight className="w-4 h-4 mx-auto" />
                    </button>
                  </>
                )}

                <div className="absolute bottom-2.5 left-2.5 right-2.5 z-30 bg-white/95 px-3 py-2 rounded-md border border-slate-200/90 flex items-center justify-between gap-2">
                  <div className="min-w-0">
                    <div className="type-eyebrow text-blue-700">Featured hardware</div>
                    <div className="text-[13px] font-semibold text-[#073574] line-clamp-1">{product.name}</div>
                    <div className="text-[10px] text-slate-500">{product.brand} · {product.category.name}</div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <div className="text-sm font-bold text-emerald-700">{formatPKR(product.basePrice)}</div>
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
                          imageUrl: productImage(product),
                        })
                      }
                      className="bg-[#073574] hover:bg-[#062A63] disabled:opacity-40 text-white h-7 w-7 rounded-md text-sm font-bold"
                      aria-label={`Add ${product.name} to cart`}
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
              {!paused && slides.length > 1 && (
                <div className="absolute bottom-0 left-0 right-0 z-30 h-0.5 bg-white/20">
                  <div key={index} className="h-full bg-white hero-progress" />
                </div>
              )}
            </div>

            {slides.length > 1 && (
              <div className="mt-2.5 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setPaused((value) => !value)}
                  className="h-7 w-7 rounded-full border border-slate-200 text-[#073574] hover:bg-slate-50"
                  aria-label={paused ? 'Play featured slider' : 'Pause featured slider'}
                >
                  {paused ? <Play className="w-3 h-3 mx-auto" /> : <Pause className="w-3 h-3 mx-auto" />}
                </button>
                <div className="flex gap-1.5 overflow-x-auto no-scrollbar">
                  {slides.map((slide, slideIndex) => (
                    <button
                      key={slide.id}
                      type="button"
                      onClick={() => goTo(slideIndex)}
                      aria-label={`Show ${slide.name}`}
                      aria-current={slideIndex === index}
                      className={`relative h-9 w-9 shrink-0 overflow-hidden rounded-md border ${
                        slideIndex === index ? 'border-[#073574] ring-2 ring-[#073574]/20' : 'border-slate-200 opacity-70 hover:opacity-100'
                      }`}
                    >
                      <CatalogImage
                        src={productImage(slide)}
                        seed={slide.sku}
                        alt=""
                        fill
                        sizes="36px"
                        className="object-cover"
                      />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
