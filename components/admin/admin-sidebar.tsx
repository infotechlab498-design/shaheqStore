'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  FileCode2,
  Wrench,
  Users,
  Truck,
  ShieldCheck,
  Settings,
  Store,
  LogOut,
  ChevronRight,
} from 'lucide-react';
import { useAdminRole } from './admin-role-context';
import { UserRole } from '@/types/user';
import { hasPermission } from '@/lib/permissions/rbac';
import { Permission } from '@/types/user';

interface NavItem {
  title: string;
  href: string;
  icon: React.ReactNode;
  permission?: Permission;
}

const NAV_ITEMS: NavItem[] = [
  {
    title: 'Dashboard Overview',
    href: '/admin/dashboard',
    icon: <LayoutDashboard className="h-4 w-4" />,
    permission: Permission.VIEW_ADMIN_DASHBOARD,
  },
  {
    title: 'Inventory & Products',
    href: '/admin/products',
    icon: <Package className="h-4 w-4" />,
    permission: Permission.VIEW_PRODUCTS,
  },
  {
    title: 'Orders & Fulfillment',
    href: '/admin/orders',
    icon: <ShoppingBag className="h-4 w-4" />,
    permission: Permission.VIEW_ORDERS,
  },
  {
    title: 'CAD & Slicing Quotes',
    href: '/admin/quotes',
    icon: <FileCode2 className="h-4 w-4" />,
    permission: Permission.VIEW_QUOTES,
  },
  {
    title: 'Engineering Services',
    href: '/admin/services',
    icon: <Wrench className="h-4 w-4" />,
    permission: Permission.MANAGE_SERVICES,
  },
  {
    title: 'Customer Accounts',
    href: '/admin/users',
    icon: <Users className="h-4 w-4" />,
    permission: Permission.VIEW_USERS,
  },
  {
    title: 'Couriers & Dispatch',
    href: '/admin/shipping',
    icon: <Truck className="h-4 w-4" />,
    permission: Permission.MANAGE_SHIPPING,
  },
  {
    title: 'Audit & Access Logs',
    href: '/admin/audit-logs',
    icon: <ShieldCheck className="h-4 w-4" />,
    permission: Permission.VIEW_AUDIT_LOGS,
  },
  {
    title: 'System Settings',
    href: '/admin/settings',
    icon: <Settings className="h-4 w-4" />,
    permission: Permission.MANAGE_SETTINGS,
  },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const { currentRole, setRole, roleConfig } = useAdminRole();

  return (
    <aside className="w-64 bg-[#051C42] text-blue-100 border-r border-[#073574] flex flex-col justify-between shrink-0 min-h-screen">
      {/* Top Branding & Workspace */}
      <div>
        <div className="p-4 border-b border-[#073574] flex items-center justify-between">
          <Link href="/admin/dashboard" className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-xs bg-[#EAF2FF] font-mono font-bold text-[#073574] text-sm">
              α
            </div>
            <div>
              <span className="font-mono font-bold text-sm text-white tracking-wider block leading-tight">
                ALPHA TECH
              </span>
              <span className="text-[10px] font-mono text-blue-200 block leading-none">
                STAFF PORTAL
              </span>
            </div>
          </Link>
          <Link
            href="/"
            title="Switch to Storefront"
            className="p-1.5 rounded-md hover:bg-[#073574] text-blue-200 hover:text-white transition-colors"
          >
            <Store className="h-4 w-4" />
          </Link>
        </div>

        {/* Role Switcher Sandbox for RBAC Testing */}
        <div className="p-3 bg-[#062A63] border-b border-[#073574] space-y-1.5">
          <div className="flex items-center justify-between text-[11px] font-mono text-blue-200">
            <span className="uppercase tracking-wider">Active RBAC Role:</span>
            <span className="text-white font-bold">{roleConfig.name}</span>
          </div>
          <select
            value={currentRole}
            onChange={(e) => setRole(e.target.value as UserRole)}
            className="w-full rounded-md border border-blue-800 bg-[#051C42] px-2 py-1 text-xs font-mono text-blue-50 focus:outline-hidden focus:ring-1 focus:ring-[#EAF2FF] cursor-pointer"
          >
            <option value={UserRole.SUPER_ADMIN}>Super Admin (All Access)</option>
            <option value={UserRole.SHOP_MANAGER}>Shop Manager (Catalog/Orders)</option>
            <option value={UserRole.CAD_PRINT_ENGINEER}>CAD / Print Engineer</option>
            <option value={UserRole.CUSTOMER}>Customer (Restricted)</option>
          </select>
        </div>

        {/* Navigation Items */}
        <nav className="p-3 space-y-1 font-mono text-xs">
          {NAV_ITEMS.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href === '/admin/dashboard' && pathname === '/admin') ||
              (item.href !== '/admin/dashboard' && pathname.startsWith(item.href));
            const isAllowed = !item.permission || hasPermission(currentRole, item.permission);

            if (!isAllowed) {
              return null; // hide or disable based on role
            }

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center justify-between px-3 py-2 rounded-md transition-colors ${
                  isActive
                    ? 'bg-[#073574] text-white font-bold'
                    : 'text-blue-200 hover:bg-[#062A63] hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  {item.icon}
                  <span className="truncate">{item.title}</span>
                </div>
                {isActive && <ChevronRight className="h-3.5 w-3.5" />}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom Session Footer */}
      <div className="p-4 border-t border-[#073574] text-xs font-mono text-blue-200 space-y-2">
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-emerald-400" />
          <span className="text-[11px] text-blue-200">Node: Lahore Hub 01</span>
        </div>
        <div className="text-[11px] text-blue-200">
          Logged in as: <strong className="text-white">info@aljazeeragc.com</strong>
        </div>
        <button
          type="button"
          onClick={async () => {
            await fetch('/api/admin/logout', { method: 'POST' });
            window.location.href = '/admin/login';
          }}
          className="flex items-center gap-2 text-[11px] text-[#EAF2FF] hover:text-white pt-1"
        >
          <LogOut className="h-3.5 w-3.5" />
          <span>Sign out</span>
        </button>
      </div>
    </aside>
  );
}
