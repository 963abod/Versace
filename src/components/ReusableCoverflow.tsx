'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, MessageCircle } from 'lucide-react';
import { useSettings } from '@/context/SettingsContext';

export interface CoverflowItem {
  id: string;
  title: string;
  subtitle?: string;
  price?: number;
  offerPrice?: number;
  image: string;
  isNew?: boolean;
  isOffer?: boolean;
  linkHref?: string;
  onButtonClick?: () => void;
  rawItem?: unknown;
}

interface ReusableCoverflowProps {
  items: CoverflowItem[];
  onItemClick?: (item: CoverflowItem, index: number) => void;
  onActiveChange?: (item: CoverflowItem, index: number) => void;
  initialIndex?: number;
  sectionTitle?: string;
  sectionSubtitle?: string;
  buttonText?: string;
}

export const ReusableCoverflow: React.FC<ReusableCoverflowProps> = ({
  items,
  onItemClick,
  onActiveChange,
  initialIndex = 0,
  sectionTitle,
  sectionSubtitle,
  buttonText = 'تواصل للاستفسار',
}) => {
  const { settings, t } = useSettings();
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [isAnimating, setIsAnimating] = useState(false);

  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  const total = items.length;

  const updateCarousel = useCallback(
    (newIndex: number) => {
      if (isAnimating || total === 0) return;
      setIsAnimating(true);

      const normalizedIndex = (newIndex + total) % total;
      setCurrentIndex(normalizedIndex);

      if (onActiveChange && items[normalizedIndex]) {
        onActiveChange(items[normalizedIndex], normalizedIndex);
      }

      setTimeout(() => {
        setIsAnimating(false);
      }, 500);
    },
    [isAnimating, total, items, onActiveChange]
  );

  const handleNext = useCallback(() => {
    updateCarousel(currentIndex + 1);
  }, [currentIndex, updateCarousel]);

  const handlePrev = useCallback(() => {
    updateCarousel(currentIndex - 1);
  }, [currentIndex, updateCarousel]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') {
        handlePrev();
      } else if (e.key === 'ArrowLeft') {
        handleNext();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleNext, handlePrev]);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    const distance = touchStartX.current - touchEndX.current;
    const isSwipeLeft = distance > 40;
    const isSwipeRight = distance < -40;

    if (isSwipeLeft) {
      handleNext();
    } else if (isSwipeRight) {
      handlePrev();
    }

    touchStartX.current = null;
    touchEndX.current = null;
  };

  if (!items || items.length === 0) {
    return (
      <div className="w-full py-12 text-center text-neutral-500 font-light">
        {t('noItems', 'لا توجد عناصر لعرضها حالياً', 'No items available at the moment')}
      </div>
    );
  }

  const whatsappNum = settings?.whatsappNumber || '+963900000000';
  const cleanNumber = whatsappNum.replace(/[^\d+]/g, '');

  return (
    <div className="w-full py-8 flex flex-col items-center select-none overflow-hidden">
      {(sectionTitle || sectionSubtitle) && (
        <div className="text-center mb-8 px-4">
          {sectionTitle && (
            <h2 className="text-2xl sm:text-3xl font-serif text-white tracking-widest font-light uppercase">
              {sectionTitle}
            </h2>
          )}
          {sectionSubtitle && (
            <p className="text-xs sm:text-sm text-neutral-400 font-light mt-2 max-w-md mx-auto">
              {sectionSubtitle}
            </p>
          )}
          <div className="mt-3 h-[1px] w-16 bg-amber-400/50 mx-auto"></div>
        </div>
      )}

      <div
        className="relative w-full max-w-5xl h-[380px] sm:h-[450px] flex items-center justify-center perspective-[1000px] my-4"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div className="relative w-full h-full flex justify-center items-center transform-preserve-3d">
          {items.map((item, i) => {
            const offset = (i - currentIndex + total) % total;

            let cardClass = 'hidden opacity-0 pointer-events-none';
            let style: React.CSSProperties = {
              transition: 'all 0.5s cubic-bezier(0.22, 1, 0.36, 1)',
            };

            if (offset === 0) {
              cardClass = 'z-20 scale-100 sm:scale-105 opacity-100 translate-z-0 pointer-events-auto shadow-2xl shadow-black/80 border border-amber-400/30';
            } else if (offset === 1) {
              cardClass = 'z-10 translate-x-[110px] sm:translate-x-[220px] scale-80 sm:scale-90 opacity-80 translate-z-[-100px] cursor-pointer hover:opacity-100';
              style.filter = 'grayscale(100%)';
            } else if (offset === 2) {
              cardClass = 'z-0 translate-x-[200px] sm:translate-x-[400px] scale-65 sm:scale-75 opacity-40 translate-z-[-300px] cursor-pointer hidden xs:block';
              style.filter = 'grayscale(100%)';
            } else if (offset === total - 1) {
              cardClass = 'z-10 -translate-x-[110px] sm:-translate-x-[220px] scale-80 sm:scale-90 opacity-80 translate-z-[-100px] cursor-pointer hover:opacity-100';
              style.filter = 'grayscale(100%)';
            } else if (offset === total - 2) {
              cardClass = 'z-0 -translate-x-[200px] sm:-translate-x-[400px] scale-65 sm:scale-75 opacity-40 translate-z-[-300px] cursor-pointer hidden xs:block';
              style.filter = 'grayscale(100%)';
            }

            const isCenter = offset === 0;

            return (
              <div
                key={item.id}
                onClick={() => {
                  if (!isCenter) {
                    updateCarousel(i);
                  } else if (onItemClick) {
                    onItemClick(item, i);
                  }
                }}
                style={style}
                className={`absolute w-[230px] sm:w-[290px] h-[330px] sm:h-[400px] rounded-2xl overflow-hidden bg-neutral-900 ${cardClass}`}
              >
                <div className="relative w-full h-full">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    sizes="(max-width: 640px) 230px, 290px"
                    className="object-cover object-center"
                    priority={isCenter}
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent"></div>

                  <div className="absolute top-3 right-3 flex flex-col gap-1 z-10">
                    {item.isNew && (
                      <span className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider bg-amber-400 text-black rounded-full shadow-md">
                        {t('badgeNew', 'حديثاً', 'NEW')}
                      </span>
                    )}
                    {item.isOffer && (
                      <span className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider bg-rose-600 text-white rounded-full shadow-md">
                        {t('badgeOffer', 'عروض', 'OFFER')}
                      </span>
                    )}
                  </div>

                  <div className="absolute bottom-0 left-0 right-0 p-4 text-center flex flex-col items-center">
                    <h3 className="text-white font-serif text-base sm:text-lg font-light tracking-wide line-clamp-1">
                      {item.title}
                    </h3>

                    {item.subtitle && (
                      <p className="text-neutral-400 text-xs font-light mt-0.5 line-clamp-1">
                        {item.subtitle}
                      </p>
                    )}

                    {item.price !== undefined && (
                      <div className="mt-2 flex items-center justify-center gap-2">
                        {item.offerPrice ? (
                          <>
                            <span className="text-amber-400 font-semibold text-sm sm:text-base">
                              ${item.offerPrice}
                            </span>
                            <span className="text-neutral-500 text-xs line-through">
                              ${item.price}
                            </span>
                          </>
                        ) : (
                          <span className="text-neutral-200 font-semibold text-sm sm:text-base">
                            ${item.price}
                          </span>
                        )}
                      </div>
                    )}

                    {isCenter && (
                      <div className="mt-3 w-full flex items-center justify-center gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            if (onItemClick) {
                              onItemClick(item, i);
                            }
                          }}
                          className="flex-1 py-2 px-3 bg-white text-black text-[11px] font-semibold tracking-wider rounded-md hover:bg-amber-400 transition-colors shadow-lg active:scale-95"
                        >
                          {buttonText}
                        </button>

                        <a
                          href={`https://wa.me/${cleanNumber}?text=${encodeURIComponent(
                            t('waInquiryMsg', `مرحباً، أود الاستفسار عن منتج: ${item.title}`, `Hello, I would like to inquire about: ${item.title}`)
                          )}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="p-2 bg-emerald-600/80 hover:bg-emerald-500 text-white rounded-md transition-colors"
                          title="استفسار عبر واتساب"
                        >
                          <MessageCircle className="w-4 h-4 fill-white stroke-none" />
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex items-center gap-6 mt-4 z-10">
        <button
          onClick={handlePrev}
          disabled={isAnimating}
          className="p-2.5 rounded-full bg-neutral-900/80 border border-white/10 text-white hover:border-amber-400/50 hover:bg-neutral-800 transition-all disabled:opacity-40"
          aria-label="Previous Item"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2">
          {items.map((_, i) => (
            <button
              key={i}
              onClick={() => updateCarousel(i)}
              className={`h-2 rounded-full transition-all duration-300 ${
                i === currentIndex
                  ? 'w-6 bg-amber-400'
                  : 'w-2 bg-neutral-700 hover:bg-neutral-500'
              }`}
              aria-label={`Go to item ${i + 1}`}
            />
          ))}
        </div>

        <button
          onClick={handleNext}
          disabled={isAnimating}
          className="p-2.5 rounded-full bg-neutral-900/80 border border-white/10 text-white hover:border-amber-400/50 hover:bg-neutral-800 transition-all disabled:opacity-40"
          aria-label="Next Item"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
