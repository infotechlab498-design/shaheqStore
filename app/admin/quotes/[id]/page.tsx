'use client';

import * as React from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  ArrowLeft,
  FileCode2,
  Lock,
  Download,
  Save,
  CheckCircle2,
  ShieldCheck,
  Calculator,
  Compass,
  Cpu,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select } from '@/components/ui/select';
import { DEMO_ADMIN_QUOTES } from '@/lib/data/demo-admin-data';
import { formatPKR } from '@/lib/utils/currency';
import { formatDate } from '@/lib/utils/date';
import { QuoteStatus } from '@/types/quote';

export default function AdminQuoteReviewPage() {
  const params = useParams();
  const id = params?.id as string;

  const initialQuote = DEMO_ADMIN_QUOTES.find((q) => q.id === id) || DEMO_ADMIN_QUOTES[0];

  const [status, setStatus] = React.useState<QuoteStatus>(initialQuote.status);
  const [assignedEngineer, setAssignedEngineer] = React.useState<string>(
    initialQuote.assignedEngineer || 'Engr. Bilal Shah (CAD Lead)'
  );
  const [runtimeHours, setRuntimeHours] = React.useState<number>(initialQuote.estimatedRuntimeHours || 14.5);
  const [materialGrams, setMaterialGrams] = React.useState<number>(initialQuote.estimatedMaterialGrams || 185);
  const [setupFee, setSetupFee] = React.useState<number>(2500);
  const [quotedPrice, setQuotedPrice] = React.useState<number>(initialQuote.quotedPrice || 32000);
  const [turnaroundDays, setTurnaroundDays] = React.useState<number>(initialQuote.turnaroundDays || 3);
  const [engineerNotes, setEngineerNotes] = React.useState<string>(
    initialQuote.engineerNotes || 'DFM Feasibility Verified. Sliced for Bambu X1 Carbon with 0.16mm layer height and 6 walls for motor vibration dampening.'
  );
  const [internalNotes, setInternalNotes] = React.useState<string>(
    initialQuote.internalNotes || 'Customer requested aerospace batch coupon test. Use high-purity PA-CF filament roll #9.'
  );

  const [savedSuccess, setSavedSuccess] = React.useState(false);
  const [downloadNotice, setDownloadNotice] = React.useState<string | null>(null);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleDownloadFile = (filename: string) => {
    setDownloadNotice(`Generating signed presigned URL with 15-min TTL for private CAD file: ${filename}`);
    setTimeout(() => setDownloadNotice(null), 4000);
  };

  return (
    <form onSubmit={handleSave} className="max-w-5xl space-y-8 font-mono text-xs">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-200 pb-4">
        <div className="flex items-center gap-3">
          <Link href="/admin/quotes">
            <Button type="button" variant="outline" size="sm" className="h-8">
              <ArrowLeft className="h-3.5 w-3.5 mr-1" />
              Quotes
            </Button>
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold font-mono text-zinc-900">
                Review Quote #{initialQuote.quoteNumber}
              </h1>
              <Badge variant="warning" size="sm">
                {status.replace(/_/g, ' ')}
              </Badge>
              {initialQuote.requiresNda && (
                <span className="flex items-center gap-1 rounded-xs bg-amber-100 px-1.5 py-0.5 text-[10px] text-amber-900 border border-amber-300">
                  <Lock className="h-3 w-3" />
                  NDA Active
                </span>
              )}
            </div>
            <span className="text-[11px] text-zinc-500">
              Submitted {formatDate(initialQuote.createdAt)} • Service: {initialQuote.serviceType}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {savedSuccess && (
            <span className="text-emerald-600 font-bold">
              ✓ Slicing & Quote Saved!
            </span>
          )}
          <Button type="submit" variant="accent" size="sm" className="uppercase tracking-wider">
            <Save className="h-3.5 w-3.5 mr-1.5" />
            Update Review State
          </Button>
        </div>
      </div>

      {downloadNotice && (
        <div className="p-3 bg-zinc-900 text-emerald-400 border border-emerald-500/40 rounded-lg flex items-center justify-between">
          <span>{downloadNotice}</span>
          <button type="button" onClick={() => setDownloadNotice(null)} className="text-zinc-400 hover:text-white ml-3">✕</button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Client Data, Manufacturing Requirements, & Staged Files */}
        <div className="lg:col-span-7 space-y-6">
          {/* Customer Organization Profile */}
          <div className="rounded-lg border border-zinc-200 bg-white p-5 shadow-xs space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-900 border-b border-zinc-100 pb-2">
              Client & Organization
            </h3>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <span className="text-zinc-500 block">Contact Name:</span>
                <span className="font-semibold text-zinc-900">{initialQuote.customerName}</span>
              </div>
              <div>
                <span className="text-zinc-500 block">Organization:</span>
                <span className="font-semibold text-zinc-900">{initialQuote.companyName || 'Private Individual'}</span>
              </div>
              <div>
                <span className="text-zinc-500 block">Email:</span>
                <span className="font-semibold text-zinc-900">{initialQuote.customerEmail}</span>
              </div>
              <div>
                <span className="text-zinc-500 block">Phone / WhatsApp:</span>
                <span className="font-semibold text-zinc-900">{initialQuote.customerPhone}</span>
              </div>
            </div>
          </div>

          {/* Staged CAD Models (Private Storage) */}
          <div className="rounded-lg border border-zinc-200 bg-white p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between border-b border-zinc-100 pb-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-900 flex items-center gap-1.5">
                <FileCode2 className="h-4 w-4 text-amber-600" />
                Confidential Staged CAD Files
              </h3>
              <span className="text-[11px] text-zinc-400">Isolated Bucket</span>
            </div>

            <div className="space-y-2">
              {initialQuote.files.map((file) => (
                <div
                  key={file.id}
                  className="p-3 rounded-md bg-zinc-50 border border-zinc-200 flex items-center justify-between"
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <FileCode2 className="h-4 w-4 text-zinc-700" />
                      <span className="font-bold text-zinc-900">{file.originalFileName}</span>
                    </div>
                    <span className="text-[10px] text-zinc-500">
                      Size: {(file.fileSizeBytes / (1024 * 1024)).toFixed(2)} MB • Ref: {(file.storageKey || file.storagePath || file.id).slice(-8)}
                    </span>
                  </div>

                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => handleDownloadFile(file.originalFileName)}
                    className="h-7 text-[11px]"
                  >
                    <Download className="h-3 w-3 mr-1" />
                    Download
                  </Button>
                </div>
              ))}
            </div>

            <p className="text-[10px] text-zinc-500 italic pt-1">
              * Files are fetched using temporary presigned URLs through the private storage provider interface. Public access is strictly forbidden.
            </p>
          </div>

          {/* Slicing & Engineering Requirements */}
          <div className="rounded-lg border border-zinc-200 bg-white p-5 shadow-xs space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-900 border-b border-zinc-100 pb-2">
              Manufacturing Demands & Parameters
            </h3>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-zinc-500 block">Requested Material:</span>
                <span className="font-semibold text-zinc-900">{initialQuote.parameters?.material || 'N/A'}</span>
              </div>
              <div>
                <span className="text-zinc-500 block">Requested Quantity:</span>
                <span className="font-semibold text-zinc-900">{initialQuote.parameters?.quantity || 1} units</span>
              </div>
              <div>
                <span className="text-zinc-500 block">Layer Height:</span>
                <span className="font-semibold text-zinc-900">
                  {initialQuote.parameters?.layerHeightMm ? `${initialQuote.parameters.layerHeightMm} mm` : '0.20 mm'}
                </span>
              </div>
              <div>
                <span className="text-zinc-500 block">Internal Infill:</span>
                <span className="font-semibold text-zinc-900">
                  {initialQuote.parameters?.infillPercentage ? `${initialQuote.parameters.infillPercentage}%` : '30%'}
                </span>
              </div>
              <div>
                <span className="text-zinc-500 block">Tolerance Spec:</span>
                <span className="font-semibold text-zinc-900">{initialQuote.parameters?.toleranceRequirement || 'Standard (± 0.2mm)'}</span>
              </div>
              <div>
                <span className="text-zinc-500 block">Surface Finish:</span>
                <span className="font-semibold text-zinc-900">{initialQuote.parameters?.surfaceFinish || 'As-Printed'}</span>
              </div>
              <div className="col-span-2 pt-2 border-t border-zinc-100">
                <span className="text-zinc-500 block mb-1">Customer Functional Description:</span>
                <p className="text-zinc-700 font-sans text-xs bg-zinc-50 p-2.5 rounded-md border border-zinc-200">
                  {initialQuote.projectDescription}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Engineering Slicing Calculation & Quote Formulation */}
        <div className="lg:col-span-5 space-y-6">
          <div className="rounded-lg border border-zinc-200 bg-white p-5 shadow-xs space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-900 flex items-center gap-1.5 border-b border-zinc-100 pb-2">
              <Calculator className="h-4 w-4 text-amber-600" />
              DFM Slicing & Quote Formulation
            </h3>

            <div className="space-y-3">
              <div className="space-y-1">
                <label className="text-zinc-700 font-medium">Quote Status Transition</label>
                <Select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as QuoteStatus)}
                  className="text-xs h-9 bg-white"
                >
                  <option value={QuoteStatus.NEW_REQUEST}>NEW_REQUEST</option>
                  <option value={QuoteStatus.UNDER_REVIEW}>UNDER_REVIEW (DFM In Progress)</option>
                  <option value={QuoteStatus.QUOTED}>QUOTED (Proposal Sent to Client)</option>
                  <option value={QuoteStatus.ACCEPTED}>ACCEPTED (Order Placed)</option>
                  <option value={QuoteStatus.REJECTED}>REJECTED (Geometry Infeasible)</option>
                </Select>
              </div>

              <div className="space-y-1">
                <label className="text-zinc-700 font-medium">Assigned Lead Engineer</label>
                <Input
                  value={assignedEngineer}
                  onChange={(e) => setAssignedEngineer(e.target.value)}
                  className="text-xs h-9"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-zinc-700 font-medium">Runtime (Hours)</label>
                  <Input
                    type="number"
                    step="0.5"
                    value={runtimeHours}
                    onChange={(e) => setRuntimeHours(parseFloat(e.target.value) || 0)}
                    className="text-xs h-9"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-zinc-700 font-medium">Material Mass (g)</label>
                  <Input
                    type="number"
                    value={materialGrams}
                    onChange={(e) => setMaterialGrams(parseInt(e.target.value) || 0)}
                    className="text-xs h-9"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-zinc-700 font-medium">Setup Fee (PKR)</label>
                  <Input
                    type="number"
                    value={setupFee}
                    onChange={(e) => setSetupFee(parseFloat(e.target.value) || 0)}
                    className="text-xs h-9"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-zinc-700 font-medium">Turnaround (Days)</label>
                  <Input
                    type="number"
                    value={turnaroundDays}
                    onChange={(e) => setTurnaroundDays(parseInt(e.target.value) || 1)}
                    className="text-xs h-9"
                  />
                </div>
              </div>

              <div className="space-y-1 pt-1">
                <label className="text-zinc-900 font-bold">Total Quoted Price (PKR) *</label>
                <Input
                  type="number"
                  required
                  value={quotedPrice}
                  onChange={(e) => setQuotedPrice(parseFloat(e.target.value) || 0)}
                  className="text-xs h-9 font-bold bg-amber-50/60 border-amber-300 text-zinc-950"
                />
                <span className="text-[10px] text-zinc-500">
                  Formatted: {formatPKR(quotedPrice)}
                </span>
              </div>

              <div className="space-y-1 pt-2">
                <label className="text-zinc-700 font-medium">Technical Feedback to Client</label>
                <Textarea
                  rows={3}
                  value={engineerNotes}
                  onChange={(e) => setEngineerNotes(e.target.value)}
                  className="text-xs font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="text-zinc-700 font-medium">Internal Production Notes (Private)</label>
                <Input
                  value={internalNotes}
                  onChange={(e) => setInternalNotes(e.target.value)}
                  className="text-xs h-8"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
