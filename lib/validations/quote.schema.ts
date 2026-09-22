import { z } from 'zod';

export const QuoteRequestSchema = z.object({
  customerName: z.string().min(2, 'Name is required'),
  customerEmail: z.string().email('Valid corporate or personal email required'),
  customerPhone: z.string().min(10, 'Valid contact phone number required'),
  customerWhatsApp: z.string().min(10, 'WhatsApp number required for engineering review updates'),
  companyName: z.string().optional(),
  serviceType: z.string().min(2, 'Service type is required'),
  projectDescription: z.string().min(20, 'Please describe your project application and operating conditions'),
  quantity: z.number().int().positive('Quantity must be at least 1').default(1),
  requestedDeadline: z.string().optional(),
  application: z.string().optional(),
  material: z.string().optional(),
  layerHeight: z.string().optional(),
  infill: z.string().optional(),
  surfaceFinish: z.string().optional(),
  tolerance: z.string().optional(),
  dimensions: z.string().optional(),
  additionalRequirements: z.string().optional(),
  ndaRequested: z.boolean().default(false),
});

export type QuoteRequestInput = z.infer<typeof QuoteRequestSchema>;
