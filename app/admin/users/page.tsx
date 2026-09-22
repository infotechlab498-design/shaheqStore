'use client';

import * as React from 'react';
import { Users, Shield, Search, UserCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { DEMO_ADMIN_USERS } from '@/lib/data/demo-admin-data';
import { formatDate } from '@/lib/utils/date';
import { UserRole } from '@/types/user';

export default function AdminUsersPage() {
  const [searchTerm, setSearchTerm] = React.useState('');

  const filtered = DEMO_ADMIN_USERS.filter((u) => {
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      return (
        u.name.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        u.role.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-200 pb-5">
        <div>
          <h1 className="text-2xl font-bold font-mono text-zinc-900">
            User Accounts & Staff RBAC Permissions
          </h1>
          <p className="text-xs font-mono text-zinc-500 mt-0.5">
            Role definitions across Super Admin, Shop Manager, CAD/Print Engineer, and Verified Customer tiers.
          </p>
        </div>
      </div>

      {/* User Table */}
      <div className="rounded-lg border border-zinc-200 bg-white overflow-hidden shadow-xs">
        <table className="w-full text-left font-mono text-xs divide-y divide-zinc-200">
          <thead className="bg-zinc-50 text-zinc-500 text-[11px]">
            <tr>
              <th className="p-3">User & Contact</th>
              <th className="p-3">Organization</th>
              <th className="p-3">Assigned Role</th>
              <th className="p-3">Status</th>
              <th className="p-3">Created</th>
              <th className="p-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100">
            {filtered.map((user) => (
              <tr key={user.id} className="hover:bg-zinc-50/80">
                <td className="p-3">
                  <div className="space-y-0.5">
                    <span className="font-bold text-zinc-900 block">{user.name}</span>
                    <span className="text-[10px] text-zinc-500">
                      {user.email} • {user.phone || 'No phone'}
                    </span>
                  </div>
                </td>
                <td className="p-3 text-zinc-700">{user.company || 'Private Account'}</td>
                <td className="p-3">
                  <Badge
                    variant={
                      user.role === UserRole.SUPER_ADMIN
                        ? 'tech'
                        : user.role === UserRole.CAD_PRINT_ENGINEER
                        ? 'warning'
                        : 'outline'
                    }
                    size="sm"
                  >
                    {user.role.replace(/_/g, ' ')}
                  </Badge>
                </td>
                <td className="p-3">
                  <span className="inline-flex items-center gap-1 text-emerald-600 font-bold text-[11px]">
                    <UserCheck className="h-3 w-3" />
                    Active
                  </span>
                </td>
                <td className="p-3 text-zinc-500 text-[11px]">{formatDate(user.createdAt)}</td>
                <td className="p-3 text-right">
                  <Button variant="outline" size="sm" className="h-7 text-[11px]">
                    Edit Permissions
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
