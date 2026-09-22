import { Prisma } from '@prisma/client';
import { prisma, withDatabaseFallback } from '@/lib/db/prisma';
import { INITIAL_PRODUCTS } from '@/lib/data/catalog';
import { Product, Category, ProductVariant } from '@/types/product';
import { decimalToNumber, dateToISO, parseTechnicalSpecs } from '@/lib/db/serializers';
import { matchesCollection } from '@/lib/utils/catalog-collections';

export interface ProductFilters {
  categoryId?: string;
  categorySlug?: string;
  isFeatured?: boolean;
  status?: string;
  search?: string;
  collection?: string;
  limit?: number;
  offset?: number;
}

// Convert Prisma Product entity to App Domain Product
function mapPrismaProductToDomain(p: any): Product {
  const primaryImg = p.images?.find((img: any) => img.isPrimary) || p.images?.[0];

  return {
    id: p.id,
    name: p.name,
    slug: p.slug,
    sku: p.sku,
    categoryId: p.categoryId,
    category: p.category
      ? {
          id: p.category.id,
          name: p.category.name,
          slug: p.category.slug,
          description: p.category.description,
          displayOrder: p.category.sortOrder ?? 0,
          image: p.category.image || undefined,
        }
      : {
          id: p.categoryId,
          name: 'General',
          slug: 'general',
          description: '',
          displayOrder: 0,
        },
    brand: p.brand || 'Alpha Tech',
    isFeatured: Boolean(p.isFeatured),
    shortDescription: p.shortDescription || '',
    description: p.description || '',
    basePrice: decimalToNumber(p.basePrice),
    currency: p.currency || 'PKR',
    status: p.status as any,
    stock: p.inventory ? p.inventory.quantity - p.inventory.reservedQuantity : 0,
    lowStockThreshold: p.lowStockThreshold || 5,
    hasVariants: (p.variants && p.variants.length > 0) || false,
    variants: (p.variants || []).map((v: any): ProductVariant => ({
      id: v.id,
      productId: v.productId,
      sku: v.sku,
      name: v.name,
      price: decimalToNumber(v.price),
      stock: v.inventory ? v.inventory.quantity - v.inventory.reservedQuantity : 0,
      lowStockThreshold: 3,
      status: (v.inventory && (v.inventory.quantity - v.inventory.reservedQuantity) > 0) ? 'IN_STOCK' : 'OUT_OF_STOCK',
      attributes: (typeof v.attributes === 'object' && v.attributes !== null) ? v.attributes : {},
    })),
    images: (p.images || []).map((img: any) => ({
      id: img.id,
      url: img.url,
      alt: img.alt || p.name,
      isPrimary: img.isPrimary,
      displayOrder: img.sortOrder ?? 0,
    })),
    technicalSpecifications: parseTechnicalSpecs(p.technicalSpecifications),
    compatibilityNotes: p.compatibilityNotes || undefined,
    shippingNotes: p.shippingNotes || undefined,
    createdAt: dateToISO(p.createdAt),
    updatedAt: dateToISO(p.updatedAt),
  };
}

function filterStaticCatalog(filters: ProductFilters = {}): Product[] {
  let result = [...INITIAL_PRODUCTS];
  if (filters.categorySlug) {
    result = result.filter((p) => p.category.slug === filters.categorySlug);
  }
  if (filters.categoryId) {
    result = result.filter((p) => p.categoryId === filters.categoryId);
  }
  if (filters.isFeatured) {
    result = result.filter((p) => p.isFeatured);
  }
  if (filters.search) {
    const term = filters.search.toLowerCase();
    result = result.filter(
      (p) =>
        p.name.toLowerCase().includes(term) ||
        p.description.toLowerCase().includes(term) ||
        p.shortDescription.toLowerCase().includes(term) ||
        p.sku.toLowerCase().includes(term) ||
        (p.brand || '').toLowerCase().includes(term) ||
        p.category.name.toLowerCase().includes(term)
    );
  }
  if (filters.collection) {
    result = result.filter((p) => matchesCollection(p, filters.collection));
  }
  if (filters.offset) {
    result = result.slice(filters.offset);
  }
  if (filters.limit) {
    result = result.slice(0, filters.limit);
  }
  return result;
}

export class ProductRepository {
  static async getAll(filters: ProductFilters = {}): Promise<Product[]> {
    return withDatabaseFallback(async () => {
      const where: Prisma.ProductWhereInput = {
        isActive: true,
      };

      if (filters.categorySlug) {
        where.category = { slug: filters.categorySlug };
      } else if (filters.categoryId) {
        where.categoryId = filters.categoryId;
      }

      if (filters.isFeatured !== undefined) {
        where.isFeatured = filters.isFeatured;
      }

      if (filters.status) {
        where.status = filters.status as Prisma.EnumStockStatusFilter['equals'];
      }

      if (filters.search) {
        where.OR = [
          { name: { contains: filters.search, mode: 'insensitive' } },
          { description: { contains: filters.search, mode: 'insensitive' } },
          { shortDescription: { contains: filters.search, mode: 'insensitive' } },
          { sku: { contains: filters.search, mode: 'insensitive' } },
          { brand: { contains: filters.search, mode: 'insensitive' } },
          { category: { name: { contains: filters.search, mode: 'insensitive' } } },
        ];
      }

      const products = await prisma.product.findMany({
        where,
        include: {
          category: true,
          variants: {
            where: { isActive: true },
            include: { inventory: true },
          },
          images: {
            orderBy: { sortOrder: 'asc' },
          },
          inventory: true,
        },
        orderBy: { createdAt: 'desc' },
        take: filters.collection ? undefined : filters.limit,
        skip: filters.collection ? undefined : filters.offset,
      });

      if (products && products.length > 0) {
        let mapped = products.map(mapPrismaProductToDomain);
        if (filters.collection) {
          mapped = mapped.filter((p) => matchesCollection(p, filters.collection));
          if (filters.offset) mapped = mapped.slice(filters.offset);
          if (filters.limit) mapped = mapped.slice(0, filters.limit);
        }
        return mapped;
      }

      return filterStaticCatalog(filters);
    }, () => filterStaticCatalog(filters));
  }

  static async getBySlug(slug: string): Promise<Product | null> {
    return withDatabaseFallback(async () => {
      const product = await prisma.product.findUnique({
        where: { slug },
        include: {
          category: true,
          variants: {
            where: { isActive: true },
            include: { inventory: true },
          },
          images: {
            orderBy: { sortOrder: 'asc' },
          },
          inventory: true,
        },
      });

      return product ? mapPrismaProductToDomain(product) : INITIAL_PRODUCTS.find((p) => p.slug === slug) || null;
    }, () => INITIAL_PRODUCTS.find((p) => p.slug === slug) || null);
  }

  static async getById(id: string): Promise<Product | null> {
    return withDatabaseFallback(async () => {
      const product = await prisma.product.findUnique({
        where: { id },
        include: {
          category: true,
          variants: {
            where: { isActive: true },
            include: { inventory: true },
          },
          images: {
            orderBy: { sortOrder: 'asc' },
          },
          inventory: true,
        },
      });

      return product ? mapPrismaProductToDomain(product) : INITIAL_PRODUCTS.find((p) => p.id === id) || null;
    }, () => INITIAL_PRODUCTS.find((p) => p.id === id) || null);
  }

  static async getCategories(): Promise<Category[]> {
    const fromCatalog = (): Category[] => {
      const catMap = new Map<string, Category>();
      for (const p of INITIAL_PRODUCTS) {
        if (!catMap.has(p.category.id)) {
          catMap.set(p.category.id, p.category);
        }
      }
      return Array.from(catMap.values());
    };

    return withDatabaseFallback(async () => {
      const categories = await prisma.category.findMany({
        where: { isActive: true },
        orderBy: { sortOrder: 'asc' },
      });

      if (categories && categories.length > 0) {
        return categories.map((c) => ({
          id: c.id,
          name: c.name,
          slug: c.slug,
          description: c.description,
          displayOrder: c.sortOrder,
          image: c.image || undefined,
        }));
      }

      return fromCatalog();
    }, fromCatalog);
  }

  static async getCategoryBySlug(slug: string): Promise<Category | null> {
    return withDatabaseFallback(async () => {
      const cat = await prisma.category.findUnique({
        where: { slug },
      });
      if (cat) {
        return {
          id: cat.id,
          name: cat.name,
          slug: cat.slug,
          description: cat.description,
          displayOrder: cat.sortOrder,
          image: cat.image || undefined,
        };
      }

      const found = INITIAL_PRODUCTS.find((p) => p.category.slug === slug);
      return found ? found.category : null;
    }, () => {
      const found = INITIAL_PRODUCTS.find((p) => p.category.slug === slug);
      return found ? found.category : null;
    });
  }
}
