/**
 * Formats numeric monetary amounts into standard Pakistani Rupee representation.
 * Example: 24500 -> "PKR 24,500"
 */
export function formatPKR(amount: number | null | undefined): string {
  if (amount === null || amount === undefined || isNaN(amount)) {
    return 'PKR 0';
  }
  return `PKR ${new Intl.NumberFormat('en-PK', {
    maximumFractionDigits: 0,
    minimumFractionDigits: 0,
  }).format(amount)}`;
}

export function formatPKRWithSymbol(amount: number): string {
  return `₨ ${new Intl.NumberFormat('en-PK', {
    maximumFractionDigits: 0,
    minimumFractionDigits: 0,
  }).format(amount)}`;
}
