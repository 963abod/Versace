import { NextResponse } from 'next/server';
import { getStoreData, saveStoreData } from '@/lib/store';
import { getAdminFromSession } from '@/lib/auth';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const data = getStoreData();
  const product = data.products.find(p => p.id === id);

  if (!product) {
    return NextResponse.json({ error: 'المنتج غير موجود' }, { status: 404 });
  }

  return NextResponse.json(product);
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
    const index = data.products.findIndex(p => p.id === id);

    if (index === -1) {
      return NextResponse.json({ error: 'المنتج غير موجود' }, { status: 404 });
    }

    data.products[index] = {
      ...data.products[index],
      ...body,
      price: Number(body.price ?? data.products[index].price),
      offerPrice: body.offerPrice !== undefined ? Number(body.offerPrice) : data.products[index].offerPrice,
      order: body.order !== undefined ? Number(body.order) : data.products[index].order,
    };

    saveStoreData(data);
    return NextResponse.json(data.products[index]);
  } catch (error) {
    console.error('Error updating product:', error);
    return NextResponse.json({ error: 'فشل تحديث المنتج' }, { status: 500 });
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
  const index = data.products.findIndex(p => p.id === id);

  if (index === -1) {
    return NextResponse.json({ error: 'المنتج غير موجود' }, { status: 404 });
  }

  data.products.splice(index, 1);
  saveStoreData(data);

  return NextResponse.json({ success: true });
}
