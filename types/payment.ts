export type PaymentMethod =
  | 'CASH_ON_DELIVERY'
  | 'BANK_TRANSFER'
  | 'JAZZCASH'
  | 'EASYPAISA'
  | 'CARD';

export type PaymentStatus =
  | 'PENDING'
  | 'SUBMITTED_FOR_VERIFICATION'
  | 'VERIFIED'
  | 'FAILED'
  | 'REFUNDED';

export interface PaymentVerification {
  id: string;
  paymentId: string;
  transactionReference: string;
  bankName?: string;
  receiptAttachmentKey?: string;
  verifiedByUserId?: string;
  verifiedAt?: string;
  rejectionReason?: string;
  notes?: string;
}

export interface Payment {
  id: string;
  orderId: string;
  orderNumber: string;
  customerName: string;
  amount: number;
  currency: string;
  method: PaymentMethod;
  status: PaymentStatus;
  transactionReference?: string;
  receiptUrl?: string; // Private preview link in admin
  verification?: PaymentVerification;
  createdAt: string;
  updatedAt: string;
}
