import { z } from 'zod';

export const PaymentProofSubmissionSchema = z.object({
  orderId: z.string().min(1, 'Order ID is required'),
  paymentMethod: z.enum(['BANK_TRANSFER', 'JAZZCASH', 'EASYPAISA']),
  transactionReference: z.string().min(4, 'Transaction ID / Raast Ref / UTR is required'),
  bankName: z.string().optional(),
  amountPaid: z.number().positive('Amount must match order total'),
  receiptFileKey: z.string().min(1, 'Deposit slip or screenshot attachment key is required'),
  notes: z.string().optional(),
});

export type PaymentProofSubmissionInput = z.infer<typeof PaymentProofSubmissionSchema>;
