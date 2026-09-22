'use client';

import * as React from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { CheckCircle2, Truck, FileText, ArrowRight, ShieldCheck, Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { WhatsAppButton } from '@/components/shared/whatsapp-button';

function OrderSuccessContent() {
  const searchParams = useSearchParams();
  const orderNumber = searchParams.get('order') || 'AT-2026-1004';
  const method = searchParams.get('method') || 'BANK_TRANSFER';

  const [copied, setCopied] = React.useState(false);

  const copyIban = () => {
    navigator.clipboard?.writeText('PK76MEZN0001020304050607');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-16 text-center space-y-8">
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
      {method === 'BANK_TRANSFER' && (
        <div className="rounded-lg border border-amber-300 bg-amber-50/70 p-6 text-left max-w-xl mx-auto space-y-3 font-mono text-xs text-amber-950">
          <h3 className="font-bold uppercase tracking-wider text-amber-900 flex items-center gap-2">
            <span>Raast / IBFT Transfer Details</span>
          </h3>
          <p className="text-amber-800 font-sans text-xs">
            Please transfer the invoice balance to Alpha Tech&apos;s corporate account and send the confirmation slip to our accounting WhatsApp:
          </p>

          <div className="p-3 bg-white rounded-md border border-amber-200 space-y-1.5">
            <div className="flex justify-between">
              <span className="text-zinc-500">Bank:</span>
              <span className="font-bold text-zinc-900">Meezan Bank Limited</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-500">Title:</span>
              <span className="font-bold text-zinc-900">Alpha Tech Technologies (Pvt) Ltd.</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-zinc-500">IBAN:</span>
              <span className="font-bold text-zinc-900 font-mono">PK76 MEZN 0001 0203 0405 0607</span>
            </div>
          </div>

          <div className="flex justify-end pt-1">
            <button
              type="button"
              onClick={copyIban}
              className="text-[11px] text-amber-800 hover:text-amber-950 font-semibold flex items-center gap-1 cursor-pointer"
            >
              <Copy className="h-3 w-3" />
              {copied ? 'Copied IBAN' : 'Copy IBAN'}
            </button>
          </div>
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
