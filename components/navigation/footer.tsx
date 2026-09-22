import Link from 'next/link';
import { Box, ShieldCheck, MessageSquare } from 'lucide-react';
import { siteConfig } from '@/lib/config/site';

export function Footer() {
  const currentYear = 2026;

  return (
    <footer className="w-full bg-white text-slate-800 border-t border-slate-200 type-small">
      <div className="store-shell section-y">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          <div className="lg:col-span-2 space-y-3">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-7 h-7 rounded bg-[#073574] text-white flex items-center justify-center">
                <Box className="w-4 h-4 text-blue-200" />
              </div>
              <span className="font-extrabold type-card-title tracking-wider text-[#073574]">
                ALPHA TECH
              </span>
            </Link>
            <p className="type-small text-slate-600 max-w-sm">
              {siteConfig.description}
            </p>
            <div className="text-[11px] font-mono text-slate-500 bg-slate-50 p-2 rounded border border-slate-200 inline-block">
              HQ: Lahore, PK · {siteConfig.contact.operatingHours}
            </div>
            <div>
              <a
                href={`https://wa.me/${siteConfig.contact.whatsapp.replace(/\D/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded text-xs font-semibold"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                WhatsApp Direct Engineering Support
              </a>
            </div>
          </div>

          <div>
            <h4 className="type-footer-heading text-[#073574] mb-3">
              Technical Store
            </h4>
            <ul className="space-y-2 type-footer-link text-slate-600">
              <li>
                <Link href="/shop?category=drone-fpv" className="hover:text-[#073574]">
                  Drone & FPV
                </Link>
              </li>
              <li>
                <Link href="/shop?category=power-systems" className="hover:text-[#073574]">
                  LiPo & Power Systems
                </Link>
              </li>
              <li>
                <Link href="/shop?category=carbon-fiber" className="hover:text-[#073574]">
                  Carbon Fiber CNC Sheets
                </Link>
              </li>
              <li>
                <Link href="/shop?category=hardware-fasteners" className="hover:text-[#073574]">
                  Titanium Fasteners
                </Link>
              </li>
              <li>
                <Link href="/shop?category=robotics-actuators" className="hover:text-[#073574]">
                  Robotics & Actuators
                </Link>
              </li>
              <li>
                <Link href="/shop" className="text-[#073574] font-semibold">
                  View Full Catalog
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="type-footer-heading text-[#073574] mb-3">
              Engineering Services
            </h4>
            <ul className="space-y-2 type-footer-link text-slate-600">
              <li>
                <Link href="/services#3d-printing" className="hover:text-[#073574]">
                  On-Demand 3D Printing
                </Link>
              </li>
              <li>
                <Link href="/services#mechanical-cad" className="hover:text-[#073574]">
                  Mechanical Design & CAD
                </Link>
              </li>
              <li>
                <Link href="/services#reverse-engineering" className="hover:text-[#073574]">
                  Reverse Engineering
                </Link>
              </li>
              <li>
                <Link href="/services#jigs-fixtures" className="hover:text-[#073574]">
                  Tooling & Assembly Jigs
                </Link>
              </li>
              <li>
                <Link href="/quote" className="text-[#073574] font-semibold">
                  Request Custom Quote
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="type-footer-heading text-[#073574] mb-3">
              Support & Specs
            </h4>
            <ul className="space-y-2 type-footer-link text-slate-600">
              <li>
                <Link href="/shipping" className="hover:text-[#073574]">
                  Courier Shipping Policy
                </Link>
              </li>
              <li>
                <Link href="/refund" className="hover:text-[#073574]">
                  Returns & RMA Terms
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-[#073574]">
                  NDA & IP Protection
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-[#073574]">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/admin/login" className="text-slate-400 hover:text-slate-600">
                  Staff Console
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-slate-200 flex flex-col md:flex-row items-center justify-between gap-4 type-copyright text-slate-500">
          <p>© {currentYear} {siteConfig.legalName} All rights reserved.</p>
          <div className="flex flex-wrap items-center justify-center gap-3 font-mono text-[10px] text-slate-400">
            <span>BANK TRANSFER</span>
            <span>•</span>
            <span>JAZZCASH</span>
            <span>•</span>
            <span>EASYPAISA</span>
            <span>•</span>
            <span>CASH ON DELIVERY</span>
            <span>•</span>
            <span>VISA / MASTERCARD</span>
          </div>
          <div className="flex items-center gap-1.5 text-blue-700 font-mono text-[10px]">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Currency: {siteConfig.currency.code}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
