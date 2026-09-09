import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import bcrypt from 'bcryptjs';
import { getStoreData } from '@/lib/store';

const COOKIE_NAME = 'versace_admin_token';

function getJwtSecret(): Uint8Array {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    console.warn('JWT_SECRET is not set in environment variables; using runtime fallback key.');
  }
  return new TextEncoder().encode(
    secret || 'versace-luxury-fashion-store-jwt-secret-runtime-key'
  );
}

export async function signToken(payload: { username: string }) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('24h')
    .sign(getJwtSecret());
}

export async function verifyToken(token: string) {
  try {
    const verified = await jwtVerify(token, getJwtSecret());
    return verified.payload as { username: string };
  } catch {
    return null;
  }
}

export async function authenticateAdmin(password: string): Promise<boolean> {
  const data = getStoreData();
  const hash = data.settings.adminPasswordHash;
  if (!hash) return false;
  return await bcrypt.compare(password, hash);
}

export async function setAdminAuthCookie(token: string) {
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 86400, // 24 hours
  });
}

export async function removeAdminAuthCookie() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

export async function getAdminFromSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;
  return await verifyToken(token);
}
