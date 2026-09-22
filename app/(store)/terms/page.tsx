import { FileText, CheckCircle2 } from 'lucide-react';
import { Breadcrumb } from '@/components/ui/breadcrumb';

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-10 space-y-8 font-sans">
      <Breadcrumb
        items={[
          { label: 'Home', href: '/' },
          { label: 'Terms of Service' },
        ]}
      />

      <div className="border-b border-zinc-200 pb-4 space-y-2">
        <span className="text-xs font-mono uppercase tracking-widest text-amber-600">
          Commercial Agreement
        </span>
        <h1 className="text-3xl font-bold font-mono text-zinc-900">
          Terms of Service & Engineering Supply
        </h1>
        <p className="text-sm text-zinc-600">
          Governing rules for hardware purchases, custom fabrication orders, and quotation engagements.
        </p>
      </div>

      <div className="space-y-6 text-sm text-zinc-600 leading-relaxed">
        <div className="space-y-2">
          <h2 className="text-lg font-bold font-mono text-zinc-900">1. Commercial Invoicing & Quotations</h2>
          <p>
            All prices listed on the Alpha Tech catalog are stated in Pakistani Rupees (PKR). Written engineering quotations provided via our quoting system remain valid for 15 calendar days from the date of issue.
          </p>
        </div>

        <div className="space-y-2">
          <h2 className="text-lg font-bold font-mono text-zinc-900">2. Customer Design Ownership</h2>
          <p>
            All intellectual property rights associated with customer-submitted CAD files, blueprints, and prototypes remain the exclusive property of the customer. Alpha Tech retains no claim or license to reproduce designs beyond fulfilling the authorized order.
          </p>
        </div>

        <div className="space-y-2">
          <h2 className="text-lg font-bold font-mono text-zinc-900">3. Compliance with Local Regulations</h2>
          <p>
            Customers ordering specialized avionics, long-range telemetry systems, or defense-grade airframe materials are solely responsible for ensuring compliance with all applicable Pakistan Civil Aviation Authority (PCAA) guidelines and legal airspace regulations.
          </p>
        </div>
      </div>
    </div>
  );
}
