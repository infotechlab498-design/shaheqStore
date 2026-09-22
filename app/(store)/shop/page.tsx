import React from 'react';
import { Metadata } from 'next';
import { ProductService } from '@/lib/services/product.service';
import { ShopClient } from '@/components/storefront/shop-client';

export const metadata: Metadata = {
  title: 'Hardware Catalog | Alpha Tech Engineering',
  description:
    'Browse verified industrial drone components, 6S LiPo battery packs, aerospace carbon fiber sheets, and precision mechanical hardware.',
};

export default async function ShopPage() {
  const [{ products }, categories] = await Promise.all([
    ProductService.getCatalog(),
    ProductService.getCategories(),
  ]);

  return (
    <React.Suspense fallback={<div className="p-16 text-center font-mono text-xs">Loading hardware catalog...</div>}>
      <ShopClient initialProducts={products} categories={categories} />
    </React.Suspense>
  );
}
