import { NextResponse } from 'next/server';
import { getReviewsAsync, saveReviewAsync } from '@/lib/store';
import { getAdminFromSession } from '@/lib/auth';
import { Review } from '@/types';

export async function GET() {
  const reviewsList = await getReviewsAsync();
  const reviews = [...reviewsList].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
  return NextResponse.json(reviews);
}

export async function POST(request: Request) {
  const session = await getAdminFromSession();
  if (!session) {
    return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
  }

  try {
    const body = await request.json();

    const newReview: Review = {
      id: 'rev-' + Date.now(),
      customerName: body.customerName || 'عميل محترم',
      comment: body.comment || '',
      rating: body.rating ? Number(body.rating) : 5,
      createdAt: new Date().toISOString(),
    };

    await saveReviewAsync(newReview);

    return NextResponse.json(newReview, { status: 201 });
  } catch (error) {
    console.error('Error creating review:', error);
    return NextResponse.json({ error: 'فشل إضافة التقييم' }, { status: 500 });
  }
}
