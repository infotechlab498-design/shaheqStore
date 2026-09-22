'use client';

import * as React from 'react';
import { MessageSquare } from 'lucide-react';
import { siteConfig } from '@/lib/config/site';
import { cn } from '@/lib/utils';

export type WhatsAppContext = 'product' | 'quote' | 'order' | 'general';

export interface WhatsAppButtonProps {
  context?: WhatsAppContext;
  referenceId?: string; // Product SKU, Order Number, or Quote Number
  productName?: string;
  customMessage?: string;
  variant?: 'floating' | 'button' | 'inline-link';
  className?: string;
}

export function WhatsAppButton({
  context = 'general',
  referenceId,
  productName,
  customMessage,
  variant = 'button',
  className,
}: WhatsAppButtonProps) {
  const getEncodedUrl = () => {
    let message = '';
    if (customMessage) {
      message = customMessage;
    } else {
      switch (context) {
        case 'product':
          message = `Hello Alpha Tech Engineering, I have a technical inquiry regarding: ${productName || 'Product'} (SKU: ${referenceId || 'N/A'}). Could you provide availability and dispatch details?`;
          break;
        case 'quote':
          message = `Hello Alpha Tech, I am inquiring regarding Custom Engineering / 3D Printing Quote ${referenceId ? `Ref #${referenceId}` : ''}.`;
          break;
        case 'order':
          message = `Hello Alpha Tech Logistics, I am contacting you regarding Order Ref #${referenceId || ''}.`;
          break;
        default:
          message = `Hello Alpha Tech, I would like to consult with an engineering specialist.`;
          break;
      }
    }

    const cleanPhone = siteConfig.contact.whatsapp.replace(/[^0-9]/g, '');
    return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
  };

  if (variant === 'floating') {
    return (
      <a
        href={getEncodedUrl()}
        target="_blank"
        rel="noopener noreferrer"
        className={cn(
          'fixed bottom-6 right-6 z-40 flex items-center gap-2 rounded-full bg-emerald-600 px-4 py-3 text-white shadow-lg hover:bg-emerald-700 transition-all hover:scale-105 font-mono text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2',
          className
        )}
        aria-label="Direct WhatsApp engineering chat"
      >
        <MessageSquare className="h-5 w-5 fill-current" />
        <span className="hidden sm:inline">WhatsApp Engineer</span>
      </a>
    );
  }

  if (variant === 'inline-link') {
    return (
      <a
        href={getEncodedUrl()}
        target="_blank"
        rel="noopener noreferrer"
        className={cn(
          'inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 hover:text-emerald-800 transition-colors font-mono',
          className
        )}
      >
        <MessageSquare className="h-4 w-4" />
        <span>Chat on WhatsApp</span>
      </a>
    );
  }

  return (
    <a
      href={getEncodedUrl()}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-md border border-emerald-600/30 bg-emerald-50 px-4 py-2 text-xs sm:text-sm font-semibold text-emerald-900 shadow-xs hover:bg-emerald-100 transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-600 font-mono',
        className
      )}
    >
      <MessageSquare className="h-4 w-4 text-emerald-600" />
      <span>Consult via WhatsApp</span>
    </a>
  );
}
