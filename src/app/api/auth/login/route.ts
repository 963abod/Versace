import { NextResponse } from 'next/server';
import { authenticateAdmin, signToken, setAdminAuthCookie } from '@/lib/auth';
import { getSettingsAsync } from '@/lib/store';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { username, password } = body;

    const settings = await getSettingsAsync();
    const expectedUsername = settings.adminUsername || 'admin';

    if (!username || !password) {
      return NextResponse.json(
        { error: 'اسم المستخدم وكلمة المرور مطلوبان' },
        { status: 400 }
      );
    }

    if (username.trim() !== expectedUsername) {
      return NextResponse.json(
        { error: 'اسم المستخدم أو كلمة المرور غير صحيحة' },
        { status: 401 }
      );
    }

    const isValid = await authenticateAdmin(password);
    if (!isValid) {
      return NextResponse.json(
        { error: 'اسم المستخدم أو كلمة المرور غير صحيحة' },
        { status: 401 }
      );
    }

    const token = await signToken({ username });
    await setAdminAuthCookie(token);

    return NextResponse.json({ success: true, username });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'حدث خطأ أثناء تسجيل الدخول' },
      { status: 500 }
    );
  }
}
