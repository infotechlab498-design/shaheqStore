'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';

export default function RootError({
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
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <p className="text-xs font-mono uppercase tracking-widest text-zinc-500">System Fault</p>
      <h1 className="mt-2 text-2xl font-bold font-mono text-zinc-900">Something went wrong</h1>
      <p className="mt-2 max-w-md text-sm text-zinc-500">
        The page failed to load. You can retry, or return to the storefront catalog.
      </p>
      <div className="mt-6 flex flex-col sm:flex-row gap-3">
        <Button variant="primary" onClick={() => reset()} className="font-mono text-xs uppercase">
          Try again
        </Button>
        <Button
          variant="outline"
          onClick={() => {
            window.location.href = '/';
          }}
          className="font-mono text-xs uppercase"
        >
          Back to store
        </Button>
      </div>
    </div>
  );
}
