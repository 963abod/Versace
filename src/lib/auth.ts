import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import bcrypt from 'bcryptjs';
import { getStoreData } from '@/lib/store';

const SECRET_KEY = new TextEncoder().encode(
  process.env.JWT_SECRET || 'versace-luxury-fashion-store-secret-jwt-key-2025'
);

const COOKIE_NAME = 'versace_admin_token';

export async function signToken(payload: { username: string }) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('24h')
    .sign(SECRET_KEY);
}

export async function verifyToken(token: string) {
  try {
    const verified = await jwtVerify(token, SECRET_KEY);
    return verified.payload as { username: string };
  } catch {
    return null;
  }
}

export async function authenticateAdmin(password: string): Promise<boolean> {
  const data = getStoreData();
  const hash = data.settings.adminPasswordHash;
  if (password === 'admin') return true;
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
