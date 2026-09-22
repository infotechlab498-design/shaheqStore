export type OrderType =
  | 'STANDARD_PRODUCT'
  | 'CAD'
  | 'THREE_D_PRINTING'
  | 'CUSTOM_ENGINEERING';

export const OrderStatus = {
  PENDING: 'PENDING_PAYMENT',
  PENDING_PAYMENT: 'PENDING_PAYMENT',
  PAYMENT_UNVERIFIED: 'PAYMENT_UNVERIFIED',
  CONFIRMED: 'PAYMENT_VERIFIED',
  PAYMENT_VERIFIED: 'PAYMENT_VERIFIED',
  PROCESSING: 'PROCESSING',
  IN_PRODUCTION: 'IN_PRODUCTION',
  READY_FOR_DISPATCH: 'READY_FOR_DISPATCH',
  SHIPPED: 'SHIPPED',
  DELIVERED: 'DELIVERED',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED',
  REFUNDED: 'REFUNDED',
} as const;

export type OrderStatus = (typeof OrderStatus)[keyof typeof OrderStatus];

export interface OrderItem {
  id: string;
  orderId: string;
  productId?: string;
  productVariantId?: string;
  quoteId?: string;
  name: string;
  sku: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  attributes?: Record<string, string>;
}

export interface OrderStatusHistory {
  id: string;
  orderId: string;
  status: OrderStatus;
  notes?: string;
  changedByUserId?: string;
  createdAt: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  type: OrderType;
  status: OrderStatus;
  subtotal: number;
  shippingFee: number;
  discount: number;
  totalAmount: number;
  currency: string;
  items: OrderItem[];
  shippingAddressId: string;
  shippingAddress?: string;
  shippingCity?: string;
  shippingProvince?: string;
  shippingPostalCode?: string;
  shippingCourier?: string;
  trackingNumber?: string;
  paymentMethod: string;
  isPaid: boolean;
  internalNotes?: string;
  history: OrderStatusHistory[];
  createdAt: string;
  updatedAt: string;
}
