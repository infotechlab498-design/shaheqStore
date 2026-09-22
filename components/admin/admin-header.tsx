'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Bell, Shield, Store, Menu } from 'lucide-react';
import { useAdminRole } from './admin-role-context';
import { Badge } from '@/components/ui/badge';

export function AdminHeader() {
  const pathname = usePathname();
  const { currentRole, roleConfig } = useAdminRole();

  const title = pathname.split('/').filter(Boolean)[1] || 'dashboard';

  return (
    <header className="h-16 border-b border-slate-200 bg-white px-6 flex items-center justify-between shrink-0">
      <div className="flex items-center gap-4">
        <span className="text-xs font-mono uppercase tracking-widest text-slate-500">
          Admin Console
        </span>
        <span className="text-slate-300">/</span>
        <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#073574]">
          {title.replace(/-/g, ' ')}
        </span>
      </div>

      <div className="flex items-center gap-4 font-mono text-xs">
        <div className="flex items-center gap-2">
          <Shield className="h-4 w-4 text-[#073574]" />
          <span className="text-slate-500 hidden sm:inline">Active Scope:</span>
          <Badge variant="tech" size="sm">
            {roleConfig.name}
          </Badge>
        </div>

        <Link
          href="/"
          className="rounded-md border border-slate-200 px-2.5 py-1 text-[#073574] hover:bg-[#EAF2FF] flex items-center gap-1.5 transition-colors"
        >
          <Store className="h-3.5 w-3.5 text-[#073574]" />
          <span className="hidden sm:inline">Storefront</span>
        </Link>
      </div>
    </header>
  );
}
