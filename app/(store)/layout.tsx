import * as React from 'react';
import { Suspense } from 'react';
import { Header } from '@/components/navigation/header';
import { Footer } from '@/components/navigation/footer';
import { WhatsAppButton } from '@/components/shared/whatsapp-button';
import { CartProvider } from '@/lib/stores/cart-store';
import { WishlistProvider } from '@/lib/stores/wishlist-store';
import { ProductService } from '@/lib/services/product.service';

export default async function StoreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const categories = await ProductService.getCategories();

  return (
    <CartProvider>
      <WishlistProvider>
        <div className="flex min-h-screen w-full flex-col bg-[#F8FAFC] text-[#10243E] selection:bg-[#073574] selection:text-white">
          <Suspense fallback={<div className="h-[7.5rem] bg-white border-b border-slate-200" />}>
            <Header categories={categories} />
          </Suspense>
          <main className="flex-1 w-full">{children}</main>
          <Footer />
          <WhatsAppButton variant="floating" />
        </div>
      </WishlistProvider>
    </CartProvider>
  );
}
