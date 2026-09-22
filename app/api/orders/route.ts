import { NextRequest, NextResponse } from 'next/server';
import { OrderService } from '@/lib/services/order.service';
import { OrderCheckoutSchema } from '@/lib/validations/order.schema';

export async function GET(request: NextRequest) {
  try {
    const orders = await OrderService.getAllOrders();
    return NextResponse.json({
      success: true,
      data: orders,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to fetch orders',
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate body
    const validatedData = OrderCheckoutSchema.parse(body);

    const items = Array.isArray(body.items) && body.items.length > 0
      ? body.items
      : [
          // Fallback sample items if checking out demo cart
          {
            productId: 'prod-boslipo-1550-6s',
            sku: 'BOS-1550-6S-150C',
            name: 'BosLipo 1550mAh 150C 22.2V 6S',
            quantity: 2,
            unitPrice: 24500,
          },
          {
            productId: 'prod-carbon-fiber-plate',
            variantId: 'var-cf-1-5mm',
            sku: 'CFP-500-15MM',
            name: 'Carbon Fiber Sheet Plate',
            variantName: '1.5mm Thickness',
            quantity: 1,
            unitPrice: 8500,
          },
        ];

    const result = await OrderService.placeOrder({
      email: validatedData.email,
      phone: validatedData.phone,
      paymentMethod: validatedData.paymentMethod,
      shippingAddress: validatedData.shippingAddress,
      notes: validatedData.notes,
      items,
    });

    if (!result.success || !result.order) {
      return NextResponse.json(
        { success: false, error: result.error || 'Failed to create order' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: result.order,
      },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error.errors ? error.errors[0]?.message : error.message || 'Order validation failed',
      },
      { status: 400 }
    );
  }
}
