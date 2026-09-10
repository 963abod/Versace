import { NextResponse } from 'next/server';
import { getCollectionsAsync, saveCollectionAsync, deleteCollectionAsync, getProductsAsync } from '@/lib/store';
import { getAdminFromSession } from '@/lib/auth';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const collections = await getCollectionsAsync();
  const collection = collections.find(c => c.id === id);

  if (!collection) {
    return NextResponse.json({ error: 'المجموعة غير موجودة' }, { status: 404 });
  }

  const products = await getProductsAsync();
  const collectionProducts = products.filter(p => p.collectionId === id);

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
    const collections = await getCollectionsAsync();
    const existing = collections.find(c => c.id === id);

    if (!existing) {
      return NextResponse.json({ error: 'المجموعة غير موجودة' }, { status: 404 });
    }

    const updatedCollection = {
      ...existing,
      ...body,
      order: body.order !== undefined ? Number(body.order) : existing.order,
    };

    await saveCollectionAsync(updatedCollection);
    return NextResponse.json(updatedCollection);
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
  const collections = await getCollectionsAsync();
  const existing = collections.find(c => c.id === id);

  if (!existing) {
    return NextResponse.json({ error: 'المجموعة غير موجودة' }, { status: 404 });
  }

  await deleteCollectionAsync(id);

  return NextResponse.json({ success: true });
}
