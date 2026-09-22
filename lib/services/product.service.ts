import { ProductRepository, ProductFilters } from '@/lib/repositories/product.repository';
import { Product, Category } from '@/types/product';

export class ProductService {
  static async getCatalog(filters: ProductFilters = {}): Promise<{
    products: Product[];
    totalCount: number;
  }> {
    const products = await ProductRepository.getAll(filters);
    return {
      products,
      totalCount: products.length,
    };
  }

  static async getFeaturedProducts(limit = 4): Promise<Product[]> {
    return await ProductRepository.getAll({ isFeatured: true, limit });
  }

  static async getProductBySlug(slug: string): Promise<Product | null> {
    return await ProductRepository.getBySlug(slug);
  }

  static async getProductById(id: string): Promise<Product | null> {
    return await ProductRepository.getById(id);
  }

  static async getCategories(): Promise<Category[]> {
    return await ProductRepository.getCategories();
  }

  static async getCategoryBySlug(slug: string): Promise<Category | null> {
    return await ProductRepository.getCategoryBySlug(slug);
  }

  static async getRelatedProducts(productId: string, categoryId: string, limit = 4): Promise<Product[]> {
    const sameCategory = (await ProductRepository.getAll({ categoryId })).filter((p) => p.id !== productId);
    if (sameCategory.length >= limit) {
      return sameCategory.slice(0, limit);
    }

    const featured = await ProductRepository.getAll({ isFeatured: true, limit: limit + 6 });
    const seen = new Set(sameCategory.map((p) => p.id));
    seen.add(productId);
    for (const product of featured) {
      if (!seen.has(product.id)) {
        sameCategory.push(product);
        seen.add(product.id);
      }
      if (sameCategory.length >= limit) break;
    }
    return sameCategory.slice(0, limit);
  }
}
