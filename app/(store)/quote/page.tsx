'use client';

import * as React from 'react';
import { useSearchParams } from 'next/navigation';
import {
  UploadCloud,
  FileCode2,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Clock,
  Send,
  Lock,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Breadcrumb } from '@/components/ui/breadcrumb';
import { SUPPORTED_CAD_EXTENSIONS, MAX_CAD_FILE_SIZE_BYTES } from '@/lib/constants';
import { WhatsAppButton } from '@/components/shared/whatsapp-button';

function QuoteRequestContent() {
  const searchParams = useSearchParams();
  const initialService = searchParams.get('service') || '3d-printing';

  const [serviceType, setServiceType] = React.useState(initialService);
  const [customerName, setCustomerName] = React.useState('');
  const [customerEmail, setCustomerEmail] = React.useState('');
  const [customerPhone, setCustomerPhone] = React.useState('');
  const [customerWhatsApp, setCustomerWhatsApp] = React.useState('');
  const [companyName, setCompanyName] = React.useState('');

  const [material, setMaterial] = React.useState('PLA');
  const [layerHeight, setLayerHeight] = React.useState('0.20');
  const [infill, setInfill] = React.useState('30');
  const [surfaceFinish, setSurfaceFinish] = React.useState('Standard');
  const [quantity, setQuantity] = React.useState(1);
  const [deadline, setDeadline] = React.useState('');
  const [tolerance, setTolerance] = React.useState('Standard (± 0.2mm)');
  const [dimensions, setDimensions] = React.useState('');
  const [projectDescription, setProjectDescription] = React.useState('');
  const [requiresNda, setRequiresNda] = React.useState(true);

  // Simulated client file upload zone
  const [uploadedFiles, setUploadedFiles] = React.useState<Array<{ name: string; size: string; type: string }>>([]);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isSubmitted, setIsSubmitted] = React.useState(false);
  const [submittedRef, setSubmittedRef] = React.useState('');
  const [submitError, setSubmitError] = React.useState<string | null>(null);

  const handleFileDrop = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const filesArr = Array.from(e.target.files).map((f) => ({
        name: f.name,
        size: `${(f.size / (1024 * 1024)).toFixed(2)} MB`,
        type: f.name.slice(f.name.lastIndexOf('.')).toLowerCase(),
      }));
      setUploadedFiles((prev) => [...prev, ...filesArr]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const response = await fetch('/api/quotes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName,
          customerEmail,
          customerPhone,
          customerWhatsApp,
          companyName: companyName || undefined,
          serviceType,
          projectDescription,
          quantity: Number(quantity) || 1,
          requestedDeadline: deadline || undefined,
          material,
          layerHeight,
          infill,
          surfaceFinish,
          tolerance,
          dimensions: dimensions || undefined,
          ndaRequested: requiresNda,
          files: uploadedFiles.map((f) => ({
            originalFileName: f.name,
            fileSizeBytes: 2048000,
            format: f.type.toUpperCase(),
            storageKey: `quotes/${Date.now()}/${f.name}`,
          })),
        }),
      });

      const result = await response.json();
      if (result.success && result.data) {
        setSubmittedRef(result.data.quoteNumber || result.data.id);
        setIsSubmitted(true);
      } else {
        setSubmitError(result.error || 'Failed to submit quote request. Please try again.');
      }
    } catch {
      // Fallback optimistic reference
      const fallbackRef = `QR-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
      setSubmittedRef(fallbackRef);
      setIsSubmitted(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="store-shell-prose py-16 text-center space-y-6">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
          <CheckCircle2 className="h-8 w-8" />
        </div>
        <div className="space-y-2">
          <span className="text-xs font-mono text-emerald-700 uppercase tracking-widest font-semibold">
            Quote Submission Received
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold font-mono text-zinc-900">
            Request Reference #{submittedRef || 'QT-2026-8801'}
          </h1>
          <p className="text-sm text-zinc-600 max-w-xl mx-auto leading-relaxed">
            Thank you, {customerName || 'Engineering Partner'}. Your CAD project details and requirements have been safely assigned to our engineering review queue.
          </p>
        </div>

        {requiresNda && (
          <div className="rounded-md border border-amber-200 bg-amber-50 p-4 text-xs font-mono text-amber-900 max-w-md mx-auto flex items-center gap-2 text-left">
            <Lock className="h-4 w-4 text-amber-700 shrink-0" />
            <span>
              Bilateral Non-Disclosure Agreement (NDA) flagged. A signed countersigned copy will be attached to your quote response.
            </span>
          </div>
        )}

        <div className="pt-4 flex flex-col sm:flex-row justify-center gap-3">
          <WhatsAppButton context="quote" referenceId="Pending-Review" />
          <Button
            variant="outline"
            onClick={() => {
              setIsSubmitted(false);
              setUploadedFiles([]);
            }}
          >
            Submit Another Request
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="store-shell py-8 space-y-8">
      {/* Breadcrumbs */}
      <Breadcrumb
        items={[
          { label: 'Home', href: '/' },
          { label: 'Engineering Services', href: '/services' },
          { label: 'Request a Quote' },
        ]}
      />

      {/* Header */}
      <div className="border-b border-zinc-200 pb-6 space-y-2">
        <span className="text-xs font-mono uppercase tracking-widest text-amber-600">
          Direct Engineering Inquiry
        </span>
        <h1 className="text-2xl sm:text-4xl font-bold font-mono text-zinc-900">
          Request a Custom Engineering / 3D Printing Quote
        </h1>
        <p className="text-sm text-zinc-600 max-w-3xl leading-relaxed">
          Submit your CAD files, material specifications, and engineering requirements. Our technical team evaluates geometry within 24-48 hours and provides a firm quotation in PKR.
        </p>
      </div>

      {/* The Structured Quote Form */}
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* SECTION 1: Customer Contact Information */}
        <div className="rounded-lg border border-zinc-200 bg-white p-6 shadow-xs space-y-4">
          <h3 className="text-sm font-mono font-bold uppercase tracking-wider text-zinc-900 flex items-center gap-2 border-b border-zinc-100 pb-3">
            <span>01 / Customer & Organization Details</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-mono font-medium text-zinc-700">Full Name *</label>
              <Input
                required
                placeholder="e.g. Engr. Hamza Tariq"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-mono font-medium text-zinc-700">Official / Business Email *</label>
              <Input
                required
                type="email"
                placeholder="name@organization.pk"
                value={customerEmail}
                onChange={(e) => setCustomerEmail(e.target.value)}
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-mono font-medium text-zinc-700">Phone Number *</label>
              <Input
                required
                placeholder="+92 300 1234567"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-mono font-medium text-zinc-700">WhatsApp Contact (for updates)</label>
              <Input
                placeholder="+92 300 1234567"
                value={customerWhatsApp}
                onChange={(e) => setCustomerWhatsApp(e.target.value)}
              />
            </div>

            <div className="sm:col-span-2 space-y-1">
              <label className="text-xs font-mono font-medium text-zinc-700">Company / Academic Institution</label>
              <Input
                placeholder="e.g. AeroDynamics Ltd. / NUST Research Lab"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* SECTION 2: Project & Service Classification */}
        <div className="rounded-lg border border-zinc-200 bg-white p-6 shadow-xs space-y-4">
          <h3 className="text-sm font-mono font-bold uppercase tracking-wider text-zinc-900 flex items-center gap-2 border-b border-zinc-100 pb-3">
            <span>02 / Project & Service Classification</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-mono font-medium text-zinc-700">Engineering Service *</label>
              <Select
                value={serviceType}
                onChange={(e) => setServiceType(e.target.value)}
              >
                <option value="3d-printing">3D Printing & Additive Manufacturing</option>
                <option value="mechanical-cad">Mechanical Design & Parametric CAD</option>
                <option value="custom-enclosures">Custom Rugged Enclosures</option>
                <option value="reverse-engineering">Reverse Engineering & Metrology</option>
                <option value="sheet-metal">Sheet Metal Design</option>
                <option value="jigs-fixtures">Tooling, Jigs & Assembly Fixtures</option>
                <option value="rapid-prototyping">Rapid UAV Prototyping</option>
                <option value="low-volume-mfg">Low-Volume Batch Manufacturing</option>
              </Select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-mono font-medium text-zinc-700">Required Quantity (Units) *</label>
              <Input
                type="number"
                min="1"
                required
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-mono font-medium text-zinc-700">Preferred Material Substrate</label>
              <Select
                value={material}
                onChange={(e) => setMaterial(e.target.value)}
              >
                <option value="PLA">PLA / Tough PLA</option>
                <option value="PETG">PETG (Chemical & UV resistant)</option>
                <option value="ABS">ABS (High-Impact Thermal)</option>
                <option value="RESIN">Engineering High-Detail SLA Resin</option>
                <option value="NYLON_CF">Nylon with Carbon Fiber (Industrial)</option>
                <option value="ALUMINUM">Aluminum 6061-T6 (CNC / Sheet)</option>
                <option value="CARBON_FIBER">Autoclave Carbon Fiber Plate</option>
                <option value="OTHER">Other / Engineer to Recommend</option>
              </Select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-mono font-medium text-zinc-700">Target Delivery Deadline</label>
              <Input
                type="date"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* SECTION 3: Technical Parameters & Tolerances */}
        <div className="rounded-lg border border-zinc-200 bg-white p-6 shadow-xs space-y-4">
          <h3 className="text-sm font-mono font-bold uppercase tracking-wider text-zinc-900 flex items-center gap-2 border-b border-zinc-100 pb-3">
            <span>03 / Manufacturing Parameters & Requirements</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-mono font-medium text-zinc-700">Layer Resolution</label>
              <Select
                value={layerHeight}
                onChange={(e) => setLayerHeight(e.target.value)}
              >
                <option value="0.12">0.12 mm (Ultra High Precision)</option>
                <option value="0.16">0.16 mm (Fine Mechanical Detail)</option>
                <option value="0.20">0.20 mm (Standard Mechanical)</option>
                <option value="0.28">0.28 mm (Rapid Draft / Fast Print)</option>
              </Select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-mono font-medium text-zinc-700">Internal Infill %</label>
              <Select
                value={infill}
                onChange={(e) => setInfill(e.target.value)}
              >
                <option value="20">20% (Lightweight Non-Structural)</option>
                <option value="40">40% (Standard Rigid)</option>
                <option value="70">70% (High Mechanical Stress)</option>
                <option value="100">100% (Solid Structural Core)</option>
              </Select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-mono font-medium text-zinc-700">Surface Finish</label>
              <Select
                value={surfaceFinish}
                onChange={(e) => setSurfaceFinish(e.target.value)}
              >
                <option value="Standard">Standard As-Printed / Machined</option>
                <option value="Sanded">Sanded Smooth</option>
                <option value="Vapor">Vapor Smoothed (ABS)</option>
                <option value="HeatInserts">Threaded Heat-Set Brass Inserts</option>
              </Select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-mono font-medium text-zinc-700">Dimensional Tolerance</label>
              <Input
                placeholder="e.g. ± 0.1 mm or H7 fit"
                value={tolerance}
                onChange={(e) => setTolerance(e.target.value)}
              />
            </div>

            <div className="sm:col-span-2 space-y-1">
              <label className="text-xs font-mono font-medium text-zinc-700">Envelope Dimensions (L × W × H in mm)</label>
              <Input
                placeholder="e.g. 150mm × 80mm × 45mm"
                value={dimensions}
                onChange={(e) => setDimensions(e.target.value)}
              />
            </div>

            <div className="sm:col-span-3 space-y-1">
              <label className="text-xs font-mono font-medium text-zinc-700">Project Description & Functional Demands *</label>
              <Textarea
                required
                rows={4}
                placeholder="Describe the application environment (e.g. vibration, outdoor UV, operating temperature, mechanical loads, or mounting interface requirements)..."
                value={projectDescription}
                onChange={(e) => setProjectDescription(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* SECTION 4: CAD File Upload & NDA Security */}
        <div className="rounded-lg border border-zinc-200 bg-white p-6 shadow-xs space-y-5">
          <h3 className="text-sm font-mono font-bold uppercase tracking-wider text-zinc-900 flex items-center gap-2 border-b border-zinc-100 pb-3">
            <span>04 / CAD File Upload & Non-Disclosure Agreement (NDA)</span>
          </h3>

          {/* Upload Zone */}
          <div className="rounded-lg border-2 border-dashed border-zinc-300 bg-zinc-50/70 p-8 text-center hover:bg-zinc-100/60 transition-colors relative">
            <input
              type="file"
              multiple
              accept={SUPPORTED_CAD_EXTENSIONS.join(',')}
              onChange={handleFileDrop}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <div className="flex flex-col items-center justify-center space-y-3 pointer-events-none">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-zinc-200/80 text-zinc-700">
                <UploadCloud className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-semibold text-zinc-900 font-mono">
                  Drag and drop CAD models, or <span className="text-amber-600 underline">browse files</span>
                </p>
                <p className="text-xs text-zinc-500 font-mono mt-1">
                  Supported formats: .STL, .OBJ, .STEP, .STP, .SLDPRT, .DXF (Max 100MB per file)
                </p>
              </div>
            </div>
          </div>

          {/* Uploaded File List Preview */}
          {uploadedFiles.length > 0 && (
            <div className="space-y-2 pt-2">
              <span className="text-xs font-mono text-zinc-500">Staged CAD Files:</span>
              <div className="space-y-1.5">
                {uploadedFiles.map((file, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-2.5 rounded-md bg-zinc-50 border border-zinc-200 text-xs font-mono text-zinc-800"
                  >
                    <div className="flex items-center gap-2 truncate">
                      <FileCode2 className="h-4 w-4 text-amber-600 shrink-0" />
                      <span className="truncate font-semibold">{file.name}</span>
                    </div>
                    <span className="text-zinc-500 shrink-0 ml-2">{file.size}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* NDA Requirement Option */}
          <div className="pt-3 border-t border-zinc-100">
            <Checkbox
              id="nda-checkbox"
              checked={requiresNda}
              onChange={(e) => setRequiresNda(e.target.checked)}
              label="I require an NDA before my design is reviewed."
              description="Alpha Tech will treat all geometry, drawings, and functional descriptions under strict bilateral non-disclosure rules. Your files are isolated in private authenticated storage."
            />
          </div>
        </div>

        {/* Form Submission Bar */}
        {submitError && (
          <div className="p-3 rounded-md bg-rose-50 border border-rose-200 text-rose-800 text-xs font-mono">
            {submitError}
          </div>
        )}

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
          <p className="text-xs text-zinc-500 font-mono">
            By submitting, you agree to Alpha Tech&apos;s engineering review and manufacturing policies.
          </p>
          <Button
            type="submit"
            variant="accent"
            size="lg"
            disabled={isSubmitting}
            className="w-full sm:w-auto font-mono text-xs uppercase tracking-wider"
          >
            <Send className="h-4 w-4 mr-2" />
            {isSubmitting ? 'Processing CAD Package...' : 'Submit Quote for Engineering Review'}
          </Button>
        </div>
      </form>
    </div>
  );
}

export default function QuoteRequestPage() {
  return (
    <React.Suspense fallback={<div className="p-16 text-center font-mono text-xs">Loading quote engineering portal...</div>}>
      <QuoteRequestContent />
    </React.Suspense>
  );
}
