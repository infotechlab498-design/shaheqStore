import Link from 'next/link';
import { ArrowRight, Layers } from 'lucide-react';
import { Product } from '@/types/product';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatPKR } from '@/lib/utils/currency';
import { STOCK_STATUS_CONFIG } from '@/lib/constants';
import { productImage } from '@/lib/utils/product-display';
import { CatalogImage } from '@/components/shared/catalog-image';

export interface ProductCardProps {
  product: Product;
  onAddToCart?: (product: Product) => void;
}

export function ProductCard({ product }: ProductCardProps) {
  const stockConfig = STOCK_STATUS_CONFIG[product.status] || STOCK_STATUS_CONFIG.IN_STOCK;
  const primaryImage = productImage(product);

  // Format first 2 primary technical specifications
  const specs = Object.entries(product.technicalSpecifications).slice(0, 2);

  return (
    <div className="group relative flex flex-col justify-between overflow-hidden rounded-lg border border-zinc-200 bg-white transition-all hover:border-zinc-400 hover:shadow-md">
      <div>
        {/* Image Container with Stock Status Badge */}
        <div className="relative aspect-square w-full overflow-hidden bg-zinc-100 border-b border-zinc-100">
          <CatalogImage
            src={primaryImage}
            seed={product.sku}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-contain p-3 transition-transform duration-300 group-hover:scale-105"
          />

          {/* Top Status & Category Badges */}
          <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between gap-1 pointer-events-none">
            <span className="rounded-xs bg-zinc-950/80 px-2 py-0.5 type-tiny uppercase tracking-wider text-zinc-200 backdrop-blur-xs">
              {product.category.name}
            </span>
            <Badge variant={stockConfig.badgeVariant as any} size="sm">
              {stockConfig.label}
            </Badge>
          </div>

          {product.hasVariants && (
            <div className="absolute bottom-2 left-2.5 flex items-center gap-1 rounded-xs bg-white/90 px-1.5 py-0.5 type-tiny text-zinc-800 shadow-xs backdrop-blur-xs">
              <Layers className="h-3 w-3 text-zinc-600" />
              <span>{product.variants.length} Thicknesses</span>
            </div>
          )}
        </div>

        {/* Content Area */}
        <div className="p-4 space-y-2.5">
          <div className="flex items-center justify-between type-tiny text-zinc-500">
            <span>SKU: {product.sku}</span>
          </div>

          <Link href={`/products/${product.slug}`} className="block group-hover:text-amber-600 transition-colors">
            <h3 className="type-card-title text-zinc-900 line-clamp-2">
              {product.name}
            </h3>
          </Link>

          <p className="type-small text-zinc-500 line-clamp-2">
            {product.shortDescription}
          </p>

          {/* Technical Specs Preview Chips */}
          {specs.length > 0 && (
            <div className="pt-1 flex flex-wrap gap-1">
              {specs.map(([key, val]) => (
                <div
                  key={key}
                  className="inline-flex items-center rounded-xs bg-zinc-100 px-1.5 py-0.5 type-tiny text-zinc-700 border border-zinc-200/60"
                >
                  <span className="text-zinc-500 mr-1">{key}:</span>
                  <span className="font-semibold">{String(val)}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Pricing and Action Footer */}
      <div className="p-4 pt-0">
        <div className="border-t border-zinc-100 pt-3 flex items-center justify-between gap-2">
          <div>
            <span className="type-tiny uppercase text-zinc-500 block">
              {product.hasVariants ? 'From' : 'Price'}
            </span>
            <span className="type-price text-zinc-950">
              {formatPKR(product.basePrice)}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <Link href={`/products/${product.slug}`}>
              <Button variant="secondary" size="sm" className="font-mono text-xs">
                <span>Details</span>
                <ArrowRight className="h-3 w-3 ml-1" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
