import { NextResponse } from 'next/server';
import { getStoreData, saveStoreData } from '@/lib/store';
import { getAdminFromSession } from '@/lib/auth';
import { Review } from '@/types';

export async function GET() {
  const data = getStoreData();
  const reviews = [...data.reviews].sort(
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
    const data = getStoreData();

    const newReview: Review = {
      id: 'rev-' + Date.now(),
      customerName: body.customerName || 'عميل محترم',
      comment: body.comment || '',
      rating: body.rating ? Number(body.rating) : 5,
      createdAt: new Date().toISOString(),
    };

    data.reviews.push(newReview);
    saveStoreData(data);

    return NextResponse.json(newReview, { status: 201 });
  } catch (error) {
    console.error('Error creating review:', error);
    return NextResponse.json({ error: 'فشل إضافة التقييم' }, { status: 500 });
  }
}
