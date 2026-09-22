'use client';

import * as React from 'react';
import Link from 'next/link';
import { Plus, Search, SlidersHorizontal, Edit2, AlertTriangle, Layers } from 'lucide-react';
import { CatalogImage } from '@/components/shared/catalog-image';
import { productImage } from '@/lib/utils/product-display';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { INITIAL_PRODUCTS } from '@/lib/data/catalog';
import { formatPKR } from '@/lib/utils/currency';
import { STOCK_STATUS_CONFIG } from '@/lib/constants';

export default function AdminProductsPage() {
  const [searchTerm, setSearchTerm] = React.useState('');
  const [filterCategory, setFilterCategory] = React.useState('all');
  const [products, setProducts] = React.useState(INITIAL_PRODUCTS);

  React.useEffect(() => {
    fetch('/api/products')
      .then((res) => res.json())
      .then((json) => {
        if (json.success && Array.isArray(json.data) && json.data.length > 0) {
          setProducts(json.data);
        }
      })
      .catch(() => {
        // Keep initial products fallback
      });
  }, []);

  const filtered = products.filter((product) => {
    if (filterCategory !== 'all' && product.category.slug !== filterCategory) return false;
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      return (
        product.name.toLowerCase().includes(q) ||
        product.sku.toLowerCase().includes(q) ||
        product.category.name.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-200 pb-5">
        <div>
          <h1 className="text-2xl font-bold font-mono text-zinc-900">
            Hardware & Inventory Management
          </h1>
          <p className="text-xs font-mono text-zinc-500 mt-0.5">
            Manage drone components, composite stock, variant matrices, and low-inventory alerts.
          </p>
        </div>

        <Link href="/admin/products/new">
          <Button variant="accent" size="sm" className="font-mono text-xs uppercase tracking-wider">
            <Plus className="h-3.5 w-3.5 mr-1.5" />
            Add New Product
          </Button>
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="w-full sm:w-72">
          <Input
            placeholder="Search SKU or product title..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="text-xs h-9 font-mono"
            leftIcon={<Search className="h-3.5 w-3.5" />}
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto font-mono text-xs">
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="rounded-md border border-zinc-300 bg-white px-3 py-1.5 text-xs text-zinc-700"
          >
            <option value="all">All Product Categories</option>
            <option value="power-systems">Power Systems</option>
            <option value="raw-materials">Raw Materials</option>
            <option value="propulsion-fpv">Propulsion & FPV</option>
            <option value="robotics-actuators">Robotics & Actuators</option>
          </select>
        </div>
      </div>

      {/* Inventory Table */}
      <div className="rounded-lg border border-zinc-200 bg-white overflow-hidden shadow-xs">
        <table className="w-full text-left font-mono text-xs divide-y divide-zinc-200">
          <thead className="bg-zinc-50 text-zinc-500 text-[11px]">
            <tr>
              <th className="p-3">Product</th>
              <th className="p-3">SKU</th>
              <th className="p-3">Category</th>
              <th className="p-3">Base Price (PKR)</th>
              <th className="p-3">Variants</th>
              <th className="p-3">Stock Units</th>
              <th className="p-3">Status</th>
              <th className="p-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100">
            {filtered.map((product) => {
              const statusCfg = STOCK_STATUS_CONFIG[product.status];
              return (
                <tr key={product.id} className="hover:bg-zinc-50/80 transition-colors">
                  <td className="p-3">
                    <div className="flex items-center gap-3">
                      <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-md border border-zinc-200 bg-zinc-100">
                        <CatalogImage
                          src={productImage(product)}
                          seed={product.sku}
                          alt={product.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="space-y-0.5">
                        <span className="font-bold text-zinc-900 block truncate max-w-xs">
                          {product.name}
                        </span>
                        <span className="text-[10px] text-zinc-500 font-sans">
                          {product.shortDescription.slice(0, 45)}...
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="p-3 text-zinc-600 font-bold">{product.sku}</td>
                  <td className="p-3 text-zinc-600">{product.category.name}</td>
                  <td className="p-3 font-bold text-zinc-900">{formatPKR(product.basePrice)}</td>
                  <td className="p-3 text-zinc-600">
                    {product.hasVariants ? (
                      <span className="inline-flex items-center gap-1 rounded-xs bg-amber-50 px-2 py-0.5 text-[10px] font-semibold text-amber-900 border border-amber-200">
                        <Layers className="h-3 w-3" />
                        {product.variants.length} Variants
                      </span>
                    ) : (
                      <span className="text-zinc-400">Single</span>
                    )}
                  </td>
                  <td className="p-3 font-semibold">
                    <span className={product.stock <= 5 ? 'text-rose-600 font-bold' : 'text-zinc-900'}>
                      {product.stock}
                    </span>
                  </td>
                  <td className="p-3">
                    <Badge variant={statusCfg?.badgeVariant as any} size="sm">
                      {statusCfg?.label || product.status}
                    </Badge>
                  </td>
                  <td className="p-3 text-right">
                    <Link
                      href={`/admin/products/new?edit=${product.id}`}
                      className="inline-flex items-center gap-1 text-zinc-700 hover:text-zinc-950 p-1 rounded-md hover:bg-zinc-100"
                    >
                      <Edit2 className="h-3.5 w-3.5" />
                      <span className="text-[11px]">Edit</span>
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
