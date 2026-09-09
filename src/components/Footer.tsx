'use client';

import React from 'react';
import { useSettings } from '@/context/SettingsContext';

export const Footer: React.FC = () => {
  const { settings, t } = useSettings();

  const storeName = settings?.storeName || 'VERSACE';
  const footerText = settings?.footerText || `جميع الحقوق محفوظة © 2025 ${storeName}`;
  const aboudUrl = settings?.aboudUrl || 'https://aboudweb.onrender.com';

  return (
    <footer className="w-full bg-black border-t border-white/10 text-neutral-400 py-12 px-6">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-start">
        <div className="flex flex-col items-center md:items-start gap-2">
          <span className="font-serif text-xl text-white font-semibold tracking-widest uppercase">
            {storeName}
          </span>
          <p className="text-xs font-light text-neutral-500 max-w-sm">
            {t('footerSub', 'الأناقة والفخامة الإيطالية الأصلية للرجل العصري المميز.', 'Italian luxury & elegance for the distinguished modern gentleman.')}
          </p>
        </div>

        <div className="flex flex-col items-center md:items-end gap-2 text-xs font-light text-neutral-400">
          <p>{footerText}</p>
          <p className="flex items-center gap-1">
            <span>{t('designedBy', 'تصميم وتطوير', 'Designed & Developed by')}</span>
            <a
              href={aboudUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-amber-400 hover:underline font-medium transition-all"
            >
              عبود
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
};
