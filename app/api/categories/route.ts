import { NextResponse } from 'next/server';
import { ProductService } from '@/lib/services/product.service';

export async function GET() {
  try {
    const categories = await ProductService.getCategories();
    return NextResponse.json({
      success: true,
      data: categories,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to fetch categories',
      },
      { status: 500 }
    );
  }
}
