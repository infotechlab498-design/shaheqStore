import { NextRequest, NextResponse } from 'next/server';
import { ProductService } from '@/lib/services/product.service';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const categorySlug = searchParams.get('category') || undefined;
    const isFeatured = searchParams.get('featured') === 'true' ? true : undefined;
    const search = searchParams.get('search') || undefined;
    const collection = searchParams.get('collection') || undefined;
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!, 10) : undefined;

    const { products, totalCount } = await ProductService.getCatalog({
      categorySlug,
      isFeatured,
      search,
      collection,
      limit,
    });

    return NextResponse.json({
      success: true,
      data: products,
      totalCount,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to fetch products',
      },
      { status: 500 }
    );
  }
}
