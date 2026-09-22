'use client';

import * as React from 'react';
import Link from 'next/link';
import { Search, FileCode2, Lock, Eye, CheckCircle2, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { DEMO_ADMIN_QUOTES } from '@/lib/data/demo-admin-data';
import { formatPKR } from '@/lib/utils/currency';
import { formatDate } from '@/lib/utils/date';
import { QuoteStatus } from '@/types/quote';

export default function AdminQuotesPage() {
  const [searchTerm, setSearchTerm] = React.useState('');
  const [selectedStatus, setSelectedStatus] = React.useState('all');
  const [quotes, setQuotes] = React.useState(DEMO_ADMIN_QUOTES);

  React.useEffect(() => {
    fetch('/api/quotes')
      .then((res) => res.json())
      .then((json) => {
        if (json.success && Array.isArray(json.data) && json.data.length > 0) {
          const mapped = json.data.map((q: any) => ({
            id: q.id,
            quoteNumber: q.quoteNumber,
            customerName: q.customerName,
            customerEmail: q.customerEmail,
            companyName: q.companyName || undefined,
            serviceType: q.serviceType,
            status: q.status,
            filesCount: Array.isArray(q.files) ? q.files.length : (q.filesCount || 1),
            ndaRequested: Boolean(q.ndaRequested),
            ndaStatus: q.ndaStatus || (q.ndaRequested ? 'SIGNED' : 'NONE'),
            quotedAmount: q.quotedPrice || q.quotedAmount || undefined,
            assignedEngineer: q.assignedEngineer || 'Unassigned',
            createdAt: q.createdAt || new Date().toISOString(),
          }));
          setQuotes(mapped);
        }
      })
      .catch(() => {
        // Keep demo quotes fallback
      });
  }, []);

  const filtered = quotes.filter((q) => {
    if (selectedStatus !== 'all' && q.status !== selectedStatus) return false;
    if (searchTerm.trim()) {
      const s = searchTerm.toLowerCase();
      return (
        q.quoteNumber.toLowerCase().includes(s) ||
        q.customerName.toLowerCase().includes(s) ||
        (q.companyName && q.companyName.toLowerCase().includes(s)) ||
        q.serviceType.toLowerCase().includes(s)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-200 pb-5">
        <div>
          <h1 className="text-2xl font-bold font-mono text-zinc-900">
            CAD Review & Engineering Slicing Queue
          </h1>
          <p className="text-xs font-mono text-zinc-500 mt-0.5">
            DFM evaluation workspace for custom 3D printing, CAD modeling, and tooling quotes.
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-xs">
        <div className="w-full sm:w-80">
          <Input
            placeholder="Search quote #, client, company..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="text-xs h-9"
            leftIcon={<Search className="h-3.5 w-3.5" />}
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="rounded-md border border-zinc-300 bg-white px-3 py-1.5 text-xs text-zinc-700"
          >
            <option value="all">All Quote Statuses</option>
            <option value={QuoteStatus.NEW_REQUEST}>New Request</option>
            <option value={QuoteStatus.UNDER_REVIEW}>Under DFM Review</option>
            <option value={QuoteStatus.QUOTED}>Quoted (Sent to Client)</option>
            <option value={QuoteStatus.ACCEPTED}>Accepted by Client</option>
            <option value={QuoteStatus.REJECTED}>Rejected</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-lg border border-zinc-200 bg-white overflow-hidden shadow-xs">
        <table className="w-full text-left font-mono text-xs divide-y divide-zinc-200">
          <thead className="bg-zinc-50 text-zinc-500 text-[11px]">
            <tr>
              <th className="p-3">Quote #</th>
              <th className="p-3">Date</th>
              <th className="p-3">Client & Company</th>
              <th className="p-3">Service Scope</th>
              <th className="p-3">Files / NDA</th>
              <th className="p-3">Quoted Price</th>
              <th className="p-3">Status</th>
              <th className="p-3">Assigned Lead</th>
              <th className="p-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100">
            {filtered.map((q) => (
              <tr key={q.id} className="hover:bg-zinc-50/80 transition-colors">
                <td className="p-3 font-bold text-zinc-900">{q.quoteNumber}</td>
                <td className="p-3 text-zinc-500 text-[11px]">{formatDate(q.createdAt)}</td>
                <td className="p-3">
                  <span className="font-semibold text-zinc-900 block">{q.customerName}</span>
                  <span className="text-[10px] text-zinc-500">{q.companyName || 'Individual'}</span>
                </td>
                <td className="p-3">
                  <span className="text-zinc-800 font-semibold block">{q.serviceType}</span>
                  <span className="text-[10px] text-zinc-500">
                    {q.parameters?.material || 'Custom Material'} • Qty: {q.parameters?.quantity || 1}
                  </span>
                </td>
                <td className="p-3">
                  <div className="flex items-center gap-2">
                    <span className="text-zinc-700">{q.files.length} model(s)</span>
                    {q.requiresNda && (
                      <span className="p-1 rounded-xs bg-amber-100 text-amber-900" title="NDA Required">
                        <Lock className="h-3 w-3" />
                      </span>
                    )}
                  </div>
                </td>
                <td className="p-3 font-bold text-zinc-900">
                  {q.quotedPrice ? formatPKR(q.quotedPrice) : <span className="text-zinc-400 font-normal">Pending</span>}
                </td>
                <td className="p-3">
                  <Badge variant="warning" size="sm">
                    {q.status.replace(/_/g, ' ')}
                  </Badge>
                </td>
                <td className="p-3 text-zinc-600">{q.assignedEngineer || 'Unassigned'}</td>
                <td className="p-3 text-right">
                  <Link href={`/admin/quotes/${q.id}`}>
                    <Button variant="outline" size="sm" className="h-7 text-[11px] px-2.5">
                      <Eye className="h-3 w-3 mr-1" />
                      Review CAD
                    </Button>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
