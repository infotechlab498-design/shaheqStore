import Link from 'next/link';
import { Package, ArrowLeft, Truck, FileText } from 'lucide-react';
import { Breadcrumb } from '@/components/ui/breadcrumb';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DEMO_ADMIN_ORDERS } from '@/lib/data/demo-admin-data';
import { formatPKR } from '@/lib/utils/currency';
import { formatDate } from '@/lib/utils/date';

export default function CustomerOrdersPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <Breadcrumb
        items={[
          { label: 'Home', href: '/' },
          { label: 'Account', href: '/account' },
          { label: 'Orders' },
        ]}
      />

      <div className="flex items-center justify-between border-b border-zinc-200 pb-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold font-mono text-zinc-900">
            Order History & Tracking
          </h1>
          <p className="text-xs font-mono text-zinc-500 mt-1">
            Review status, courier tracking consignments, and invoice slips.
          </p>
        </div>
        <Link href="/account">
          <Button variant="outline" size="sm" className="font-mono text-xs">
            <ArrowLeft className="h-3.5 w-3.5 mr-1" />
            Back to Account
          </Button>
        </Link>
      </div>

      <div className="space-y-4">
        {DEMO_ADMIN_ORDERS.map((order) => (
          <div
            key={order.id}
            className="rounded-lg border border-zinc-200 bg-white p-5 sm:p-6 shadow-xs space-y-4"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-100 pb-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-base text-zinc-950">
                    Order #{order.orderNumber}
                  </span>
                  <Badge variant="info" size="sm">
                    {order.status.replace(/_/g, ' ')}
                  </Badge>
                </div>
                <span className="text-xs font-mono text-zinc-500">
                  Placed on {formatDate(order.createdAt)}
                </span>
              </div>

              <div className="text-right font-mono">
                <span className="text-base font-bold text-zinc-950 block">
                  {formatPKR(order.totalAmount)}
                </span>
                <span className="text-[11px] text-zinc-500">
                  {order.paymentMethod.replace(/_/g, ' ')} • {order.isPaid ? 'PAID' : 'PENDING'}
                </span>
              </div>
            </div>

            {/* Items */}
            <div className="space-y-2">
              {order.items.map((item) => (
                <div key={item.id} className="flex items-center justify-between text-xs font-mono py-1">
                  <span className="text-zinc-800">
                    {item.quantity}x {item.name} ({item.sku})
                  </span>
                  <span className="font-semibold text-zinc-900">
                    {formatPKR(item.totalPrice)}
                  </span>
                </div>
              ))}
            </div>

            {/* Tracking details */}
            {order.trackingNumber && (
              <div className="pt-3 border-t border-zinc-100 flex items-center justify-between text-xs font-mono text-zinc-600 bg-zinc-50 p-3 rounded-md">
                <div className="flex items-center gap-2">
                  <Truck className="h-4 w-4 text-amber-600" />
                  <span>
                    Courier: <strong>{order.shippingCourier}</strong> | Tracking #{' '}
                    <strong>{order.trackingNumber}</strong>
                  </span>
                </div>
                <span className="text-emerald-700 font-semibold">Overland Transit</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
