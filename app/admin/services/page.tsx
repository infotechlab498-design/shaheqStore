'use client';

import * as React from 'react';
import Link from 'next/link';
import { Wrench, Plus, Edit2, CheckCircle2, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ENGINEERING_SERVICES } from '@/lib/data/catalog';

export default function AdminServicesPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-200 pb-5">
        <div>
          <h1 className="text-2xl font-bold font-mono text-zinc-900">
            Engineering Services Configuration
          </h1>
          <p className="text-xs font-mono text-zinc-500 mt-0.5">
            Configure service capabilities, standard turnaround lead times, and billing models.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-mono text-xs">
        {ENGINEERING_SERVICES.map((srv) => (
          <div
            key={srv.id}
            className="rounded-lg border border-zinc-200 bg-white p-5 shadow-xs space-y-4"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Wrench className="h-4 w-4 text-amber-600" />
                <h3 className="font-bold text-zinc-900 text-sm">{srv.title}</h3>
              </div>
              <Badge variant="tech" size="sm">
                Active
              </Badge>
            </div>

            <p className="text-zinc-600 font-sans text-xs">{srv.shortDescription}</p>

            <div className="space-y-1.5 pt-2 border-t border-zinc-100 text-[11px]">
              <div className="flex justify-between">
                <span className="text-zinc-500">Lead Time:</span>
                <span className="font-semibold text-zinc-900">{srv.turnaroundTime}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">Base Billing:</span>
                <span className="font-semibold text-amber-600">{srv.startingPriceLabel}</span>
              </div>
            </div>

            <div className="pt-2 border-t border-zinc-100 flex items-center justify-between">
              <span className="text-[10px] text-zinc-400">
                {srv.capabilities.length} Verified Capabilities
              </span>
              <Button variant="outline" size="sm" className="h-7 text-[11px]">
                <Edit2 className="h-3 w-3 mr-1" />
                Configure
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
