import { ShieldAlert, RotateCcw, CheckCircle2 } from 'lucide-react';
import { Breadcrumb } from '@/components/ui/breadcrumb';

export default function RefundPolicyPage() {
  return (
    <div className="store-shell-prose py-10 space-y-8 font-sans">
      <Breadcrumb
        items={[
          { label: 'Home', href: '/' },
          { label: 'Warranty & Refunds' },
        ]}
      />

      <div className="border-b border-zinc-200 pb-4 space-y-2">
        <span className="text-xs font-mono uppercase tracking-widest text-amber-600">
          Hardware Assurance
        </span>
        <h1 className="text-3xl font-bold font-mono text-zinc-900">
          Warranty, Inspection & Refund Policy
        </h1>
        <p className="text-sm text-zinc-600">
          Quality guarantees, DOA replacement, and customized fabrication terms.
        </p>
      </div>

      <div className="space-y-6 text-sm text-zinc-600 leading-relaxed">
        <div className="space-y-2">
          <h2 className="text-lg font-bold font-mono text-zinc-900">1. Dead on Arrival (DOA) Guarantee</h2>
          <p>
            Any hardware component (electronic speed controllers, brushless motors, flight controllers, or LiPo packs) found to have manufacturing defects upon arrival must be reported within 48 hours of courier delivery for immediate diagnostic inspection and exchange.
          </p>
        </div>

        <div className="space-y-2">
          <h2 className="text-lg font-bold font-mono text-zinc-900">2. LiPo Battery Cell Variance Warranty</h2>
          <p>
            Batteries returned for replacement must exhibit factory-state physical integrity (un-swollen, original shrink wrap intact, un-soldered power leads). Packs damaged by over-discharge (below 3.0V/cell) or high-speed crashes are excluded from manufacturer replacement warranties.
          </p>
        </div>

        <div className="space-y-2">
          <h2 className="text-lg font-bold font-mono text-zinc-900">3. Custom 3D Printed & CNC Milled Parts</h2>
          <p>
            Custom manufactured parts are fabricated strictly to the customer&apos;s supplied CAD geometry and confirmed tolerances. Dimensional discrepancies exceeding agreed tolerances (e.g. ±0.1mm) qualify for immediate re-print or machining correction at zero added charge.
          </p>
        </div>
      </div>
    </div>
  );
}
