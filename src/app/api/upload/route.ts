import { NextResponse } from 'next/server';
import { getAdminFromSession } from '@/lib/auth';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

export async function POST(request: Request) {
  const session = await getAdminFromSession();
  if (!session) {
    return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const files = formData.getAll('files') as File[];

    if (!files || files.length === 0) {
      return NextResponse.json({ error: 'لم يتم تحميل أي ملف' }, { status: 400 });
    }

    const uploadDir = path.join(process.cwd(), 'public', 'uploads');
    await mkdir(uploadDir, { recursive: true });

    const fileUrls: string[] = [];

    for (const file of files) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const ext = file.name.split('.').pop() || 'png';
      const filename = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${ext}`;
      const filePath = path.join(uploadDir, filename);

      await writeFile(filePath, buffer);
      fileUrls.push(`/uploads/${filename}`);
    }

    return NextResponse.json({ urls: fileUrls });
  } catch (error) {
    console.error('Error uploading file:', error);
    return NextResponse.json({ error: 'حدث خطأ أثناء تحميل الصورة' }, { status: 500 });
  }
}
