export interface PaginationState {
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}

export interface CartItem {
  id: string;
  productId: string;
  variantId?: string;
  productName: string;
  variantName?: string;
  sku: string;
  unitPrice: number;
  quantity: number;
  imageUrl: string;
  weightGrams?: number;
}

export interface CartState {
  items: CartItem[];
  subtotal: number;
  estimatedShipping: number;
  discount: number;
  total: number;
  currency: string;
}

export interface ServiceItem {
  id: string;
  title: string;
  slug: string;
  category: string;
  shortDescription: string;
  detailedDescription: string;
  capabilities: string[];
  materialsSupported: string[];
  turnaroundTime: string;
  startingPriceLabel: string;
  iconName: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
  };
}
