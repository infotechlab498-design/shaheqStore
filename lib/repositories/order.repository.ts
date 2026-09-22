import { prisma, withDatabaseFallback } from '@/lib/db/prisma';
import { DEMO_ADMIN_ORDERS } from '@/lib/data/demo-admin-data';
import { Order, OrderStatus } from '@/types/order';
import { decimalToNumber, dateToISO } from '@/lib/db/serializers';

export interface CreateOrderParams {
  orderNumber: string;
  userId?: string;
  email: string;
  phone: string;
  orderType?: 'PRODUCT' | 'CUSTOM_SERVICE' | 'THREE_D_PRINTING' | 'CAD' | 'ENGINEERING';
  items: {
    productId?: string;
    productVariantId?: string;
    quoteId?: string;
    productName: string;
    variantName?: string;
    sku: string;
    quantity: number;
    unitPrice: number;
    total: number;
    technicalSnapshot?: any;
  }[];
  subtotal: number;
  shippingAmount: number;
  discountAmount?: number;
  total: number;
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
}

function mapPrismaOrderToDomain(o: any): Order {
  const addressSnapshot = (typeof o.shippingAddressSnapshot === 'object' && o.shippingAddressSnapshot !== null)
    ? o.shippingAddressSnapshot
    : {};

  const typeMap: Record<string, any> = {
    PRODUCT: 'STANDARD_PRODUCT',
    STANDARD_PRODUCT: 'STANDARD_PRODUCT',
    CUSTOM_SERVICE: 'CUSTOM_ENGINEERING',
    THREE_D_PRINTING: 'THREE_D_PRINTING',
    CAD: 'CAD',
    ENGINEERING: 'CUSTOM_ENGINEERING',
  };

  return {
    id: o.id,
    orderNumber: o.orderNumber,
    customerId: o.userId || 'guest',
    customerName: addressSnapshot.fullName
      || (o.user?.firstName ? `${o.user.firstName} ${o.user.lastName ?? ''}`.trim() : 'Valued Customer'),
    customerEmail: o.email,
    customerPhone: o.phone,
    type: typeMap[o.orderType] || 'STANDARD_PRODUCT',
    status: o.status as OrderStatus,
    subtotal: decimalToNumber(o.subtotal),
    shippingFee: decimalToNumber(o.shippingAmount),
    discount: decimalToNumber(o.discountAmount),
    totalAmount: decimalToNumber(o.total),
    currency: o.currency || 'PKR',
    shippingAddressId: o.id,
    shippingAddress: addressSnapshot.addressLine1 || '',
    shippingCity: addressSnapshot.city || '',
    shippingProvince: addressSnapshot.province || '',
    shippingPostalCode: addressSnapshot.postalCode || '',
    shippingCourier: o.shipments?.[0]?.courierCode || undefined,
    trackingNumber: o.shipments?.[0]?.trackingNumber || undefined,
    paymentMethod: o.payments?.[0]?.method || 'BANK_TRANSFER',
    isPaid: o.paymentStatus === 'VERIFIED',
    internalNotes: o.notes || undefined,
    items: (o.items || []).map((it: any) => ({
      id: it.id,
      orderId: it.orderId,
      productId: it.productId || undefined,
      productVariantId: it.variantId || undefined,
      quoteId: it.quoteId || undefined,
      name: it.productName,
      sku: it.sku,
      quantity: it.quantity,
      unitPrice: decimalToNumber(it.unitPrice),
      totalPrice: decimalToNumber(it.total),
      attributes: (typeof it.technicalSnapshot === 'object' && it.technicalSnapshot !== null) ? it.technicalSnapshot : undefined,
    })),
    history: (o.statusHistory || []).map((h: any) => ({
      id: h.id,
      orderId: h.orderId,
      status: h.newStatus as OrderStatus,
      notes: h.note || undefined,
      changedByUserId: h.changedBy || undefined,
      createdAt: dateToISO(h.createdAt),
    })),
    createdAt: dateToISO(o.createdAt),
    updatedAt: dateToISO(o.updatedAt),
  };
}

export class OrderRepository {
  static async getAll(limit = 50): Promise<Order[]> {
    return withDatabaseFallback(async () => {
      const orders = await prisma.order.findMany({
        include: {
          items: true,
          statusHistory: { orderBy: { createdAt: 'asc' } },
          payments: true,
          shipments: true,
          user: true,
        },
        orderBy: { createdAt: 'desc' },
        take: limit,
      });

      if (orders && orders.length > 0) {
        return orders.map(mapPrismaOrderToDomain);
      }

      return DEMO_ADMIN_ORDERS;
    }, () => DEMO_ADMIN_ORDERS);
  }

  static async getById(id: string): Promise<Order | null> {
    return withDatabaseFallback(async () => {
      const order = await prisma.order.findUnique({
        where: { id },
        include: {
          items: true,
          statusHistory: { orderBy: { createdAt: 'asc' } },
          payments: { include: { verification: true } },
          shipments: { include: { trackingEvents: true } },
          user: true,
        },
      });

      if (order) {
        return mapPrismaOrderToDomain(order);
      }

      return DEMO_ADMIN_ORDERS.find((o) => o.id === id || o.orderNumber === id) || null;
    }, () => DEMO_ADMIN_ORDERS.find((o) => o.id === id || o.orderNumber === id) || null);
  }

  static async getByOrderNumber(orderNumber: string): Promise<Order | null> {
    return withDatabaseFallback(async () => {
      const order = await prisma.order.findUnique({
        where: { orderNumber },
        include: {
          items: true,
          statusHistory: { orderBy: { createdAt: 'asc' } },
          payments: true,
          shipments: true,
          user: true,
        },
      });

      if (order) {
        return mapPrismaOrderToDomain(order);
      }

      return DEMO_ADMIN_ORDERS.find((o) => o.orderNumber === orderNumber) || null;
    }, () => DEMO_ADMIN_ORDERS.find((o) => o.orderNumber === orderNumber) || null);
  }

  static async create(params: CreateOrderParams): Promise<Order> {
    try {
      const created = await prisma.$transaction(async (tx) => {
        const order = await tx.order.create({
          data: {
            orderNumber: params.orderNumber,
            userId: params.userId || null,
            email: params.email,
            phone: params.phone,
            orderType: params.orderType || 'PRODUCT',
            subtotal: params.subtotal,
            shippingAmount: params.shippingAmount,
            discountAmount: params.discountAmount || 0,
            total: params.total,
            shippingAddressSnapshot: params.shippingAddress,
            notes: params.notes,
            items: {
              create: params.items.map((it) => ({
                productId: it.productId || null,
                variantId: it.productVariantId || null,
                quoteId: it.quoteId || null,
                productName: it.productName,
                variantName: it.variantName,
                sku: it.sku,
                quantity: it.quantity,
                unitPrice: it.unitPrice,
                total: it.total,
                technicalSnapshot: it.technicalSnapshot || null,
              })),
            },
            statusHistory: {
              create: {
                newStatus: 'PENDING_PAYMENT',
                changedBy: 'SYSTEM',
                note: 'Order created',
              },
            },
            payments: {
              create: {
                method: params.paymentMethod,
                amount: params.total,
                currency: 'PKR',
                status: params.paymentMethod === 'COD' ? 'PENDING' : 'PENDING',
              },
            },
          },
          include: {
            items: true,
            statusHistory: true,
            payments: true,
          },
        });

        return order;
      });

      return mapPrismaOrderToDomain(created);
    } catch {
      // Return a simulated structured order when DB is unavailable
      const fallbackOrder: Order = {
        id: `ord-${Date.now()}`,
        orderNumber: params.orderNumber,
        customerId: params.userId || 'guest',
        customerName: params.shippingAddress.fullName,
        customerEmail: params.email,
        customerPhone: params.phone,
        type: 'STANDARD_PRODUCT',
        status: 'PENDING_PAYMENT',
        subtotal: params.subtotal,
        shippingFee: params.shippingAmount,
        discount: params.discountAmount || 0,
        totalAmount: params.total,
        currency: 'PKR',
        shippingAddressId: 'addr-fallback',
        shippingAddress: params.shippingAddress.addressLine1,
        shippingCity: params.shippingAddress.city,
        shippingProvince: params.shippingAddress.province,
        shippingPostalCode: params.shippingAddress.postalCode,
        paymentMethod: params.paymentMethod,
        isPaid: false,
        items: params.items.map((it, idx) => ({
          id: `item-${idx + 1}`,
          orderId: `ord-${Date.now()}`,
          productId: it.productId,
          productVariantId: it.productVariantId,
          name: it.productName,
          sku: it.sku,
          quantity: it.quantity,
          unitPrice: it.unitPrice,
          totalPrice: it.total,
        })),
        history: [
          {
            id: 'hist-init',
            orderId: `ord-${Date.now()}`,
            status: 'PENDING_PAYMENT',
            notes: 'Order initiated',
            createdAt: new Date().toISOString(),
          },
        ],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      return fallbackOrder;
    }
  }

  static async updateStatus(
    orderId: string,
    newStatus: any,
    changedBy = 'STAFF',
    note?: string
  ): Promise<boolean> {
    try {
      await prisma.$transaction(async (tx) => {
        const order = await tx.order.findUnique({ where: { id: orderId } });
        if (!order) return;

        await tx.order.update({
          where: { id: orderId },
          data: { status: newStatus },
        });

        await tx.orderStatusHistory.create({
          data: {
            orderId,
            previousStatus: order.status,
            newStatus,
            changedBy,
            note,
          },
        });
      });
      return true;
    } catch {
      return false;
    }
  }
}
