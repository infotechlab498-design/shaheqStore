import { CourierProvider, ShipmentStatus } from '@/types/shipping';

export interface BookingRequest {
  orderNumber: string;
  recipientName: string;
  recipientPhone: string;
  recipientEmail?: string;
  destinationAddress: string;
  destinationCity: string;
  weightKg: number;
  pieces: number;
  codAmountToCollect: number; // 0 for prepaid
  specialInstructions?: string;
}

export interface BookingResult {
  consignmentNumber: string;
  trackingNumber: string;
  labelUrl?: string;
  status: ShipmentStatus;
}

export interface TrackingResult {
  trackingNumber: string;
  courier: CourierProvider;
  currentStatus: ShipmentStatus;
  statusDescription: string;
  lastUpdated: string;
  events: Array<{
    date: string;
    location: string;
    activity: string;
  }>;
}

export interface ICourierProvider {
  readonly courier: CourierProvider;
  bookShipment(request: BookingRequest): Promise<BookingResult>;
  trackShipment(trackingNumber: string): Promise<TrackingResult>;
  cancelBooking(consignmentNumber: string): Promise<boolean>;
  generateLabelPdfUrl(consignmentNumber: string): Promise<string>;
}
