import { PaymentMethod } from '@/types/payment';

export interface PaymentInitiationParams {
  orderId: string;
  orderNumber: string;
  amount: number;
  currency: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  callbackUrl: string;
}

export interface PaymentInitiationResult {
  paymentId: string;
  redirectUrl?: string;
  instructions?: string;
  requiresManualVerification: boolean;
  status: 'PENDING' | 'SUBMITTED_FOR_VERIFICATION';
}

export interface IPaymentProvider {
  readonly method: PaymentMethod;
  initiatePayment(params: PaymentInitiationParams): Promise<PaymentInitiationResult>;
  verifyPayment(transactionId: string): Promise<{ isVerified: boolean; rawDetails?: unknown }>;
}
