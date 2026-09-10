import { NextResponse } from 'next/server';
import { getSettingsAsync, saveSettingsAsync } from '@/lib/store';
import { getAdminFromSession } from '@/lib/auth';

export async function GET() {
  const settings = await getSettingsAsync();
  const publicSettings = { ...settings };
  delete publicSettings.adminPasswordHash;
  return NextResponse.json(publicSettings);
}

export async function PUT(request: Request) {
  const session = await getAdminFromSession();
  if (!session) {
    return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
  }

  try {
    const newSettings = await request.json();
    const settings = await getSettingsAsync();

    const updatedSettings = {
      ...settings,
      ...newSettings,
      adminPasswordHash: newSettings.adminPasswordHash || settings.adminPasswordHash,
    };

    await saveSettingsAsync(updatedSettings);

    const updatedPublicSettings = { ...updatedSettings };
    delete updatedPublicSettings.adminPasswordHash;

    return NextResponse.json(updatedPublicSettings);
  } catch (error) {
    console.error('Error updating settings:', error);
    return NextResponse.json({ error: 'فشل حفظ الإعدادات' }, { status: 500 });
  }
}
