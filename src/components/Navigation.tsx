'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useSettings } from '@/context/SettingsContext';
import { Search, Home, Grid, Sparkles, Tag, Info, Globe, Shield } from 'lucide-react';

export const Navigation: React.FC = () => {
  const { settings, language, setLanguage, t } = useSettings();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/?search=${encodeURIComponent(searchQuery.trim())}#products`);
      setSearchOpen(false);
    }
  };

  const navItems = [
    { label: t('navHome', 'الرئيسية', 'Home'), href: '/', icon: Home },
    { label: t('navProducts', 'المنتجات', 'Products'), href: '/#products', icon: Grid },
    { label: t('navCollections', 'المجموعات', 'Collections'), href: '/#collections', icon: Tag },
    { label: t('navNew', 'وصل حديثاً', 'New Arrivals'), href: '/#new-arrivals', icon: Sparkles },
    { label: t('navOffers', 'العروض', 'Offers'), href: '/#offers', icon: Tag },
    { label: t('navAbout', 'من نحن', 'About Us'), href: '/#about', icon: Info },
  ];

  return (
    <>
      <header className="sticky top-0 z-50 w-full bg-black/90 backdrop-blur-md border-b border-white/10 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between gap-4">
          
          <Link href="/" className="flex items-center gap-3 group">
            <span className="font-serif text-2xl font-semibold tracking-[0.25em] text-white group-hover:text-amber-400 transition-colors uppercase">
              {settings?.storeName || 'VERSACE'}
            </span>
          </Link>

          <nav className="hidden lg:flex items-center gap-6">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-xs font-medium tracking-wider text-neutral-300 hover:text-white hover:border-b-2 hover:border-amber-400 pb-1 transition-all"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <form onSubmit={handleSearchSubmit} className="relative flex items-center">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t('searchPlaceholder', 'بحث عالي الفخامة...', 'Search luxury...')}
                className={`bg-neutral-900 text-xs text-white placeholder-neutral-500 rounded-full pl-9 pr-4 py-2 border border-white/15 focus:outline-none focus:border-amber-400/80 transition-all duration-300 ${
                  searchOpen ? 'w-48 sm:w-64 opacity-100' : 'w-9 sm:w-48 opacity-90 sm:opacity-100'
                }`}
              />
              <button
                type="submit"
                onClick={() => setSearchOpen(!searchOpen)}
                className="absolute left-2.5 text-neutral-400 hover:text-white p-1"
                aria-label="Search"
              >
                <Search className="w-4 h-4" />
              </button>
            </form>

            <button
              onClick={() => setLanguage(language === 'ar' ? 'en' : 'ar')}
              className="flex items-center gap-1 text-xs text-neutral-300 hover:text-amber-400 px-2.5 py-1.5 rounded-full border border-white/10 hover:border-white/20 transition-all"
              title="Toggle Language"
            >
              <Globe className="w-3.5 h-3.5" />
              <span className="uppercase font-semibold text-[10px]">
                {language === 'ar' ? 'EN' : 'عربي'}
              </span>
            </button>

            <Link
              href="/admin"
              className="p-2 text-neutral-400 hover:text-white transition-colors"
              title={t('admin', 'لوحة التحكم', 'Admin Dashboard')}
            >
              <Shield className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </header>

      <nav className="lg:hidden fixed bottom-4 left-4 right-4 z-50 bg-black/80 backdrop-blur-xl border border-white/15 rounded-full shadow-[0_10px_30px_rgba(0,0,0,0.8)] px-3 py-2 flex items-center justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center p-1.5 rounded-full transition-all duration-300 ${
                isActive
                  ? 'text-amber-400 scale-110'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[9px] mt-0.5 font-light tracking-tight">
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>
    </>
  );
};
