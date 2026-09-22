import { z } from 'zod';

const pakistaniPhone = z
  .string()
  .trim()
  .transform((value) => value.replace(/[\s-]/g, ''))
  .refine(
    (value) => /^(\+92|0)[0-9]{10}$/.test(value),
    'Valid Pakistani mobile number required (e.g., 03001234567 or +92 300 1234567)'
  );

export const AddressSchema = z.object({
  fullName: z.string().min(3, 'Full name is required'),
  phone: pakistaniPhone,
  province: z.string().min(2, 'Province is required'),
  city: z.string().min(2, 'City is required'),
  area: z.string().optional(),
  addressLine1: z.string().min(5, 'Street address is required'),
  addressLine2: z.string().optional(),
  postalCode: z.string().min(4, 'Postal code is required'),
  country: z.string().default('Pakistan'),
});

export const OrderCheckoutSchema = z.object({
  email: z.string().email('Valid email required for order confirmation and tracking'),
  phone: pakistaniPhone,
  paymentMethod: z
    .enum(['COD', 'CASH_ON_DELIVERY', 'BANK_TRANSFER', 'JAZZCASH', 'EASYPAISA', 'CARD'])
    .transform((method) => (method === 'CASH_ON_DELIVERY' ? 'COD' : method)),
  shippingAddress: AddressSchema,
  notes: z.string().max(500, 'Notes must be under 500 characters').optional(),
});

export type OrderCheckoutInput = z.infer<typeof OrderCheckoutSchema>;
