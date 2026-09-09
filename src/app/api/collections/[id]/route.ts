import { NextResponse } from 'next/server';
import { getStoreData, saveStoreData } from '@/lib/store';
import { getAdminFromSession } from '@/lib/auth';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const data = getStoreData();
  const collection = data.collections.find(c => c.id === id);

  if (!collection) {
    return NextResponse.json({ error: 'المجموعة غير موجودة' }, { status: 404 });
  }

  const collectionProducts = data.products.filter(p => p.collectionId === id);

  return NextResponse.json({ ...collection, products: collectionProducts });
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getAdminFromSession();
  if (!session) {
    return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
  }

  const { id } = await params;
  try {
    const body = await request.json();
    const data = getStoreData();
    const index = data.collections.findIndex(c => c.id === id);

    if (index === -1) {
      return NextResponse.json({ error: 'المجموعة غير موجودة' }, { status: 404 });
    }

    data.collections[index] = {
      ...data.collections[index],
      ...body,
      order: body.order !== undefined ? Number(body.order) : data.collections[index].order,
    };

    saveStoreData(data);
    return NextResponse.json(data.collections[index]);
  } catch (error) {
    console.error('Error updating collection:', error);
    return NextResponse.json({ error: 'فشل تحديث المجموعة' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getAdminFromSession();
  if (!session) {
    return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
  }

  const { id } = await params;
  const data = getStoreData();
  const index = data.collections.findIndex(c => c.id === id);

  if (index === -1) {
    return NextResponse.json({ error: 'المجموعة غير موجودة' }, { status: 404 });
  }

  data.collections.splice(index, 1);
  saveStoreData(data);

  return NextResponse.json({ success: true });
}
