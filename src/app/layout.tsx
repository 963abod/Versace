import type { Metadata } from 'next';
import { Inter, Playfair_Display } from 'next/font/google';
import './globals.css';
import { SettingsProvider } from '@/context/SettingsContext';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-serif',
});

export const metadata: Metadata = {
  title: 'VERSACE — Luxury Men Fashion Store',
  description: 'Unrivaled Luxury, Authentic Italian Style for the Modern Gentleman.',
  openGraph: {
    title: 'VERSACE — Luxury Men Fashion Store',
    description: 'Unrivaled Luxury, Authentic Italian Style for the Modern Gentleman.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" className={`${inter.variable} ${playfair.variable} dark`}>
      <body className="bg-black text-white antialiased min-h-screen">
        <SettingsProvider>{children}</SettingsProvider>
      </body>
    </html>
  );
}
