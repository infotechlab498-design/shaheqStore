'use client';

import * as React from 'react';
import { Save, Building, Phone, Truck, Shield, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { siteConfig } from '@/lib/config/site';

export default function AdminSettingsPage() {
  const [siteName, setSiteName] = React.useState(siteConfig.name);
  const [supportEmail, setSupportEmail] = React.useState(siteConfig.contact.email);
  const [whatsappPhone, setWhatsappPhone] = React.useState(siteConfig.contact.whatsapp);
  const [warehouseAddress, setWarehouseAddress] = React.useState(siteConfig.contact.address);

  // Banking
  const [bankName, setBankName] = React.useState('Meezan Bank Limited');
  const [accountTitle, setAccountTitle] = React.useState('Alpha Tech Technologies (Pvt) Ltd.');
  const [iban, setIban] = React.useState('PK76MEZN0001020304050607');

  // Shipping
  const [flatShippingFee, setFlatShippingFee] = React.useState(450);
  const [freeShippingThreshold, setFreeShippingThreshold] = React.useState(50000);

  const [savedSuccess, setSavedSuccess] = React.useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <form onSubmit={handleSave} className="max-w-4xl space-y-8 font-mono text-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-200 pb-5">
        <div>
          <h1 className="text-2xl font-bold font-mono text-zinc-900">
            Platform & Operational Settings
          </h1>
          <p className="text-xs font-mono text-zinc-500 mt-0.5">
            Configure contact coordinates, banking IBFT accounts, and logistics rates.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {savedSuccess && (
            <span className="text-emerald-600 font-bold">
              ✓ Settings Saved!
            </span>
          )}
          <Button type="submit" variant="accent" size="sm" className="uppercase tracking-wider">
            <Save className="h-3.5 w-3.5 mr-1.5" />
            Save Configuration
          </Button>
        </div>
      </div>

      {/* General Platform Coordinates */}
      <div className="rounded-lg border border-zinc-200 bg-white p-6 shadow-xs space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-900 border-b border-zinc-100 pb-2">
          01 / Organization Profile & Contacts
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-zinc-700">Platform Title</label>
            <Input
              value={siteName}
              onChange={(e) => setSiteName(e.target.value)}
              className="text-xs h-9"
            />
          </div>

          <div className="space-y-1">
            <label className="text-zinc-700">Official Contact Email</label>
            <Input
              value={supportEmail}
              onChange={(e) => setSupportEmail(e.target.value)}
              className="text-xs h-9"
            />
          </div>

          <div className="space-y-1">
            <label className="text-zinc-700">Engineering WhatsApp Number</label>
            <Input
              value={whatsappPhone}
              onChange={(e) => setWhatsappPhone(e.target.value)}
              className="text-xs h-9"
            />
          </div>

          <div className="space-y-1">
            <label className="text-zinc-700">Dispatch Facility Address (Lahore)</label>
            <Input
              value={warehouseAddress}
              onChange={(e) => setWarehouseAddress(e.target.value)}
              className="text-xs h-9"
            />
          </div>
        </div>
      </div>

      {/* Corporate Bank Account for IBFT */}
      <div className="rounded-lg border border-zinc-200 bg-white p-6 shadow-xs space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-900 border-b border-zinc-100 pb-2 flex items-center gap-2">
          <Building className="h-4 w-4 text-amber-600" />
          <span>02 / Bank Transfer & Raast Settlement Coordinates</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-1">
            <label className="text-zinc-700">Bank Name</label>
            <Input
              value={bankName}
              onChange={(e) => setBankName(e.target.value)}
              className="text-xs h-9"
            />
          </div>

          <div className="space-y-1">
            <label className="text-zinc-700">Account Title</label>
            <Input
              value={accountTitle}
              onChange={(e) => setAccountTitle(e.target.value)}
              className="text-xs h-9"
            />
          </div>

          <div className="space-y-1">
            <label className="text-zinc-700">Account IBAN (Pakistan)</label>
            <Input
              value={iban}
              onChange={(e) => setIban(e.target.value)}
              className="text-xs h-9 font-mono"
            />
          </div>
        </div>
      </div>

      {/* Domestic Courier Fee Rules */}
      <div className="rounded-lg border border-zinc-200 bg-white p-6 shadow-xs space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-900 border-b border-zinc-100 pb-2 flex items-center gap-2">
          <Truck className="h-4 w-4 text-amber-600" />
          <span>03 / Domestic Logistics & Shipping Tariffs</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-zinc-700">Standard Flat Shipping Fee (PKR)</label>
            <Input
              type="number"
              value={flatShippingFee}
              onChange={(e) => setFlatShippingFee(parseInt(e.target.value) || 0)}
              className="text-xs h-9"
            />
          </div>

          <div className="space-y-1">
            <label className="text-zinc-700">Free Shipping Threshold (PKR)</label>
            <Input
              type="number"
              value={freeShippingThreshold}
              onChange={(e) => setFreeShippingThreshold(parseInt(e.target.value) || 0)}
              className="text-xs h-9"
            />
          </div>
        </div>
      </div>
    </form>
  );
}
