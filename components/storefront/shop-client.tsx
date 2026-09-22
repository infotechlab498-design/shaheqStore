'use client';

import * as React from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Search, SlidersHorizontal, RotateCcw } from 'lucide-react';
import { ProductCard } from '@/components/storefront/product-card';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/empty-state';
import { Breadcrumb } from '@/components/ui/breadcrumb';
import { Product, Category } from '@/types/product';

interface ShopClientProps {
  initialProducts: Product[];
  categories: Category[];
}

export function ShopClient({ initialProducts, categories }: ShopClientProps) {
  const searchParams = useSearchParams();
  const paramCategory = searchParams.get('category');
  const paramSearch = searchParams.get('search');
  const paramDeals = searchParams.get('deals') === '1';

  const [selectedCategory, setSelectedCategory] = React.useState<string>(paramCategory || 'all');
  const [searchQuery, setSearchQuery] = React.useState<string>(paramSearch || '');
  const [selectedStockStatus, setSelectedStockStatus] = React.useState<string>('all');
  const [sortBy, setSortBy] = React.useState<string>('featured');
  const [mobileFilterOpen, setMobileFilterOpen] = React.useState(false);

  // Synchronize if query param changes
  React.useEffect(() => {
    if (paramCategory) {
      setSelectedCategory(paramCategory);
    }
  }, [paramCategory]);

  React.useEffect(() => {
    if (paramSearch !== null) {
      setSearchQuery(paramSearch || '');
    }
  }, [paramSearch]);

  // Filter products
  const filteredProducts = React.useMemo(() => {
    return initialProducts
      .filter((product) => {
        // Category match
        if (selectedCategory !== 'all' && product.category.slug !== selectedCategory) {
          return false;
        }
        // Stock status match
        if (selectedStockStatus !== 'all' && product.status !== selectedStockStatus) {
          return false;
        }
        // Search query match (name, sku, description, specifications)
        if (searchQuery.trim()) {
          const query = searchQuery.toLowerCase().trim();
          const matchesName = product.name.toLowerCase().includes(query);
          const matchesSku = product.sku.toLowerCase().includes(query);
          const matchesDesc = product.shortDescription.toLowerCase().includes(query);
          const matchesBrand = (product.brand || '').toLowerCase().includes(query);
          const matchesCategory = product.category.name.toLowerCase().includes(query);
          const matchesSpecs = Object.entries(product.technicalSpecifications).some(
            ([k, v]) => k.toLowerCase().includes(query) || String(v).toLowerCase().includes(query)
          );
          if (!matchesName && !matchesSku && !matchesDesc && !matchesBrand && !matchesCategory && !matchesSpecs) {
            return false;
          }
        }
        if (paramDeals) {
          const merch = String(product.technicalSpecifications.Merch || '');
          if (!product.isFeatured && !merch.includes('bestseller') && !merch.includes('sale')) {
            return false;
          }
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price-asc') return a.basePrice - b.basePrice;
        if (sortBy === 'price-desc') return b.basePrice - a.basePrice;
        if (sortBy === 'name') return a.name.localeCompare(b.name);
        return 0; // default featured
      });
  }, [initialProducts, selectedCategory, selectedStockStatus, searchQuery, sortBy, paramDeals]);

  const clearFilters = () => {
    setSelectedCategory('all');
    setSelectedStockStatus('all');
    setSearchQuery('');
    setSortBy('featured');
  };

  const hasActiveFilters =
    selectedCategory !== 'all' ||
    selectedStockStatus !== 'all' ||
    searchQuery.trim() !== '' ||
    sortBy !== 'featured';

  return (
    <div className="store-shell py-8 space-y-8">
      {/* Breadcrumb Trail */}
      <Breadcrumb
        items={[
          { label: 'Home', href: '/' },
          { label: 'Hardware Catalog', href: '/shop' },
          ...(selectedCategory !== 'all'
            ? [
                {
                  label:
                    categories.find((c) => c.slug === selectedCategory)?.name ||
                    selectedCategory,
                },
              ]
            : []),
        ]}
      />

      {/* Catalog Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-zinc-200 pb-6">
        <div>
          <span className="type-eyebrow text-zinc-500">
            Alpha Tech Inventory
          </span>
          <h1 className="type-page text-zinc-900 mt-1">
            Hardware & Components Catalog
          </h1>
          <p className="mt-1 type-small text-zinc-500 max-w-2xl">
            Aerospace grade composites, high-discharge lithium polymer cells, brushless motors, and precision robotics hardware.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="md:hidden font-mono text-xs flex items-center gap-1.5"
            onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
          >
            <SlidersHorizontal className="h-4 w-4" />
            <span>Filters</span>
          </Button>
          <span className="text-xs font-mono text-zinc-500">
            Showing <strong className="text-zinc-900">{filteredProducts.length}</strong> items
          </span>
        </div>
      </div>

      {/* Main Grid: Sidebar Filters + Products */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        {/* Left Filter Sidebar */}
        <aside
          className={`md:col-span-3 space-y-6 ${
            mobileFilterOpen ? 'block' : 'hidden md:block'
          } rounded-lg border border-zinc-200 bg-white p-5 shadow-xs`}
        >
          <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
            <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-zinc-900">
              Filter Catalog
            </h3>
            {hasActiveFilters && (
              <button
                type="button"
                onClick={clearFilters}
                className="text-[11px] font-mono text-amber-600 hover:text-amber-700 flex items-center gap-1 cursor-pointer"
              >
                <RotateCcw className="h-3 w-3" />
                Reset
              </button>
            )}
          </div>

          {/* Search Input */}
          <div className="space-y-1.5">
            <label className="text-xs font-mono font-medium text-zinc-700">Keyword Search</label>
            <Input
              placeholder="e.g. 1550mAh, 1.5mm, 6S..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              leftIcon={<Search className="h-3.5 w-3.5" />}
              className="text-xs h-9"
            />
          </div>

          {/* Categories */}
          <div className="space-y-2">
            <label className="text-xs font-mono font-medium text-zinc-700">Categories</label>
            <div className="space-y-1 font-mono text-xs">
              <button
                type="button"
                onClick={() => setSelectedCategory('all')}
                className={`flex w-full items-center justify-between px-2.5 py-1.5 rounded-md text-left transition-colors cursor-pointer ${
                  selectedCategory === 'all'
                    ? 'bg-zinc-900 text-white font-semibold'
                    : 'text-zinc-600 hover:bg-zinc-100'
                }`}
              >
                <span>All Categories</span>
                <span>{initialProducts.length}</span>
              </button>

              {categories.map((cat) => {
                const isSelected = selectedCategory === cat.slug;
                const count = initialProducts.filter((p) => p.category.slug === cat.slug).length;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setSelectedCategory(cat.slug)}
                    className={`flex w-full items-center justify-between px-2.5 py-1.5 rounded-md text-left transition-colors cursor-pointer ${
                      isSelected
                        ? 'bg-zinc-900 text-white font-semibold'
                        : 'text-zinc-600 hover:bg-zinc-100'
                    }`}
                  >
                    <span className="truncate mr-2">{cat.name}</span>
                    <span className="text-[10px] opacity-80">{count}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Stock Availability */}
          <div className="space-y-1.5">
            <label className="text-xs font-mono font-medium text-zinc-700">Stock Availability</label>
            <Select
              value={selectedStockStatus}
              onChange={(e) => setSelectedStockStatus(e.target.value)}
              className="text-xs h-9"
            >
              <option value="all">All Inventory Statuses</option>
              <option value="IN_STOCK">In Stock (Immediate Dispatch)</option>
              <option value="LOW_STOCK">Low Stock (Limited Units)</option>
              <option value="PRE_ORDER">Pre-Order</option>
              <option value="OUT_OF_STOCK">Out of Stock</option>
            </Select>
          </div>

          {/* Sort By */}
          <div className="space-y-1.5">
            <label className="text-xs font-mono font-medium text-zinc-700">Sort Ordering</label>
            <Select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="text-xs h-9"
            >
              <option value="featured">Featured First</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="name">Product Name (A-Z)</option>
            </Select>
          </div>

          {/* Direct WhatsApp Help */}
          <div className="pt-4 border-t border-zinc-100">
            <p className="text-[11px] font-mono text-zinc-500 mb-2">
              Looking for custom dimensions or bulk packs?
            </p>
            <Link
              href="/quote"
              className="inline-flex w-full items-center justify-center rounded-md border border-amber-600/40 bg-amber-50 px-3 py-2 text-xs font-semibold text-amber-900 hover:bg-amber-100 font-mono"
            >
              Request Custom Batch
            </Link>
          </div>
        </aside>

        {/* Right Product Grid */}
        <main className="md:col-span-9">
          {filteredProducts.length > 0 ? (
            <div className="product-grid">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <EmptyState
              title="No matching components found"
              description="No products matched your specific category or search criteria. Try removing filters or searching for alternative specs."
              actionLabel="Reset All Filters"
              onAction={clearFilters}
            />
          )}

          {/* Pagination Architecture Placeholder */}
          {filteredProducts.length > 0 && (
            <div className="mt-12 flex items-center justify-between border-t border-zinc-200 pt-6 text-xs font-mono text-zinc-500">
              <span>
                Page 1 of 1 • Showing {filteredProducts.length} items
              </span>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" disabled>
                  Previous
                </Button>
                <Button variant="outline" size="sm" disabled>
                  Next
                </Button>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
