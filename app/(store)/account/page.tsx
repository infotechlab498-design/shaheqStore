'use client';

import * as React from 'react';
import Link from 'next/link';
import {
  User,
  Package,
  FileCode2,
  Clock,
  ArrowRight,
  ShieldCheck,
  MapPin,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Breadcrumb } from '@/components/ui/breadcrumb';
import { formatPKR } from '@/lib/utils/currency';
import { DEMO_ADMIN_ORDERS, DEMO_ADMIN_QUOTES } from '@/lib/data/demo-admin-data';

export default function AccountDashboardPage() {
  const activeOrders = DEMO_ADMIN_ORDERS.slice(0, 2);
  const activeQuotes = DEMO_ADMIN_QUOTES.slice(0, 2);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Breadcrumbs */}
      <Breadcrumb
        items={[
          { label: 'Home', href: '/' },
          { label: 'Customer Account' },
        ]}
      />

      {/* Account Header */}
      <div className="rounded-lg border border-zinc-200 bg-white p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-zinc-900 text-white font-mono font-bold text-xl">
            HT
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold font-mono text-zinc-900">Hamza Tariq</h1>
              <Badge variant="tech" size="sm">
                Verified Client
              </Badge>
            </div>
            <p className="text-xs font-mono text-zinc-500 mt-0.5">
              hamza.tariq@aeroeng.pk • +92 321 4567890
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link href="/account/orders">
            <Button variant="outline" size="sm" className="font-mono text-xs">
              All Orders
            </Button>
          </Link>
          <Link href="/account/quotes">
            <Button variant="outline" size="sm" className="font-mono text-xs">
              Quote Status
            </Button>
          </Link>
        </div>
      </div>

      {/* Grid: Active Orders & Quotes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Active Orders */}
        <div className="rounded-lg border border-zinc-200 bg-white p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
            <h3 className="font-mono text-sm font-bold uppercase tracking-wider text-zinc-900 flex items-center gap-2">
              <Package className="h-4 w-4 text-amber-600" />
              <span>Hardware Orders</span>
            </h3>
            <Link href="/account/orders" className="text-xs font-mono text-amber-600 hover:text-amber-700">
              View All
            </Link>
          </div>

          <div className="space-y-3">
            {activeOrders.map((order) => (
              <div
                key={order.id}
                className="p-4 rounded-md border border-zinc-200 bg-zinc-50/60 space-y-2 font-mono text-xs"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-zinc-900">{order.orderNumber}</span>
                  <Badge variant="info" size="sm">
                    {order.status.replace(/_/g, ' ')}
                  </Badge>
                </div>

                <div className="text-zinc-600 font-sans text-xs">
                  {order.items.map((i) => `${i.quantity}x ${i.name}`).join(', ')}
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-zinc-200/60 text-[11px] text-zinc-500">
                  <span>Total: <strong>{formatPKR(order.totalAmount)}</strong></span>
                  <span>Courier: {order.shippingCourier || 'TCS'}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Active Quotes */}
        <div className="rounded-lg border border-zinc-200 bg-white p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
            <h3 className="font-mono text-sm font-bold uppercase tracking-wider text-zinc-900 flex items-center gap-2">
              <FileCode2 className="h-4 w-4 text-amber-600" />
              <span>CAD & 3D Printing Quotes</span>
            </h3>
            <Link href="/account/quotes" className="text-xs font-mono text-amber-600 hover:text-amber-700">
              View All
            </Link>
          </div>

          <div className="space-y-3">
            {activeQuotes.map((quote) => (
              <div
                key={quote.id}
                className="p-4 rounded-md border border-zinc-200 bg-zinc-50/60 space-y-2 font-mono text-xs"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-zinc-900">{quote.quoteNumber}</span>
                  <Badge variant="warning" size="sm">
                    {quote.status.replace(/_/g, ' ')}
                  </Badge>
                </div>

                <div className="text-zinc-700 font-sans text-xs line-clamp-2">
                  {quote.projectDescription}
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-zinc-200/60 text-[11px] text-zinc-500">
                  <span>Files: {quote.files.length} Staged</span>
                  <span>{quote.requiresNda ? 'NDA Active' : 'Public DFM'}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-2">
            <Link href="/quote" className="block">
              <Button variant="accent" size="sm" className="w-full font-mono text-xs uppercase tracking-wider">
                Request New Custom Quote
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
