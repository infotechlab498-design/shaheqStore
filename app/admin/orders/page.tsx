'use client';

import * as React from 'react';
import Link from 'next/link';
import { Search, SlidersHorizontal, Eye, Truck, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { DEMO_ADMIN_ORDERS } from '@/lib/data/demo-admin-data';
import { formatPKR } from '@/lib/utils/currency';
import { formatDate } from '@/lib/utils/date';
import { OrderStatus } from '@/types/order';

export default function AdminOrdersPage() {
  const [searchTerm, setSearchTerm] = React.useState('');
  const [selectedStatus, setSelectedStatus] = React.useState('all');
  const [orders, setOrders] = React.useState(DEMO_ADMIN_ORDERS);

  React.useEffect(() => {
    fetch('/api/orders')
      .then((res) => res.json())
      .then((json) => {
        if (json.success && Array.isArray(json.data) && json.data.length > 0) {
          const mapped = json.data.map((o: any) => ({
            id: o.id,
            orderNumber: o.orderNumber,
            customerName: o.shippingAddress?.fullName || o.customerName || 'Customer',
            customerEmail: o.email || o.customerEmail || 'customer@alphatech.pk',
            customerPhone: o.phone || o.customerPhone || '+92 300 1234567',
            status: o.status,
            totalAmount: o.total || o.totalAmount || 0,
            paymentMethod: o.paymentMethod || 'BANK_TRANSFER',
            isPaid: o.paymentStatus === 'PAID' || o.paymentStatus === 'VERIFIED' || o.isPaid || false,
            shippingCity: o.shippingAddress?.city || o.shippingCity || 'Lahore',
            shippingProvince: o.shippingAddress?.province || o.shippingProvince || 'Punjab',
            shippingCourier: o.shippingCourier || (o.shipments?.[0]?.courierCode) || 'TCS',
            trackingNumber: o.trackingNumber || (o.shipments?.[0]?.trackingNumber) || undefined,
            createdAt: o.createdAt || new Date().toISOString(),
            items: (o.items || []).map((it: any) => ({
              productId: it.productId,
              name: it.productName || it.name,
              quantity: it.quantity,
              unitPrice: it.unitPrice,
              totalPrice: it.total || (it.quantity * it.unitPrice),
            })),
          }));
          setOrders(mapped);
        }
      })
      .catch(() => {
        // Keep demo orders fallback
      });
  }, []);

  const filtered = orders.filter((order) => {
    if (selectedStatus !== 'all' && order.status !== selectedStatus) return false;
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      return (
        order.orderNumber.toLowerCase().includes(q) ||
        order.customerName.toLowerCase().includes(q) ||
        (order.shippingCity && order.shippingCity.toLowerCase().includes(q)) ||
        (order.trackingNumber && order.trackingNumber.toLowerCase().includes(q))
      );
    }
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-200 pb-5">
        <div>
          <h1 className="text-2xl font-bold font-mono text-zinc-900">
            Hardware Orders & Logistics Dispatch
          </h1>
          <p className="text-xs font-mono text-zinc-500 mt-0.5">
            Process incoming orders, verify bank transfers, and generate courier consignments.
          </p>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-xs">
        <div className="w-full sm:w-80">
          <Input
            placeholder="Search order #, customer, city, tracking..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="text-xs h-9"
            leftIcon={<Search className="h-3.5 w-3.5" />}
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="rounded-md border border-zinc-300 bg-white px-3 py-1.5 text-xs text-zinc-700"
          >
            <option value="all">All Order Statuses</option>
            <option value={OrderStatus.PENDING}>Pending Confirmation</option>
            <option value={OrderStatus.CONFIRMED}>Confirmed</option>
            <option value={OrderStatus.PROCESSING}>Processing / Packing</option>
            <option value={OrderStatus.SHIPPED}>Shipped via Courier</option>
            <option value={OrderStatus.DELIVERED}>Delivered</option>
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <div className="rounded-lg border border-zinc-200 bg-white overflow-hidden shadow-xs">
        <table className="w-full text-left font-mono text-xs divide-y divide-zinc-200">
          <thead className="bg-zinc-50 text-zinc-500 text-[11px]">
            <tr>
              <th className="p-3">Order #</th>
              <th className="p-3">Date</th>
              <th className="p-3">Customer & City</th>
              <th className="p-3">Items Summary</th>
              <th className="p-3">Payment</th>
              <th className="p-3">Total Amount</th>
              <th className="p-3">Status</th>
              <th className="p-3">Courier Logistics</th>
              <th className="p-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100">
            {filtered.map((order) => (
              <tr key={order.id} className="hover:bg-zinc-50/80 transition-colors">
                <td className="p-3 font-bold text-zinc-900">{order.orderNumber}</td>
                <td className="p-3 text-zinc-500 text-[11px]">{formatDate(order.createdAt)}</td>
                <td className="p-3">
                  <span className="font-semibold text-zinc-900 block">{order.customerName}</span>
                  <span className="text-[10px] text-zinc-500">{order.shippingCity || 'Pakistan'}, {order.shippingProvince || 'PK'}</span>
                </td>
                <td className="p-3 text-zinc-700">
                  <span className="truncate max-w-[200px] block">
                    {order.items.map((i) => `${i.quantity}x ${i.name}`).join(', ')}
                  </span>
                </td>
                <td className="p-3">
                  <span className="font-semibold text-zinc-800 block text-[11px]">
                    {order.paymentMethod.replace(/_/g, ' ')}
                  </span>
                  <span className={`text-[10px] font-bold ${order.isPaid ? 'text-emerald-600' : 'text-amber-600'}`}>
                    {order.isPaid ? 'PAID' : 'AWAITING VERIFICATION'}
                  </span>
                </td>
                <td className="p-3 font-bold text-zinc-900">{formatPKR(order.totalAmount)}</td>
                <td className="p-3">
                  <Badge variant="info" size="sm">
                    {order.status.replace(/_/g, ' ')}
                  </Badge>
                </td>
                <td className="p-3">
                  {order.trackingNumber ? (
                    <div className="space-y-0.5 text-[11px]">
                      <span className="font-bold text-zinc-800">{order.shippingCourier}</span>
                      <span className="text-zinc-500 block font-mono">#{order.trackingNumber}</span>
                    </div>
                  ) : (
                    <span className="text-[11px] text-amber-600 font-semibold">Needs Consignment</span>
                  )}
                </td>
                <td className="p-3 text-right">
                  <Link href={`/admin/orders/${order.id}`}>
                    <Button variant="outline" size="sm" className="h-7 text-[11px] px-2.5">
                      <Eye className="h-3 w-3 mr-1" />
                      Manage
                    </Button>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
