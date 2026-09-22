import { Role, Permission } from '@/types/user';

export type { Permission };

export interface RoleDefinition {
  name: string;
  label: string;
  description: string;
}

export const ROLE_DEFINITIONS: Record<Role, RoleDefinition> = {
  SUPER_ADMIN: {
    name: 'Super Admin',
    label: 'Super Admin',
    description: 'Unrestricted administrative access to store, quotes, CAD files, finance, and system settings.',
  },
  SHOP_MANAGER: {
    name: 'Shop Manager',
    label: 'Shop Manager',
    description: 'Manages catalog inventory, customer orders, courier logistics dispatch, and payment verifications.',
  },
  CAD_PRINT_ENGINEER: {
    name: 'CAD / Additive Engineer',
    label: 'CAD / Additive Engineer',
    description: 'Inspects confidential CAD files, runs DFM slicing analysis, submits pricing proposals, and manages production queues.',
  },
  CUSTOMER: {
    name: 'Verified Client',
    label: 'Verified Client',
    description: 'Customer ordering drone components and submitting confidential engineering quote requests.',
  },
};

const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  SUPER_ADMIN: [
    'VIEW_DASHBOARD',
    'VIEW_ADMIN_DASHBOARD',
    'VIEW_PRODUCTS',
    'MANAGE_PRODUCTS',
    'MANAGE_INVENTORY',
    'VIEW_ORDERS',
    'MANAGE_ORDERS',
    'VIEW_QUOTES',
    'MANAGE_QUOTES',
    'REVIEW_CAD_FILES',
    'UPDATE_PRODUCTION_STATUS',
    'MANAGE_SERVICES',
    'VERIFY_PAYMENTS',
    'MANAGE_SHIPPING',
    'MANAGE_SHIPMENTS',
    'VIEW_USERS',
    'VIEW_CUSTOMERS',
    'VIEW_AUDIT_LOGS',
    'VIEW_ANALYTICS',
    'MANAGE_STAFF',
    'MANAGE_SETTINGS',
  ],
  SHOP_MANAGER: [
    'VIEW_DASHBOARD',
    'VIEW_ADMIN_DASHBOARD',
    'VIEW_PRODUCTS',
    'MANAGE_PRODUCTS',
    'MANAGE_INVENTORY',
    'VIEW_ORDERS',
    'MANAGE_ORDERS',
    'MANAGE_SERVICES',
    'VERIFY_PAYMENTS',
    'MANAGE_SHIPPING',
    'MANAGE_SHIPMENTS',
    'VIEW_USERS',
    'VIEW_CUSTOMERS',
    'VIEW_ANALYTICS',
  ],
  CAD_PRINT_ENGINEER: [
    'VIEW_DASHBOARD',
    'VIEW_ADMIN_DASHBOARD',
    'VIEW_PRODUCTS',
    'VIEW_QUOTES',
    'MANAGE_QUOTES',
    'REVIEW_CAD_FILES',
    'UPDATE_PRODUCTION_STATUS',
    'VIEW_AUDIT_LOGS',
  ],
  CUSTOMER: [],
};

export function hasPermission(role: Role, permission: Permission): boolean {
  const permissions = ROLE_PERMISSIONS[role];
  return permissions ? permissions.includes(permission) : false;
}

export function getAccessibleRoutes(role: Role): string[] {
  const routes: string[] = ['/admin'];
  if (hasPermission(role, 'MANAGE_PRODUCTS')) routes.push('/admin/products');
  if (hasPermission(role, 'MANAGE_INVENTORY')) routes.push('/admin/inventory');
  if (hasPermission(role, 'MANAGE_ORDERS')) routes.push('/admin/orders');
  if (hasPermission(role, 'MANAGE_QUOTES')) routes.push('/admin/quotes');
  if (hasPermission(role, 'VERIFY_PAYMENTS')) routes.push('/admin/payments');
  if (hasPermission(role, 'MANAGE_SHIPMENTS')) routes.push('/admin/shipments');
  if (hasPermission(role, 'VIEW_CUSTOMERS')) routes.push('/admin/customers');
  if (hasPermission(role, 'VIEW_ANALYTICS')) routes.push('/admin/analytics');
  if (hasPermission(role, 'MANAGE_STAFF')) routes.push('/admin/staff');
  if (hasPermission(role, 'MANAGE_SETTINGS')) routes.push('/admin/settings');
  return routes;
}
