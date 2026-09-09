'use client';

import React from 'react';
import Image from 'next/image';
import { useSettings } from '@/context/SettingsContext';
import { MessageCircle } from 'lucide-react';

interface HeroProps {
  onExploreClick?: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onExploreClick }) => {
  const { settings, t } = useSettings();

  const title = t(
    'heroTitle',
    settings?.heroTitle || 'فخامة لا تُضاهى، أسلوب إيطالي أصيل',
    settings?.heroTitleEn || 'Unrivaled Luxury, Authentic Italian Style'
  );

  const description = t(
    'heroDescription',
    settings?.heroDescription || 'اكتشف التشكيلة الجديدة الفاخرة المصممة للرجل العصري الأنيق.',
    settings?.heroDescriptionEn || 'Discover the new luxury collection crafted for the modern gentleman.'
  );

  const heroImg = settings?.heroImage || 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=1600&auto=format&fit=crop';
  const whatsappNum = settings?.whatsappNumber || '+963900000000';
  const cleanNumber = whatsappNum.replace(/[^\d+]/g, '');

  return (
    <section className="relative w-full h-[85vh] min-h-[500px] max-h-[900px] overflow-hidden bg-black">
      <div className="absolute inset-0 z-0">
        <Image
          src={heroImg}
          alt={title}
          fill
          priority
          sizes="100vw"
          className="object-cover object-center opacity-65 scale-105 transition-transform duration-1000 ease-out"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/60"></div>
      </div>

      <a
        href={`https://wa.me/${cleanNumber}?text=${encodeURIComponent(
          t('waDefaultMsg', 'مرحباً، أود الاستفسار عن التشكيلة الفاخرة لدى متجركم.', 'Hello, I would like to inquire about your luxury collection.')
        )}`}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-24 right-6 z-40 flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-emerald-950/40 backdrop-blur-md border border-emerald-500/40 text-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.3)] hover:scale-105 hover:shadow-[0_0_25px_rgba(16,185,129,0.5)] hover:border-emerald-400 transition-all duration-300 group"
        aria-label="WhatsApp Contact"
      >
        <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center text-black shadow-md group-hover:rotate-12 transition-transform">
          <MessageCircle className="w-5 h-5 fill-black stroke-emerald-500" />
        </div>
        <span className="text-xs font-semibold tracking-wide text-emerald-100 hidden sm:inline">
          {t('whatsapp', 'تواصل معنا', 'Contact Us')}
        </span>
      </a>

      <div className="relative z-10 max-w-6xl mx-auto h-full px-6 flex flex-col justify-end pb-16 text-center sm:text-start">
        <div className="max-w-2xl">
          <span className="inline-block text-amber-400 text-xs tracking-[0.25em] uppercase font-semibold mb-3 bg-amber-400/10 px-3 py-1 rounded-full border border-amber-400/20">
            {t('luxuryStore', 'متجر الأزياء الفاخرة', 'Luxury Fashion Store')}
          </span>
          
          <h1 className="text-3xl sm:text-5xl font-serif text-white font-light tracking-wide leading-tight mb-4 drop-shadow-md">
            {title}
          </h1>

          <p className="text-neutral-300 text-sm sm:text-base font-light leading-relaxed mb-8 max-w-xl">
            {description}
          </p>

          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4">
            <button
              onClick={onExploreClick}
              className="px-8 py-3.5 bg-white text-black text-xs font-semibold tracking-widest uppercase rounded-sm hover:bg-neutral-200 transition-all duration-300 shadow-lg active:scale-95"
            >
              {t('exploreCollection', 'استكشف المجموعة', 'Explore Collection')}
            </button>
            <a
              href="#collections"
              className="px-8 py-3.5 bg-neutral-900/80 backdrop-blur-sm border border-white/20 text-white text-xs font-semibold tracking-widest uppercase rounded-sm hover:bg-neutral-800 transition-all duration-300"
            >
              {t('viewCollections', 'المجموعات', 'Collections')}
            </a>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black to-transparent z-10 pointer-events-none"></div>
    </section>
  );
};
