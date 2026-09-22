export type CourierProvider = 'TCS' | 'LEOPARD' | 'MNP' | 'TRAX';

export type ShipmentStatus =
  | 'DRAFT'
  | 'BOOKED'
  | 'PICKED_UP'
  | 'IN_TRANSIT'
  | 'OUT_FOR_DELIVERY'
  | 'DELIVERED'
  | 'RETURNED'
  | 'FAILED_DELIVERY';

export interface ShipmentTrackingEvent {
  id: string;
  shipmentId: string;
  status: ShipmentStatus;
  location: string;
  message: string;
  timestamp: string;
}

export interface Shipment {
  id: string;
  orderId: string;
  orderNumber: string;
  courier: CourierProvider;
  consignmentNumber?: string;
  trackingNumber?: string;
  labelUrl?: string;
  status: ShipmentStatus;
  originCity: string;
  destinationCity: string;
  recipientName: string;
  recipientPhone: string;
  recipientAddress: string;
  weightKg: number;
  codAmountToCollect: number; // 0 if prepaid
  currency: string;
  estimatedDeliveryDate?: string;
  trackingEvents: ShipmentTrackingEvent[];
  createdAt: string;
  updatedAt: string;
}
