'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import {
  ShoppingCart,
  ShoppingBag,
  Box,
  FileText,
  Phone,
  ShieldCheck,
  Heart,
  Layers,
  SlidersHorizontal,
  Search,
  User,
  Truck,
  Zap,
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
import { QuickShopCollection } from '@/lib/utils/catalog-collections';

const MOBILE_CATEGORY_CHIPS = [
  { label: 'ALL', href: '/shop' },
  { label: 'DRONES & FPV', href: '/shop?category=drone-fpv' },
  { label: 'POWER 6S', href: '/shop?category=power-systems' },
  { label: 'CARBON FIBER', href: '/shop?category=carbon-fiber' },
  { label: 'HARDWARE', href: '/shop?category=hardware-fasteners' },
  { label: 'ROBOTICS', href: '/shop?category=robotics-actuators' },
];

const MOBILE_QUICK_CHIPS: { id: QuickShopCollection; label: string; icon?: 'zap' }[] = [
  { id: 'all', label: 'All Components' },
  { id: '6s-batteries', label: '6S LiPo', icon: 'zap' },
  { id: 'carbon-fiber', label: 'Carbon Fiber' },
  { id: 'hardware-fasteners', label: 'Fasteners' },
  { id: 'fpv-propulsion', label: 'FPV' },
];

function whatsappHref(message?: string): string {
  const phone = siteConfig.contact.whatsapp.replace(/\D/g, '');
  const text = message ? `?text=${encodeURIComponent(message)}` : '';
  return `https://wa.me/${phone}${text}`;
}

function compactThreshold(value: number): string {
  if (value >= 1000) return `Rs. ${Math.round(value / 1000)}K`;
  return formatPKR(value);
}

export function Header({ categories = [] }: { categories?: Category[] }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { itemCount, subtotal, setMiniCartOpen } = useCart();
  const { count: savedCount, setOpen: setSavedOpen } = useWishlist();

  const catalogCategories = categories.filter((category) => category.slug !== 'custom-cad-cnc');
  const navCategories = catalogCategories.slice(0, 7);

  const activeCategory = searchParams.get('category');
  const shopAllActive = pathname === '/shop' && !activeCategory;
  const activeQuick = (searchParams.get('qs') as QuickShopCollection) || 'all';
  const freeShip = compactThreshold(siteConfig.shipping.freeShippingThreshold);

  const focusMobileSearch = () => {
    document.getElementById('mobile-store-search')?.focus();
  };

  const quickHref = (id: QuickShopCollection) => {
    if (pathname === '/') return `/?qs=${id}`;
    if (id === 'all') return '/shop';
    if (id === '6s-batteries') return '/shop?search=6S';
    if (id === 'carbon-fiber') return '/shop?category=carbon-fiber';
    if (id === 'hardware-fasteners') return '/shop?category=hardware-fasteners';
    if (id === 'fpv-propulsion') return '/shop?category=drone-fpv';
    return '/shop';
  };

  const chipActive = (href: string) => {
    if (href === '/shop') return shopAllActive || pathname === '/';
    return href.includes(`category=${activeCategory}`) && pathname === '/shop';
  };

  return (
    <>
      <div className="md:hidden bg-[#F4F7FB]">
        <div className="bg-[#051C42] text-white">
          <div className="px-3 py-1.5 flex items-center justify-between text-[10px] font-bold tracking-wide uppercase">
            <span className="inline-flex items-center gap-1.5">
              <Truck className="w-3.5 h-3.5 text-sky-300" />
              TCS Express Free &gt; {freeShip}
            </span>
            <span className="text-sky-200">ISO-9001 Metrics</span>
          </div>
        </div>

        <div className="sticky top-0 z-40 bg-[#F4F7FB]/95 backdrop-blur-md">
          <div className="px-3 pt-2.5 pb-2 flex items-center gap-2">
            <Link href="/" className="flex items-center gap-2 min-w-0 flex-1">
              <div className="w-8 h-8 rounded-md bg-[#073574] text-white flex items-center justify-center shrink-0">
                <Box className="w-4 h-4 text-blue-200" />
              </div>
              <div className="min-w-0">
                <div className="text-[13px] font-extrabold tracking-wide text-[#073574] leading-none">
                  ALPHATECH
                </div>
                <div className="text-[8px] font-bold uppercase tracking-[0.14em] text-slate-500 mt-0.5 truncate">
                  Engineering & Hardware
                </div>
              </div>
            </Link>
            <button
              type="button"
              onClick={focusMobileSearch}
              className="h-9 w-9 rounded-full text-slate-600 flex items-center justify-center"
              aria-label="Search catalog"
            >
              <Search className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={() => setSavedOpen(true)}
              className="relative h-9 w-9 rounded-full text-slate-600 flex items-center justify-center"
              aria-label="Saved items"
            >
              <Heart className="w-5 h-5" />
              {savedCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 min-w-4 h-4 px-1 rounded-full bg-blue-600 text-white text-[9px] font-bold flex items-center justify-center">
                  {savedCount}
                </span>
              )}
            </button>
            <button
              type="button"
              onClick={() => setMiniCartOpen(true)}
              className="relative h-9 w-9 rounded-full text-slate-700 flex items-center justify-center"
              aria-label="Shopping cart"
            >
              <ShoppingBag className="w-5 h-5" />
              {itemCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 min-w-4 h-4 px-1 rounded-full bg-blue-600 text-white text-[9px] font-bold flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </button>
            <Link
              href="/account"
              className="h-9 w-9 rounded-full bg-[#073574] text-white flex items-center justify-center"
              aria-label="Account"
            >
              <User className="w-4 h-4" />
            </Link>
          </div>

          <div className="px-3 pb-2 flex gap-1.5 overflow-x-auto no-scrollbar">
            {MOBILE_CATEGORY_CHIPS.map((chip) => (
              <Link
                key={chip.href}
                href={chip.href}
                className={cn(
                  'shrink-0 px-3 py-1.5 rounded-full text-[10px] font-bold tracking-wide',
                  chipActive(chip.href)
                    ? 'bg-[#073574] text-white'
                    : 'bg-[#E8EEF8] text-slate-600'
                )}
              >
                {chip.label}
              </Link>
            ))}
          </div>

          <div className="px-3 pb-2">
            <ProductSearch
              categories={catalogCategories}
              variant="mobile"
              inputId="mobile-store-search"
            />
          </div>

          <div className="px-3 pb-3 flex gap-1.5 overflow-x-auto no-scrollbar">
            {MOBILE_QUICK_CHIPS.map((chip) => (
              <Link
                key={chip.id}
                href={quickHref(chip.id)}
                className={cn(
                  'shrink-0 inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-[11px] font-semibold',
                  (pathname === '/' ? activeQuick === chip.id : false) || (pathname !== '/' && chip.id === 'all' && shopAllActive)
                    ? 'bg-[#073574] text-white'
                    : 'bg-white text-slate-600 border border-slate-200'
                )}
              >
                {chip.icon === 'zap' && <Zap className="w-3 h-3" />}
                {chip.label}
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className="hidden md:block">
        <div className="w-full bg-[#051C42] text-slate-300 text-[11px] border-b border-blue-950/60 tracking-tight">
          <div className="store-shell py-1.5 flex flex-wrap items-center justify-between gap-y-1 gap-x-2">
            <div className="flex items-center gap-4 flex-wrap">
              <a
                href={whatsappHref('Need tech support from Alpha Tech')}
                className="flex items-center gap-1.5 text-white/90 hover:text-white"
              >
                <Phone className="w-3.5 h-3.5 text-blue-400" />
                <span>
                  Tech Support & WhatsApp:{' '}
                  <strong className="text-white">{siteConfig.contact.phone}</strong>
                </span>
              </a>
              <span className="hidden md:inline-block text-slate-500">•</span>
              <span className="hidden md:flex items-center gap-1 text-slate-300">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                Secure STEP / CAD NDA Processing
              </span>
              <span className="hidden lg:inline-block text-slate-500">•</span>
              <span className="hidden lg:inline-block text-slate-300">
                Fast Nationwide Shipping Across Pakistan
              </span>
              <span className="hidden xl:inline-block text-slate-500">•</span>
              <span className="hidden xl:inline-block text-blue-300 font-medium">
                ISO 9001:2015 PRECISION HUB
              </span>
            </div>

            <div className="flex items-center gap-3 text-slate-300">
              <span className="hidden sm:inline bg-blue-900/50 text-blue-200 px-2 py-0.5 rounded text-[10px] font-semibold border border-blue-700/40">
                Free shipping over {formatPKR(siteConfig.shipping.freeShippingThreshold)}
              </span>
              <span className="text-emerald-400 font-medium flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                READY TO SHIP
              </span>
              <span className="hidden sm:inline text-slate-400">Order before 4:00 PM PKT</span>
              <div className="border-l border-slate-700 pl-2 text-slate-200 font-mono text-[11px]">
                {siteConfig.currency.code} (Rs.)
              </div>
            </div>
          </div>
        </div>

        <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-xs">
          <div className="store-shell py-3 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Link href="/" className="flex items-center gap-2.5 group">
                <div className="w-9 h-9 rounded bg-[#073574] text-white flex items-center justify-center shadow-sm group-hover:bg-[#0B3B82] transition-colors">
                  <Box className="w-5 h-5 text-blue-200" />
                </div>
                <div className="flex flex-col">
                  <span className="font-extrabold text-lg tracking-wider text-[#073574] leading-none">
                    ALPHA TECH
                  </span>
                  <span className="text-[10px] uppercase font-bold tracking-widest text-slate-500 mt-0.5">
                    Hardware & CAD
                  </span>
                </div>
              </Link>
            </div>

            <div className="flex-1 max-w-2xl hidden md:flex items-center min-w-0">
              <ProductSearch categories={catalogCategories} />
            </div>

            <div className="flex items-center gap-3">
              <a
                href={whatsappHref('Need a live engineer on the Alpha Tech line')}
                className="hidden xl:flex items-center gap-2 border-r border-slate-200 pr-3"
              >
                <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <Phone className="w-4 h-4" />
                </div>
                <div className="text-left text-xs">
                  <div className="text-[10px] text-slate-500 font-semibold uppercase">Live tech line</div>
                  <div className="font-bold text-[#073574] text-xs">{siteConfig.contact.phone}</div>
                </div>
              </a>

              <Link
                href="/quote"
                className="hidden sm:inline-flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-[#073574] px-3 py-2 rounded-md text-xs font-bold transition-colors border border-slate-200"
              >
                <FileText className="w-3.5 h-3.5 text-blue-600" />
                Get a Custom Quote
              </Link>

              <button
                type="button"
                onClick={() => setSavedOpen(true)}
                className="p-2 rounded-md hover:bg-slate-100 text-slate-700 relative transition-colors"
                title="Saved items"
                aria-label="Wishlist"
              >
                <Heart className="w-5 h-5 text-slate-600" />
                {savedCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-600 text-white rounded-full text-[10px] font-bold w-4 h-4 flex items-center justify-center">
                    {savedCount}
                  </span>
                )}
              </button>

              <button
                type="button"
                onClick={() => setMiniCartOpen(true)}
                className="flex items-center gap-2 bg-[#073574] hover:bg-[#062A63] text-white px-3 py-2 rounded-md transition-colors shadow-xs"
                aria-label="Open cart"
              >
                <div className="relative">
                  <ShoppingCart className="w-4 h-4" />
                  {itemCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-emerald-500 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                      {itemCount}
                    </span>
                  )}
                </div>
                <div className="hidden sm:flex flex-col text-left leading-tight">
                  <span className="text-[10px] text-blue-200 font-medium">{itemCount} items</span>
                  <span className="text-xs font-bold">{formatPKR(subtotal)}</span>
                </div>
              </button>
            </div>
          </div>
        </header>

        <nav className="w-full bg-[#073574] text-white text-xs border-b border-[#05244E] hidden md:block">
          <div className="store-shell flex items-center justify-between overflow-x-auto no-scrollbar py-0.5">
            <div className="flex items-center space-x-1 whitespace-nowrap">
              <Link
                href="/shop"
                className={cn(
                  'px-3 py-2 font-bold tracking-tight rounded-xs flex items-center gap-1.5 transition-colors',
                  shopAllActive
                    ? 'bg-[#05244E] text-white'
                    : 'text-slate-200 hover:bg-white/10'
                )}
              >
                <SlidersHorizontal className="w-3.5 h-3.5 text-blue-300" />
                All Catalog
              </Link>
              {navCategories.map((category) => (
                <Link
                  key={category.id}
                  href={`/shop?category=${category.slug}`}
                  className={cn(
                    'px-3 py-2 font-medium tracking-tight rounded-xs transition-colors',
                    pathname === '/shop' && activeCategory === category.slug
                      ? 'bg-[#05244E] text-white font-bold'
                      : 'text-slate-200 hover:bg-white/10'
                  )}
                >
                  {category.name}
                </Link>
              ))}
              <Link
                href="/quote"
                className="px-3 py-2 text-blue-200 font-semibold hover:bg-white/10 flex items-center gap-1"
              >
                <Layers className="w-3.5 h-3.5" />
                CAD & DFM Hub
              </Link>
            </div>
            <div className="text-[11px] text-blue-200 font-mono tracking-tight shrink-0 pl-3">
              TOLERANCE: ±0.01mm
            </div>
          </div>
        </nav>
      </div>

      <MiniCart />
      <MiniSaved />
    </>
  );
}
