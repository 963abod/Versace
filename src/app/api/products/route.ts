import { NextResponse } from 'next/server';
import { getStoreData, saveStoreData } from '@/lib/store';
import { getAdminFromSession } from '@/lib/auth';
import { Product } from '@/types';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const search = searchParams.get('search')?.toLowerCase() || '';
  const category = searchParams.get('category');
  const collectionId = searchParams.get('collectionId');
  const size = searchParams.get('size');
  const color = searchParams.get('color');
  const isNew = searchParams.get('isNew') === 'true';
  const isOffer = searchParams.get('isOffer') === 'true';
  const minPrice = searchParams.get('minPrice') ? Number(searchParams.get('minPrice')) : undefined;
  const maxPrice = searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : undefined;
  const sortBy = searchParams.get('sortBy') || 'order';

  const data = getStoreData();
  let products = [...data.products];

  if (search) {
    products = products.filter(
      p =>
        p.name.toLowerCase().includes(search) ||
        (p.nameEn && p.nameEn.toLowerCase().includes(search)) ||
        p.description.toLowerCase().includes(search) ||
        p.category.toLowerCase().includes(search)
    );
  }

  if (category) {
    products = products.filter(p => p.category === category);
  }

  if (collectionId) {
    products = products.filter(p => p.collectionId === collectionId);
  }

  if (size) {
    products = products.filter(p => p.sizes.includes(size));
  }

  if (color) {
    products = products.filter(p => p.colors.some(c => c.includes(color)));
  }

  if (isNew) {
    products = products.filter(p => p.isNew);
  }

  if (isOffer) {
    products = products.filter(p => p.isOffer);
  }

  if (minPrice !== undefined) {
    products = products.filter(p => (p.offerPrice || p.price) >= minPrice);
  }

  if (maxPrice !== undefined) {
    products = products.filter(p => (p.offerPrice || p.price) <= maxPrice);
  }

  if (sortBy === 'newest') {
    products.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  } else if (sortBy === 'price-asc') {
    products.sort((a, b) => (a.offerPrice || a.price) - (b.offerPrice || b.price));
  } else if (sortBy === 'price-desc') {
    products.sort((a, b) => (b.offerPrice || b.price) - (a.offerPrice || a.price));
  } else {
    products.sort((a, b) => a.order - b.order);
  }

  return NextResponse.json(products);
}

export async function POST(request: Request) {
  const session = await getAdminFromSession();
  if (!session) {
    return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const data = getStoreData();

    const newProduct: Product = {
      id: 'prod-' + Date.now(),
      name: body.name || 'منتج جديد',
      nameEn: body.nameEn || '',
      price: Number(body.price) || 0,
      description: body.description || '',
      descriptionEn: body.descriptionEn || '',
      images: body.images || ['https://images.unsplash.com/photo-1594938298603-c8148c4dae35'],
      sizes: body.sizes || [],
      colors: body.colors || [],
      category: body.category || 'عام',
      collectionId: body.collectionId || '',
      isNew: Boolean(body.isNew),
      isOffer: Boolean(body.isOffer),
      offerPrice: body.offerPrice ? Number(body.offerPrice) : undefined,
      available: body.available !== undefined ? Boolean(body.available) : true,
      order: body.order ? Number(body.order) : data.products.length + 1,
      createdAt: new Date().toISOString(),
    };

    data.products.push(newProduct);
    saveStoreData(data);

    return NextResponse.json(newProduct, { status: 201 });
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json({ error: 'فشل إضافة المنتج' }, { status: 500 });
  }
}
