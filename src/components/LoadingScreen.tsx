'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';

interface LoadingScreenProps {
  storeName?: string;
  logoUrl?: string;
  onFinish?: () => void;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ storeName = 'VERSACE', logoUrl, onFinish }) => {
  const [fading, setFading] = useState(false);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setFading(true);
      setTimeout(() => {
        setHidden(true);
        if (onFinish) onFinish();
      }, 700);
    }, 1200);

    return () => clearTimeout(timer);
  }, [onFinish]);

  if (hidden) return null;

  return (
    <div
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black transition-opacity duration-700 ease-in-out ${
        fading ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      <div className="relative flex flex-col items-center">
        <div className="w-24 h-24 mb-6 relative animate-spin-slow flex items-center justify-center">
          {logoUrl ? (
            <Image
              src={logoUrl}
              alt={storeName}
              width={96}
              height={96}
              className="object-contain"
              priority
            />
          ) : (
            <div className="w-20 h-20 rounded-full border-2 border-white/20 border-t-white flex items-center justify-center">
              <span className="text-white font-serif text-2xl font-bold tracking-widest">
                {storeName.charAt(0)}
              </span>
            </div>
          )}
        </div>

        <h1 className="text-white font-serif text-2xl tracking-[0.3em] font-light uppercase text-center">
          {storeName}
        </h1>
        <div className="mt-2 h-[1px] w-12 bg-amber-400/60"></div>
      </div>
    </div>
  );
};
