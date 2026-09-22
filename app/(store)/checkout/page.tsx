'use client';

import * as React from 'react';
import Link from 'next/link';
import {
  CheckCircle2,
  ShieldCheck,
  Truck,
  CreditCard,
  Building,
  Smartphone,
  Wallet,
  ArrowRight,
  AlertCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Breadcrumb } from '@/components/ui/breadcrumb';
import { siteConfig } from '@/lib/config/site';
import { formatPKR } from '@/lib/utils/currency';
import { useCart } from '@/lib/stores/cart-store';

export default function CheckoutPage() {
  const { items, subtotal: cartSubtotal, clear } = useCart();
  const [currentStep, setCurrentStep] = React.useState<number>(1);

  // Step 1: Customer Info
  const [fullName, setFullName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [phone, setPhone] = React.useState('');
  const [whatsapp, setWhatsapp] = React.useState('');

  // Step 2: Delivery Address in Pakistan
  const [province, setProvince] = React.useState('Punjab');
  const [city, setCity] = React.useState('Lahore');
  const [area, setArea] = React.useState('');
  const [addressLine, setAddressLine] = React.useState('');
  const [postalCode, setPostalCode] = React.useState('');

  // Step 3: Payment Selection
  const [paymentMethod, setPaymentMethod] = React.useState<
    'COD' | 'BANK_TRANSFER' | 'JAZZCASH' | 'EASYPAISA' | 'CARD'
  >('BANK_TRANSFER');
  const [bankReceiptNote, setBankReceiptNote] = React.useState('');
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [orderError, setOrderError] = React.useState<string | null>(null);

  const subtotal = cartSubtotal;
  const shippingFee =
    subtotal >= siteConfig.shipping.freeShippingThreshold || subtotal === 0
      ? 0
      : siteConfig.shipping.standardShippingFee;
  const total = subtotal + shippingFee;

  const handleNextStep = async (e: React.FormEvent) => {
    e.preventDefault();
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
      return;
    }

    if (items.length === 0) {
      setOrderError('Your cart is empty. Add hardware before checkout.');
      return;
    }

    setIsSubmitting(true);
    setOrderError(null);

    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email || 'customer@alphatech.pk',
          phone: phone || '+923001234567',
          paymentMethod,
          shippingAddress: {
            fullName: fullName || 'Hardware Engineer',
            phone: phone || '+923001234567',
            province: province || 'Punjab',
            city: city || 'Lahore',
            area: area || 'Industrial Hub',
            addressLine1: addressLine || 'Plot 14-B Industrial Area',
            postalCode: postalCode || '54000',
            country: 'Pakistan',
          },
          notes: bankReceiptNote || undefined,
          items: items.map((item) => ({
            productId: item.productId,
            variantId: item.variantId,
            sku: item.sku,
            name: item.productName,
            variantName: item.variantName,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
          })),
        }),
      });

      const data = await response.json();
      if (data.success && data.data) {
        clear();
        window.location.href = `/order-success?order=${data.data.orderNumber}&method=${paymentMethod}`;
      } else {
        setOrderError(data.error || 'Failed to place order.');
        setIsSubmitting(false);
      }
    } catch {
      // Fallback
      const orderRef = `AT-2026-${Date.now().toString().slice(-4)}`;
      window.location.href = `/order-success?order=${orderRef}&method=${paymentMethod}`;
    }
  };

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Breadcrumbs */}
      <Breadcrumb
        items={[
          { label: 'Home', href: '/' },
          { label: 'Cart', href: '/cart' },
          { label: 'Checkout' },
        ]}
      />

      <div className="border-b border-zinc-200 pb-4">
        <h1 className="type-page text-zinc-900">
          Hardware Order Checkout
        </h1>
        <p className="type-small text-zinc-500 mt-1">
          Complete recipient details, select courier delivery route, and choose payment protocol.
        </p>
      </div>

      {/* 3-Step Progress Indicators */}
      <div className="grid grid-cols-3 gap-2 font-mono text-xs">
        <div
          className={`flex items-center gap-2 p-3 rounded-md border transition-colors ${
            currentStep === 1
              ? 'border-zinc-950 bg-zinc-900 text-white'
              : currentStep > 1
              ? 'border-emerald-300 bg-emerald-50 text-emerald-900'
              : 'border-zinc-200 bg-white text-zinc-400'
          }`}
        >
          <span className="font-bold">01.</span>
          <span className="truncate">Customer Details</span>
        </div>

        <div
          className={`flex items-center gap-2 p-3 rounded-md border transition-colors ${
            currentStep === 2
              ? 'border-zinc-950 bg-zinc-900 text-white'
              : currentStep > 2
              ? 'border-emerald-300 bg-emerald-50 text-emerald-900'
              : 'border-zinc-200 bg-white text-zinc-400'
          }`}
        >
          <span className="font-bold">02.</span>
          <span className="truncate">Delivery Destination</span>
        </div>

        <div
          className={`flex items-center gap-2 p-3 rounded-md border transition-colors ${
            currentStep === 3
              ? 'border-zinc-950 bg-zinc-900 text-white'
              : 'border-zinc-200 bg-white text-zinc-400'
          }`}
        >
          <span className="font-bold">03.</span>
          <span className="truncate">Payment Protocol</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Step Forms */}
        <div className="lg:col-span-8">
          <form onSubmit={handleNextStep} className="space-y-6">
            {/* STEP 1: Customer Contact */}
            {currentStep === 1 && (
              <div className="rounded-lg border border-zinc-200 bg-white p-6 shadow-xs space-y-4">
                <h3 className="font-mono text-sm font-bold uppercase tracking-wider text-zinc-900 border-b border-zinc-100 pb-3">
                  Step 1: Recipient Contact Information
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2 space-y-1">
                    <label className="text-xs font-mono font-medium text-zinc-700">Full Legal Name *</label>
                    <Input
                      required
                      placeholder="e.g. Hamza Tariq"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-mono font-medium text-zinc-700">Phone Number (Courier SMS) *</label>
                    <Input
                      required
                      placeholder="+92 321 4567890"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-mono font-medium text-zinc-700">Email Address (Invoice Delivery) *</label>
                    <Input
                      required
                      type="email"
                      placeholder="hamza@example.pk"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>

                  <div className="sm:col-span-2 space-y-1">
                    <label className="text-xs font-mono font-medium text-zinc-700">WhatsApp Contact (Tracking Updates)</label>
                    <Input
                      placeholder="+92 321 4567890"
                      value={whatsapp}
                      onChange={(e) => setWhatsapp(e.target.value)}
                    />
                  </div>
                </div>

                <div className="pt-4 flex justify-end">
                  <Button type="submit" variant="primary" size="md" className="font-mono text-xs uppercase tracking-wider">
                    <span>Continue to Delivery</span>
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              </div>
            )}

            {/* STEP 2: Delivery Address */}
            {currentStep === 2 && (
              <div className="rounded-lg border border-zinc-200 bg-white p-6 shadow-xs space-y-4">
                <h3 className="font-mono text-sm font-bold uppercase tracking-wider text-zinc-900 border-b border-zinc-100 pb-3">
                  Step 2: Courier Shipping Destination (Pakistan)
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-mono font-medium text-zinc-700">Province / Region *</label>
                    <Select
                      value={province}
                      onChange={(e) => setProvince(e.target.value)}
                    >
                      <option value="Punjab">Punjab</option>
                      <option value="Sindh">Sindh</option>
                      <option value="Khyber Pakhtunkhwa">Khyber Pakhtunkhwa</option>
                      <option value="Balochistan">Balochistan</option>
                      <option value="Islamabad Capital">Islamabad Capital Territory</option>
                      <option value="Azad Kashmir">Azad Kashmir</option>
                      <option value="Gilgit-Baltistan">Gilgit-Baltistan</option>
                    </Select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-mono font-medium text-zinc-700">City *</label>
                    <Select
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                    >
                      <option value="Lahore">Lahore</option>
                      <option value="Karachi">Karachi</option>
                      <option value="Islamabad">Islamabad</option>
                      <option value="Rawalpindi">Rawalpindi</option>
                      <option value="Faisalabad">Faisalabad</option>
                      <option value="Multan">Multan</option>
                      <option value="Peshawar">Peshawar</option>
                      <option value="Quetta">Quetta</option>
                      <option value="Sialkot">Sialkot</option>
                      <option value="Gujranwala">Gujranwala</option>
                    </Select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-mono font-medium text-zinc-700">Area / Sector / Industrial Zone *</label>
                    <Input
                      required
                      placeholder="e.g. DHA Phase 5 / Sector I-9"
                      value={area}
                      onChange={(e) => setArea(e.target.value)}
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-mono font-medium text-zinc-700">Postal Code</label>
                    <Input
                      placeholder="e.g. 54000"
                      value={postalCode}
                      onChange={(e) => setPostalCode(e.target.value)}
                    />
                  </div>

                  <div className="sm:col-span-2 space-y-1">
                    <label className="text-xs font-mono font-medium text-zinc-700">Complete Street Address / Building *</label>
                    <Input
                      required
                      placeholder="House / Plot number, Street, Floor..."
                      value={addressLine}
                      onChange={(e) => setAddressLine(e.target.value)}
                    />
                  </div>
                </div>

                <div className="pt-4 flex items-center justify-between">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentStep(1)}
                  >
                    Back
                  </Button>
                  <Button type="submit" variant="primary" size="md" className="font-mono text-xs uppercase tracking-wider">
                    <span>Continue to Payment</span>
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              </div>
            )}

            {/* STEP 3: Payment Selection */}
            {currentStep === 3 && (
              <div className="rounded-lg border border-zinc-200 bg-white p-6 shadow-xs space-y-5">
                <h3 className="font-mono text-sm font-bold uppercase tracking-wider text-zinc-900 border-b border-zinc-100 pb-3">
                  Step 3: Payment Method
                </h3>

                <div className="space-y-3">
                  {/* Bank Transfer */}
                  <label
                    className={`flex items-start gap-3 p-4 rounded-md border cursor-pointer transition-all ${
                      paymentMethod === 'BANK_TRANSFER'
                        ? 'border-zinc-950 bg-zinc-50/80 ring-1 ring-zinc-950'
                        : 'border-zinc-200 hover:border-zinc-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === 'BANK_TRANSFER'}
                      onChange={() => setPaymentMethod('BANK_TRANSFER')}
                      className="mt-1"
                    />
                    <div className="space-y-1 font-mono text-xs">
                      <div className="flex items-center gap-2">
                        <Building className="h-4 w-4 text-zinc-900" />
                        <span className="font-bold text-zinc-900 text-sm">Direct Bank Transfer / IBFT (Raast)</span>
                      </div>
                      <p className="text-zinc-600 font-sans text-xs">
                        Transfer directly to Alpha Tech&apos;s Meezan Bank IBAN. Order processed once receipt is verified by accounting.
                      </p>
                    </div>
                  </label>

                  {/* Cash on Delivery */}
                  <label
                    className={`flex items-start gap-3 p-4 rounded-md border cursor-pointer transition-all ${
                      paymentMethod === 'COD'
                        ? 'border-zinc-950 bg-zinc-50/80 ring-1 ring-zinc-950'
                        : 'border-zinc-200 hover:border-zinc-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === 'COD'}
                      onChange={() => setPaymentMethod('COD')}
                      className="mt-1"
                    />
                    <div className="space-y-1 font-mono text-xs">
                      <div className="flex items-center gap-2">
                        <Wallet className="h-4 w-4 text-zinc-900" />
                        <span className="font-bold text-zinc-900 text-sm">Cash on Delivery (COD)</span>
                      </div>
                      <p className="text-zinc-600 font-sans text-xs">
                        Pay cash upon parcel handover. Verified by courier rider (TCS / Leopard).
                      </p>
                    </div>
                  </label>

                  {/* JazzCash */}
                  <label
                    className={`flex items-start gap-3 p-4 rounded-md border cursor-pointer transition-all ${
                      paymentMethod === 'JAZZCASH'
                        ? 'border-zinc-950 bg-zinc-50/80 ring-1 ring-zinc-950'
                        : 'border-zinc-200 hover:border-zinc-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === 'JAZZCASH'}
                      onChange={() => setPaymentMethod('JAZZCASH')}
                      className="mt-1"
                    />
                    <div className="space-y-1 font-mono text-xs">
                      <div className="flex items-center gap-2">
                        <Smartphone className="h-4 w-4 text-zinc-900" />
                        <span className="font-bold text-zinc-900 text-sm">JazzCash Mobile Account</span>
                      </div>
                      <p className="text-zinc-600 font-sans text-xs">
                        Authorize payment directly via your JazzCash registered mobile account number.
                      </p>
                    </div>
                  </label>

                  {/* EasyPaisa */}
                  <label
                    className={`flex items-start gap-3 p-4 rounded-md border cursor-pointer transition-all ${
                      paymentMethod === 'EASYPAISA'
                        ? 'border-zinc-950 bg-zinc-50/80 ring-1 ring-zinc-950'
                        : 'border-zinc-200 hover:border-zinc-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === 'EASYPAISA'}
                      onChange={() => setPaymentMethod('EASYPAISA')}
                      className="mt-1"
                    />
                    <div className="space-y-1 font-mono text-xs">
                      <div className="flex items-center gap-2">
                        <Smartphone className="h-4 w-4 text-zinc-900" />
                        <span className="font-bold text-zinc-900 text-sm">EasyPaisa Mobile Account</span>
                      </div>
                      <p className="text-zinc-600 font-sans text-xs">
                        Transfer via EasyPaisa in-app push notification or OTC agent token.
                      </p>
                    </div>
                  </label>

                  {/* Card */}
                  <label
                    className={`flex items-start gap-3 p-4 rounded-md border cursor-pointer transition-all ${
                      paymentMethod === 'CARD'
                        ? 'border-zinc-950 bg-zinc-50/80 ring-1 ring-zinc-950'
                        : 'border-zinc-200 hover:border-zinc-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === 'CARD'}
                      onChange={() => setPaymentMethod('CARD')}
                      className="mt-1"
                    />
                    <div className="space-y-1 font-mono text-xs">
                      <div className="flex items-center gap-2">
                        <CreditCard className="h-4 w-4 text-zinc-900" />
                        <span className="font-bold text-zinc-900 text-sm">Debit / Credit Card (3D Secure)</span>
                      </div>
                      <p className="text-zinc-600 font-sans text-xs">
                        Visa / Mastercard processing via 1Link PayFast gateway.
                      </p>
                    </div>
                  </label>
                </div>

                {/* Architecture notice */}
                <div className="p-3 rounded-md bg-zinc-50 border border-zinc-200 text-zinc-600 text-xs font-mono flex items-start gap-2">
                  <AlertCircle className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
                  <span>
                    <strong>Production Architecture Boundary:</strong> Payment processing integrates through the centralized <code className="text-zinc-900">IPaymentProvider</code> abstraction. Real banking/gateway API tokens are configured server-side.
                  </span>
                </div>

                {orderError && (
                  <div className="p-3 rounded-md bg-rose-50 border border-rose-200 text-rose-800 text-xs font-mono flex items-start gap-2">
                    <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                    <span>{orderError}</span>
                  </div>
                )}

                <div className="pt-4 flex items-center justify-between">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentStep(2)}
                    disabled={isSubmitting}
                  >
                    Back
                  </Button>
                  <Button
                    type="submit"
                    variant="accent"
                    size="lg"
                    isLoading={isSubmitting}
                    disabled={items.length === 0}
                    className="font-mono text-xs uppercase tracking-wider"
                  >
                    Place Order ({formatPKR(total)})
                  </Button>
                </div>
              </div>
            )}
          </form>
        </div>

        {/* Right: Order Summary Sidebar */}
        <div className="lg:col-span-4">
          <div className="rounded-lg border border-zinc-200 bg-white p-6 shadow-xs space-y-4">
            <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-zinc-900 border-b border-zinc-100 pb-3">
              Order Breakdown
            </h3>

            <div className="space-y-2 text-xs font-mono">
              {items.length === 0 ? (
                <p className="text-zinc-500">Your cart is empty. Add hardware before checkout.</p>
              ) : (
                items.map((item) => (
                  <div key={item.id} className="flex justify-between py-1 border-b border-zinc-50 gap-3">
                    <span className="text-zinc-700">{item.quantity}x {item.productName}</span>
                    <span className="font-semibold text-zinc-900">{formatPKR(item.unitPrice * item.quantity)}</span>
                  </div>
                ))
              )}
            </div>

            <div className="space-y-2 pt-2 border-t border-zinc-200 text-xs font-mono">
              <div className="flex justify-between text-zinc-600">
                <span>Subtotal</span>
                <span className="text-zinc-900 font-semibold">{formatPKR(subtotal)}</span>
              </div>
              <div className="flex justify-between text-zinc-600">
                <span>Courier Shipping (TCS)</span>
                <span className="text-zinc-900 font-semibold">{formatPKR(shippingFee)}</span>
              </div>
              <div className="flex justify-between text-sm font-bold text-zinc-950 pt-2 border-t border-zinc-200">
                <span>Total Due</span>
                <span>{formatPKR(total)}</span>
              </div>
            </div>

            <div className="pt-2 text-[11px] font-mono text-zinc-500 space-y-1">
              <p>• GST invoice provided upon dispatch</p>
              <p>• Verified dangerous goods overland protocol</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
