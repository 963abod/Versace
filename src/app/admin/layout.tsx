'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, ShoppingBag, Layers, MessageSquare, Settings, LogOut, Store } from 'lucide-react';

export default function AdminLayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [authenticated, setAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    if (pathname === '/admin/login') {
      setAuthenticated(true);
      return;
    }

    async function checkAuth() {
      try {
        const res = await fetch('/api/auth/me');
        if (res.ok) {
          setAuthenticated(true);
        } else {
          setAuthenticated(false);
          router.push('/admin/login');
        }
      } catch {
        setAuthenticated(false);
        router.push('/admin/login');
      }
    }
    checkAuth();
  }, [pathname, router]);

  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  if (authenticated === null) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-amber-400 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/admin/login');
  };

  const navItems = [
    { label: 'الرئيسية والإحصائيات', href: '/admin', icon: LayoutDashboard },
    { label: 'إدارة المنتجات', href: '/admin/products', icon: ShoppingBag },
    { label: 'إدارة المجموعات', href: '/admin/collections', icon: Layers },
    { label: 'إدارة التقييمات', href: '/admin/reviews', icon: MessageSquare },
    { label: 'الإعدادات المركزية', href: '/admin/settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-black text-white flex flex-col md:flex-row font-sans">
      <aside className="w-full md:w-64 bg-neutral-950 border-b md:border-b-0 md:border-l border-white/10 p-6 flex flex-col justify-between flex-shrink-0">
        <div className="space-y-8">
          <div className="flex items-center justify-between">
            <Link href="/admin" className="font-serif text-xl font-semibold tracking-widest text-amber-400 uppercase">
              لوحة التحكم
            </Link>
            <Link href="/" target="_blank" className="p-2 text-neutral-400 hover:text-white" title="زيارة المتجر">
              <Store className="w-4 h-4" />
            </Link>
          </div>

          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-amber-400 text-black font-semibold shadow-md'
                      : 'text-neutral-400 hover:bg-neutral-900 hover:text-white'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="pt-6 border-t border-white/10 mt-6">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs text-rose-400 hover:bg-rose-950/40 hover:text-rose-300 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>تسجيل الخروج</span>
          </button>
        </div>
      </aside>

      <main className="flex-1 p-6 md:p-10 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
