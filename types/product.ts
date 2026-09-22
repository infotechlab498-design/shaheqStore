export type StockStatus = 'IN_STOCK' | 'LOW_STOCK' | 'PRE_ORDER' | 'OUT_OF_STOCK';

export interface ProductAttribute {
  id: string;
  name: string;
  value: string;
  unit?: string;
}

export interface ProductVariant {
  id: string;
  productId: string;
  sku: string;
  name: string; // e.g., "1.5mm Thickness", "4mm Thickness", "5mm Thickness"
  price: number;
  stock: number;
  lowStockThreshold: number;
  status: StockStatus;
  attributes: Record<string, string>;
}

export interface ProductImage {
  id: string;
  url: string;
  alt: string;
  isPrimary: boolean;
  displayOrder: number;
}

export interface ProductCategory {
  id: string;
  name: string;
  slug: string;
  description: string;
  displayOrder: number;
  image?: string;
}

/** Alias used by catalog services, repositories, and shop filters. */
export type Category = ProductCategory;

export interface Product {
  id: string;
  name: string;
  slug: string;
  sku: string;
  categoryId: string;
  category: ProductCategory;
  brand?: string;
  shortDescription: string;
  description: string;
  basePrice: number;
  currency: string;
  status: StockStatus;
  stock: number;
  lowStockThreshold: number;
  hasVariants: boolean;
  isFeatured?: boolean;
  variants: ProductVariant[];
  images: ProductImage[];
  technicalSpecifications: Record<string, string | number>;
  compatibilityNotes?: string;
  shippingNotes?: string;
  createdAt: string;
  updatedAt: string;
}
