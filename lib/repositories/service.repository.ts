import { prisma, withDatabaseFallback } from '@/lib/db/prisma';
import { ENGINEERING_SERVICES } from '@/lib/data/catalog';
import { ServiceItem } from '@/types/common';

function mapService(s: { id: string; name: string; slug: string; serviceType: string; description: string }): ServiceItem {
  const match = ENGINEERING_SERVICES.find((e) => e.slug === s.slug);
  return {
    id: s.id,
    title: s.name,
    slug: s.slug,
    category: s.serviceType,
    shortDescription: s.description,
    detailedDescription: match?.detailedDescription || s.description,
    capabilities: match?.capabilities || [],
    materialsSupported: match?.materialsSupported || [],
    turnaroundTime: match?.turnaroundTime || '3 - 5 Days',
    startingPriceLabel: match?.startingPriceLabel || 'Custom Quoted',
    iconName: match?.iconName || 'Wrench',
  };
}

export class ServiceRepository {
  static async getAll(): Promise<ServiceItem[]> {
    return withDatabaseFallback(async () => {
      const services = await prisma.service.findMany({
        where: { isActive: true },
        orderBy: { sortOrder: 'asc' },
      });

      if (services && services.length > 0) {
        return services.map(mapService);
      }

      return ENGINEERING_SERVICES;
    }, () => ENGINEERING_SERVICES);
  }

  static async getBySlug(slug: string): Promise<ServiceItem | null> {
    return withDatabaseFallback(async () => {
      const service = await prisma.service.findUnique({
        where: { slug },
      });

      if (service) {
        return mapService(service);
      }

      return ENGINEERING_SERVICES.find((e) => e.slug === slug) || null;
    }, () => ENGINEERING_SERVICES.find((e) => e.slug === slug) || null);
  }
}
