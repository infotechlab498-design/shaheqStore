'use client';

import * as React from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { CheckCircle2, Truck, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { WhatsAppButton } from '@/components/shared/whatsapp-button';
import { PaymentInstructions } from '@/components/storefront/payment-instructions';

function OrderSuccessContent() {
  const searchParams = useSearchParams();
  const orderNumber = searchParams.get('order') || 'AT-2026-1004';
  const method = searchParams.get('method') || 'BANK_TRANSFER';

  return (
    <div className="store-shell-prose py-16 text-center space-y-8">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
        <CheckCircle2 className="h-10 w-10" />
      </div>

      <div className="space-y-2">
        <span className="text-xs font-mono uppercase tracking-widest text-emerald-700 font-semibold">
          Order Placement Confirmed
        </span>
        <h1 className="text-2xl sm:text-4xl font-bold font-mono text-zinc-900">
          Order Reference #{orderNumber}
        </h1>
        <p className="text-sm text-zinc-600 max-w-lg mx-auto leading-relaxed">
          Your flight hardware order has been staged. A formal tracking docket will be generated once courier consignment dispatch is authorized.
        </p>
      </div>

      {/* Bank Transfer Instructions if IBFT selected */}
      {(method === 'BANK_TRANSFER' || method === 'JAZZCASH' || method === 'EASYPAISA') && (
        <div className="max-w-xl mx-auto">
          <PaymentInstructions />
        </div>
      )}

      {/* Next Steps */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left max-w-xl mx-auto font-mono text-xs">
        <div className="p-4 rounded-md border border-zinc-200 bg-white space-y-1.5">
          <Truck className="h-4 w-4 text-amber-600" />
          <h4 className="font-bold text-zinc-900">Courier Dispatch</h4>
          <p className="text-zinc-500 font-sans text-xs">
            Assigned to TCS / Leopard overland delivery with live SMS tracking updates.
          </p>
        </div>

        <div className="p-4 rounded-md border border-zinc-200 bg-white space-y-1.5">
          <FileText className="h-4 w-4 text-emerald-600" />
          <h4 className="font-bold text-zinc-900">Corporate Invoice</h4>
          <p className="text-zinc-500 font-sans text-xs">
            Commercial NTN tax invoice generated and emailed to your recipient address.
          </p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row justify-center items-center gap-3 pt-4">
        <WhatsAppButton context="order" referenceId={orderNumber} />
        <Link href="/account">
          <Button variant="outline" size="md">
            View My Orders
          </Button>
        </Link>
        <Link href="/shop">
          <Button variant="primary" size="md">
            Return to Catalog
          </Button>
        </Link>
      </div>
    </div>
  );
}

export default function OrderSuccessPage() {
  return (
    <React.Suspense fallback={<div className="p-16 text-center font-mono text-xs">Loading order confirmation...</div>}>
      <OrderSuccessContent />
    </React.Suspense>
  );
}
