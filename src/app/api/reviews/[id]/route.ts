import { NextResponse } from 'next/server';
import { getReviewsAsync, saveReviewAsync, deleteReviewAsync } from '@/lib/store';
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
    const reviews = await getReviewsAsync();
    const existing = reviews.find(r => r.id === id);

    if (!existing) {
      return NextResponse.json({ error: 'التقييم غير موجود' }, { status: 404 });
    }

    const updatedReview = {
      ...existing,
      ...body,
      rating: body.rating !== undefined ? Number(body.rating) : existing.rating,
    };

    await saveReviewAsync(updatedReview);
    return NextResponse.json(updatedReview);
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
  const reviews = await getReviewsAsync();
  const existing = reviews.find(r => r.id === id);

  if (!existing) {
    return NextResponse.json({ error: 'التقييم غير موجود' }, { status: 404 });
  }

  await deleteReviewAsync(id);

  return NextResponse.json({ success: true });
}
