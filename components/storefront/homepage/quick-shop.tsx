'use client';

import * as React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Product } from '@/types/product';
import { HomepageProductCard } from '@/components/storefront/homepage-product-card';
import {
  QUICK_SHOP_FILTERS,
  QuickShopCollection,
  collectionCount,
  matchesCollection,
} from '@/lib/utils/catalog-collections';

interface QuickShopProps {
  products: Product[];
}

export function QuickShop({ products }: QuickShopProps) {
  const [active, setActive] = React.useState<QuickShopCollection>('bestsellers');
  const [items, setItems] = React.useState<Product[]>(() =>
    products.filter((product) => matchesCollection(product, 'bestsellers'))
  );
  const [loading, setLoading] = React.useState(false);
  const [canPrev, setCanPrev] = React.useState(false);
  const [canNext, setCanNext] = React.useState(false);
  const scrollerRef = React.useRef<HTMLDivElement>(null);

  const meta = QUICK_SHOP_FILTERS.find((filter) => filter.id === active) || QUICK_SHOP_FILTERS[1];

  const updateScrollState = React.useCallback(() => {
    const node = scrollerRef.current;
    if (!node) {
      setCanPrev(false);
      setCanNext(false);
      return;
    }
    const max = node.scrollWidth - node.clientWidth;
    setCanPrev(node.scrollLeft > 8);
    setCanNext(max - node.scrollLeft > 8);
  }, []);

  React.useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    const params = new URLSearchParams({ collection: active, limit: '16' });
    fetch(`/api/products?${params.toString()}`, { signal: controller.signal })
      .then((response) => response.json())
      .then((payload) => {
        if (payload.success && Array.isArray(payload.data)) {
          setItems(payload.data as Product[]);
        } else {
          setItems(products.filter((product) => matchesCollection(product, active)));
        }
      })
      .catch((error) => {
        if ((error as Error).name !== 'AbortError') {
          setItems(products.filter((product) => matchesCollection(product, active)));
        }
      })
      .finally(() => setLoading(false));

    return () => controller.abort();
  }, [active, products]);

  React.useEffect(() => {
    const node = scrollerRef.current;
    if (!node) return;
    node.scrollTo({ left: 0 });
    updateScrollState();
  }, [items, updateScrollState]);

  React.useEffect(() => {
    const node = scrollerRef.current;
    if (!node) return;
    updateScrollState();
    node.addEventListener('scroll', updateScrollState, { passive: true });
    window.addEventListener('resize', updateScrollState);
    return () => {
      node.removeEventListener('scroll', updateScrollState);
      window.removeEventListener('resize', updateScrollState);
    };
  }, [updateScrollState]);

  const scrollByPage = (direction: -1 | 1) => {
    const node = scrollerRef.current;
    if (!node) return;
    const amount = Math.max(node.clientWidth * 0.85, 300);
    node.scrollBy({ left: direction * amount, behavior: 'smooth' });
  };

  return (
    <section className="w-full bg-[#F8FAFC] border-b border-slate-200">
      <div className="w-full bg-white border-b border-slate-200 sticky top-[8.75rem] z-30">
        <div className="store-shell flex items-center gap-3 py-3 overflow-x-auto no-scrollbar">
          <div className="shrink-0">
            <div className="type-eyebrow text-[#073574]">Quick shop</div>
            <div className="type-tiny text-slate-500 whitespace-nowrap">Live Stock Catalog</div>
          </div>
          {QUICK_SHOP_FILTERS.map((filter) => {
            const count = collectionCount(products, filter.id);
            const selected = active === filter.id;
            return (
              <button
                key={filter.id}
                type="button"
                onClick={() => setActive(filter.id)}
                className={`type-nav px-3.5 py-1.5 rounded-full whitespace-nowrap border transition-colors ${
                  selected
                    ? 'bg-[#073574] text-white border-[#073574] type-nav-active'
                    : 'bg-white text-slate-600 border-slate-200 hover:border-[#073574] hover:text-[#073574]'
                }`}
              >
                {filter.label}
                {count > 0 ? ` (${count})` : ''}
              </button>
            );
          })}
        </div>
      </div>

      <div className="store-shell py-8 sm:py-10">
        <div className="flex items-end justify-between gap-4 mb-6">
          <div>
            <div className="inline-flex items-center gap-1.5 type-eyebrow text-blue-700">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-700" />
              {meta.kicker}
            </div>
            <h2 className="type-section text-[#073574] uppercase mt-1">
              {meta.title}
            </h2>
            <p className="type-small text-slate-500 mt-1 max-w-xl">{meta.description}</p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => scrollByPage(-1)}
              disabled={!canPrev}
              className="h-9 w-9 rounded-md border border-slate-200 bg-white text-[#073574] disabled:opacity-30 disabled:cursor-not-allowed hover:bg-[#EAF2FF]"
              aria-label="Previous products"
            >
              <ChevronLeft className="w-5 h-5 mx-auto" />
            </button>
            <button
              type="button"
              onClick={() => scrollByPage(1)}
              disabled={!canNext}
              className="h-9 w-9 rounded-md bg-[#073574] text-white disabled:opacity-30 disabled:cursor-not-allowed hover:bg-[#062A63]"
              aria-label="Next products"
            >
              <ChevronRight className="w-5 h-5 mx-auto" />
            </button>
          </div>
        </div>

        <div
          ref={scrollerRef}
          className={`flex gap-4 overflow-x-auto no-scrollbar snap-x snap-mandatory pb-2 ${loading ? 'opacity-70' : ''}`}
        >
          {items.length === 0 && !loading && (
            <p className="text-sm text-slate-500 py-10">No products matched this Quick Shop filter.</p>
          )}
          {items.map((product) => (
            <HomepageProductCard
              key={product.id}
              product={product}
              className="w-[min(100%,18.5rem)] sm:w-[19.5rem] lg:w-[20.5rem] shrink-0 snap-start"
            />
          ))}
        </div>
      </div>
    </section>
  );
}
