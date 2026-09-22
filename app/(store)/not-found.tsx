import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function StoreNotFound() {
  return (
    <div className="mx-auto max-w-xl px-4 py-20 text-center space-y-4">
      <p className="text-xs font-mono uppercase tracking-widest text-zinc-500">404</p>
      <h1 className="text-2xl font-bold font-mono text-zinc-900">Page not found</h1>
      <p className="text-sm text-zinc-500">
        The hardware page or product slug you requested is not in the catalog.
      </p>
      <Link href="/shop">
        <Button variant="primary" className="font-mono text-xs uppercase">
          Browse catalog
        </Button>
      </Link>
    </div>
  );
}
