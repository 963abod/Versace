'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { ShoppingBag, Sparkles, Tag, Layers, MessageSquare, ArrowLeft } from 'lucide-react';
import { Product, Collection, Review } from '@/types';

export default function AdminDashboardPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const [prodRes, colRes, revRes] = await Promise.all([
          fetch('/api/products'),
          fetch('/api/collections'),
          fetch('/api/reviews'),
        ]);

        if (prodRes.ok) setProducts(await prodRes.json());
        if (colRes.ok) setCollections(await colRes.json());
        if (revRes.ok) setReviews(await revRes.json());
      } catch (err) {
        console.error('Failed to load dashboard stats:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-10 h-10 border-2 border-amber-400 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const newProductsCount = products.filter((p) => p.isNew).length;
  const offersCount = products.filter((p) => p.isOffer).length;

  const statCards = [
    {
      title: 'إجمالي المنتجات',
      count: products.length,
      icon: ShoppingBag,
      color: 'text-amber-400 bg-amber-400/10 border-amber-400/20',
      href: '/admin/products',
    },
    {
      title: 'المنتجات الجديدة',
      count: newProductsCount,
      icon: Sparkles,
      color: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20',
      href: '/admin/products',
    },
    {
      title: 'العروض الخاصة',
      count: offersCount,
      icon: Tag,
      color: 'text-rose-400 bg-rose-400/10 border-rose-400/20',
      href: '/admin/products',
    },
    {
      title: 'المجموعات',
      count: collections.length,
      icon: Layers,
      color: 'text-sky-400 bg-sky-400/10 border-sky-400/20',
      href: '/admin/collections',
    },
    {
      title: 'آراء وتقييمات العملاء',
      count: reviews.length,
      icon: MessageSquare,
      color: 'text-purple-400 bg-purple-400/10 border-purple-400/20',
      href: '/admin/reviews',
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-serif font-light text-white tracking-wide">
          مرحباً بك في لوحة تحكم المتجر
        </h1>
        <p className="text-xs text-neutral-400 mt-1">
          إليك نظرة عامة سريعة على بيانات وإحصائيات المتجر الفاخر.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {statCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <Link
              key={idx}
              href={card.href}
              className="p-6 bg-neutral-950 rounded-2xl border border-white/10 hover:border-amber-400/40 transition-all group flex flex-col justify-between space-y-4"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs text-neutral-400 font-medium">{card.title}</span>
                <div className={`p-2.5 rounded-xl border ${card.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
              </div>

              <div className="flex items-baseline justify-between">
                <span className="text-3xl font-semibold text-white">{card.count}</span>
                <span className="text-xs text-neutral-500 group-hover:text-amber-400 flex items-center gap-1 transition-colors">
                  إدارة <ArrowLeft className="w-3 h-3" />
                </span>
              </div>
            </Link>
          );
        })}
      </div>

      <div className="p-6 bg-neutral-950 rounded-2xl border border-white/10 space-y-4">
        <h2 className="text-sm font-semibold text-white">إجراءات سريعة</h2>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/admin/products"
            className="px-4 py-2 bg-amber-400 text-black text-xs font-semibold rounded-xl hover:bg-amber-300 transition-colors"
          >
            + إضافة منتج جديد
          </Link>
          <Link
            href="/admin/collections"
            className="px-4 py-2 bg-neutral-900 border border-white/15 text-white text-xs font-semibold rounded-xl hover:bg-neutral-800 transition-colors"
          >
            + إضافة مجموعة جديدة
          </Link>
          <Link
            href="/admin/settings"
            className="px-4 py-2 bg-neutral-900 border border-white/15 text-white text-xs font-semibold rounded-xl hover:bg-neutral-800 transition-colors"
          >
            تعديل إعدادات المتجر والواتساب
          </Link>
        </div>
      </div>
    </div>
  );
}
