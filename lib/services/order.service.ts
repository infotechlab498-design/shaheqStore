import { OrderRepository, CreateOrderParams } from '@/lib/repositories/order.repository';
import { InventoryService } from '@/lib/services/inventory.service';
import { Order } from '@/types/order';

export interface CartCheckoutItem {
  productId: string;
  variantId?: string;
  name: string;
  variantName?: string;
  sku: string;
  quantity: number;
  unitPrice: number;
}

export class OrderService {
  static FREE_SHIPPING_THRESHOLD = 15000; // PKR 15,000
  static STANDARD_SHIPPING_FEE = 350; // PKR 350

  static calculateTotals(items: { unitPrice: number; quantity: number }[]): {
    subtotal: number;
    shippingFee: number;
    total: number;
  } {
    const subtotal = items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
    const shippingFee = subtotal >= this.FREE_SHIPPING_THRESHOLD || subtotal === 0 ? 0 : this.STANDARD_SHIPPING_FEE;
    const total = subtotal + shippingFee;

    return { subtotal, shippingFee, total };
  }

  static async placeOrder(params: {
    userId?: string;
    email: string;
    phone: string;
    items: CartCheckoutItem[];
    paymentMethod: 'COD' | 'BANK_TRANSFER' | 'JAZZCASH' | 'EASYPAISA' | 'CARD';
    shippingAddress: {
      fullName: string;
      phone: string;
      province: string;
      city: string;
      area?: string;
      addressLine1: string;
      addressLine2?: string;
      postalCode: string;
      country?: string;
    };
    notes?: string;
  }): Promise<{ success: boolean; order?: Order; error?: string }> {
    if (!params.items || params.items.length === 0) {
      return { success: false, error: 'Cannot place an empty order' };
    }

    const { subtotal, shippingFee, total } = this.calculateTotals(params.items);
    const orderNumber = `AT-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`;

    const createPayload: CreateOrderParams = {
      orderNumber,
      userId: params.userId,
      email: params.email,
      phone: params.phone,
      orderType: 'PRODUCT',
      items: params.items.map((it) => ({
        productId: it.productId,
        productVariantId: it.variantId,
        productName: it.name,
        variantName: it.variantName,
        sku: it.sku,
        quantity: it.quantity,
        unitPrice: it.unitPrice,
        total: it.unitPrice * it.quantity,
      })),
      subtotal,
      shippingAmount: shippingFee,
      discountAmount: 0,
      total,
      paymentMethod: params.paymentMethod,
      shippingAddress: params.shippingAddress,
      notes: params.notes,
    };

    const order = await OrderRepository.create(createPayload);

    // Reserve inventory
    for (const it of params.items) {
      await InventoryService.reserveForCheckout(it.productId, it.quantity, order.id, it.variantId);
    }

    return { success: true, order };
  }

  static async getOrder(idOrNumber: string): Promise<Order | null> {
    if (idOrNumber.startsWith('AT-')) {
      return await OrderRepository.getByOrderNumber(idOrNumber);
    }
    return await OrderRepository.getById(idOrNumber);
  }

  static async getAllOrders(): Promise<Order[]> {
    return await OrderRepository.getAll();
  }
}
