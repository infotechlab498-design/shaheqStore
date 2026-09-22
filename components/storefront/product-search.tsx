'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Search, Camera, SlidersHorizontal } from 'lucide-react';
import { Category, Product } from '@/types/product';
import { formatPKR } from '@/lib/utils/currency';
import { productImage } from '@/lib/utils/product-display';
import { CatalogImage } from '@/components/shared/catalog-image';

interface ProductSearchProps {
  categories: Category[];
  compact?: boolean;
  variant?: 'default' | 'compact' | 'mobile';
  inputId?: string;
  onNavigate?: () => void;
}

export function ProductSearch({
  categories,
  compact = false,
  variant,
  inputId = 'product-search-input',
  onNavigate,
}: ProductSearchProps) {
  const mode = variant || (compact ? 'compact' : 'default');
  const router = useRouter();
  const rootRef = React.useRef<HTMLDivElement>(null);
  const [query, setQuery] = React.useState('');
  const [category, setCategory] = React.useState('all');
  const [results, setResults] = React.useState<Product[]>([]);
  const [open, setOpen] = React.useState(false);
  const [activeIndex, setActiveIndex] = React.useState(-1);
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    const onClick = (event: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  React.useEffect(() => {
    const term = query.trim();
    if (term.length < 2) {
      setResults([]);
      setOpen(false);
      setLoading(false);
      return;
    }

    const controller = new AbortController();
    const timer = window.setTimeout(async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams({ search: term, limit: '8' });
        if (category !== 'all') params.set('category', category);
        const response = await fetch(`/api/products?${params.toString()}`, { signal: controller.signal });
        const payload = await response.json();
        const products = Array.isArray(payload.data) ? (payload.data as Product[]) : [];
        setResults(products);
        setOpen(true);
        setActiveIndex(products.length ? 0 : -1);
      } catch (error) {
        if ((error as Error).name !== 'AbortError') {
          setResults([]);
        }
      } finally {
        setLoading(false);
      }
    }, 200);

    return () => {
      controller.abort();
      window.clearTimeout(timer);
    };
  }, [query, category]);

  const goToShop = () => {
    const params = new URLSearchParams();
    if (query.trim()) params.set('search', query.trim());
    if (category !== 'all') params.set('category', category);
    setOpen(false);
    onNavigate?.();
    router.push(params.toString() ? `/shop?${params.toString()}` : '/shop');
  };

  const goToProduct = (product: Product) => {
    setOpen(false);
    setQuery(product.name);
    onNavigate?.();
    router.push(`/products/${product.slug}`);
  };

  const onKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setActiveIndex((index) => Math.min(results.length - 1, index + 1));
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      setActiveIndex((index) => Math.max(0, index - 1));
    } else if (event.key === 'Escape') {
      setOpen(false);
    } else if (event.key === 'Enter' && open && activeIndex >= 0 && results[activeIndex]) {
      event.preventDefault();
      goToProduct(results[activeIndex]);
    }
  };

  if (mode === 'mobile') {
    return (
      <div ref={rootRef} className="relative w-full">
        <form
          onSubmit={(event) => {
            event.preventDefault();
            goToShop();
          }}
          className="flex items-center gap-2"
        >
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              id={inputId}
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              onFocus={() => {
                if (results.length) setOpen(true);
              }}
              onKeyDown={onKeyDown}
              placeholder="Search batteries, carbon fiber, ESCs, motors..."
              className="w-full h-11 rounded-xl border border-slate-200 bg-white pl-9 pr-10 text-[13px] text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#073574]"
              role="combobox"
              aria-expanded={open}
              aria-autocomplete="list"
            />
            <button
              type="button"
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400"
              aria-label="Focus search"
              onClick={() => document.getElementById(inputId)?.focus()}
            >
              <Camera className="w-4 h-4" />
            </button>
          </div>
          <Link
            href="/shop"
            aria-label="Open catalog filters"
            className="h-11 w-11 shrink-0 rounded-xl border border-slate-200 bg-white text-slate-600 flex items-center justify-center"
          >
            <SlidersHorizontal className="w-4 h-4" />
          </Link>
        </form>
        {open && (
          <div className="absolute z-50 mt-1 w-full rounded-lg border border-slate-200 bg-white shadow-xl overflow-hidden">
            {loading && results.length === 0 && (
              <p className="px-4 py-3 text-xs text-slate-500">Searching catalog…</p>
            )}
            {!loading && results.length === 0 && query.trim().length >= 2 && (
              <p className="px-4 py-3 text-xs text-slate-500">No matching hardware. Press Enter to search the shop.</p>
            )}
            {results.map((product, index) => (
              <button
                key={product.id}
                type="button"
                onMouseEnter={() => setActiveIndex(index)}
                onClick={() => goToProduct(product)}
                className={`w-full flex items-center gap-3 px-3 py-2 text-left ${
                  index === activeIndex ? 'bg-[#EAF2FF]' : 'hover:bg-slate-50'
                }`}
              >
                <div className="relative h-12 w-12 shrink-0 rounded border border-slate-200 overflow-hidden bg-slate-50">
                  <CatalogImage
                    src={productImage(product)}
                    seed={product.sku}
                    alt={product.name}
                    fill
                    sizes="48px"
                    className="object-cover"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-xs font-bold text-[#073574] line-clamp-1">{product.name}</div>
                  <div className="text-[10px] font-mono text-slate-500">
                    {product.sku} · {product.category.name}
                  </div>
                </div>
                <div className="text-xs font-extrabold text-slate-800">{formatPKR(product.basePrice)}</div>
              </button>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div ref={rootRef} className={compact || mode === 'compact' ? 'relative space-y-2' : 'relative w-full'}>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          goToShop();
        }}
        className={compact ? 'space-y-2' : 'w-full'}
      >
        <div className={compact ? 'space-y-2' : 'flex w-full rounded-md border border-slate-300 overflow-hidden focus-within:border-[#073574] focus-within:ring-1 focus-within:ring-[#073574] bg-white'}>
          <select
            value={category}
            onChange={(event) => setCategory(event.target.value)}
            aria-label="Search in category"
            className={compact
              ? 'w-full rounded-md border border-slate-300 px-3 py-2 type-input'
              : 'bg-slate-50 type-label text-slate-700 px-3 py-2.5 border-r border-slate-200 max-w-[9.5rem]'}
          >
            <option value="all">All Categories</option>
            {categories.map((item) => (
              <option key={item.id} value={item.slug}>
                {item.name}
              </option>
            ))}
          </select>
          <div className={compact ? 'relative' : 'relative flex-1'}>
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              onFocus={() => {
                if (results.length) setOpen(true);
              }}
              onKeyDown={onKeyDown}
              placeholder="Search products, SKUs, batteries, carbon..."
              className={compact
                ? 'w-full rounded-md border border-slate-300 px-3 py-2 pl-9 type-input'
                : 'w-full type-input text-slate-900 px-3 py-2.5 pl-9 focus:outline-none'}
              role="combobox"
              aria-expanded={open}
              aria-autocomplete="list"
            />
          </div>
          <button
            type="submit"
            className={compact
              ? 'w-full bg-[#073574] hover:bg-[#062A63] text-white px-4 py-2 rounded-md type-button'
              : 'bg-[#073574] hover:bg-[#062A63] text-white px-4 type-button'}
          >
            Search
          </button>
        </div>
      </form>

      {open && (
        <div className="absolute z-50 mt-1 w-full rounded-lg border border-slate-200 bg-white shadow-xl overflow-hidden">
          {loading && results.length === 0 && (
            <p className="px-4 py-3 text-xs text-slate-500">Searching catalog…</p>
          )}
          {!loading && results.length === 0 && query.trim().length >= 2 && (
            <p className="px-4 py-3 text-xs text-slate-500">No matching hardware. Press Enter to search the shop.</p>
          )}
          {results.map((product, index) => (
            <button
              key={product.id}
              type="button"
              onMouseEnter={() => setActiveIndex(index)}
              onClick={() => goToProduct(product)}
              className={`w-full flex items-center gap-3 px-3 py-2 text-left ${
                index === activeIndex ? 'bg-[#EAF2FF]' : 'hover:bg-slate-50'
              }`}
            >
              <div className="relative h-12 w-12 shrink-0 rounded border border-slate-200 overflow-hidden bg-slate-50">
                <CatalogImage
                  src={productImage(product)}
                  seed={product.sku}
                  alt={product.name}
                  fill
                  sizes="48px"
                  className="object-cover"
                />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-xs font-bold text-[#073574] line-clamp-1">{product.name}</div>
                <div className="text-[10px] font-mono text-slate-500">
                  {product.sku} · {product.category.name}
                </div>
              </div>
              <div className="text-xs font-extrabold text-slate-800">{formatPKR(product.basePrice)}</div>
            </button>
          ))}
          {query.trim().length >= 2 && (
            <Link
              href={`/shop?search=${encodeURIComponent(query.trim())}${category !== 'all' ? `&category=${category}` : ''}`}
              onClick={() => {
                setOpen(false);
                onNavigate?.();
              }}
              className="block px-4 py-2 text-[11px] font-bold text-[#073574] bg-slate-50 border-t border-slate-100"
            >
              View all results for “{query.trim()}”
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
