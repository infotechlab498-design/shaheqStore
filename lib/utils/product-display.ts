import { Product } from '@/types/product';
import { formatPKR } from '@/lib/utils/currency';
import { safeCatalogSrc } from '@/lib/utils/catalog-image';

export function productImage(product: Product): string {
  return safeCatalogSrc(product.images[0]?.url, product.sku || product.slug || 'alphatech');
}

export function productKeySpecs(product: Product): { label: string; value: string }[] {
  return Object.entries(product.technicalSpecifications)
    .filter(([key]) => key !== 'Merch' && key !== 'CompareAtPrice')
    .slice(0, 4)
    .map(([label, value]) => ({ label, value: String(value) }));
}

export function productMerch(product: Product): string {
  return String(product.technicalSpecifications.Merch || '');
}

export function isNewArrival(product: Product): boolean {
  if (productMerch(product).includes('new')) return true;
  const created = Date.parse(product.createdAt);
  if (Number.isNaN(created)) return false;
  return Date.now() - created < 1000 * 60 * 60 * 24 * 21;
}

export function productCompareAt(product: Product, currentPrice: number): number | null {
  const raw = Number(product.technicalSpecifications.CompareAtPrice);
  return Number.isFinite(raw) && raw > currentPrice ? raw : null;
}

export function productDiscountPercent(product: Product, currentPrice: number): number | null {
  const compareAt = productCompareAt(product, currentPrice);
  if (!compareAt) return null;
  return Math.round(((compareAt - currentPrice) / compareAt) * 100);
}

export function productStockBadge(product: Product): { label: string; tone: 'navy' | 'emerald' | 'rose' } {
  const inStock = product.stock > 0 && product.status !== 'OUT_OF_STOCK';
  if (!inStock) return { label: 'OUT OF STOCK', tone: 'rose' };
  if (product.stock <= product.lowStockThreshold) {
    return { label: `${product.stock} UNITS LEFT`, tone: 'navy' };
  }
  if (product.stock >= 20) return { label: 'READY TO DISPATCH', tone: 'emerald' };
  return { label: 'IN STOCK', tone: 'navy' };
}

export function categoryStartingPrice(products: Product[], categoryId: string): string {
  const prices = products.filter((p) => p.categoryId === categoryId || p.category.slug === categoryId).map((p) => p.basePrice);
  if (prices.length === 0) return 'View catalog';
  return `From ${formatPKR(Math.min(...prices))}`;
}
