export const UserRole = {
  SUPER_ADMIN: 'SUPER_ADMIN',
  SHOP_MANAGER: 'SHOP_MANAGER',
  CAD_PRINT_ENGINEER: 'CAD_PRINT_ENGINEER',
  CUSTOMER: 'CUSTOMER',
} as const;

export type UserRole = (typeof UserRole)[keyof typeof UserRole];
export type Role = UserRole;

export const Permission = {
  VIEW_DASHBOARD: 'VIEW_DASHBOARD',
  VIEW_ADMIN_DASHBOARD: 'VIEW_ADMIN_DASHBOARD',
  VIEW_PRODUCTS: 'VIEW_PRODUCTS',
  MANAGE_PRODUCTS: 'MANAGE_PRODUCTS',
  MANAGE_INVENTORY: 'MANAGE_INVENTORY',
  VIEW_ORDERS: 'VIEW_ORDERS',
  MANAGE_ORDERS: 'MANAGE_ORDERS',
  VIEW_QUOTES: 'VIEW_QUOTES',
  MANAGE_QUOTES: 'MANAGE_QUOTES',
  REVIEW_CAD_FILES: 'REVIEW_CAD_FILES',
  UPDATE_PRODUCTION_STATUS: 'UPDATE_PRODUCTION_STATUS',
  MANAGE_SERVICES: 'MANAGE_SERVICES',
  VERIFY_PAYMENTS: 'VERIFY_PAYMENTS',
  MANAGE_SHIPPING: 'MANAGE_SHIPPING',
  MANAGE_SHIPMENTS: 'MANAGE_SHIPMENTS',
  VIEW_USERS: 'VIEW_USERS',
  VIEW_CUSTOMERS: 'VIEW_CUSTOMERS',
  VIEW_AUDIT_LOGS: 'VIEW_AUDIT_LOGS',
  VIEW_ANALYTICS: 'VIEW_ANALYTICS',
  MANAGE_STAFF: 'MANAGE_STAFF',
  MANAGE_SETTINGS: 'MANAGE_SETTINGS',
} as const;

export type Permission = (typeof Permission)[keyof typeof Permission];

export interface Address {
  id: string;
  userId?: string;
  fullName: string;
  phone: string;
  province: string;
  city: string;
  area: string;
  addressLine1: string;
  addressLine2?: string;
  postalCode: string;
  isDefault: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: Role;
  avatarUrl?: string;
  addresses?: Address[];
  createdAt: string;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  whatsapp?: string;
  company?: string;
  totalOrders: number;
  totalSpent: number;
  totalQuotes: number;
  currency: string;
  createdAt: string;
}
