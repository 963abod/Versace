import { NextResponse } from 'next/server';
import { getAdminFromSession } from '@/lib/auth';

export async function GET() {
  const session = await getAdminFromSession();
  if (!session) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }

  return NextResponse.json({ authenticated: true, username: session.username });
}
