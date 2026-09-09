import { NextResponse } from 'next/server';
import { getStoreData, saveStoreData } from '@/lib/store';
import { getAdminFromSession } from '@/lib/auth';

export async function GET() {
  const data = getStoreData();
  const publicSettings = { ...data.settings };
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
    const data = getStoreData();

    data.settings = {
      ...data.settings,
      ...newSettings,
      adminPasswordHash: newSettings.adminPasswordHash || data.settings.adminPasswordHash,
    };

    saveStoreData(data);

    const updatedPublicSettings = { ...data.settings };
    delete updatedPublicSettings.adminPasswordHash;

    return NextResponse.json(updatedPublicSettings);
  } catch (error) {
    console.error('Error updating settings:', error);
    return NextResponse.json({ error: 'فشل حفظ الإعدادات' }, { status: 500 });
  }
}
