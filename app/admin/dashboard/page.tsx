'use client';

import * as React from 'react';
import Link from 'next/link';
import {
  DollarSign,
  Package,
  FileCode2,
  AlertTriangle,
  ArrowUpRight,
  Plus,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { formatPKR } from '@/lib/utils/currency';
import { DEMO_ADMIN_ORDERS, DEMO_ADMIN_QUOTES } from '@/lib/data/demo-admin-data';
import { INITIAL_PRODUCTS } from '@/lib/data/catalog';
import { useAdminRole } from '@/components/admin/admin-role-context';
import { hasPermission } from '@/lib/permissions/rbac';
import { Permission } from '@/types/user';
import { Order } from '@/types/order';
import { QuoteRequest } from '@/types/quote';

interface DashboardStats {
  grossVolume: number;
  activeOrdersCount: number;
  pendingQuotesCount: number;
  lowStockCount: number;
  recentOrders: Order[];
  recentQuotes: QuoteRequest[];
}

export default function AdminDashboardPage() {
  const { currentRole } = useAdminRole();
  const [stats, setStats] = React.useState<DashboardStats | null>(null);

  const canManageProducts = hasPermission(currentRole, Permission.MANAGE_PRODUCTS);
  const lowStockItems = INITIAL_PRODUCTS.filter((p) => p.status === 'LOW_STOCK' || p.stock < 10);
  const recentOrders = stats?.recentOrders?.length ? stats.recentOrders : DEMO_ADMIN_ORDERS;
  const recentQuotes = stats?.recentQuotes?.length ? stats.recentQuotes : DEMO_ADMIN_QUOTES;

  React.useEffect(() => {
    fetch('/api/admin/stats')
      .then((response) => response.json())
      .then((payload) => {
        if (payload.success) setStats(payload.data);
      })
      .catch(() => undefined);
  }, []);

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-slate-500">
            Operations Console
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold font-mono text-[#073574] mt-1">
            Alpha Tech Engineering Dashboard
          </h1>
          <p className="text-xs font-mono text-slate-500 mt-1">
            Inventory, courier manifests, CAD quotes, and live catalog operations.
          </p>
        </div>

        {canManageProducts && (
          <div className="flex items-center gap-2">
            <Link href="/admin/products/new">
              <Button variant="accent" size="sm" className="font-mono text-xs uppercase tracking-wider">
                <Plus className="h-3.5 w-3.5 mr-1" />
                Add Product
              </Button>
            </Link>
            <Link href="/admin/quotes">
              <Button variant="outline" size="sm" className="font-mono text-xs">
                Slicing Queue
              </Button>
            </Link>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-lg border border-slate-200 bg-white shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-500 text-xs font-mono">
            <span>Gross Volume</span>
            <DollarSign className="h-4 w-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black font-mono text-[#073574]">
            {formatPKR(stats?.grossVolume ?? 845000)}
          </div>
          <span className="text-[11px] font-mono text-emerald-600 flex items-center gap-1">
            <ArrowUpRight className="h-3 w-3" />
            Live catalog + order ledger
          </span>
        </div>

        <div className="p-5 rounded-lg border border-slate-200 bg-white shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-500 text-xs font-mono">
            <span>Active Orders</span>
            <Package className="h-4 w-4 text-[#073574]" />
          </div>
          <div className="text-2xl font-black font-mono text-[#073574]">
            {stats?.activeOrdersCount ?? DEMO_ADMIN_ORDERS.length}
          </div>
          <span className="text-[11px] font-mono text-slate-500">Awaiting pickup or production</span>
        </div>

        <div className="p-5 rounded-lg border border-slate-200 bg-white shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-500 text-xs font-mono">
            <span>Pending CAD Quotes</span>
            <FileCode2 className="h-4 w-4 text-[#073574]" />
          </div>
          <div className="text-2xl font-black font-mono text-[#073574]">
            {stats?.pendingQuotesCount ?? DEMO_ADMIN_QUOTES.length}
          </div>
          <span className="text-[11px] font-mono text-[#073574]">Needs DFM review</span>
        </div>

        <div className="p-5 rounded-lg border border-slate-200 bg-white shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-500 text-xs font-mono">
            <span>Critical Stock Alerts</span>
            <AlertTriangle className="h-4 w-4 text-rose-600" />
          </div>
          <div className="text-2xl font-black font-mono text-[#073574]">
            {stats?.lowStockCount ?? lowStockItems.length}
          </div>
          <span className="text-[11px] font-mono text-rose-600">Reorder threshold exceeded</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-4 rounded-lg border border-slate-200 bg-white p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-[#073574] flex items-center gap-1.5">
              <AlertTriangle className="h-4 w-4 text-rose-500" />
              Low Stock Alert List
            </h3>
            <Link href="/admin/products" className="text-[11px] font-mono text-[#073574] hover:text-[#051C42]">
              Inventory
            </Link>
          </div>
          <div className="space-y-3 font-mono text-xs">
            {lowStockItems.map((item) => (
              <div key={item.id} className="p-3 rounded-md border border-rose-200 bg-rose-50/50 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#073574] truncate mr-2">{item.name}</span>
                  <Badge variant="destructive" size="sm">{item.stock} left</Badge>
                </div>
                <div className="flex justify-between text-[11px] text-slate-500">
                  <span>SKU: {item.sku}</span>
                  <span>{formatPKR(item.basePrice)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-8 rounded-lg border border-slate-200 bg-white p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-[#073574]">
              Recent Hardware Orders
            </h3>
            <Link href="/admin/orders" className="text-[11px] font-mono text-[#073574] hover:text-[#051C42]">
              View All Orders
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left font-mono text-xs divide-y divide-slate-200">
              <thead>
                <tr className="text-slate-500 text-[11px]">
                  <th className="py-2">Order #</th>
                  <th className="py-2">Recipient</th>
                  <th className="py-2">Total</th>
                  <th className="py-2">Status</th>
                  <th className="py-2">Courier</th>
                  <th className="py-2 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {recentOrders.slice(0, 6).map((order) => (
                  <tr key={order.id} className="hover:bg-[#EAF2FF]/60">
                    <td className="py-3 font-bold text-[#073574]">{order.orderNumber}</td>
                    <td className="py-3 text-slate-700">{order.customerName}</td>
                    <td className="py-3 font-semibold">{formatPKR(order.totalAmount)}</td>
                    <td className="py-3">
                      <Badge variant="info" size="sm">{String(order.status).replace(/_/g, ' ')}</Badge>
                    </td>
                    <td className="py-3 text-slate-500">{order.shippingCourier || 'Pending'}</td>
                    <td className="py-3 text-right">
                      <Link href={`/admin/orders/${order.id}`} className="text-[#073574] hover:text-[#051C42] underline text-[11px]">
                        Inspect
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-[#073574] flex items-center gap-2">
            <FileCode2 className="h-4 w-4 text-[#073574]" />
            Engineering & 3D Printing Slicing Requests
          </h3>
          <Link href="/admin/quotes" className="text-[11px] font-mono text-[#073574] hover:text-[#051C42]">
            All Quotes
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-xs divide-y divide-slate-200">
            <thead>
              <tr className="text-slate-500 text-[11px]">
                <th className="py-2">Quote #</th>
                <th className="py-2">Client</th>
                <th className="py-2">Service</th>
                <th className="py-2">Material / Specs</th>
                <th className="py-2">Status</th>
                <th className="py-2">Assigned Engineer</th>
                <th className="py-2 text-right">Review</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {recentQuotes.slice(0, 6).map((quote) => (
                <tr key={quote.id} className="hover:bg-[#EAF2FF]/60">
                  <td className="py-3 font-bold text-[#073574]">{quote.quoteNumber}</td>
                  <td className="py-3">
                    <span className="block text-[#073574] font-semibold">{quote.customerName}</span>
                    <span className="text-[10px] text-slate-500">{quote.companyName || 'Private Client'}</span>
                  </td>
                  <td className="py-3 text-slate-700">{quote.serviceType}</td>
                  <td className="py-3 text-slate-500">
                    {quote.parameters?.material || 'N/A'} • {quote.parameters?.quantity || 1} unit(s)
                  </td>
                  <td className="py-3">
                    <Badge variant="warning" size="sm">{String(quote.status).replace(/_/g, ' ')}</Badge>
                  </td>
                  <td className="py-3 text-slate-700">{quote.assignedEngineer || 'Unassigned'}</td>
                  <td className="py-3 text-right">
                    <Link href={`/admin/quotes/${quote.id}`} className="text-[#073574] hover:text-[#051C42] font-semibold text-[11px]">
                      Open CAD Review →
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
