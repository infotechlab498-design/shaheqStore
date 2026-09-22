'use client';

import Link from 'next/link';
import { useMemo, useState, type ReactNode } from 'react';
import {
  ArrowRight,
  Bot,
  ChevronRight,
  CreditCard,
  FlaskConical,
  GraduationCap,
  Headphones,
  Layers,
  Plane,
  ShieldCheck,
  Truck,
  Box,
} from 'lucide-react';
import { Product, Category } from '@/types/product';
import { ServiceItem } from '@/types/common';
import { categoryStartingPrice, isNewArrival } from '@/lib/utils/product-display';
import { HomepageProductCard } from '@/components/storefront/homepage-product-card';
import { CatalogImage } from '@/components/shared/catalog-image';
import { QuickShop } from '@/components/storefront/homepage/quick-shop';
import { HeroSlider } from '@/components/storefront/homepage/hero-slider';
import { siteConfig } from '@/lib/config/site';

const CATEGORY_IMAGES: Record<string, string> = {
  'power-systems': 'https://picsum.photos/seed/power-systems-cat/800/800',
  'raw-materials': 'https://picsum.photos/seed/raw-materials-cat/800/800',
  'carbon-fiber': 'https://picsum.photos/seed/carbon-fiber-cat/800/800',
  'propulsion-fpv': 'https://picsum.photos/seed/propulsion-fpv-cat/800/800',
  'drone-fpv': 'https://picsum.photos/seed/drone-fpv-cat/800/800',
  'drone-components': 'https://picsum.photos/seed/drone-components-cat/800/800',
  'robotics-actuators': 'https://picsum.photos/seed/robotics-actuators-cat/800/800',
  'robotics-components': 'https://picsum.photos/seed/robotics-components-cat/800/800',
  'hardware-fasteners': 'https://picsum.photos/seed/hardware-fasteners-cat/800/800',
  'additive-materials': 'https://picsum.photos/seed/additive-materials-cat/800/800',
  'tooling-bench': 'https://picsum.photos/seed/tooling-bench-cat/800/800',
};

const PROMOS = [
  {
    tag: 'Save up to 20%',
    title: 'FPV Multi-Pack Deals',
    description: 'Order any bundle of 4+ 6S LiPo batteries and receive 20% off plus free TCS priority shipping.',
    href: '/shop?category=power-systems',
    cta: 'Shop Battery Bundles',
    theme: 'navy' as const,
  },
  {
    tag: 'Complimentary chamfer',
    title: 'Carbon Fiber Clearance',
    description: 'Selected 2.0mm and 3.0mm Toray prepreg plates now include free precision CNC edge chamfering on custom cuts.',
    href: '/shop?search=carbon',
    cta: 'Shop Plate Stock',
    theme: 'white' as const,
  },
  {
    tag: 'Hardware bundle −30%',
    title: 'Ti-6Al-4V Standoff Kits',
    description: 'Buy any racing drone frame and get 30% off any Grade 5 titanium modular fastener or knurled standoff kit.',
    href: '/shop?category=hardware-fasteners',
    cta: 'Explore Fastener Kits',
    theme: 'ice' as const,
  },
];

const APPLICATIONS = [
  {
    icon: Plane,
    title: 'FPV Drone Racing',
    description: 'High-C graphene packs, high-KV race motors, and ultralight carbon frames.',
    href: '/shop?search=fpv',
    cta: 'Explore Racing Hardware',
  },
  {
    icon: Bot,
    title: 'Robotics & Rovers',
    description: 'CAN-bus telemetry, precision magnetic encoders, and titanium chassis mountings.',
    href: '/shop?category=robotics-actuators',
    cta: 'Explore Robotics',
  },
  {
    icon: FlaskConical,
    title: 'Defense & R&D Labs',
    description: 'Aerospace composite stock, calibration certificates, and rapid-batch DFM verification.',
    href: '/services',
    cta: 'Explore Lab Services',
  },
  {
    icon: GraduationCap,
    title: 'University Engineering',
    description: 'Tax-exempt NTN billing, bulk student project kits, and custom mechanical assistance.',
    href: '/quote',
    cta: 'Explore Academic Hub',
  },
];

interface HomePageClientProps {
  products: Product[];
  categories: Category[];
  services: ServiceItem[];
}

export function HomePageClient({ products, categories, services }: HomePageClientProps) {
  const [query, setQuery] = useState('');

  const featured = useMemo(
    () => products.filter((p) => p.isFeatured).slice(0, 10),
    [products]
  );
  const newArrivals = useMemo(
    () => [...products].filter(isNewArrival).sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt)).slice(0, 4),
    [products]
  );

  const filteredCatalog = useMemo(() => {
    if (!query.trim()) return products;
    const q = query.toLowerCase();
    return products.filter((product) =>
      product.name.toLowerCase().includes(q) ||
      product.sku.toLowerCase().includes(q) ||
      product.category.name.toLowerCase().includes(q)
    );
  }, [products, query]);

  const displayCategories = categories.filter((c) => c.slug !== 'custom-cad-cnc');

  return (
    <div className="w-full bg-[#F8FAFC] text-[#10243E]">
      <HeroSlider
        products={products}
        catalogCount={products.length}
        categoryCount={displayCategories.length}
      />

      <section className="w-full section-y bg-[#F5F7FA] border-b border-slate-200">
        <div className="store-shell">
          <div className="flex items-end justify-between mb-6 gap-2">
            <div>
              <div className="type-eyebrow text-blue-700">Core classification</div>
              <h2 className="type-section text-[#073574] uppercase">Shop by category</h2>
            </div>
            <Link href="/shop" className="text-xs font-bold text-[#073574] inline-flex items-center gap-1">
              All Categories ({products.length}) <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="category-grid">
            {displayCategories.map((cat) => {
              const count = products.filter((p) => p.category.slug === cat.slug || p.categoryId === cat.id).length;
              const image = cat.image || CATEGORY_IMAGES[cat.slug] || `https://picsum.photos/seed/${cat.slug}/800/800`;
              return (
                <Link
                  key={cat.id}
                  href={`/shop?category=${cat.slug}`}
                  className="bg-white border border-slate-200 rounded-lg p-3 hover:border-[#073574] hover:shadow-md transition-all group flex flex-col justify-between"
                >
                  <div className="relative aspect-[4/3] w-full rounded bg-slate-100 overflow-hidden mb-3">
                    <CatalogImage src={image} seed={cat.slug} alt={cat.name} fill sizes="(max-width: 768px) 100vw, (max-width: 1536px) 25vw, 20vw" className="object-cover group-hover:scale-105 transition-transform duration-300" />
                    <div className="absolute top-2 left-2 bg-black/60 text-white text-[10px] font-semibold px-2 py-0.5 rounded">
                      {count} Items
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <h3 className="type-card-title text-[#073574]">{cat.name}</h3>
                    <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-[#073574]" />
                  </div>
                  <p className="type-small text-slate-500 mt-1 line-clamp-1">{cat.description}</p>
                  <div className="mt-3 pt-2 border-t border-slate-100 text-[11px] font-semibold text-blue-700">
                    {categoryStartingPrice(products, cat.id)}
                  </div>
                </Link>
              );
            })}
            <Link
              href="/quote"
              className="bg-white border border-slate-200 rounded-lg p-3 hover:border-[#073574] hover:shadow-md transition-all group flex flex-col justify-between"
            >
              <div className="relative aspect-[4/3] w-full rounded bg-[#073574] overflow-hidden mb-3 flex items-center justify-center text-white">
                <Layers className="w-10 h-10" />
                <div className="absolute top-2 right-2 bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded">
                  Fast DFM
                </div>
              </div>
              <h3 className="type-card-title text-[#073574]">Custom CAD & CNC</h3>
              <p className="type-small text-slate-500 mt-1">On-demand milling, SLS, and engineering quotes.</p>
              <div className="mt-3 pt-2 border-t border-slate-100 text-[11px] font-semibold text-blue-700">Instant DFM Quote</div>
            </Link>
          </div>
        </div>
      </section>

      <QuickShop products={products} />

      <section className="w-full section-y bg-[#F8FAFC] border-b border-slate-200">
        <div className="store-shell-wide promo-grid">
          {PROMOS.map((promo) => (
            <article
              key={promo.title}
              className={`rounded-2xl p-6 sm:p-7 flex flex-col ${
                promo.theme === 'navy'
                  ? 'bg-[#051C42] text-white'
                  : promo.theme === 'ice'
                    ? 'bg-[#EAF2FF] text-[#073574]'
                    : 'bg-white text-[#073574] border border-slate-200'
              }`}
            >
              <div className={`type-eyebrow ${
                promo.theme === 'navy' ? 'text-blue-200' : promo.theme === 'ice' ? 'text-emerald-700' : 'text-slate-500'
              }`}>
                {promo.tag}
              </div>
              <h3 className="type-promo-card mt-3">{promo.title}</h3>
              <p className={`type-small mt-3 flex-1 ${promo.theme === 'navy' ? 'text-blue-100' : 'text-slate-600'}`}>
                {promo.description}
              </p>
              <Link
                href={promo.href}
                className={`mt-6 inline-flex items-center justify-center gap-2 rounded-md px-4 py-2.5 type-button w-fit ${
                  promo.theme === 'navy'
                    ? 'bg-white text-[#073574] hover:bg-blue-50'
                    : 'bg-[#073574] text-white hover:bg-[#062A63]'
                }`}
              >
                {promo.cta} <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </article>
          ))}
        </div>
      </section>

      <section className="w-full section-y bg-white border-b border-slate-200">
        <div className="store-shell">
          <SectionHeading kicker="Verified components" title="Featured hardware" href="/shop" />
          <div className="product-grid">
            {featured.map((product) => (
              <HomepageProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      <section id="catalog-section" className="w-full section-y bg-[#F5F7FA] border-b border-slate-200">
        <div className="store-shell space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
            <SectionHeading kicker="Live catalog" title="Hardware in stock" href="/shop" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Filter by SKU, chemistry, or carbon thickness..."
              className="w-full sm:w-80 rounded-md border border-slate-300 bg-white px-3 py-2 text-xs"
            />
          </div>
          <div className="product-grid">
            {filteredCatalog.slice(0, 10).map((product) => (
              <HomepageProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {newArrivals.length > 0 && (
        <section className="w-full section-y bg-white border-b border-slate-200">
          <div className="store-shell">
            <SectionHeading kicker="Just landed" title="New arrivals" href="/shop" />
            <div className="product-grid">
              {newArrivals.map((product) => (
                <HomepageProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}

      {services.length > 0 && (
        <section className="w-full section-y bg-[#051C42] text-white border-b border-slate-800">
          <div className="store-shell grid grid-cols-1 lg:grid-cols-2" style={{ gap: 'var(--hero-gap)' }}>
            {services.slice(0, 2).map((service) => (
              <div key={service.id} className="rounded-xl border border-white/10 bg-white/5 p-6 space-y-3">
                <Box className="w-8 h-8 text-blue-200" />
                <h3 className="type-promo-card">{service.title}</h3>
                <p className="type-small text-blue-100">{service.shortDescription}</p>
                <ul className="text-xs text-blue-100 space-y-1">
                  {service.capabilities.slice(0, 3).map((cap) => (
                    <li key={cap}>• {cap}</li>
                  ))}
                </ul>
                <Link
                  href={`/quote?service=${service.slug}`}
                  className="inline-flex items-center gap-2 bg-white text-[#073574] px-4 py-2 rounded text-xs font-bold uppercase"
                >
                  Request quote <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            ))}
          </div>
        </section>
      )}

      <section className="w-full bg-white">
        <div className="store-shell section-y">
          <div className="type-eyebrow text-slate-400">Tailored workflows</div>
          <h2 className="type-section text-[#073574] uppercase mt-1">
            Shop by application
          </h2>
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4" style={{ gap: 'var(--category-gap)' }}>
            {APPLICATIONS.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.title} className="space-y-3">
                  <Icon className="w-7 h-7 text-[#073574]" strokeWidth={1.75} />
                  <h3 className="type-card-title text-[#073574]">{item.title}</h3>
                  <p className="type-small text-slate-500">{item.description}</p>
                  <Link href={item.href} className="inline-flex items-center gap-1 type-nav type-nav-active text-[#073574] hover:text-[#051C42]">
                    {item.cta} <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              );
            })}
          </div>
        </div>

        <div className="border-t border-slate-100 bg-[#F8FAFC]">
          <div className="store-shell py-8 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4" style={{ gap: 'var(--category-gap)' }}>
            <TrustCard
              icon={<ShieldCheck className="w-5 h-5" />}
              title="100% Genuine Specs"
              text="Every cell, plate, and fastener is batch-calibrated against factory test sheets."
            />
            <TrustCard
              icon={<CreditCard className="w-5 h-5" />}
              title="Secure Local Payments"
              text="Pay via 1Link IBFT, JazzCash, EasyPaisa, cash on delivery, or cards."
            />
            <TrustCard
              icon={<Truck className="w-5 h-5" />}
              title="TCS Priority Nationwide"
              text="Overnight dispatch from Islamabad and Karachi warehouse fulfillment hubs."
            />
            <TrustCard
              icon={<Headphones className="w-5 h-5" />}
              title="Direct WhatsApp Engineer"
              text={`Real drone engineers available on WhatsApp to check electrical compatibility. ${siteConfig.contact.phone}`}
            />
          </div>
        </div>
      </section>
    </div>
  );
}

function SectionHeading({ kicker, title, href }: { kicker: string; title: string; href: string }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 gap-2">
      <div>
        <div className="type-eyebrow text-blue-700">{kicker}</div>
        <h2 className="type-section text-[#073574] uppercase">{title}</h2>
      </div>
      <Link href={href} className="text-xs font-bold text-[#073574] inline-flex items-center gap-1">
        View catalog <ArrowRight className="w-3.5 h-3.5" />
      </Link>
    </div>
  );
}

function TrustCard({ icon, title, text }: { icon: ReactNode; title: string; text: string }) {
  return (
    <div className="flex gap-3">
      <div className="h-10 w-10 shrink-0 rounded-md bg-[#EAF2FF] text-[#073574] flex items-center justify-center">
        {icon}
      </div>
      <div>
        <h3 className="font-semibold text-[#073574] type-card-title">{title}</h3>
        <p className="type-small text-slate-500 mt-1">{text}</p>
      </div>
    </div>
  );
}
