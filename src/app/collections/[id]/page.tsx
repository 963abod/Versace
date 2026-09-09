'use client';

import React, { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { useSettings } from '@/context/SettingsContext';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { ReusableCoverflow, CoverflowItem } from '@/components/ReusableCoverflow';
import { Collection, Product } from '@/types';
import { ArrowLeft, ArrowRight } from 'lucide-react';

export default function CollectionDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { t, language } = useSettings();
  const router = useRouter();

  const [collection, setCollection] = useState<(Collection & { products?: Product[] }) | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCollection() {
      try {
        const res = await fetch(`/api/collections/${id}`);
        if (res.ok) {
          setCollection(await res.json());
        }
      } catch (err) {
        console.error('Failed to load collection details:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchCollection();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="w-12 h-12 border-2 border-white/20 border-t-amber-400 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!collection) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6 text-center">
        <h1 className="text-2xl font-serif mb-4">{t('collectionNotFound', 'المجموعة غير موجودة', 'Collection Not Found')}</h1>
        <button
          onClick={() => router.back()}
          className="px-6 py-2.5 bg-amber-400 text-black text-xs font-semibold rounded-full"
        >
          {t('goBack', 'الرجوع للخلف', 'Go Back')}
        </button>
      </div>
    );
  }

  const collectionProducts = collection.products || [];
  const coverflowItems: CoverflowItem[] = collectionProducts.map((p) => ({
    id: p.id,
    title: p.name,
    subtitle: p.category,
    price: p.price,
    offerPrice: p.offerPrice,
    image: p.images[0] || 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35',
    isNew: p.isNew,
    isOffer: p.isOffer,
    rawItem: p,
  }));

  return (
    <div className="min-h-screen bg-black text-white font-sans">
      <Navigation />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-xs font-medium text-neutral-400 hover:text-amber-400 mb-8 transition-colors group"
        >
          {language === 'ar' ? <ArrowRight className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> : <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />}
          <span>{t('backToCollections', 'الرجوع للمجموعات', 'Back to Collections')}</span>
        </button>

        <div className="relative w-full h-[280px] rounded-3xl overflow-hidden border border-white/10 mb-12 flex items-end p-8">
          <img src={collection.image} alt={collection.name} className="absolute inset-0 w-full h-full object-cover opacity-50" />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>
          <div className="relative z-10 max-w-xl">
            <span className="text-amber-400 text-xs font-semibold tracking-widest uppercase bg-amber-400/10 px-3 py-1 rounded-full border border-amber-400/20">
              {t('collectionBadge', 'مجموعة فاخرة', 'Luxury Collection')}
            </span>
            <h1 className="text-3xl sm:text-4xl font-serif text-white font-light mt-2">{collection.name}</h1>
            <p className="text-xs sm:text-sm text-neutral-300 font-light mt-2">{collection.description}</p>
          </div>
        </div>

        {coverflowItems.length > 0 ? (
          <ReusableCoverflow
            items={coverflowItems}
            onItemClick={(item) => router.push(`/products/${item.id}`)}
            sectionTitle={t('collectionProductsTitle', 'قطع هذه المجموعة', 'Collection Pieces')}
            buttonText={t('inquire', 'استفسر الآن', 'Inquire Now')}
          />
        ) : (
          <div className="text-center py-16 text-neutral-500 font-light text-sm">
            {t('noProductsInCollection', 'لا توجد منتجات مضافة في هذه المجموعة حالياً.', 'No products in this collection yet.')}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
