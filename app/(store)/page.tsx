import { ProductService } from '@/lib/services/product.service';
import { ServiceRepository } from '@/lib/repositories/service.repository';
import { HomePageClient } from '@/components/storefront/homepage/home-page-client';

export default async function HomePage() {
  const [{ products }, categories, services] = await Promise.all([
    ProductService.getCatalog(),
    ProductService.getCategories(),
    ServiceRepository.getAll(),
  ]);

  return <HomePageClient products={products} categories={categories} services={services} />;
}
