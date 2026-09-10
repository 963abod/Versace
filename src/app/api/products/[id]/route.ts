import { NextResponse } from 'next/server';
import { getProductsAsync, saveProductAsync, deleteProductAsync } from '@/lib/store';
import { getAdminFromSession } from '@/lib/auth';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const products = await getProductsAsync();
  const product = products.find(p => p.id === id);

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
    const products = await getProductsAsync();
    const existing = products.find(p => p.id === id);

    if (!existing) {
      return NextResponse.json({ error: 'المنتج غير موجود' }, { status: 404 });
    }

    const updatedProduct = {
      ...existing,
      ...body,
      price: Number(body.price ?? existing.price),
      offerPrice: body.offerPrice !== undefined ? Number(body.offerPrice) : existing.offerPrice,
      order: body.order !== undefined ? Number(body.order) : existing.order,
    };

    await saveProductAsync(updatedProduct);
    return NextResponse.json(updatedProduct);
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
  const products = await getProductsAsync();
  const existing = products.find(p => p.id === id);

  if (!existing) {
    return NextResponse.json({ error: 'المنتج غير موجود' }, { status: 404 });
  }

  await deleteProductAsync(id);

  return NextResponse.json({ success: true });
}
