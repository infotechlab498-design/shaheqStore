'use client';

import * as React from 'react';
import { ShieldCheck, UserCheck, FileCode2, Package, Search } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { DEMO_ADMIN_AUDIT_LOGS } from '@/lib/data/demo-admin-data';
import { formatDate } from '@/lib/utils/date';

export default function AdminAuditLogsPage() {
  return (
    <div className="space-y-6 font-mono text-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-200 pb-5">
        <div>
          <h1 className="text-2xl font-bold font-mono text-zinc-900">
            Security & Audit Activity Logs
          </h1>
          <p className="text-xs font-mono text-zinc-500 mt-0.5">
            Immutable log of CAD downloads, inventory adjustments, and status transitions for compliance.
          </p>
        </div>
      </div>

      <div className="rounded-lg border border-zinc-200 bg-white overflow-hidden shadow-xs">
        <table className="w-full text-left font-mono text-xs divide-y divide-zinc-200">
          <thead className="bg-zinc-50 text-zinc-500 text-[11px]">
            <tr>
              <th className="p-3">Timestamp</th>
              <th className="p-3">Staff Operator</th>
              <th className="p-3">Action Type</th>
              <th className="p-3">Target Entity</th>
              <th className="p-3">Audit Details</th>
              <th className="p-3 text-right">IP Address</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100">
            {DEMO_ADMIN_AUDIT_LOGS.map((log) => (
              <tr key={log.id} className="hover:bg-zinc-50/80">
                <td className="p-3 text-zinc-500 text-[11px]">{formatDate(log.createdAt)}</td>
                <td className="p-3 font-bold text-zinc-900">{log.userName}</td>
                <td className="p-3">
                  <Badge
                    variant={
                      log.action.includes('DOWNLOAD')
                        ? 'warning'
                        : log.action.includes('DISPATCH')
                        ? 'tech'
                        : 'outline'
                    }
                    size="sm"
                  >
                    {log.action}
                  </Badge>
                </td>
                <td className="p-3 text-zinc-700">
                  {log.entityType}: {log.entityId}
                </td>
                <td className="p-3 text-zinc-600 font-sans text-xs max-w-md truncate">
                  {JSON.stringify(log.details)}
                </td>
                <td className="p-3 text-zinc-500 text-[11px] text-right">{log.ipAddress}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
