import { z } from 'zod';

export const ProductVariantSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(2, 'Variant name must be at least 2 characters'),
  sku: z.string().min(3, 'Variant SKU must be at least 3 characters'),
  price: z.number().positive('Price must be greater than zero'),
  stock: z.number().int().nonnegative('Stock cannot be negative').default(0),
  weight: z.number().positive().optional(),
  attributes: z.record(z.string(), z.string()).default({}),
});

export const ProductCreateSchema = z.object({
  name: z.string().min(3, 'Product name must be at least 3 characters'),
  slug: z.string().min(3, 'Slug is required'),
  sku: z.string().min(3, 'SKU is required'),
  categoryId: z.string().min(1, 'Category is required'),
  shortDescription: z.string().min(10, 'Short description is required'),
  description: z.string().min(20, 'Full technical description is required'),
  basePrice: z.number().positive('Base price must be positive'),
  currency: z.string().default('PKR'),
  status: z.enum(['IN_STOCK', 'LOW_STOCK', 'PRE_ORDER', 'OUT_OF_STOCK']).default('IN_STOCK'),
  stock: z.number().int().nonnegative().default(0),
  lowStockThreshold: z.number().int().nonnegative().default(5),
  technicalSpecifications: z.record(z.string(), z.string()).default({}),
  compatibilityNotes: z.string().optional(),
  shippingNotes: z.string().optional(),
  variants: z.array(ProductVariantSchema).optional(),
});

export type ProductCreateInput = z.infer<typeof ProductCreateSchema>;
