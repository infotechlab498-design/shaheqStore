'use client';

import { Copy, MessageSquare } from 'lucide-react';
import * as React from 'react';
import { siteConfig } from '@/lib/config/site';

export function PaymentInstructions({
  compact = false,
}: {
  compact?: boolean;
}) {
  const { bank, walletNumber, proofWhatsapp } = siteConfig.payments;
  const [copied, setCopied] = React.useState<string | null>(null);

  const copy = (label: string, value: string) => {
    navigator.clipboard?.writeText(value);
    setCopied(label);
    window.setTimeout(() => setCopied(null), 2000);
  };

  const waNumber = siteConfig.contact.whatsapp.replace(/\D/g, '');
  const waHref = `https://wa.me/${waNumber}?text=${encodeURIComponent(
    `Assalamualaikum, I have sent the payment for my Alpha Tech order. Sharing the screenshot now.`
  )}`;

  const rows = [
    { label: 'Bank', value: bank.name },
    { label: 'Account title', value: bank.accountTitle },
    { label: 'Account number', value: bank.accountNumber, copy: true },
    { label: 'IBAN', value: bank.iban, copy: true },
    { label: 'EasyPaisa / JazzCash', value: walletNumber, copy: true },
  ];

  return (
    <div className={`rounded-lg border border-blue-200 bg-[#EAF2FF] ${compact ? 'p-4' : 'p-5'} space-y-3 text-left`}>
      <h3 className="text-sm font-bold text-[#073574]">Pay these Alpha Tech accounts</h3>
      <div className="rounded-md border border-blue-100 bg-white divide-y divide-slate-100">
        {rows.map((row) => (
          <div key={row.label} className="flex items-start justify-between gap-3 px-3 py-2.5">
            <div className="min-w-0">
              <div className="text-[10px] uppercase tracking-wide text-slate-500 font-semibold">{row.label}</div>
              <div className="text-sm font-semibold text-[#073574] break-all">{row.value}</div>
            </div>
            {row.copy && (
              <button
                type="button"
                onClick={() => copy(row.label, row.value)}
                className="shrink-0 inline-flex items-center gap-1 text-[11px] font-semibold text-slate-600 hover:text-[#073574]"
              >
                <Copy className="w-3 h-3" />
                {copied === row.label ? 'Copied' : 'Copy'}
              </button>
            )}
          </div>
        ))}
      </div>
      <p className="text-xs text-slate-700 leading-relaxed">
        After you send the payment, send the receipt screenshot on WhatsApp
        {' '}
        <a href={waHref} target="_blank" rel="noopener noreferrer" className="font-bold text-[#073574] underline">
          {proofWhatsapp}
        </a>
        . Your order is confirmed once the screenshot is received.
      </p>
      <a
        href={waHref}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 rounded-md bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-2 text-xs font-bold"
      >
        <MessageSquare className="w-3.5 h-3.5" />
        Send screenshot on WhatsApp
      </a>
    </div>
  );
}
