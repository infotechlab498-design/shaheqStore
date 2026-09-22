'use client';

import * as React from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  ArrowLeft,
  Truck,
  CheckCircle2,
  FileText,
  Clock,
  ShieldCheck,
  Building,
  Save,
  Barcode,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { DEMO_ADMIN_ORDERS } from '@/lib/data/demo-admin-data';
import { formatPKR } from '@/lib/utils/currency';
import { formatDate } from '@/lib/utils/date';
import { OrderStatus } from '@/types/order';

function createConsignmentNumber(courier: string, orderNumber: string): string {
  const cleanNumber = orderNumber.replace(/[^0-9]/g, '').padEnd(6, '1');
  return `${courier.toUpperCase().slice(0, 3)}-88${cleanNumber}`;
}

export default function AdminOrderDetailPage() {
  const params = useParams();
  const id = params?.id as string;

  const initialOrder = DEMO_ADMIN_ORDERS.find((o) => o.id === id) || DEMO_ADMIN_ORDERS[0];

  const [orderStatus, setOrderStatus] = React.useState<OrderStatus>(initialOrder.status);
  const [isPaid, setIsPaid] = React.useState<boolean>(initialOrder.isPaid);
  const [courier, setCourier] = React.useState<string>(initialOrder.shippingCourier || 'TCS');
  const [trackingNumber, setTrackingNumber] = React.useState<string>(initialOrder.trackingNumber || '');
  const [notes, setNotes] = React.useState<string>(initialOrder.internalNotes || '');
  const [toastMessage, setToastMessage] = React.useState<string | null>(null);

  const handleGenerateConsignment = () => {
    const generated = createConsignmentNumber(courier, initialOrder.orderNumber);
    setTrackingNumber(generated);
    setOrderStatus(OrderStatus.SHIPPED);
    showToast(`Consignment ${generated} generated via ${courier} API simulation!`);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    showToast('Order fulfillment and shipping details saved.');
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  return (
    <form onSubmit={handleSave} className="max-w-5xl space-y-8 font-mono text-xs">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-200 pb-4">
        <div className="flex items-center gap-3">
          <Link href="/admin/orders">
            <Button type="button" variant="outline" size="sm" className="h-8">
              <ArrowLeft className="h-3.5 w-3.5 mr-1" />
              Orders
            </Button>
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold font-mono text-zinc-900">
                Order #{initialOrder.orderNumber}
              </h1>
              <Badge variant="info" size="sm">
                {orderStatus.replace(/_/g, ' ')}
              </Badge>
            </div>
            <span className="text-[11px] text-zinc-500">
              Placed {formatDate(initialOrder.createdAt)}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {toastMessage && (
            <span className="text-emerald-600 font-bold">
              ✓ {toastMessage}
            </span>
          )}
          <Button type="submit" variant="accent" size="sm" className="uppercase tracking-wider">
            <Save className="h-3.5 w-3.5 mr-1.5" />
            Update Order State
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Order Items & Delivery Location */}
        <div className="lg:col-span-7 space-y-6">
          {/* Ordered Hardware Items */}
          <div className="rounded-lg border border-zinc-200 bg-white p-5 shadow-xs space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-900 border-b border-zinc-100 pb-2">
              Consigned Hardware Items
            </h3>

            <div className="divide-y divide-zinc-100">
              {initialOrder.items.map((item) => (
                <div key={item.id} className="py-3 flex items-center justify-between">
                  <div className="space-y-0.5">
                    <span className="font-bold text-zinc-900 block">{item.name}</span>
                    <span className="text-[11px] text-zinc-500">
                      SKU: {item.sku} • {item.quantity} units @ {formatPKR(item.unitPrice)}
                    </span>
                  </div>
                  <span className="font-bold text-zinc-900">
                    {formatPKR(item.totalPrice)}
                  </span>
                </div>
              ))}
            </div>

            <div className="pt-2 border-t border-zinc-200 flex justify-between font-bold text-sm text-zinc-950">
              <span>Total Invoice Amount</span>
              <span>{formatPKR(initialOrder.totalAmount)}</span>
            </div>
          </div>

          {/* Delivery & Recipient Details */}
          <div className="rounded-lg border border-zinc-200 bg-white p-5 shadow-xs space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-900 border-b border-zinc-100 pb-2">
              Consignee & Destination (Pakistan)
            </h3>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-zinc-500 block">Recipient Name:</span>
                <span className="font-semibold text-zinc-900">{initialOrder.customerName}</span>
              </div>
              <div>
                <span className="text-zinc-500 block">Phone / WhatsApp:</span>
                <span className="font-semibold text-zinc-900">{initialOrder.customerPhone}</span>
              </div>
              <div>
                <span className="text-zinc-500 block">Destination City:</span>
                <span className="font-semibold text-zinc-900">
                  {initialOrder.shippingCity || 'Islamabad'}, {initialOrder.shippingProvince || 'Federal Capital'}
                </span>
              </div>
              <div>
                <span className="text-zinc-500 block">Postal Index:</span>
                <span className="font-semibold text-zinc-900">{initialOrder.shippingPostalCode || '44000'}</span>
              </div>
              <div className="col-span-2">
                <span className="text-zinc-500 block">Delivery Address:</span>
                <span className="font-semibold text-zinc-900">{initialOrder.shippingAddress || 'Sector F-7/2, Street 14, House 22'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Courier Consignment & Payment Processing */}
        <div className="lg:col-span-5 space-y-6">
          {/* Courier Logistics Workflow */}
          <div className="rounded-lg border border-zinc-200 bg-white p-5 shadow-xs space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-900 flex items-center gap-1.5 border-b border-zinc-100 pb-2">
              <Truck className="h-4 w-4 text-amber-600" />
              Courier Fulfillment & Logistics
            </h3>

            <div className="space-y-3">
              <div className="space-y-1">
                <label className="text-zinc-700 font-medium">Fulfillment Courier Carrier</label>
                <Select
                  value={courier}
                  onChange={(e) => setCourier(e.target.value)}
                  className="text-xs h-9 bg-white"
                >
                  <option value="TCS">TCS Logistics (Overland & Hazmat)</option>
                  <option value="LEOPARD">Leopard Courier Service</option>
                  <option value="MNP">M&P Express Logistics</option>
                  <option value="TRAX">Trax Logistics Network</option>
                </Select>
              </div>

              <div className="space-y-1">
                <label className="text-zinc-700 font-medium">Consignment / Tracking Number</label>
                <div className="flex gap-2">
                  <Input
                    placeholder="e.g. 77019283401"
                    value={trackingNumber}
                    onChange={(e) => setTrackingNumber(e.target.value)}
                    className="text-xs h-9 font-mono"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleGenerateConsignment}
                    className="shrink-0 text-[11px]"
                    title="Generate booking consignment code"
                  >
                    <Barcode className="h-3.5 w-3.5 mr-1" />
                    Auto Book
                  </Button>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-zinc-700 font-medium">Order Status Workflow</label>
                <Select
                  value={orderStatus}
                  onChange={(e) => setOrderStatus(e.target.value as OrderStatus)}
                  className="text-xs h-9 bg-white"
                >
                  <option value={OrderStatus.PENDING}>PENDING (Unverified)</option>
                  <option value={OrderStatus.CONFIRMED}>CONFIRMED (Ready for Packing)</option>
                  <option value={OrderStatus.PROCESSING}>PROCESSING (In QA / Packing)</option>
                  <option value={OrderStatus.SHIPPED}>SHIPPED (Handed to Courier)</option>
                  <option value={OrderStatus.DELIVERED}>DELIVERED (Completed)</option>
                  <option value={OrderStatus.CANCELLED}>CANCELLED</option>
                </Select>
              </div>
            </div>
          </div>

          {/* Payment Status & Accounting */}
          <div className="rounded-lg border border-zinc-200 bg-white p-5 shadow-xs space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-900 border-b border-zinc-100 pb-2">
              Payment Settlement
            </h3>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between">
                <span className="text-zinc-500">Method:</span>
                <span className="font-bold text-zinc-900">{initialOrder.paymentMethod}</span>
              </div>

              <div className="flex items-center justify-between pt-1">
                <span className="text-zinc-500">Settlement Verification:</span>
                <button
                  type="button"
                  onClick={() => setIsPaid(!isPaid)}
                  className={`px-3 py-1 rounded-md text-xs font-bold font-mono transition-colors cursor-pointer ${
                    isPaid
                      ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                      : 'bg-amber-100 text-amber-900 border border-amber-300'
                  }`}
                >
                  {isPaid ? '✓ PAID / VERIFIED' : 'PENDING SETTLEMENT'}
                </button>
              </div>

              <div className="space-y-1 pt-2">
                <label className="text-zinc-700 font-medium">Internal Dispatch Log Notes</label>
                <Input
                  placeholder="e.g. Verified Meezan Bank IBFT slip #TXN-99218"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="text-xs h-8"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
