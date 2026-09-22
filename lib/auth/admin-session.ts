export const ADMIN_SESSION_COOKIE = 'alpha_admin_session';

const SESSION_TTL_SECONDS = 60 * 60 * 12;

function sessionSecret(): string {
  return process.env.ADMIN_SESSION_SECRET || process.env.AUTH_SECRET || 'alpha-tech-local-admin-session';
}

function toBase64Url(bytes: ArrayBuffer | Uint8Array): string {
  const view = bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes);
  let binary = '';
  view.forEach((value) => {
    binary += String.fromCharCode(value);
  });
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function fromBase64Url(value: string): string {
  const padded = value.replace(/-/g, '+').replace(/_/g, '/');
  return atob(padded);
}

function safeEqual(left: string, right: string): boolean {
  if (left.length !== right.length) return false;
  let mismatch = 0;
  for (let i = 0; i < left.length; i += 1) {
    mismatch |= left.charCodeAt(i) ^ right.charCodeAt(i);
  }
  return mismatch === 0;
}

async function sign(payload: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(sessionSecret()),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  const signature = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(payload));
  return toBase64Url(signature);
}

export async function createAdminSessionToken(email: string): Promise<string> {
  const payload = toBase64Url(
    new TextEncoder().encode(
      JSON.stringify({
        email: email.trim().toLowerCase(),
        role: 'SUPER_ADMIN',
        exp: Date.now() + SESSION_TTL_SECONDS * 1000,
      })
    )
  );
  const signature = await sign(payload);
  return `${payload}.${signature}`;
}

export async function readAdminSession(token?: string | null): Promise<{ email: string; role: string } | null> {
  if (!token) return null;
  const [payload, signature] = token.split('.');
  if (!payload || !signature) return null;

  const expected = await sign(payload);
  if (!safeEqual(expected, signature)) return null;

  try {
    const data = JSON.parse(
      new TextDecoder().decode(Uint8Array.from(fromBase64Url(payload), (char) => char.charCodeAt(0)))
    ) as { email?: string; role?: string; exp?: number };
    if (!data.email || !data.exp || data.exp < Date.now()) return null;
    return { email: data.email, role: data.role || 'SUPER_ADMIN' };
  } catch {
    return null;
  }
}

export function adminCookieOptions() {
  return {
    httpOnly: true,
    sameSite: 'lax' as const,
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: SESSION_TTL_SECONDS,
  };
}
