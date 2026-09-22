import { Product } from '@/types/product';
import { isNewArrival, productMerch } from '@/lib/utils/product-display';

export type QuickShopCollection =
  | 'all'
  | 'bestsellers'
  | 'new'
  | 'fpv-propulsion'
  | '6s-batteries'
  | 'carbon-fiber'
  | 'hardware-fasteners';

export interface QuickShopFilterMeta {
  id: QuickShopCollection;
  label: string;
  kicker: string;
  title: string;
  description: string;
}

export const QUICK_SHOP_FILTERS: QuickShopFilterMeta[] = [
  {
    id: 'all',
    label: 'All Components',
    kicker: 'Live stock catalog',
    title: 'All components',
    description: 'Every in-stock SKU currently available for nationwide dispatch.',
  },
  {
    id: 'bestsellers',
    label: 'Best Sellers',
    kicker: 'High demand inventory',
    title: 'Best sellers',
    description: 'Battle-tested components chosen by drone racing teams and defense universities.',
  },
  {
    id: 'new',
    label: 'New Arrivals',
    kicker: 'Just landed',
    title: 'New arrivals',
    description: 'Fresh hardware added to the live Alpha Tech catalog.',
  },
  {
    id: 'fpv-propulsion',
    label: 'FPV Propulsion',
    kicker: 'Race ready',
    title: 'FPV propulsion',
    description: 'Motors, frames, stacks, props, and digital video hardware.',
  },
  {
    id: '6s-batteries',
    label: '6S Batteries',
    kicker: 'Power systems',
    title: '6S batteries',
    description: 'High-discharge LiPo packs for 6S FPV and heavy-lift platforms.',
  },
  {
    id: 'carbon-fiber',
    label: 'Toray Carbon Fiber',
    kicker: 'Composite stock',
    title: 'Toray carbon fiber',
    description: 'Plates, CNC-cut arms, and tape from Toray 3K inventory.',
  },
  {
    id: 'hardware-fasteners',
    label: 'Titanium Fasteners',
    kicker: 'Hardware kits',
    title: 'Titanium fasteners',
    description: 'Grade 5 Ti fastener kits for race frames and robotics.',
  },
];

export function isBestseller(product: Product): boolean {
  return Boolean(product.isFeatured) || productMerch(product).includes('bestseller');
}

export function matchesCollection(product: Product, collection?: string): boolean {
  if (!collection || collection === 'all') return true;
  if (collection === 'bestsellers') return isBestseller(product);
  if (collection === 'new') return isNewArrival(product);
  if (collection === 'fpv-propulsion') {
    return product.category.slug === 'drone-fpv' || product.category.slug === 'propulsion-fpv';
  }
  if (collection === '6s-batteries') {
    return product.category.slug === 'power-systems' && /6s/i.test(`${product.name} ${product.sku}`);
  }
  if (collection === 'carbon-fiber') {
    return product.category.slug === 'carbon-fiber' || product.category.slug === 'raw-materials';
  }
  if (collection === 'hardware-fasteners') {
    return product.category.slug === 'hardware-fasteners';
  }
  return product.category.slug === collection;
}

export function collectionCount(products: Product[], collection: QuickShopCollection): number {
  return products.filter((product) => matchesCollection(product, collection)).length;
}
