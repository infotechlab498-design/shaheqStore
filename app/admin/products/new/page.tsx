'use client';

import * as React from 'react';
import Link from 'next/link';
import { ArrowLeft, Plus, Trash2, Save, Layers, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { PRODUCT_CATEGORIES } from '@/lib/constants';

interface SpecRow {
  key: string;
  value: string;
}

interface VariantRow {
  name: string;
  sku: string;
  price: number;
  stock: number;
  attributeKey: string;
  attributeVal: string;
}

export default function AdminProductEditorPage() {
  const [name, setName] = React.useState('Carbon Fiber Sheet Plate 500x500mm');
  const [sku, setSku] = React.useState('CFP-500X500');
  const [category, setCategory] = React.useState('raw-materials');
  const [basePrice, setBasePrice] = React.useState(8500);
  const [stock, setStock] = React.useState(25);
  const [status, setStatus] = React.useState('IN_STOCK');
  const [shortDesc, setShortDesc] = React.useState('High-strength 3K twill weave carbon fiber sheet panel for drone arms and structural robotics plates.');
  const [description, setDescription] = React.useState('Vacuum-infused high-modulus carbon fiber plates cured under controlled temperature and autoclave consolidation.');
  const [hasVariants, setHasVariants] = React.useState(true);

  // Dynamic Technical Specifications
  const [specs, setSpecs] = React.useState<SpecRow[]>([
    { key: 'Weave', value: '3K Plain / Twill' },
    { key: 'Dimensions', value: '500mm x 500mm' },
    { key: 'Resin System', value: 'Aerospace Epoxy' },
    { key: 'Thickness Tolerance', value: '± 0.08 mm' },
  ]);

  // Variant Rows
  const [variants, setVariants] = React.useState<VariantRow[]>([
    { name: '1.5mm Thickness', sku: 'CFP-500-15MM', price: 8500, stock: 12, attributeKey: 'Thickness', attributeVal: '1.5mm' },
    { name: '4.0mm Thickness', sku: 'CFP-500-40MM', price: 16500, stock: 8, attributeKey: 'Thickness', attributeVal: '4.0mm' },
    { name: '5.0mm Thickness', sku: 'CFP-500-50MM', price: 21000, stock: 5, attributeKey: 'Thickness', attributeVal: '5.0mm' },
  ]);

  const [savedSuccess, setSavedSuccess] = React.useState(false);

  const addSpecRow = () => {
    setSpecs([...specs, { key: '', value: '' }]);
  };

  const removeSpecRow = (idx: number) => {
    setSpecs(specs.filter((_, i) => i !== idx));
  };

  const addVariantRow = () => {
    setVariants([
      ...variants,
      {
        name: 'New Thickness Variant',
        sku: `${sku}-${variants.length + 1}`,
        price: basePrice,
        stock: 5,
        attributeKey: 'Thickness',
        attributeVal: '2.0mm',
      },
    ]);
  };

  const removeVariantRow = (idx: number) => {
    setVariants(variants.filter((_, i) => i !== idx));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <form onSubmit={handleSave} className="max-w-5xl space-y-8 font-mono text-xs">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-200 pb-4">
        <div className="flex items-center gap-3">
          <Link href="/admin/products">
            <Button type="button" variant="outline" size="sm" className="h-8">
              <ArrowLeft className="h-3.5 w-3.5 mr-1" />
              Products
            </Button>
          </Link>
          <h1 className="text-xl font-bold font-mono text-zinc-900">
            Hardware Catalog Editor
          </h1>
        </div>

        <div className="flex items-center gap-2">
          {savedSuccess && (
            <span className="text-emerald-600 font-bold">
              ✓ Saved to Catalog!
            </span>
          )}
          <Button type="submit" variant="accent" size="sm" className="uppercase tracking-wider">
            <Save className="h-3.5 w-3.5 mr-1.5" />
            Save Product
          </Button>
        </div>
      </div>

      {/* General Product Information */}
      <div className="rounded-lg border border-zinc-200 bg-white p-6 shadow-xs space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-900 border-b border-zinc-100 pb-2">
          01 / General Hardware Details
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="sm:col-span-2 space-y-1">
            <label className="text-zinc-700 font-medium">Product Title *</label>
            <Input
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="text-xs h-9"
            />
          </div>

          <div className="space-y-1">
            <label className="text-zinc-700 font-medium">Primary SKU Code *</label>
            <Input
              required
              value={sku}
              onChange={(e) => setSku(e.target.value)}
              className="text-xs h-9"
            />
          </div>

          <div className="space-y-1">
            <label className="text-zinc-700 font-medium">Category</label>
            <Select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="text-xs h-9"
            >
              {PRODUCT_CATEGORIES.map((c) => (
                <option key={c.id} value={c.slug}>
                  {c.name}
                </option>
              ))}
            </Select>
          </div>

          <div className="space-y-1">
            <label className="text-zinc-700 font-medium">Base Price (PKR) *</label>
            <Input
              type="number"
              required
              value={basePrice}
              onChange={(e) => setBasePrice(parseFloat(e.target.value) || 0)}
              className="text-xs h-9"
            />
          </div>

          <div className="space-y-1">
            <label className="text-zinc-700 font-medium">Initial Inventory (Units)</label>
            <Input
              type="number"
              value={stock}
              onChange={(e) => setStock(parseInt(e.target.value) || 0)}
              className="text-xs h-9"
            />
          </div>

          <div className="space-y-1">
            <label className="text-zinc-700 font-medium">Inventory Status</label>
            <Select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="text-xs h-9"
            >
              <option value="IN_STOCK">IN_STOCK (Immediate Dispatch)</option>
              <option value="LOW_STOCK">LOW_STOCK (Warning Flag)</option>
              <option value="OUT_OF_STOCK">OUT_OF_STOCK</option>
              <option value="PRE_ORDER">PRE_ORDER (Manufacturing Batch)</option>
            </Select>
          </div>

          <div className="sm:col-span-2 space-y-1">
            <label className="text-zinc-700 font-medium">Short Engineering Description</label>
            <Input
              value={shortDesc}
              onChange={(e) => setShortDesc(e.target.value)}
              className="text-xs h-9"
            />
          </div>

          <div className="sm:col-span-3 space-y-1">
            <label className="text-zinc-700 font-medium">Detailed Blueprint & Composition Notes</label>
            <Textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="text-xs font-mono"
            />
          </div>
        </div>
      </div>

      {/* Dynamic Key-Value Technical Specifications */}
      <div className="rounded-lg border border-zinc-200 bg-white p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-zinc-100 pb-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-900">
            02 / Category Technical Specifications (Extensible Key-Value Matrix)
          </h3>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={addSpecRow}
            className="h-7 text-[11px]"
          >
            <Plus className="h-3 w-3 mr-1" />
            Add Spec Row
          </Button>
        </div>

        <div className="space-y-2">
          {specs.map((row, idx) => (
            <div key={idx} className="flex items-center gap-3">
              <Input
                placeholder="Parameter (e.g. Discharge Rate, Cell Count)"
                value={row.key}
                onChange={(e) => {
                  const copy = [...specs];
                  copy[idx].key = e.target.value;
                  setSpecs(copy);
                }}
                className="w-1/3 text-xs h-8"
              />
              <Input
                placeholder="Value (e.g. 150C Continuous, 22.2V)"
                value={row.value}
                onChange={(e) => {
                  const copy = [...specs];
                  copy[idx].value = e.target.value;
                  setSpecs(copy);
                }}
                className="w-2/3 text-xs h-8"
              />
              <button
                type="button"
                onClick={() => removeSpecRow(idx)}
                className="p-1.5 text-zinc-400 hover:text-rose-600 cursor-pointer"
                title="Remove Specification"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Variant Manager */}
      <div className="rounded-lg border border-zinc-200 bg-white p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-zinc-100 pb-2">
          <div className="space-y-1">
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-900 flex items-center gap-1.5">
              <Layers className="h-3.5 w-3.5 text-amber-600" />
              03 / Variant Matrix (Independent SKU, Price, and Stock per Thickness)
            </h3>
            <p className="text-[11px] text-zinc-500">
              Allows customers to pick 1.5mm, 4.0mm, or 5.0mm sheet thickness with specific pricing.
            </p>
          </div>
          {hasVariants && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addVariantRow}
              className="h-7 text-[11px]"
            >
              <Plus className="h-3 w-3 mr-1" />
              Add Variant
            </Button>
          )}
        </div>

        <div className="pt-1">
          <Checkbox
            id="has-variants-check"
            checked={hasVariants}
            onChange={(e) => setHasVariants(e.target.checked)}
            label="Enable multi-variant matrix for this product"
          />
        </div>

        {hasVariants && (
          <div className="space-y-3 pt-2">
            {variants.map((v, idx) => (
              <div
                key={idx}
                className="p-3 rounded-md border border-zinc-200 bg-zinc-50/70 grid grid-cols-1 sm:grid-cols-5 gap-3 items-center"
              >
                <div className="sm:col-span-2 space-y-1">
                  <label className="text-[10px] text-zinc-500 uppercase">Variant Name</label>
                  <Input
                    value={v.name}
                    onChange={(e) => {
                      const copy = [...variants];
                      copy[idx].name = e.target.value;
                      setVariants(copy);
                    }}
                    className="text-xs h-8 bg-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] text-zinc-500 uppercase">Variant SKU</label>
                  <Input
                    value={v.sku}
                    onChange={(e) => {
                      const copy = [...variants];
                      copy[idx].sku = e.target.value;
                      setVariants(copy);
                    }}
                    className="text-xs h-8 bg-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] text-zinc-500 uppercase">Price (PKR)</label>
                  <Input
                    type="number"
                    value={v.price}
                    onChange={(e) => {
                      const copy = [...variants];
                      copy[idx].price = parseFloat(e.target.value) || 0;
                      setVariants(copy);
                    }}
                    className="text-xs h-8 bg-white"
                  />
                </div>

                <div className="flex items-center gap-2 pt-4 sm:pt-0">
                  <div className="flex-1 space-y-1">
                    <label className="text-[10px] text-zinc-500 uppercase">Stock</label>
                    <Input
                      type="number"
                      value={v.stock}
                      onChange={(e) => {
                        const copy = [...variants];
                        copy[idx].stock = parseInt(e.target.value) || 0;
                        setVariants(copy);
                      }}
                      className="text-xs h-8 bg-white"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => removeVariantRow(idx)}
                    className="p-2 text-zinc-400 hover:text-rose-600 cursor-pointer mt-4"
                    title="Delete Variant"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex justify-end gap-3 pt-2">
        <Link href="/admin/products">
          <Button type="button" variant="outline" size="md">
            Cancel
          </Button>
        </Link>
        <Button type="submit" variant="accent" size="md" className="uppercase tracking-wider">
          <Save className="h-4 w-4 mr-2" />
          Publish / Update Product
        </Button>
      </div>
    </form>
  );
}
