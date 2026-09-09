'use client';

import React, { useEffect, useState } from 'react';
import { Review } from '@/types';
import { Plus, Edit2, Trash2, Star, X } from 'lucide-react';

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingReview, setEditingReview] = useState<Review | null>(null);

  const [customerName, setCustomerName] = useState('');
  const [comment, setComment] = useState('');
  const [rating, setRating] = useState('5');

  const fetchReviews = async () => {
    try {
      const res = await fetch('/api/reviews');
      if (res.ok) setReviews(await res.json());
    } catch (err) {
      console.error('Failed to load reviews:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const openModal = (rev?: Review) => {
    if (rev) {
      setEditingReview(rev);
      setCustomerName(rev.customerName);
      setComment(rev.comment);
      setRating(rev.rating.toString());
    } else {
      setEditingReview(null);
      setCustomerName('');
      setComment('');
      setRating('5');
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingReview(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      customerName,
      comment,
      rating: parseInt(rating, 10) || 5,
    };

    const url = editingReview ? `/api/reviews/${editingReview.id}` : '/api/reviews';
    const method = editingReview ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        fetchReviews();
        closeModal();
      } else {
        alert('حدث خطأ أثناء حفظ التقييم');
      }
    } catch (err) {
      console.error('Error saving review:', err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('هل أنت متأكد من رغبتك في حذف هذا التقييم؟')) return;

    try {
      const res = await fetch(`/api/reviews/${id}`, { method: 'DELETE' });
      if (res.ok) fetchReviews();
    } catch (err) {
      console.error('Error deleting review:', err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-serif text-white font-light">إدارة تقييمات العملاء</h1>
          <p className="text-xs text-neutral-400 mt-1">إضافة، تعديل، وحذف آراء العملاء المعروضة على الصفحة الرئيسية</p>
        </div>

        <button
          onClick={() => openModal()}
          className="flex items-center gap-2 px-4 py-2.5 bg-amber-400 text-black text-xs font-semibold rounded-xl hover:bg-amber-300 transition-colors shadow-lg"
        >
          <Plus className="w-4 h-4" />
          <span>إضافة تقييم جديد</span>
        </button>
      </div>

      {loading ? (
        <div className="p-12 text-center text-neutral-500 text-xs">جاري تحميل التقييمات...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {reviews.map((rev) => (
            <div
              key={rev.id}
              className="p-5 bg-neutral-950 border border-white/10 rounded-2xl flex flex-col justify-between space-y-4 hover:border-amber-400/40 transition-all"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-white text-sm">{rev.customerName}</span>
                  <div className="flex items-center gap-1 text-amber-400">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3.5 h-3.5 ${
                          i < rev.rating ? 'fill-amber-400 text-amber-400' : 'text-neutral-700'
                        }`}
                      />
                    ))}
                  </div>
                </div>
                <p className="text-xs text-neutral-300 font-light leading-relaxed italic">
                  &quot;{rev.comment}&quot;
                </p>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-white/10">
                <button
                  onClick={() => openModal(rev)}
                  className="p-2 text-neutral-400 hover:text-amber-400 hover:bg-neutral-900 rounded-lg transition-colors flex items-center gap-1 text-xs"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  <span>تعديل</span>
                </button>
                <button
                  onClick={() => handleDelete(rev.id)}
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
                {editingReview ? 'تعديل التقييم' : 'إضافة تقييم جديد'}
              </h2>
              <button onClick={closeModal} className="p-2 text-neutral-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-neutral-400 mb-1">اسم العميل</label>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full bg-black text-white p-3 rounded-xl border border-white/10 focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-neutral-400 mb-1">التقييم بالنجوم (1 إلى 5)</label>
                <select
                  value={rating}
                  onChange={(e) => setRating(e.target.value)}
                  className="w-full bg-black text-white p-3 rounded-xl border border-white/10 focus:outline-none focus:border-amber-400"
                >
                  <option value="5">5 نجوم (ممتاز)</option>
                  <option value="4">4 نجوم (جيد جداً)</option>
                  <option value="3">3 نجوم (جيد)</option>
                  <option value="2">2 نجوم (متوسط)</option>
                  <option value="1">1 نجمة (ضعيف)</option>
                </select>
              </div>

              <div>
                <label className="block text-neutral-400 mb-1">تعليق العميل</label>
                <textarea
                  rows={3}
                  required
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="w-full bg-black text-white p-3 rounded-xl border border-white/10 focus:outline-none focus:border-amber-400"
                ></textarea>
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
                  حفظ التقييم
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
