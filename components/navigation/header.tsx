'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Menu,
  X,
  ShoppingCart,
  User,
  Box,
  FileText,
  Phone,
  ShieldCheck,
  Truck,
  Heart,
  ChevronDown,
  PackageSearch,
  MessageSquare,
  Percent,
} from 'lucide-react';
import { siteConfig } from '@/lib/config/site';
import { cn } from '@/lib/utils';
import { formatPKR } from '@/lib/utils/currency';
import { useCart } from '@/lib/stores/cart-store';
import { useWishlist } from '@/lib/stores/wishlist-store';
import { MiniCart } from '@/components/storefront/mini-cart';
import { MiniSaved } from '@/components/storefront/mini-saved';
import { ProductSearch } from '@/components/storefront/product-search';
import { Category } from '@/types/product';

const PRIMARY_LINKS = [
  { label: 'Shop', href: '/shop' },
  { label: 'Engineering Services', href: '/services' },
  { label: '3D Printing', href: '/services#3d-printing' },
  { label: 'CAD & Design', href: '/services#mechanical-cad' },
  { label: 'About', href: '/about' },
];

const CATEGORY_BAR = [
  { label: 'Shop All', href: '/shop' },
  { label: 'Drone & FPV', href: '/shop?category=drone-fpv' },
  { label: 'Power Systems', href: '/shop?category=power-systems' },
  { label: 'Carbon Fiber', href: '/shop?category=carbon-fiber' },
  { label: 'Hardware & Fasteners', href: '/shop?category=hardware-fasteners' },
  { label: 'Robotics & Actuators', href: '/shop?category=robotics-actuators' },
  { label: '3D Printing', href: '/services#3d-printing' },
  { label: 'CAD & Engineering', href: '/quote' },
];

function whatsappHref(message?: string): string {
  const phone = siteConfig.contact.whatsapp.replace(/\D/g, '');
  const text = message ? `?text=${encodeURIComponent(message)}` : '';
  return `https://wa.me/${phone}${text}`;
}

export function Header({ categories = [] }: { categories?: Category[] }) {
  const pathname = usePathname();
  const { itemCount, subtotal, setMiniCartOpen } = useCart();
  const { count: savedCount, setOpen: setSavedOpen } = useWishlist();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [categoriesOpen, setCategoriesOpen] = React.useState(false);
  const categoryMenuRef = React.useRef<HTMLDivElement>(null);

  const catalogCategories = categories.filter((category) => category.slug !== 'custom-cad-cnc');

  const [prevPathname, setPrevPathname] = React.useState(pathname);
  if (prevPathname !== pathname) {
    setPrevPathname(pathname);
    setMobileMenuOpen(false);
    setCategoriesOpen(false);
  }

  React.useEffect(() => {
    const onClick = (event: MouseEvent) => {
      if (categoryMenuRef.current && !categoryMenuRef.current.contains(event.target as Node)) {
        setCategoriesOpen(false);
      }
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  const isActive = (href: string) => {
    const path = href.split('#')[0];
    return pathname === path || (path !== '/' && pathname.startsWith(path));
  };

  return (
    <>
      <div className="w-full bg-[#051C42] text-slate-300 type-tiny border-b border-blue-950/60">
        <div className="store-shell py-1.5 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-3 flex-wrap">
            <a href={whatsappHref('Need tech support from Alpha Tech')} className="inline-flex items-center gap-1.5 text-white/90 hover:text-white">
              <Phone className="w-3.5 h-3.5 text-blue-400" />
              Tech Support & WhatsApp: <strong className="text-white">{siteConfig.contact.phone}</strong>
            </a>
            <span className="hidden md:inline text-slate-500">•</span>
            <span className="hidden md:inline-flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              Secure STEP / CAD NDA Processing
            </span>
            <span className="hidden lg:inline text-slate-500">•</span>
            <span className="hidden lg:inline">Fast Nationwide Shipping Across Pakistan</span>
            <span className="hidden xl:inline text-slate-500">•</span>
            <span className="hidden xl:inline text-blue-300 font-medium">ISO 9001:2015 PRECISION HUB</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden sm:inline bg-blue-900/50 text-blue-200 px-2 py-0.5 rounded text-[10px] font-semibold border border-blue-700/40">
              Free shipping over {formatPKR(siteConfig.shipping.freeShippingThreshold)}
            </span>
            <span className="text-emerald-400 font-medium inline-flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Ready to ship
            </span>
            <span className="hidden sm:inline font-mono text-slate-200">{siteConfig.currency.code}</span>
          </div>
        </div>
      </div>

      <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
        <div className="store-shell">
          <div className="flex h-[4.25rem] items-center gap-3">
            <button
              type="button"
              onClick={() => setMobileMenuOpen((open) => !open)}
              className="lg:hidden p-2 rounded-md text-slate-700 hover:bg-slate-100"
              aria-label="Open menu"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>

            <Link href="/" className="flex items-center gap-2.5 shrink-0">
              <div className="w-9 h-9 rounded bg-[#073574] text-white flex items-center justify-center">
                <Box className="w-5 h-5 text-blue-200" />
              </div>
              <div className="hidden xs:flex flex-col sm:flex">
                <span className="font-extrabold type-card-title tracking-wider text-[#073574] leading-none">ALPHA TECH</span>
                <span className="type-tiny uppercase font-semibold tracking-widest text-slate-500">Hardware & CAD</span>
              </div>
            </Link>

            <nav className="hidden xl:flex items-center gap-1">
              <div className="relative" ref={categoryMenuRef}>
                <button
                  type="button"
                  onClick={() => setCategoriesOpen((open) => !open)}
                  className="inline-flex items-center gap-1 px-2.5 py-1.5 type-nav text-slate-700 hover:bg-slate-50 rounded-md"
                >
                  Categories
                  <ChevronDown className={cn('w-3.5 h-3.5 transition', categoriesOpen && 'rotate-180')} />
                </button>
                {categoriesOpen && (
                  <div className="absolute left-0 top-full mt-1 w-72 rounded-lg border border-slate-200 bg-white shadow-xl p-2 z-50">
                    <Link
                      href="/shop"
                      onClick={() => setCategoriesOpen(false)}
                      className="block px-3 py-2 type-nav text-[#073574] hover:bg-slate-50 rounded-md"
                    >
                      All categories
                    </Link>
                    {catalogCategories.map((category) => (
                      <Link
                        key={category.id}
                        href={`/shop?category=${category.slug}`}
                        onClick={() => setCategoriesOpen(false)}
                        className="block px-3 py-2 type-nav text-slate-700 hover:bg-slate-50 rounded-md"
                      >
                        {category.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
              {PRIMARY_LINKS.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'px-2.5 py-1.5 type-nav rounded-md whitespace-nowrap',
                    isActive(item.href) ? 'bg-[#EAF2FF] text-[#073574] type-nav-active' : 'text-slate-700 hover:bg-slate-50'
                  )}
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            <div className="hidden md:flex flex-1 min-w-0 max-w-2xl xl:max-w-3xl 2xl:max-w-4xl">
              <ProductSearch categories={catalogCategories} />
            </div>

            <div className="ml-auto flex items-center gap-1.5 sm:gap-2">
              <Link
                href="/quote"
                className="hidden lg:inline-flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-[#073574] px-3 py-2 rounded-md type-button border border-slate-200"
              >
                <FileText className="w-3.5 h-3.5 text-blue-600" />
                Get a Custom Quote
              </Link>
              <Link href="/account" className="hidden sm:flex flex-col items-center justify-center h-10 px-2 rounded-md text-slate-600 hover:bg-slate-100" aria-label="Account">
                <User className="h-4 w-4" />
                <span className="text-[10px] font-semibold">Account</span>
              </Link>
              <button
                type="button"
                onClick={() => setSavedOpen(true)}
                className="relative hidden sm:flex flex-col items-center justify-center h-10 px-2 rounded-md text-slate-600 hover:bg-slate-100"
                aria-label="Saved items"
              >
                <Heart className="h-4 w-4" />
                <span className="text-[10px] font-semibold">Saved</span>
                {savedCount > 0 && (
                  <span className="absolute -top-0.5 right-1 bg-rose-600 text-white rounded-full text-[10px] font-bold min-w-4 h-4 px-1 flex items-center justify-center">
                    {savedCount}
                  </span>
                )}
              </button>
              <button
                type="button"
                onClick={() => setMiniCartOpen(true)}
                className="relative flex h-10 items-center gap-1.5 px-2.5 sm:px-3 rounded-md bg-[#073574] text-white hover:bg-[#062A63]"
                aria-label="Shopping cart"
              >
                <ShoppingCart className="h-4 w-4" />
                <span className="hidden sm:flex flex-col items-start leading-none">
                  <span className="text-[10px] text-blue-200">Cart ({itemCount})</span>
                  <span className="text-xs font-bold">{formatPKR(subtotal)}</span>
                </span>
                <span className="sm:hidden flex h-4 min-w-4 items-center justify-center rounded-full bg-emerald-500 px-1 text-[10px] font-bold">
                  {itemCount}
                </span>
              </button>
            </div>
          </div>
        </div>

        <div className="w-full bg-[#073574] text-white type-tiny hidden md:block">
          <div className="store-shell h-8 flex items-center justify-between gap-4">
            <span className="inline-flex items-center gap-1.5 font-medium">
              <Truck className="w-3.5 h-3.5 text-blue-200" />
              Free shipping on orders over {formatPKR(siteConfig.shipping.freeShippingThreshold)} nationwide
            </span>
            <div className="flex items-center gap-4">
              <Link href="/account/orders" className="inline-flex items-center gap-1 hover:text-blue-100">
                <PackageSearch className="w-3.5 h-3.5" />
                Track order
              </Link>
              <Link href="/contact" className="hover:text-blue-100">Support</Link>
              <a href={whatsappHref()} className="inline-flex items-center gap-1 hover:text-blue-100">
                <MessageSquare className="w-3.5 h-3.5" />
                WhatsApp: {siteConfig.contact.phone}
              </a>
              <span className="font-mono text-blue-100">{siteConfig.currency.code} / Pakistan</span>
            </div>
          </div>
        </div>

        <nav className="w-full hidden lg:block border-t border-slate-100">
          <div className="store-shell flex items-center gap-1 overflow-x-auto no-scrollbar py-1.5">
            {CATEGORY_BAR.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'px-3 py-1.5 type-nav rounded-md whitespace-nowrap',
                  isActive(item.href) ? 'bg-[#EAF2FF] text-[#073574] type-nav-active' : 'text-slate-700 hover:bg-slate-50'
                )}
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="/shop?deals=1"
              className="ml-auto inline-flex items-center gap-1 px-3 py-1.5 type-nav type-nav-active rounded-md text-rose-600 bg-rose-50 hover:bg-rose-100 whitespace-nowrap"
            >
              <Percent className="w-3.5 h-3.5" />
              Deals -20%
            </Link>
          </div>
        </nav>

        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-slate-200 bg-white px-4 py-3 space-y-3">
            <ProductSearch categories={catalogCategories} compact onNavigate={() => setMobileMenuOpen(false)} />
            {PRIMARY_LINKS.map((item) => (
              <Link key={item.href} href={item.href} className="block px-2 py-2 text-sm font-medium text-slate-700">
                {item.label}
              </Link>
            ))}
            <div className="grid grid-cols-2 gap-2 pt-1">
              {CATEGORY_BAR.map((item) => (
                <Link key={item.href} href={item.href} className="px-2 py-2 text-xs font-semibold text-slate-600 bg-slate-50 rounded">
                  {item.label}
                </Link>
              ))}
            </div>
            <div className="flex gap-2 pt-1">
              <Link href="/account" className="flex-1 text-center border border-slate-200 rounded-md py-2 text-xs font-bold">Account</Link>
              <Link href="/saved" className="flex-1 text-center border border-slate-200 rounded-md py-2 text-xs font-bold">Saved</Link>
              <Link href="/quote" className="flex-1 text-center bg-[#073574] text-white rounded-md py-2 text-xs font-bold">Quote CAD</Link>
            </div>
          </div>
        )}
      </header>
      <MiniCart />
      <MiniSaved />
    </>
  );
}
