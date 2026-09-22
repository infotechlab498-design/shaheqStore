'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';

export default function StoreError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="mx-auto max-w-xl px-4 py-20 text-center space-y-4">
      <p className="text-xs font-mono uppercase tracking-widest text-zinc-500">Storefront Error</p>
      <h1 className="text-2xl font-bold font-mono text-zinc-900">Unable to load this page</h1>
      <p className="text-sm text-zinc-500">
        Catalog or checkout data failed to render. Retry the request or continue shopping.
      </p>
      <div className="flex justify-center gap-3">
        <Button variant="primary" onClick={() => reset()} className="font-mono text-xs uppercase">
          Retry
        </Button>
        <Button
          variant="outline"
          onClick={() => {
            window.location.href = '/shop';
          }}
          className="font-mono text-xs uppercase"
        >
          Open catalog
        </Button>
      </div>
    </div>
  );
}
