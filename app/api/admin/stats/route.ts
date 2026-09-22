import { NextResponse } from 'next/server';
import { OrderService } from '@/lib/services/order.service';
import { QuoteService } from '@/lib/services/quote.service';
import { ProductService } from '@/lib/services/product.service';

export async function GET() {
  try {
    const [orders, quotes, { products }] = await Promise.all([
      OrderService.getAllOrders(),
      QuoteService.getAllQuotes(),
      ProductService.getCatalog(),
    ]);

    const grossVolume = orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);
    const activeOrdersCount = orders.filter((o) => o.status !== 'DELIVERED' && o.status !== 'CANCELLED').length;
    const pendingQuotesCount = quotes.filter((q) => q.status === 'UNDER_REVIEW' || q.status === 'NEW_REQUEST').length;
    const lowStockCount = products.filter((p) => p.status === 'LOW_STOCK' || p.stock <= 5).length;

    return NextResponse.json({
      success: true,
      data: {
        grossVolume,
        activeOrdersCount,
        pendingQuotesCount,
        lowStockCount,
        recentOrders: orders.slice(0, 5),
        recentQuotes: quotes.slice(0, 5),
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch admin stats' },
      { status: 500 }
    );
  }
}
