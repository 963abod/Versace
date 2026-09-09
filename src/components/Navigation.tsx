'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useSettings } from '@/context/SettingsContext';
import { Search, Home, Grid, Sparkles, Tag, Info, Globe, MapPin, Menu, X, Phone } from 'lucide-react';

export const Navigation: React.FC = () => {
  const { settings, language, setLanguage, t } = useSettings();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');
  const [visibleMobileNav, setVisibleMobileNav] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  const pathname = usePathname();
  const router = useRouter();

  const googleMapsUrl = settings?.googleMaps || 'https://maps.google.com';

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/?search=${encodeURIComponent(searchQuery.trim())}#products`);
      setSearchOpen(false);
    }
  };

  const navItems = [
    { id: 'hero', label: t('navHome', 'الرئيسية', 'Home'), href: '/', icon: Home },
    { id: 'products', label: t('navProducts', 'المنتجات', 'Products'), href: '/#products', icon: Grid },
    { id: 'collections', label: t('navCollections', 'المجموعات', 'Collections'), href: '/#collections', icon: Tag },
    { id: 'new-arrivals', label: t('navNew', 'وصل حديثاً', 'New Arrivals'), href: '/#new-arrivals', icon: Sparkles },
    { id: 'offers', label: t('navOffers', 'العروض', 'Offers'), href: '/#offers', icon: Tag },
    { id: 'about', label: t('navAbout', 'من نحن', 'About Us'), href: '/#about', icon: Info },
  ];

  // Smooth Hide / Show Mobile Bottom Navigation on scroll
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setVisibleMobileNav(false); // Hide on scroll down
      } else {
        setVisibleMobileNav(true); // Show on scroll up
      }
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  // Active Section Intersection Sync
  useEffect(() => {
    if (pathname !== '/') {
      setActiveSection('');
      return;
    }

    const sectionIds = ['hero', 'products', 'collections', 'new-arrivals', 'offers', 'about'];
    const handleObserver = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(handleObserver, {
      rootMargin: '-20% 0px -60% 0px',
      threshold: 0.1,
    });

    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [pathname]);

  return (
    <>
      {/* Desktop & Tablet Header Bar */}
      <header className="sticky top-0 z-50 w-full bg-black/90 backdrop-blur-md border-b border-white/10 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between gap-4">
          
          <Link href="/" className="flex items-center gap-3 group">
            <span className="font-serif text-2xl font-semibold tracking-[0.25em] text-white group-hover:text-amber-400 transition-colors uppercase">
              {settings?.storeName || 'VERSACE'}
            </span>
          </Link>

          {/* Desktop Nav Items */}
          <nav className="hidden lg:flex items-center gap-6">
            {navItems.map((item) => {
              const isActive = activeSection === item.id || (pathname === '/' && item.id === 'hero' && !activeSection);
              return (
                <Link
                  key={item.id}
                  href={item.href}
                  className={`text-xs font-medium tracking-wider pb-1 border-b-2 transition-all duration-300 ${
                    isActive
                      ? 'text-amber-400 border-amber-400 font-semibold'
                      : 'text-neutral-400 border-transparent hover:text-white'
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
            <a
              href={googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-medium tracking-wider text-neutral-400 hover:text-amber-400 pb-1 border-b-2 border-transparent transition-colors flex items-center gap-1"
            >
              <MapPin className="w-3.5 h-3.5" />
              <span>{t('storeLocation', 'موقع المحل', 'Store Location')}</span>
            </a>
          </nav>

          {/* Search, Language & Mobile Hamburger Button */}
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

            {/* Mobile Drawer Trigger (Hamburger Button) */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-2 text-neutral-300 hover:text-amber-400 rounded-full border border-white/10 hover:border-amber-400/50 transition-colors"
              aria-label="Open Menu"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Floating Glassmorphism Mobile Bottom Navigation (Hides smoothly on scroll down) */}
      <nav
        className={`lg:hidden fixed bottom-4 left-4 right-4 z-40 bg-black/85 backdrop-blur-xl border border-white/15 rounded-full shadow-[0_10px_30px_rgba(0,0,0,0.8)] px-3 py-2 flex items-center justify-around transition-transform duration-500 ease-in-out ${
          visibleMobileNav ? 'translate-y-0' : 'translate-y-24'
        }`}
      >
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeSection === item.id || (pathname === '/' && item.id === 'hero' && !activeSection);
          return (
            <Link
              key={item.id}
              href={item.href}
              className={`flex flex-col items-center justify-center p-1.5 rounded-full transition-all duration-300 ${
                isActive
                  ? 'text-amber-400 scale-110 font-semibold'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span className="text-[9px] mt-0.5 font-light tracking-tight">
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>

      {/* Mobile Drawer Overlay Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-2xl flex flex-col justify-between p-6 animate-in fade-in duration-300">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <span className="font-serif text-2xl font-semibold tracking-[0.2em] text-white uppercase">
              {settings?.storeName || 'VERSACE'}
            </span>
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="p-2.5 text-neutral-400 hover:text-white rounded-full bg-neutral-900 border border-white/10"
              aria-label="Close Menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-4 my-auto py-6">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;
              return (
                <Link
                  key={item.id}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-4 py-3 px-4 rounded-2xl text-base font-serif font-light transition-all ${
                    isActive
                      ? 'bg-amber-400/10 border border-amber-400/30 text-amber-400 font-normal'
                      : 'text-neutral-300 hover:text-white hover:bg-neutral-900'
                  }`}
                >
                  <Icon className={`w-5 h-5 ${isActive ? 'text-amber-400' : 'text-neutral-400'}`} />
                  <span>{item.label}</span>
                </Link>
              );
            })}

            <a
              href={googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-4 py-3 px-4 rounded-2xl text-base font-serif font-light text-amber-400 hover:bg-amber-400/10 transition-all border border-amber-400/20"
            >
              <MapPin className="w-5 h-5 text-amber-400" />
              <span>{t('storeLocation', 'موقع المحل / الخريطة', 'Store Location / Map')}</span>
            </a>
          </div>

          <div className="pt-4 border-t border-white/10 space-y-2 text-xs text-neutral-400">
            <p className="flex items-center gap-2">
              <Phone className="w-3.5 h-3.5 text-amber-400" />
              <span>{settings?.phone || '+963900000000'}</span>
            </p>
            <p className="text-[11px] text-neutral-500">{settings?.address}</p>
          </div>
        </div>
      )}
    </>
  );
};
