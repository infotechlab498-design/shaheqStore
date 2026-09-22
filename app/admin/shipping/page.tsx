'use client';

import * as React from 'react';
import { Truck, CheckCircle2, Clock, MapPin, Search, Barcode } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { DEMO_ADMIN_ORDERS } from '@/lib/data/demo-admin-data';

export default function AdminShippingPage() {
  const [courierStatus, setCourierStatus] = React.useState({
    TCS: 'Online (API Operational)',
    LEOPARD: 'Online (Overland Dispatch Active)',
    MNP: 'Online (Express COD Ready)',
    TRAX: 'Online (Bulk Pickup Active)',
  });

  return (
    <div className="space-y-8 font-mono text-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-200 pb-5">
        <div>
          <h1 className="text-2xl font-bold font-mono text-zinc-900">
            Courier Logistics & Consignment Management
          </h1>
          <p className="text-xs font-mono text-zinc-500 mt-0.5">
            Integrations with TCS, Leopard, M&P, and Trax for hazardous goods and overland parcel delivery.
          </p>
        </div>
      </div>

      {/* Courier Integrations Status Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {Object.entries(courierStatus).map(([name, status]) => (
          <div key={name} className="p-4 rounded-lg border border-zinc-200 bg-white shadow-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-sm text-zinc-900">{name} Logistics</span>
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
            </div>
            <p className="text-[11px] text-emerald-700 font-semibold">{status}</p>
            <span className="text-[10px] text-zinc-500 block pt-1 border-t border-zinc-100">
              Contract Account: AT-PAK-788
            </span>
          </div>
        ))}
      </div>

      {/* Dispatched Consignments Table */}
      <div className="rounded-lg border border-zinc-200 bg-white overflow-hidden shadow-xs space-y-4 p-5">
        <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
          <h3 className="font-bold uppercase tracking-wider text-zinc-900 text-xs flex items-center gap-2">
            <Truck className="h-4 w-4 text-amber-600" />
            Active Courier Consignments
          </h3>
          <span className="text-zinc-500 text-[11px]">Overland Fleet Manifest</span>
        </div>

        <table className="w-full text-left font-mono text-xs divide-y divide-zinc-200">
          <thead className="bg-zinc-50 text-zinc-500 text-[11px]">
            <tr>
              <th className="p-3">Consignment #</th>
              <th className="p-3">Carrier</th>
              <th className="p-3">Origin Hub</th>
              <th className="p-3">Destination City</th>
              <th className="p-3">Recipient</th>
              <th className="p-3">Consigned Order</th>
              <th className="p-3">Hazmat Flag</th>
              <th className="p-3 text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100">
            {DEMO_ADMIN_ORDERS.filter((o) => o.trackingNumber).map((order) => (
              <tr key={order.id} className="hover:bg-zinc-50/80">
                <td className="p-3 font-bold text-zinc-900 flex items-center gap-1.5">
                  <Barcode className="h-3.5 w-3.5 text-zinc-500" />
                  {order.trackingNumber}
                </td>
                <td className="p-3 font-semibold text-zinc-800">{order.shippingCourier}</td>
                <td className="p-3 text-zinc-600">Lahore Central Hub</td>
                <td className="p-3 font-semibold text-zinc-900">{order.shippingCity}</td>
                <td className="p-3 text-zinc-700">{order.customerName}</td>
                <td className="p-3 text-zinc-500">{order.orderNumber}</td>
                <td className="p-3">
                  <span className="inline-block px-1.5 py-0.5 rounded-xs bg-amber-50 text-amber-900 border border-amber-200 text-[10px] font-bold">
                    Class 9 (LiPo)
                  </span>
                </td>
                <td className="p-3 text-right">
                  <Badge variant="success" size="sm">
                    In Transit
                  </Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
