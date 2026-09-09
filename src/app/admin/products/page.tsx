'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { Product, Collection } from '@/types';
import { Plus, Edit2, Trash2, Upload, Search, X } from 'lucide-react';

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const [name, setName] = useState('');
  const [nameEn, setNameEn] = useState('');
  const [price, setPrice] = useState('');
  const [offerPrice, setOfferPrice] = useState('');
  const [description, setDescription] = useState('');
  const [descriptionEn, setDescriptionEn] = useState('');
  const [category, setCategory] = useState('بدلات');
  const [collectionId, setCollectionId] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [sizesStr, setSizesStr] = useState('48, 50, 52, 54');
  const [colorsStr, setColorsStr] = useState('أسود, كحلي');
  const [isNew, setIsNew] = useState(false);
  const [isOffer, setIsOffer] = useState(false);
  const [available, setAvailable] = useState(true);
  const [order, setOrder] = useState('1');
  const [uploading, setUploading] = useState(false);

  const fetchProductsAndCollections = async () => {
    try {
      const [pRes, cRes] = await Promise.all([
        fetch('/api/products'),
        fetch('/api/collections'),
      ]);
      if (pRes.ok) setProducts(await pRes.json());
      if (cRes.ok) setCollections(await cRes.json());
    } catch (err) {
      console.error('Failed to fetch product data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductsAndCollections();
  }, []);

  const openModal = (product?: Product) => {
    if (product) {
      setEditingProduct(product);
      setName(product.name);
      setNameEn(product.nameEn || '');
      setPrice(product.price.toString());
      setOfferPrice(product.offerPrice ? product.offerPrice.toString() : '');
      setDescription(product.description);
      setDescriptionEn(product.descriptionEn || '');
      setCategory(product.category);
      setCollectionId(product.collectionId || '');
      setImages(product.images || []);
      setSizesStr((product.sizes || []).join(', '));
      setColorsStr((product.colors || []).join(', '));
      setIsNew(product.isNew);
      setIsOffer(product.isOffer);
      setAvailable(product.available);
      setOrder(product.order.toString());
    } else {
      setEditingProduct(null);
      setName('');
      setNameEn('');
      setPrice('');
      setOfferPrice('');
      setDescription('');
      setDescriptionEn('');
      setCategory('بدلات');
      setCollectionId('');
      setImages([]);
      setSizesStr('S, M, L, XL');
      setColorsStr('أسود');
      setIsNew(true);
      setIsOffer(false);
      setAvailable(true);
      setOrder((products.length + 1).toString());
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append('files', files[i]);
    }

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        setImages((prev) => [...prev, ...data.urls]);
      } else {
        alert('فشل تحميل الصورة');
      }
    } catch (err) {
      console.error('Image upload error:', err);
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      name,
      nameEn,
      price: parseFloat(price) || 0,
      offerPrice: offerPrice ? parseFloat(offerPrice) : undefined,
      description,
      descriptionEn,
      category,
      collectionId,
      images: images.length > 0 ? images : ['https://images.unsplash.com/photo-1594938298603-c8148c4dae35'],
      sizes: sizesStr.split(',').map((s) => s.trim()).filter(Boolean),
      colors: colorsStr.split(',').map((c) => c.trim()).filter(Boolean),
      isNew,
      isOffer,
      available,
      order: parseInt(order, 10) || 1,
    };

    const url = editingProduct ? `/api/products/${editingProduct.id}` : '/api/products';
    const method = editingProduct ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        fetchProductsAndCollections();
        closeModal();
      } else {
        alert('حدث خطأ أثناء حفظ المنتج');
      }
    } catch (err) {
      console.error('Error saving product:', err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('هل أنت متأكد من رغبتك في حذف هذا المنتج؟')) return;

    try {
      const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
      if (res.ok) {
        fetchProductsAndCollections();
      }
    } catch (err) {
      console.error('Error deleting product:', err);
    }
  };

  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-serif text-white font-light">إدارة المنتجات</h1>
          <p className="text-xs text-neutral-400 mt-1">إضافة، تعديل، وترتيب منتجات المعرض الفاخر</p>
        </div>

        <button
          onClick={() => openModal()}
          className="flex items-center gap-2 px-4 py-2.5 bg-amber-400 text-black text-xs font-semibold rounded-xl hover:bg-amber-300 transition-colors shadow-lg"
        >
          <Plus className="w-4 h-4" />
          <span>إضافة منتج جديد</span>
        </button>
      </div>

      <div className="relative max-w-md">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="بحث بالاسم أو التصنيف..."
          className="w-full bg-neutral-950 text-xs text-white p-3 pr-10 rounded-xl border border-white/10 focus:outline-none focus:border-amber-400"
        />
        <Search className="w-4 h-4 absolute right-3 top-3.5 text-neutral-500" />
      </div>

      <div className="bg-neutral-950 border border-white/10 rounded-2xl overflow-hidden shadow-xl">
        {loading ? (
          <div className="p-12 text-center text-neutral-500 text-xs">جاري تحميل المنتجات...</div>
        ) : filteredProducts.length === 0 ? (
          <div className="p-12 text-center text-neutral-500 text-xs">لا توجد منتجات مطابقة للبحث</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs text-neutral-300">
              <thead className="bg-neutral-900 border-b border-white/10 text-neutral-400 uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="p-4">المنتج</th>
                  <th className="p-4">التصنيف</th>
                  <th className="p-4">السعر</th>
                  <th className="p-4">الشارات</th>
                  <th className="p-4">التوفر</th>
                  <th className="p-4">الترتيب</th>
                  <th className="p-4 text-center">الإجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-neutral-900/50 transition-colors">
                    <td className="p-4 flex items-center gap-3">
                      <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-neutral-900 flex-shrink-0 border border-white/10">
                        <Image
                          src={product.images[0] || 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35'}
                          alt={product.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <p className="font-semibold text-white">{product.name}</p>
                        <p className="text-[10px] text-neutral-500">{product.nameEn}</p>
                      </div>
                    </td>
                    <td className="p-4">{product.category}</td>
                    <td className="p-4 font-medium">
                      {product.isOffer && product.offerPrice ? (
                        <div className="flex flex-col">
                          <span className="text-amber-400 font-semibold">${product.offerPrice}</span>
                          <span className="text-[10px] text-neutral-500 line-through">${product.price}</span>
                        </div>
                      ) : (
                        <span>${product.price}</span>
                      )}
                    </td>
                    <td className="p-4 space-x-1 space-x-reverse">
                      {product.isNew && (
                        <span className="px-2 py-0.5 text-[9px] bg-amber-400/20 text-amber-400 border border-amber-400/30 rounded-full font-semibold">
                          حديثاً
                        </span>
                      )}
                      {product.isOffer && (
                        <span className="px-2 py-0.5 text-[9px] bg-rose-500/20 text-rose-400 border border-rose-500/30 rounded-full font-semibold">
                          عرض
                        </span>
                      )}
                    </td>
                    <td className="p-4">
                      {product.available ? (
                        <span className="text-emerald-400 font-medium">متوفر</span>
                      ) : (
                        <span className="text-rose-400 font-medium">غير متوفر</span>
                      )}
                    </td>
                    <td className="p-4 font-mono">{product.order}</td>
                    <td className="p-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => openModal(product)}
                          className="p-2 text-neutral-400 hover:text-amber-400 hover:bg-neutral-800 rounded-lg transition-colors"
                          title="تعديل"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(product.id)}
                          className="p-2 text-neutral-400 hover:text-rose-400 hover:bg-neutral-800 rounded-lg transition-colors"
                          title="حذف"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-neutral-950 border border-white/10 w-full max-w-2xl rounded-2xl sm:rounded-3xl p-4 sm:p-8 space-y-6 my-4 sm:my-8 max-h-[95vh] sm:max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <h2 className="text-lg font-serif text-white">
                {editingProduct ? 'تعديل بيانات المنتج' : 'إضافة منتج جديد'}
              </h2>
              <button onClick={closeModal} className="p-2 text-neutral-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-neutral-400 mb-1">اسم المنتج (عربي)</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-black text-white p-3 rounded-xl border border-white/10 focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-neutral-400 mb-1">اسم المنتج (English)</label>
                  <input
                    type="text"
                    value={nameEn}
                    onChange={(e) => setNameEn(e.target.value)}
                    className="w-full bg-black text-white p-3 rounded-xl border border-white/10 focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-neutral-400 mb-1">السعر الأصلي ($)</label>
                  <input
                    type="number"
                    required
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-full bg-black text-white p-3 rounded-xl border border-white/10 focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-neutral-400 mb-1">سعر العرض ($ إن وجد)</label>
                  <input
                    type="number"
                    value={offerPrice}
                    onChange={(e) => setOfferPrice(e.target.value)}
                    className="w-full bg-black text-white p-3 rounded-xl border border-white/10 focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-neutral-400 mb-1">ترتيب العرض</label>
                  <input
                    type="number"
                    value={order}
                    onChange={(e) => setOrder(e.target.value)}
                    className="w-full bg-black text-white p-3 rounded-xl border border-white/10 focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-neutral-400 mb-1">التصنيف</label>
                  <input
                    type="text"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    placeholder="مثال: بدلات، قمصان، أحذية"
                    className="w-full bg-black text-white p-3 rounded-xl border border-white/10 focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-neutral-400 mb-1">المجموعة</label>
                  <select
                    value={collectionId}
                    onChange={(e) => setCollectionId(e.target.value)}
                    className="w-full bg-black text-white p-3 rounded-xl border border-white/10 focus:outline-none focus:border-amber-400"
                  >
                    <option value="">بدون مجموعة</option>
                    {collections.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-neutral-400 mb-1">الوصف (عربي)</label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-black text-white p-3 rounded-xl border border-white/10 focus:outline-none focus:border-amber-400"
                ></textarea>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-neutral-400 mb-1">المقاسات المتاحة (مفصولة بفواصل)</label>
                  <input
                    type="text"
                    value={sizesStr}
                    onChange={(e) => setSizesStr(e.target.value)}
                    placeholder="48, 50, 52, 54"
                    className="w-full bg-black text-white p-3 rounded-xl border border-white/10 focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-neutral-400 mb-1">الألوان المتاحة (مفصولة بفواصل)</label>
                  <input
                    type="text"
                    value={colorsStr}
                    onChange={(e) => setColorsStr(e.target.value)}
                    placeholder="أسود, كحلي, كحلي داكن"
                    className="w-full bg-black text-white p-3 rounded-xl border border-white/10 focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-neutral-400 mb-2">صور المنتج (يمكنك رفع عدة صور)</label>
                <div className="flex flex-wrap gap-3 mb-3">
                  {images.map((url, idx) => (
                    <div key={idx} className="relative w-20 h-20 rounded-xl overflow-hidden border border-white/10 group">
                      <Image src={url} alt="" fill className="object-cover" />
                      <button
                        type="button"
                        onClick={() => removeImage(idx)}
                        className="absolute top-1 right-1 p-1 bg-black/80 text-rose-400 rounded-full hover:bg-rose-600 hover:text-white transition-colors"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}

                  <label className="w-20 h-20 rounded-xl border-2 border-dashed border-white/20 hover:border-amber-400 flex flex-col items-center justify-center cursor-pointer transition-colors text-neutral-400 hover:text-amber-400">
                    <Upload className="w-5 h-5 mb-1" />
                    <span className="text-[10px]">{uploading ? 'تحميل...' : 'رفع صورة'}</span>
                    <input type="file" multiple accept="image/*" onChange={handleImageUpload} className="hidden" />
                  </label>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isNew}
                    onChange={(e) => setIsNew(e.target.checked)}
                    className="rounded border-white/20 text-amber-400 focus:ring-amber-400"
                  />
                  <span>تعليم كـ &quot;وصل حديثاً&quot;</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isOffer}
                    onChange={(e) => setIsOffer(e.target.checked)}
                    className="rounded border-white/20 text-amber-400 focus:ring-amber-400"
                  />
                  <span>تعليم كـ &quot;عرض خاص&quot;</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={available}
                    onChange={(e) => setAvailable(e.target.checked)}
                    className="rounded border-white/20 text-amber-400 focus:ring-amber-400"
                  />
                  <span>متوفر في المعرض</span>
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-5 py-2.5 bg-neutral-900 border border-white/10 text-neutral-300 rounded-xl hover:bg-neutral-800"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-amber-400 text-black font-semibold rounded-xl hover:bg-amber-300 shadow-lg"
                >
                  حفظ البيانات
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
