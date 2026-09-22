import Link from 'next/link';
import { FileCode2, ArrowLeft, Lock, Download } from 'lucide-react';
import { Breadcrumb } from '@/components/ui/breadcrumb';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DEMO_ADMIN_QUOTES } from '@/lib/data/demo-admin-data';
import { formatDate } from '@/lib/utils/date';
import { formatPKR } from '@/lib/utils/currency';

export default function CustomerQuotesPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <Breadcrumb
        items={[
          { label: 'Home', href: '/' },
          { label: 'Account', href: '/account' },
          { label: 'Quotes' },
        ]}
      />

      <div className="flex items-center justify-between border-b border-zinc-200 pb-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold font-mono text-zinc-900">
            Engineering Quotes & DFM Reviews
          </h1>
          <p className="text-xs font-mono text-zinc-500 mt-1">
            Track slicing evaluations, CAD file revisions, and machine runtime calculations.
          </p>
        </div>
        <div className="flex gap-2">
          <Link href="/quote">
            <Button variant="accent" size="sm" className="font-mono text-xs">
              + New Quote
            </Button>
          </Link>
          <Link href="/account">
            <Button variant="outline" size="sm" className="font-mono text-xs">
              <ArrowLeft className="h-3.5 w-3.5 mr-1" />
              Account
            </Button>
          </Link>
        </div>
      </div>

      <div className="space-y-4">
        {DEMO_ADMIN_QUOTES.map((quote) => (
          <div
            key={quote.id}
            className="rounded-lg border border-zinc-200 bg-white p-5 sm:p-6 shadow-xs space-y-4 font-mono text-xs"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-100 pb-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-base text-zinc-950">
                    Quote #{quote.quoteNumber}
                  </span>
                  <Badge variant="warning" size="sm">
                    {quote.status.replace(/_/g, ' ')}
                  </Badge>
                  {quote.requiresNda && (
                    <span className="inline-flex items-center gap-1 rounded-xs bg-amber-50 px-1.5 py-0.5 text-[10px] text-amber-800 border border-amber-200">
                      <Lock className="h-3 w-3" />
                      NDA Protected
                    </span>
                  )}
                </div>
                <span className="text-zinc-500">
                  Submitted {formatDate(quote.createdAt)} • Service: {quote.serviceType}
                </span>
              </div>

              {quote.quotedPrice && (
                <div className="text-right">
                  <span className="text-base font-bold text-emerald-700 block">
                    {formatPKR(quote.quotedPrice)}
                  </span>
                  <span className="text-[10px] text-zinc-500">Firm Production Quote</span>
                </div>
              )}
            </div>

            <div className="text-zinc-700 font-sans text-sm leading-relaxed">
              {quote.projectDescription}
            </div>

            {/* Files Attached */}
            <div className="pt-2 border-t border-zinc-100 flex flex-wrap items-center justify-between gap-3 text-zinc-500">
              <div className="flex items-center gap-2">
                <FileCode2 className="h-4 w-4 text-amber-600" />
                <span>
                  Staged Models: {quote.files.map((f) => f.originalFileName).join(', ')}
                </span>
              </div>
              <span>Assigned: {quote.assignedEngineer || 'Reviewing Lead'}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
