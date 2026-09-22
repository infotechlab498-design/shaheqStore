import { Truck, ShieldCheck, Clock, AlertTriangle } from 'lucide-react';
import { Breadcrumb } from '@/components/ui/breadcrumb';

export default function ShippingPolicyPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-10 space-y-8 font-sans">
      <Breadcrumb
        items={[
          { label: 'Home', href: '/' },
          { label: 'Shipping & Logistics' },
        ]}
      />

      <div className="border-b border-zinc-200 pb-4 space-y-2">
        <span className="text-xs font-mono uppercase tracking-widest text-amber-600">
          Overland Logistics & Dangerous Goods
        </span>
        <h1 className="text-3xl font-bold font-mono text-zinc-900">
          Shipping & Delivery Policy
        </h1>
        <p className="text-sm text-zinc-600">
          Protocol for delivering high-discharge lithium batteries, composite panels, and precision parts throughout Pakistan.
        </p>
      </div>

      <div className="space-y-6 text-sm text-zinc-600 leading-relaxed">
        <div className="space-y-2">
          <h2 className="text-lg font-bold font-mono text-zinc-900">1. Domestic Courier Network</h2>
          <p>
            Alpha Tech partners with established domestic logistics carriers including TCS, Leopard Courier, M&P, and Trax. Deliveries to major metropolitan hubs (Lahore, Karachi, Islamabad, Rawalpindi, Faisalabad) typically arrive within 24 to 48 hours following dispatch.
          </p>
        </div>

        <div className="space-y-2">
          <h2 className="text-lg font-bold font-mono text-zinc-900">2. Lithium Battery Transport Protocol</h2>
          <p>
            Due to hazardous goods classifications, Lithium Polymer (LiPo) batteries are packaged in flame-retardant sleeves and transported exclusively via overland road freight. Air transit for high-capacity LiPo packs is restricted under national aviation safety standards.
          </p>
        </div>

        <div className="space-y-2">
          <h2 className="text-lg font-bold font-mono text-zinc-900">3. Carbon Fiber & Composite Plate Handling</h2>
          <p>
            High-modulus carbon fiber plates are sealed in protective film and reinforced with corrugated rigid backing to prevent micro-fracturing or edge chipping during courier transit.
          </p>
        </div>

        <div className="space-y-2">
          <h2 className="text-lg font-bold font-mono text-zinc-900">4. Tracking & Delivery Inspection</h2>
          <p>
            Upon consignment handover, a tracking number is automatically dispatched via SMS and Email. Customers are advised to inspect outer packaging integrity prior to signing courier delivery dockets.
          </p>
        </div>
      </div>
    </div>
  );
}
