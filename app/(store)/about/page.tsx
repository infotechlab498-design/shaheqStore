import { Cpu, ShieldCheck, Compass, Award, CheckCircle2 } from 'lucide-react';
import { Breadcrumb } from '@/components/ui/breadcrumb';
import { siteConfig } from '@/lib/config/site';

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-10 space-y-12 font-sans">
      <Breadcrumb
        items={[
          { label: 'Home', href: '/' },
          { label: 'About Alpha Tech' },
        ]}
      />

      <div className="border-b border-zinc-200 pb-6 space-y-3">
        <span className="text-xs font-mono uppercase tracking-widest text-amber-600">
          Corporate & Engineering Profile
        </span>
        <h1 className="text-3xl sm:text-4xl font-bold font-mono text-zinc-900">
          Precision Systems. Industrial Rigor.
        </h1>
        <p className="text-base text-zinc-600 leading-relaxed max-w-3xl">
          Alpha Tech is an advanced engineering enterprise headquartered in Lahore, Pakistan. We supply aerospace-grade drone components, high-discharge lithium power systems, precision autoclave carbon fiber, and provide industrial-grade additive manufacturing and CAD modeling.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm text-zinc-600 leading-relaxed">
        <div className="space-y-4">
          <h3 className="text-lg font-bold font-mono text-zinc-900">Hardware Distribution</h3>
          <p>
            The drone and robotics sectors require zero tolerance for component failure. Every LiPo battery pack stocked by Alpha Tech is batch-tested for internal impedance (IR), cell voltage balance, and high-amp discharge capability.
          </p>
          <p>
            Our carbon fiber stock is sourced directly from certified composite fabricators, utilizing 3K twill quasi-isotropic layups consolidated under high autoclave pressure.
          </p>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-bold font-mono text-zinc-900">Additive & CAD Services</h3>
          <p>
            In addition to our ready-to-ship hardware catalog, Alpha Tech operates an enclosed additive manufacturing facility capable of printing engineering polymers including Nylon-CF, Polycarbonate, and High-Toughness SLA Resins.
          </p>
          <p>
            We uphold bilateral NDAs for corporate defense, research institutes, and commercial UAV developers, guaranteeing complete IP isolation.
          </p>
        </div>
      </div>

      <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-6 sm:p-8 space-y-4 font-mono text-xs">
        <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-900">
          Alpha Tech Engineering Standards
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 bg-white rounded-md border border-zinc-200">
            <span className="text-amber-600 font-bold block mb-1">ISO / ASME GD&T</span>
            <span className="text-zinc-600 font-sans text-xs">Geometric dimensioning and tolerancing down to sub-50 microns.</span>
          </div>
          <div className="p-4 bg-white rounded-md border border-zinc-200">
            <span className="text-amber-600 font-bold block mb-1">100% IP ISOLATION</span>
            <span className="text-zinc-600 font-sans text-xs">Isolated private storage buckets for confidential engineering models.</span>
          </div>
          <div className="p-4 bg-white rounded-md border border-zinc-200">
            <span className="text-amber-600 font-bold block mb-1">TRACEABLE COURIER</span>
            <span className="text-zinc-600 font-sans text-xs">Overland delivery compliance for dangerous goods and LiPo batteries.</span>
          </div>
        </div>
      </div>
    </div>
  );
}
