'use client';

import * as React from 'react';
import { usePathname } from 'next/navigation';
import { AdminRoleProvider } from '@/components/admin/admin-role-context';
import { AdminSidebar } from '@/components/admin/admin-sidebar';
import { AdminHeader } from '@/components/admin/admin-header';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  return (
    <AdminRoleProvider>
      <div className="min-h-screen flex bg-[#EAF2FF] text-slate-900">
        <AdminSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <AdminHeader />
          <main className="flex-1 p-6 sm:p-8 overflow-y-auto">
            {children}
          </main>
        </div>
      </div>
    </AdminRoleProvider>
  );
}
