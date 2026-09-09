'use client';

import React, { useState, useEffect, use } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useSettings } from '@/context/SettingsContext';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { Product } from '@/types';
import { ArrowLeft, ArrowRight, MessageCircle, ChevronLeft, ChevronRight, Check } from 'lucide-react';

export default function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { settings, language, t } = useSettings();
  const router = useRouter();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('');

  useEffect(() => {
    async function fetchProduct() {
      try {
        const res = await fetch(`/api/products/${id}`);
        if (res.ok) {
          const data: Product = await res.json();
          setProduct(data);
          if (data.sizes && data.sizes.length > 0) setSelectedSize(data.sizes[0]);
          if (data.colors && data.colors.length > 0) setSelectedColor(data.colors[0]);
        }
      } catch (err) {
        console.error('Failed to load product details:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="w-12 h-12 border-2 border-white/20 border-t-amber-400 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6 text-center">
        <h1 className="text-2xl font-serif mb-4">{t('productNotFound', 'المنتج غير موجود', 'Product Not Found')}</h1>
        <button
          onClick={() => router.back()}
          className="px-6 py-2.5 bg-amber-400 text-black text-xs font-semibold rounded-full"
        >
          {t('goBack', 'الرجوع للخلف', 'Go Back')}
        </button>
      </div>
    );
  }

  const images = product.images && product.images.length > 0 ? product.images : ['https://images.unsplash.com/photo-1594938298603-c8148c4dae35'];
  const whatsappNum = settings?.whatsappNumber || '+963900000000';
  const cleanNumber = whatsappNum.replace(/[^\d+]/g, '');

  const waMessage = t(
    'waProductMsg',
    `مرحباً، أود الاستفسار وشراء المنتج: ${product.name} ${selectedSize ? `(المقاس: ${selectedSize})` : ''} ${selectedColor ? `(اللون: ${selectedColor})` : ''}`,
    `Hello, I would like to inquire about and purchase: ${product.name} ${selectedSize ? `(Size: ${selectedSize})` : ''} ${selectedColor ? `(Color: ${selectedColor})` : ''}`
  );

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-amber-400 selection:text-black">
      <Navigation />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-xs font-medium text-neutral-400 hover:text-amber-400 mb-8 transition-colors group"
        >
          {language === 'ar' ? <ArrowRight className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> : <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />}
          <span>{t('backToProducts', 'الرجوع إلى القائمة', 'Back to Store')}</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          <div className="space-y-4">
            <div className="relative w-full h-[450px] sm:h-[550px] rounded-2xl overflow-hidden bg-neutral-900 border border-white/10 shadow-2xl">
              <Image
                src={images[activeImageIndex]}
                alt={product.name}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover object-center"
              />

              {images.length > 1 && (
                <>
                  <button
                    onClick={() => setActiveImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))}
                    className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/60 border border-white/20 text-white hover:bg-black transition-colors"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setActiveImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/60 border border-white/20 text-white hover:bg-black transition-colors"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}

              <div className="absolute top-4 right-4 flex flex-col gap-1">
                {product.isNew && (
                  <span className="px-3 py-1 text-xs font-bold uppercase bg-amber-400 text-black rounded-full shadow-md">
                    {t('badgeNew', 'حديثاً', 'NEW')}
                  </span>
                )}
                {product.isOffer && (
                  <span className="px-3 py-1 text-xs font-bold uppercase bg-rose-600 text-white rounded-full shadow-md">
                    {t('badgeOffer', 'عروض', 'OFFER')}
                  </span>
                )}
              </div>
            </div>

            {images.length > 1 && (
              <div className="flex items-center gap-3 overflow-x-auto pb-2">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`relative w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 border-2 transition-all ${
                      activeImageIndex === idx ? 'border-amber-400 scale-105' : 'border-white/10 opacity-60 hover:opacity-100'
                    }`}
                  >
                    <Image src={img} alt="" fill className="object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div>
              <span className="text-amber-400 text-xs font-semibold uppercase tracking-widest bg-amber-400/10 px-3 py-1 rounded-full border border-amber-400/20">
                {product.category}
              </span>
              <h1 className="text-3xl sm:text-4xl font-serif font-light text-white mt-3 leading-tight">
                {product.name}
              </h1>
            </div>

            <div className="flex items-center gap-4">
              {product.isOffer && product.offerPrice ? (
                <>
                  <span className="text-3xl font-semibold text-amber-400">${product.offerPrice}</span>
                  <span className="text-lg text-neutral-500 line-through">${product.price}</span>
                  <span className="text-xs text-rose-400 font-medium bg-rose-950/60 border border-rose-800 px-2.5 py-1 rounded-md">
                    {t('save', 'توفير خاص', 'Special Discount')}
                  </span>
                </>
              ) : (
                <span className="text-3xl font-semibold text-white">${product.price}</span>
              )}
            </div>

            <div className="p-4 bg-neutral-900/60 rounded-xl border border-white/10">
              <p className="text-xs sm:text-sm text-neutral-300 font-light leading-relaxed">
                {product.description}
              </p>
            </div>

            {product.sizes && product.sizes.length > 0 && (
              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-2">
                  {t('selectSize', 'المقاس المتاح:', 'Available Sizes:')}
                </label>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((s) => (
                    <button
                      key={s}
                      onClick={() => setSelectedSize(s)}
                      className={`px-4 py-2 text-xs font-medium rounded-lg border transition-all ${
                        selectedSize === s
                          ? 'bg-white text-black border-white shadow-md'
                          : 'bg-neutral-900 text-neutral-300 border-white/15 hover:border-white/40'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {product.colors && product.colors.length > 0 && (
              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-2">
                  {t('selectColor', 'اللون المتاح:', 'Available Colors:')}
                </label>
                <div className="flex flex-wrap gap-2">
                  {product.colors.map((c) => (
                    <button
                      key={c}
                      onClick={() => setSelectedColor(c)}
                      className={`px-4 py-2 text-xs font-medium rounded-lg border transition-all ${
                        selectedColor === c
                          ? 'bg-amber-400 text-black border-amber-400 shadow-md font-semibold'
                          : 'bg-neutral-900 text-neutral-300 border-white/15 hover:border-white/40'
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="flex items-center gap-2 text-xs">
              <span className="text-neutral-400">{t('availability', 'الحالة:', 'Status:')}</span>
              {product.available ? (
                <span className="text-emerald-400 flex items-center gap-1 font-medium">
                  <Check className="w-3.5 h-3.5" />
                  {t('inStock', 'متوفر في المعرض', 'In Stock')}
                </span>
              ) : (
                <span className="text-rose-400 font-medium">{t('outOfStock', 'نفدت الكمية', 'Out of Stock')}</span>
              )}
            </div>

            <div className="pt-4 border-t border-white/10">
              <a
                href={`https://wa.me/${cleanNumber}?text=${encodeURIComponent(waMessage)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-4 px-6 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-semibold tracking-wider rounded-xl shadow-lg shadow-emerald-950/50 flex items-center justify-center gap-3 transition-all duration-300 group"
              >
                <MessageCircle className="w-5 h-5 fill-white stroke-none group-hover:rotate-12 transition-transform" />
                <span>{t('orderViaWa', 'تواصل للطلب والاستفسار عبر واتساب', 'Inquire & Order via WhatsApp')}</span>
              </a>
              <p className="text-[11px] text-neutral-500 text-center mt-2 font-light">
                {t('waHint', 'سيتم إدراج تفاصيل المنتج والمقاس تلقائياً في الرسالة', 'Product details will be automatically included in the message')}
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
