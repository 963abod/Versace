'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { Collection } from '@/types';
import { Plus, Edit2, Trash2, Upload, X } from 'lucide-react';

export default function AdminCollectionsPage() {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCollection, setEditingCollection] = useState<Collection | null>(null);

  const [name, setName] = useState('');
  const [nameEn, setNameEn] = useState('');
  const [description, setDescription] = useState('');
  const [descriptionEn, setDescriptionEn] = useState('');
  const [image, setImage] = useState('');
  const [order, setOrder] = useState('1');
  const [uploading, setUploading] = useState(false);

  const fetchCollections = async () => {
    try {
      const res = await fetch('/api/collections');
      if (res.ok) setCollections(await res.json());
    } catch (err) {
      console.error('Failed to load collections:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCollections();
  }, []);

  const openModal = (col?: Collection) => {
    if (col) {
      setEditingCollection(col);
      setName(col.name);
      setNameEn(col.nameEn || '');
      setDescription(col.description);
      setDescriptionEn(col.descriptionEn || '');
      setImage(col.image);
      setOrder(col.order.toString());
    } else {
      setEditingCollection(null);
      setName('');
      setNameEn('');
      setDescription('');
      setDescriptionEn('');
      setImage('https://images.unsplash.com/photo-1594938298603-c8148c4dae35');
      setOrder((collections.length + 1).toString());
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingCollection(null);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('files', files[0]);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        setImage(data.urls[0]);
      } else {
        alert('فشل تحميل الصورة');
      }
    } catch (err) {
      console.error('Image upload error:', err);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      name,
      nameEn,
      description,
      descriptionEn,
      image,
      order: parseInt(order, 10) || 1,
    };

    const url = editingCollection ? `/api/collections/${editingCollection.id}` : '/api/collections';
    const method = editingCollection ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        fetchCollections();
        closeModal();
      } else {
        alert('حدث خطأ أثناء حفظ المجموعة');
      }
    } catch (err) {
      console.error('Error saving collection:', err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('هل أنت تأكد من رغبتك في حذف هذه المجموعة؟')) return;

    try {
      const res = await fetch(`/api/collections/${id}`, { method: 'DELETE' });
      if (res.ok) fetchCollections();
    } catch (err) {
      console.error('Error deleting collection:', err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-serif text-white font-light">إدارة المجموعات</h1>
          <p className="text-xs text-neutral-400 mt-1">إضافة وتعديل مجموعات الأزياء المعروضة في Coverflow</p>
        </div>

        <button
          onClick={() => openModal()}
          className="flex items-center gap-2 px-4 py-2.5 bg-amber-400 text-black text-xs font-semibold rounded-xl hover:bg-amber-300 transition-colors shadow-lg"
        >
          <Plus className="w-4 h-4" />
          <span>إضافة مجموعة جديدة</span>
        </button>
      </div>

      {loading ? (
        <div className="p-12 text-center text-neutral-500 text-xs">جاري تحميل المجموعات...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {collections.map((col) => (
            <div
              key={col.id}
              className="p-5 bg-neutral-950 border border-white/10 rounded-2xl flex flex-col justify-between space-y-4 hover:border-amber-400/40 transition-all"
            >
              <div className="flex items-start gap-4">
                <div className="relative w-24 h-24 rounded-xl overflow-hidden bg-neutral-900 border border-white/10 flex-shrink-0">
                  <Image src={col.image} alt={col.name} fill className="object-cover" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-serif text-lg font-light text-white">{col.name}</h3>
                  <p className="text-[10px] text-neutral-500 font-mono">الترتيب: {col.order}</p>
                  <p className="text-xs text-neutral-300 font-light line-clamp-2">{col.description}</p>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-white/10">
                <button
                  onClick={() => openModal(col)}
                  className="p-2 text-neutral-400 hover:text-amber-400 hover:bg-neutral-900 rounded-lg transition-colors flex items-center gap-1 text-xs"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  <span>تعديل</span>
                </button>
                <button
                  onClick={() => handleDelete(col.id)}
                  className="p-2 text-neutral-400 hover:text-rose-400 hover:bg-neutral-900 rounded-lg transition-colors flex items-center gap-1 text-xs"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>حذف</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-neutral-950 border border-white/10 w-full max-w-lg rounded-3xl p-6 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <h2 className="text-lg font-serif text-white">
                {editingCollection ? 'تعديل البيانات' : 'إضافة مجموعة جديدة'}
              </h2>
              <button onClick={closeModal} className="p-2 text-neutral-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-neutral-400 mb-1">اسم المجموعة (عربي)</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-black text-white p-3 rounded-xl border border-white/10 focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-neutral-400 mb-1">اسم المجموعة (English)</label>
                <input
                  type="text"
                  value={nameEn}
                  onChange={(e) => setNameEn(e.target.value)}
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

              <div>
                <label className="block text-neutral-400 mb-1">وصف قصير</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-black text-white p-3 rounded-xl border border-white/10 focus:outline-none focus:border-amber-400"
                ></textarea>
              </div>

              <div>
                <label className="block text-neutral-400 mb-2">صورة المجموعة</label>
                <div className="flex items-center gap-4">
                  {image && (
                    <div className="relative w-20 h-20 rounded-xl overflow-hidden border border-white/10">
                      <Image src={image} alt="" fill className="object-cover" />
                    </div>
                  )}

                  <label className="px-4 py-2 bg-neutral-900 border border-white/15 hover:border-amber-400 rounded-xl cursor-pointer text-neutral-300 hover:text-white flex items-center gap-2">
                    <Upload className="w-4 h-4" />
                    <span>{uploading ? 'جاري التحميل...' : 'تغيير الصورة'}</span>
                    <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                  </label>
                </div>
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
