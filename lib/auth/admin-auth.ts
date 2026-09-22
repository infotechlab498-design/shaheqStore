export const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'info@aljazeeragc.com';
export const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'infoSkilz@21';

function safeEqual(left: string, right: string): boolean {
  if (left.length !== right.length) return false;
  let mismatch = 0;
  for (let i = 0; i < left.length; i += 1) {
    mismatch |= left.charCodeAt(i) ^ right.charCodeAt(i);
  }
  return mismatch === 0;
}

export function verifyAdminCredentials(email: string, password: string): boolean {
  return (
    safeEqual(email.trim().toLowerCase(), ADMIN_EMAIL.toLowerCase()) &&
    safeEqual(password, ADMIN_PASSWORD)
  );
}
