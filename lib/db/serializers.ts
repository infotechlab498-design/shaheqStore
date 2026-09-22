import { Decimal } from '@prisma/client/runtime/library';

export function decimalToNumber(val: Decimal | number | null | undefined): number {
  if (val === null || val === undefined) return 0;
  if (typeof val === 'number') return val;
  return Number(val.toString());
}

export function formatPKR(amount: Decimal | number | null | undefined): string {
  const num = decimalToNumber(amount);
  return `PKR ${num.toLocaleString('en-PK')}`;
}

export function dateToISO(date: Date | string | null | undefined): string {
  if (!date) return '';
  if (typeof date === 'string') return date;
  return date.toISOString();
}

/**
 * Safely parse JSON specifications into a record of key-value pairs
 */
export function parseTechnicalSpecs(specs: unknown): Record<string, string> {
  if (!specs) return {};
  if (typeof specs === 'object' && specs !== null) {
    const result: Record<string, string> = {};
    for (const [k, v] of Object.entries(specs)) {
      result[k] = String(v);
    }
    return result;
  }
  return {};
}
