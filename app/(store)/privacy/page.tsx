import { Lock, ShieldCheck, EyeOff } from 'lucide-react';
import { Breadcrumb } from '@/components/ui/breadcrumb';

export default function PrivacyPolicyPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-10 space-y-8 font-sans">
      <Breadcrumb
        items={[
          { label: 'Home', href: '/' },
          { label: 'Privacy & NDA Policy' },
        ]}
      />

      <div className="border-b border-zinc-200 pb-4 space-y-2">
        <span className="text-xs font-mono uppercase tracking-widest text-amber-600">
          Intellectual Property & Security
        </span>
        <h1 className="text-3xl font-bold font-mono text-zinc-900">
          Privacy Policy & Bilateral NDA Framework
        </h1>
        <p className="text-sm text-zinc-600">
          How Alpha Tech safeguards proprietary CAD models, customer information, and corporate data.
        </p>
      </div>

      <div className="space-y-6 text-sm text-zinc-600 leading-relaxed">
        <div className="space-y-2">
          <h2 className="text-lg font-bold font-mono text-zinc-900">1. Strict CAD File Isolation</h2>
          <p>
            Customer geometry files (.STL, .STEP, .SLDPRT, .DXF) submitted for quoting or manufacturing are stored within private, non-public object storage buckets accessible only by credentialed engineers with verified clearance.
          </p>
        </div>

        <div className="space-y-2">
          <h2 className="text-lg font-bold font-mono text-zinc-900">2. Enforceable Non-Disclosure Agreements (NDAs)</h2>
          <p>
            When requested by selecting the NDA option during quote submission, Alpha Tech issues an executed bilateral non-disclosure agreement protecting the client&apos;s proprietary mechanical architectures, schematics, and functional trade secrets.
          </p>
        </div>

        <div className="space-y-2">
          <h2 className="text-lg font-bold font-mono text-zinc-900">3. Customer Personal Information</h2>
          <p>
            Contact numbers, physical delivery addresses, and payment confirmation slips are utilized strictly for dispatch verification and legal commercial tax filing in Pakistan. Data is never shared or marketed to third-party brokers.
          </p>
        </div>
      </div>
    </div>
  );
}
