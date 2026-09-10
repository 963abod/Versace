import { NextResponse } from 'next/server';
import { getAdminFromSession } from '@/lib/auth';
import { getSupabaseClient } from '@/lib/supabase';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

function getUploadDir(): string {
  return path.join(process.cwd(), 'public', 'uploads');
}

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

    const supabase = getSupabaseClient();
    const fileUrls: string[] = [];

    if (supabase) {
      for (const file of files) {
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        const rawExt = file.name ? file.name.split('.').pop() || 'png' : 'png';
        const ext = rawExt.toLowerCase().replace(/[^a-z0-9]/g, '') || 'png';
        const filename = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${ext}`;

        console.log(`Uploading file to Supabase Storage bucket 'products' with path: ${filename}`);

        const { error: uploadError } = await supabase.storage
          .from('products')
          .upload(filename, buffer, {
            contentType: file.type || `image/${ext}`,
            upsert: true,
          });

        if (uploadError) {
          console.error('Supabase storage upload error details:', JSON.stringify(uploadError, null, 2));
          throw uploadError;
        }

        const { data: urlData } = supabase.storage
          .from('products')
          .getPublicUrl(filename);

        fileUrls.push(urlData.publicUrl);
      }
    } else {
      const uploadDir = getUploadDir();
      await mkdir(uploadDir, { recursive: true });

      for (const file of files) {
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        const ext = file.name.split('.').pop() || 'png';
        const filename = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${ext}`;
        const filePath = path.join(uploadDir, filename);

        await writeFile(filePath, buffer);
        fileUrls.push(`/uploads/${filename}`);
      }
    }

    return NextResponse.json({ urls: fileUrls });
  } catch (error) {
    console.error('Error uploading file:', error);
    return NextResponse.json({ error: 'حدث خطأ أثناء تحميل الصورة' }, { status: 500 });
  }
}
