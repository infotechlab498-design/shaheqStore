import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ProductService } from '@/lib/services/product.service';
import { ProductDetailView } from '@/components/storefront/product-detail-view';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await ProductService.getProductBySlug(slug);

  if (!product) {
    return {
      title: 'Product Not Found | Alpha Tech',
    };
  }

  return {
    title: `${product.name} | Alpha Tech Engineering`,
    description: product.shortDescription,
    openGraph: {
      title: `${product.name} - Technical Hardware`,
      description: product.shortDescription,
      images: product.images.map((img) => ({ url: img.url, alt: img.alt })),
    },
  };
}

export default async function ProductDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const product = await ProductService.getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const relatedProducts = await ProductService.getRelatedProducts(product.id, product.categoryId, 4);

  return <ProductDetailView product={product} relatedProducts={relatedProducts} />;
}
