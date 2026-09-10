import { NextResponse } from 'next/server';
import { getCollectionsAsync, saveCollectionAsync } from '@/lib/store';
import { getAdminFromSession } from '@/lib/auth';
import { Collection } from '@/types';

export async function GET() {
  const allCollections = await getCollectionsAsync();
  const collections = [...allCollections].sort((a, b) => a.order - b.order);
  return NextResponse.json(collections);
}

export async function POST(request: Request) {
  const session = await getAdminFromSession();
  if (!session) {
    return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const allCollections = await getCollectionsAsync();

    const newCollection: Collection = {
      id: 'col-' + Date.now(),
      name: body.name || 'مجموعة جديدة',
      nameEn: body.nameEn || '',
      image: body.image || 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35',
      description: body.description || '',
      descriptionEn: body.descriptionEn || '',
      order: body.order ? Number(body.order) : allCollections.length + 1,
    };

    await saveCollectionAsync(newCollection);

    return NextResponse.json(newCollection, { status: 201 });
  } catch (error) {
    console.error('Error creating collection:', error);
    return NextResponse.json({ error: 'فشل إضافة المجموعة' }, { status: 500 });
  }
}
