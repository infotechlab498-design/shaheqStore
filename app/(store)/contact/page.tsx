import { Mail, Phone, MapPin, MessageSquare, Clock } from 'lucide-react';
import { Breadcrumb } from '@/components/ui/breadcrumb';
import { siteConfig } from '@/lib/config/site';
import { WhatsAppButton } from '@/components/shared/whatsapp-button';
import { Button } from '@/components/ui/button';

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-10 space-y-10 font-sans">
      <Breadcrumb
        items={[
          { label: 'Home', href: '/' },
          { label: 'Contact Us' },
        ]}
      />

      <div className="border-b border-zinc-200 pb-6 space-y-2">
        <span className="text-xs font-mono uppercase tracking-widest text-amber-600">
          Support & Consultation
        </span>
        <h1 className="text-3xl sm:text-4xl font-bold font-mono text-zinc-900">
          Connect with Alpha Tech Engineers
        </h1>
        <p className="text-sm text-zinc-600 max-w-2xl leading-relaxed">
          Reach our Lahore facility directly for hardware inquiries, custom battery configurations, bulk pricing, or CAD project consultation.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Contact Info Cards */}
        <div className="space-y-4">
          <div className="p-5 rounded-lg border border-zinc-200 bg-white space-y-2">
            <div className="flex items-center gap-3">
              <Phone className="h-5 w-5 text-amber-600" />
              <h3 className="font-mono font-bold text-zinc-900 text-sm">Direct Phone & WhatsApp</h3>
            </div>
            <p className="text-xs text-zinc-600 font-mono pl-8">{siteConfig.contact.phone}</p>
            <p className="text-xs text-zinc-500 pl-8 font-sans">
              Mon – Sat: 09:00 to 18:00 (PKT)
            </p>
          </div>

          <div className="p-5 rounded-lg border border-zinc-200 bg-white space-y-2">
            <div className="flex items-center gap-3">
              <Mail className="h-5 w-5 text-amber-600" />
              <h3 className="font-mono font-bold text-zinc-900 text-sm">Official Inquiries</h3>
            </div>
            <p className="text-xs text-zinc-600 font-mono pl-8">{siteConfig.contact.email}</p>
            <p className="text-xs text-zinc-500 pl-8 font-sans">
              Sales, RFPs, and corporate vendor registration
            </p>
          </div>

          <div className="p-5 rounded-lg border border-zinc-200 bg-white space-y-2">
            <div className="flex items-center gap-3">
              <MapPin className="h-5 w-5 text-amber-600" />
              <h3 className="font-mono font-bold text-zinc-900 text-sm">Engineering & Dispatch Facility</h3>
            </div>
            <p className="text-xs text-zinc-600 font-sans pl-8">{siteConfig.contact.address}</p>
          </div>

          <div className="pt-2">
            <WhatsAppButton context="general" />
          </div>
        </div>

        {/* Rapid Message Form */}
        <div className="rounded-lg border border-zinc-200 bg-white p-6 shadow-xs space-y-4">
          <h3 className="font-mono text-sm font-bold uppercase tracking-wider text-zinc-900 border-b border-zinc-100 pb-3">
            Send a Technical Message
          </h3>

          <form className="space-y-3 font-mono text-xs">
            <div className="space-y-1">
              <label className="text-zinc-700">Full Name</label>
              <input
                type="text"
                placeholder="Hamza Tariq"
                className="w-full rounded-md border border-zinc-300 p-2 text-xs bg-white text-zinc-900 font-mono"
              />
            </div>

            <div className="space-y-1">
              <label className="text-zinc-700">Email Address</label>
              <input
                type="email"
                placeholder="hamza@example.pk"
                className="w-full rounded-md border border-zinc-300 p-2 text-xs bg-white text-zinc-900 font-mono"
              />
            </div>

            <div className="space-y-1">
              <label className="text-zinc-700">Message / Inquiry Details</label>
              <textarea
                rows={4}
                placeholder="Hardware model, questions about LiPo impedance or 3D printing tolerances..."
                className="w-full rounded-md border border-zinc-300 p-2 text-xs bg-white text-zinc-900 font-mono"
              />
            </div>

            <Button variant="accent" size="md" className="w-full font-mono text-xs uppercase tracking-wider">
              Send Message
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
