import { NextResponse } from 'next/server';
import { getStoreData, saveStoreData } from '@/lib/store';
import { getAdminFromSession } from '@/lib/auth';

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
    const index = data.reviews.findIndex(r => r.id === id);

    if (index === -1) {
      return NextResponse.json({ error: 'التقييم غير موجود' }, { status: 404 });
    }

    data.reviews[index] = {
      ...data.reviews[index],
      ...body,
      rating: body.rating !== undefined ? Number(body.rating) : data.reviews[index].rating,
    };

    saveStoreData(data);
    return NextResponse.json(data.reviews[index]);
  } catch (error) {
    console.error('Error updating review:', error);
    return NextResponse.json({ error: 'فشل تحديث التقييم' }, { status: 500 });
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
  const index = data.reviews.findIndex(r => r.id === id);

  if (index === -1) {
    return NextResponse.json({ error: 'التقييم غير موجود' }, { status: 404 });
  }

  data.reviews.splice(index, 1);
  saveStoreData(data);

  return NextResponse.json({ success: true });
}
