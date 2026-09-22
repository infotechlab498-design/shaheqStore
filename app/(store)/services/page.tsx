import Link from 'next/link';
import {
  Printer,
  Compass,
  Scan,
  Wrench,
  Layers,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Breadcrumb } from '@/components/ui/breadcrumb';
import { ServiceRepository } from '@/lib/repositories/service.repository';
import { WhatsAppButton } from '@/components/shared/whatsapp-button';

export default async function ServicesPage() {
  const services = await ServiceRepository.getAll();

  return (
    <div className="store-shell py-8 space-y-12">
      {/* Breadcrumbs */}
      <Breadcrumb
        items={[
          { label: 'Home', href: '/' },
          { label: 'Engineering Services', href: '/services' },
        ]}
      />

      {/* Page Header */}
      <div className="border-b border-zinc-200 pb-8 space-y-3">
        <span className="text-xs font-mono uppercase tracking-widest text-amber-600">
          On-Demand Engineering Laboratory
        </span>
        <h1 className="text-3xl sm:text-5xl font-bold font-mono text-zinc-900 leading-tight">
          Precision CAD, 3D Additive & Rapid Prototyping
        </h1>
        <p className="text-sm sm:text-base text-zinc-600 max-w-3xl leading-relaxed">
          From parametric 3D CAD modeling and finite element simulation to sub-millimeter industrial 3D printing and reverse engineering. We execute high-spec engineering components for aerospace, defense research, robotics, and commercial hardware ventures.
        </p>

        <div className="pt-2 flex flex-wrap items-center gap-3 font-mono text-xs text-zinc-500">
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
            Enforceable Bilateral NDAs
          </span>
          <span>•</span>
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
            STEP, STL, SLDPRT, DXF Formats
          </span>
          <span>•</span>
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
            24-48h Slicing & Quote Response
          </span>
        </div>
      </div>

      {/* All Engineering Services Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {services.map((service) => (
          <div
            key={service.id}
            id={service.slug}
            className="rounded-xl border border-zinc-200 bg-white p-6 sm:p-8 shadow-xs flex flex-col justify-between space-y-6 hover:border-zinc-400 transition-all"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-zinc-900 text-amber-400 shadow-xs">
                  {service.slug.includes('3d') && <Printer className="h-6 w-6" />}
                  {service.slug.includes('cad') && <Compass className="h-6 w-6" />}
                  {service.slug.includes('reverse') && <Scan className="h-6 w-6" />}
                  {service.slug.includes('jigs') && <Wrench className="h-6 w-6" />}
                  {!service.slug.includes('3d') && !service.slug.includes('cad') && !service.slug.includes('reverse') && !service.slug.includes('jigs') && <Layers className="h-6 w-6" />}
                </div>
                <div className="text-right font-mono">
                  <span className="text-[10px] uppercase text-zinc-400 block">Typical Turnaround</span>
                  <span className="text-xs font-semibold text-zinc-900">{service.turnaroundTime}</span>
                </div>
              </div>

              <div>
                <span className="text-[11px] font-mono text-amber-600 uppercase tracking-wider font-semibold">
                  {service.category}
                </span>
                <h3 className="text-xl sm:text-2xl font-bold font-mono text-zinc-900 mt-0.5">
                  {service.title}
                </h3>
                <p className="mt-2 text-sm text-zinc-600 leading-relaxed">
                  {service.detailedDescription}
                </p>
              </div>

              {/* Capabilities Checklist */}
              <div className="space-y-2 pt-2 border-t border-zinc-100">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-800">
                  Engineering Scope:
                </span>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono text-zinc-700">
                  {service.capabilities.map((cap, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 mt-0.5 shrink-0" />
                      <span>{cap}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Supported Materials */}
              <div className="space-y-1.5 pt-2 border-t border-zinc-100 text-xs font-mono">
                <span className="text-zinc-500 font-semibold">Supported Materials / Substrates:</span>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {service.materialsSupported.map((mat, i) => (
                    <span
                      key={i}
                      className="rounded-xs bg-zinc-100 px-2 py-0.5 text-[11px] text-zinc-800 border border-zinc-200"
                    >
                      {mat}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Service Footer Actions */}
            <div className="pt-4 border-t border-zinc-100 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              <span className="text-xs font-mono text-zinc-500">
                Billing Model: <strong className="text-zinc-900">{service.startingPriceLabel}</strong>
              </span>
              <div className="flex items-center gap-2">
                <WhatsAppButton context="quote" referenceId={service.title} />
                <Link href={`/quote?service=${service.slug}`}>
                  <Button variant="accent" size="sm" className="font-mono text-xs uppercase tracking-wider">
                    <span>Submit Files</span>
                    <ArrowRight className="h-3.5 w-3.5 ml-1" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Structured Quote Process Explanation */}
      <section className="rounded-xl border border-zinc-200 bg-zinc-900 p-8 sm:p-12 text-white space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-mono uppercase tracking-widest text-amber-400">
            How It Works
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold font-mono">
            4-Stage Rapid Engineering Workflow
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400">
            Transparent quoting, parametric DFM verification, and traceable fabrication.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 font-mono text-xs">
          <div className="p-4 rounded-lg bg-zinc-950 border border-zinc-800 space-y-2">
            <span className="text-amber-500 font-bold text-sm block">STEP 01</span>
            <h4 className="font-bold text-white text-sm">Upload CAD Data</h4>
            <p className="text-zinc-400 font-sans leading-relaxed text-xs">
              Upload .STL, .STEP, or .SLDPRT models under bilateral NDA protection up to 100MB.
            </p>
          </div>

          <div className="p-4 rounded-lg bg-zinc-950 border border-zinc-800 space-y-2">
            <span className="text-amber-500 font-bold text-sm block">STEP 02</span>
            <h4 className="font-bold text-white text-sm">DFM Slicing Review</h4>
            <p className="text-zinc-400 font-sans leading-relaxed text-xs">
              Our engineering team inspects wall thickness, draft angles, layer orientation, and material properties.
            </p>
          </div>

          <div className="p-4 rounded-lg bg-zinc-950 border border-zinc-800 space-y-2">
            <span className="text-amber-500 font-bold text-sm block">STEP 03</span>
            <h4 className="font-bold text-white text-sm">Firm Quote & Invoice</h4>
            <p className="text-zinc-400 font-sans leading-relaxed text-xs">
              Receive a formal quotation in PKR with exact machine runtime, material weight, and delivery timeline.
            </p>
          </div>

          <div className="p-4 rounded-lg bg-zinc-950 border border-zinc-800 space-y-2">
            <span className="text-amber-500 font-bold text-sm block">STEP 04</span>
            <h4 className="font-bold text-white text-sm">Dispatch via Courier</h4>
            <p className="text-zinc-400 font-sans leading-relaxed text-xs">
              Finished components undergo dimensional QA before packing and insured courier transit.
            </p>
          </div>
        </div>

        <div className="text-center pt-4">
          <Link href="/quote">
            <Button variant="accent" size="lg" className="font-mono text-xs sm:text-sm uppercase tracking-wider">
              Launch Custom Quote Form
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
