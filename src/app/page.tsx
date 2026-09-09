'use client';

import React, { useState, useEffect, useCallback, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useSettings } from '@/context/SettingsContext';
import { LoadingScreen } from '@/components/LoadingScreen';
import { Hero } from '@/components/Hero';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { ReusableCoverflow, CoverflowItem } from '@/components/ReusableCoverflow';
import { Product, Collection, Review } from '@/types';
import Image from 'next/image';
import { SlidersHorizontal, Search, Star, RefreshCw } from 'lucide-react';

function HomePageContent() {
  const { settings, t } = useSettings();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [products, setProducts] = useState<Product[]>([]);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);

  // Filters State
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedCollection, setSelectedCollection] = useState<string>('');
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [minPrice, setMinPrice] = useState<string>('');
  const [maxPrice, setMaxPrice] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('order');
  const [showFilters, setShowFilters] = useState(false);

  const fetchAllData = useCallback(async () => {
    try {
      const query = new URLSearchParams();
      if (searchQuery) query.set('search', searchQuery);
      if (selectedCategory) query.set('category', selectedCategory);
      if (selectedCollection) query.set('collectionId', selectedCollection);
      if (selectedSize) query.set('size', selectedSize);
      if (selectedColor) query.set('color', selectedColor);
      if (minPrice) query.set('minPrice', minPrice);
      if (maxPrice) query.set('maxPrice', maxPrice);
      if (sortBy) query.set('sortBy', sortBy);

      const [prodRes, colRes, revRes] = await Promise.all([
        fetch(`/api/products?${query.toString()}`),
        fetch('/api/collections'),
        fetch('/api/reviews'),
      ]);

      if (prodRes.ok) setProducts(await prodRes.json());
      if (colRes.ok) setCollections(await colRes.json());
      if (revRes.ok) setReviews(await revRes.json());
    } catch (err) {
      console.error('Failed to fetch home page data:', err);
    }
  }, [searchQuery, selectedCategory, selectedCollection, selectedSize, selectedColor, minPrice, maxPrice, sortBy]);

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  useEffect(() => {
    const s = searchParams.get('search');
    if (s !== null) {
      setSearchQuery(s);
    }
  }, [searchParams]);

  const handleProductClick = (item: CoverflowItem) => {
    router.push(`/products/${item.id}`);
  };

  const handleCollectionClick = (item: CoverflowItem) => {
    router.push(`/collections/${item.id}`);
  };

  const productCoverflowItems: CoverflowItem[] = products.map((p) => ({
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

  const newArrivalItems = productCoverflowItems.filter((item) => item.isNew);
  const offerItems = productCoverflowItems.filter((item) => item.isOffer);

  const collectionCoverflowItems: CoverflowItem[] = collections.map((c) => ({
    id: c.id,
    title: c.name,
    subtitle: c.description,
    image: c.image,
    rawItem: c,
  }));

  const allCategories = Array.from(new Set(products.map((p) => p.category)));

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-amber-400 selection:text-black">
      <LoadingScreen storeName={settings?.storeName || 'VERSACE'} logoUrl={settings?.logoUrl} />
      <Navigation />
      <Hero onExploreClick={() => {
        const el = document.getElementById('products');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-12 pb-32 lg:pb-12 space-y-24">
        {/* PRODUCTS SECTION */}
        <section id="products" className="scroll-mt-24">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="text-2xl sm:text-3xl font-serif text-white font-light tracking-widest uppercase">
                {t('productsTitle', 'تشكيلة المنتجات الفاخرة', 'Luxury Products')}
              </h2>
              <p className="text-xs text-neutral-400 font-light mt-1">
                {t('productsSub', 'اختر القطع التي تحاكي ذوقك الرفيع', 'Choose pieces tailored to your sophisticated taste')}
              </p>
            </div>

            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-neutral-900 border border-white/15 text-xs text-neutral-200 hover:text-amber-400 hover:border-amber-400/50 transition-all"
            >
              <SlidersHorizontal className="w-4 h-4" />
              <span>{t('filterOptions', 'تصفية وتصنيف المنتجات', 'Filters & Sort')}</span>
            </button>
          </div>

          {showFilters && (
            <div className="p-6 bg-neutral-900/90 rounded-2xl border border-white/10 mb-8 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-[11px] text-neutral-400 mb-1">
                    {t('searchLabel', 'اسم المنتج أو الوصف', 'Product Name / Keyword')}
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder={t('searchPlaceholder', 'بحث...', 'Search...')}
                      className="w-full bg-black text-xs text-white p-2.5 pl-8 rounded-lg border border-white/10 focus:outline-none focus:border-amber-400"
                    />
                    <Search className="w-3.5 h-3.5 absolute left-2.5 top-3 text-neutral-500" />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] text-neutral-400 mb-1">
                    {t('categoryLabel', 'التصنيف', 'Category')}
                  </label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full bg-black text-xs text-white p-2.5 rounded-lg border border-white/10 focus:outline-none focus:border-amber-400"
                  >
                    <option value="">{t('allCategories', 'جميع التصنيفات', 'All Categories')}</option>
                    {allCategories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] text-neutral-400 mb-1">
                    {t('collectionLabel', 'المجموعة', 'Collection')}
                  </label>
                  <select
                    value={selectedCollection}
                    onChange={(e) => setSelectedCollection(e.target.value)}
                    className="w-full bg-black text-xs text-white p-2.5 rounded-lg border border-white/10 focus:outline-none focus:border-amber-400"
                  >
                    <option value="">{t('allCollections', 'جميع المجموعات', 'All Collections')}</option>
                    {collections.map((col) => (
                      <option key={col.id} value={col.id}>
                        {col.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] text-neutral-400 mb-1">
                    {t('sortByLabel', 'ترتيب حسب', 'Sort By')}
                  </label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full bg-black text-xs text-white p-2.5 rounded-lg border border-white/10 focus:outline-none focus:border-amber-400"
                  >
                    <option value="order">{t('sortDefault', 'الافتراضي', 'Default')}</option>
                    <option value="newest">{t('sortNewest', 'الأحدث أولاً', 'Newest First')}</option>
                    <option value="price-asc">{t('sortPriceAsc', 'السعر: من الأقل للأعلى', 'Price: Low to High')}</option>
                    <option value="price-desc">{t('sortPriceDesc', 'السعر: من الأعلى للأقل', 'Price: High to Low')}</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('');
                    setSelectedCollection('');
                    setSelectedSize('');
                    setSelectedColor('');
                    setMinPrice('');
                    setMaxPrice('');
                    setSortBy('order');
                  }}
                  className="flex items-center gap-1 text-xs text-amber-400 hover:underline"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>{t('resetFilters', 'إعادة ضبط الفلاتر', 'Reset Filters')}</span>
                </button>
              </div>
            </div>
          )}

          <ReusableCoverflow
            items={productCoverflowItems}
            onItemClick={handleProductClick}
            buttonText={t('inquire', 'استفسر الآن', 'Inquire Now')}
          />
        </section>

        {/* COLLECTIONS SECTION */}
        <section id="collections" className="scroll-mt-24 pt-8">
          <ReusableCoverflow
            items={collectionCoverflowItems}
            onItemClick={handleCollectionClick}
            sectionTitle={t('collectionsSectionTitle', 'مجموعات الدار الفاخرة', 'Luxury House Collections')}
            sectionSubtitle={t('collectionsSectionSub', 'تشكيلات فريدة تناسب كافة المناسبات والأوقات', 'Exclusive collections crafted for every occasion')}
            buttonText={t('viewCollectionProducts', 'استعرض المنتجات', 'View Products')}
          />
        </section>

        {/* NEW ARRIVALS SECTION */}
        {newArrivalItems.length > 0 && (
          <section id="new-arrivals" className="scroll-mt-24 pt-8">
            <ReusableCoverflow
              items={newArrivalItems}
              onItemClick={handleProductClick}
              sectionTitle={t('newArrivalsTitle', 'وصل حديثاً', 'New Arrivals')}
              sectionSubtitle={t('newArrivalsSub', 'أحدث الابتكارات وصيحات الموضة التي وصلت دارنا مؤخراً', 'Latest arrivals and fashion innovations')}
              buttonText={t('inquire', 'استفسر الآن', 'Inquire Now')}
            />
          </section>
        )}

        {/* OFFERS SECTION */}
        {offerItems.length > 0 && (
          <section id="offers" className="scroll-mt-24 pt-8">
            <ReusableCoverflow
              items={offerItems}
              onItemClick={handleProductClick}
              sectionTitle={t('offersTitle', 'العروض الخاصة', 'Special Offers')}
              sectionSubtitle={t('offersSub', 'فرص استثنائية لاقتناء قطع فاخرة بأسعار مميزة', 'Exceptional opportunities for luxury pieces')}
              buttonText={t('inquireOffer', 'اغتنم العرض', 'Claim Offer')}
            />
          </section>
        )}

        {/* ABOUT US SECTION */}
        <section id="about" className="scroll-mt-24 py-12 px-6 bg-neutral-950 rounded-3xl border border-white/10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            <div className="space-y-4">
              <span className="text-amber-400 text-xs font-semibold tracking-widest uppercase">
                {t('aboutLabel', 'من نحن', 'About Us')}
              </span>
              <h2 className="text-2xl sm:text-4xl font-serif font-light text-white leading-tight">
                {t('aboutHeader', 'الأناقة والفخامة الإيطالية الأصيلة', 'Authentic Italian Luxury & Elegance')}
              </h2>
              <div className="h-[1px] w-12 bg-amber-400/60"></div>
              <p className="text-neutral-300 text-sm font-light leading-relaxed">
                {settings?.aboutUs ||
                  'تأسست دار الأثاث والأزياء الفاخرة لتقديم أحدث صيحات الموضة العالمية للرجل العصري. نتميز بتوفير أرقى خامات الأقمشة والتصاميم المبتكرة التي تعكس شخصية الرجل الواثق.'}
              </p>
            </div>

            <div className="relative h-[320px] rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
              <Image
                src={settings?.aboutUsImage || 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?q=80&w=1200&auto=format&fit=crop'}
                alt="About Us"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
          </div>
        </section>

        {/* REVIEWS SECTION */}
        {reviews.length > 0 && (
          <section id="reviews" className="py-12">
            <div className="text-center mb-10">
              <h2 className="text-2xl sm:text-3xl font-serif text-white font-light tracking-widest uppercase">
                {t('reviewsTitle', 'آراء العملاء المميزين', 'Customer Testimonials')}
              </h2>
              <p className="text-xs text-neutral-400 font-light mt-1">
                {t('reviewsSub', 'ما يقوله نخبة عملائنا عن تجربة التسوق لدينا', 'What our distinguished clients say about us')}
              </p>
              <div className="mt-3 h-[1px] w-16 bg-amber-400/50 mx-auto"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {reviews.map((rev) => (
                <div
                  key={rev.id}
                  className="p-6 bg-neutral-900/60 rounded-2xl border border-white/10 flex flex-col justify-between hover:border-amber-400/30 transition-all"
                >
                  <div className="space-y-3">
                    <div className="flex items-center gap-1 text-amber-400">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < rev.rating ? 'fill-amber-400 text-amber-400' : 'text-neutral-700'
                          }`}
                        />
                      ))}
                    </div>
                    <p className="text-xs text-neutral-300 font-light leading-relaxed italic">
                      &quot;{rev.comment}&quot;
                    </p>
                  </div>

                  <div className="mt-4 pt-4 border-t border-white/10 flex items-center justify-between">
                    <span className="text-xs font-semibold text-white">{rev.customerName}</span>
                    <span className="text-[10px] text-neutral-500">
                      {new Date(rev.createdAt).toLocaleDateString(t('locale', 'ar-EG', 'en-US'))}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
}

export default function HomePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-black text-white flex items-center justify-center">
          <div className="w-10 h-10 border-2 border-amber-400 border-t-transparent rounded-full animate-spin"></div>
        </div>
      }
    >
      <HomePageContent />
    </Suspense>
  );
}
