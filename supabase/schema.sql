-- Supabase Database Schema Migration for VERSACE Store
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Collections Table
CREATE TABLE IF NOT EXISTS public.collections (
    id TEXT PRIMARY KEY DEFAULT ('col-' || extract(epoch from now())::bigint::text),
    name TEXT NOT NULL,
    name_en TEXT,
    image TEXT NOT NULL,
    description TEXT,
    description_en TEXT,
    "order" INT DEFAULT 1,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Products Table
CREATE TABLE IF NOT EXISTS public.products (
    id TEXT PRIMARY KEY DEFAULT ('prod-' || extract(epoch from now())::bigint::text),
    name TEXT NOT NULL,
    name_en TEXT,
    price NUMERIC NOT NULL,
    offer_price NUMERIC,
    description TEXT,
    description_en TEXT,
    images TEXT[] DEFAULT '{}',
    sizes TEXT[] DEFAULT '{}',
    colors TEXT[] DEFAULT '{}',
    category TEXT NOT NULL DEFAULT 'عام',
    collection_id TEXT REFERENCES public.collections(id) ON DELETE SET NULL,
    is_new BOOLEAN DEFAULT false,
    is_offer BOOLEAN DEFAULT false,
    available BOOLEAN DEFAULT true,
    "order" INT DEFAULT 1,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Reviews Table
CREATE TABLE IF NOT EXISTS public.reviews (
    id TEXT PRIMARY KEY DEFAULT ('rev-' || extract(epoch from now())::bigint::text),
    customer_name TEXT NOT NULL,
    comment TEXT NOT NULL,
    rating INT DEFAULT 5 CHECK (rating >= 1 AND rating <= 5),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Settings Table
CREATE TABLE IF NOT EXISTS public.settings (
    id INT PRIMARY KEY DEFAULT 1 CHECK (id = 1),
    store_name TEXT DEFAULT 'VERSACE',
    logo_url TEXT DEFAULT '/images/versace-logo.png',
    hero_image TEXT DEFAULT 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=1600&auto=format&fit=crop',
    hero_title TEXT DEFAULT 'فخامة لا تُضاهى، أسلوب إيطالي أصيل',
    hero_title_en TEXT DEFAULT 'Unrivaled Luxury, Authentic Italian Style',
    hero_description TEXT DEFAULT 'اكتشف التشكيلة الجديدة الفاخرة لعام 2026 المصممة للرجل العصري الأنيق.',
    hero_description_en TEXT DEFAULT 'Discover the new luxury 2026 collection crafted for the modern gentleman.',
    whatsapp_number TEXT DEFAULT '+963900000000',
    phone TEXT DEFAULT '+963900000000',
    instagram TEXT DEFAULT 'https://instagram.com/versace',
    facebook TEXT DEFAULT 'https://facebook.com/versace',
    google_maps TEXT DEFAULT 'https://maps.google.com',
    address TEXT DEFAULT 'شارع الفخامة الرئيسي، المزة، دمشق',
    opening_hours TEXT DEFAULT 'يومياً من 10:00 صباحاً حتى 11:00 مساءً',
    about_us TEXT DEFAULT 'تأسست دار الأزياء الفاخرة لتقديم أحدث صيحات الموضة العالمية للرجل العصري. نتميز بتوفير أرقى خامات الأقمشة والتصاميم المبتكرة التي تعكس شخصية الرجل الواثق.',
    about_us_en TEXT DEFAULT 'Established to deliver the finest international men fashion trends to the modern gentleman. We pride ourselves on offering top-quality fabrics and distinctive designs.',
    about_us_image TEXT DEFAULT 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?q=80&w=1200&auto=format&fit=crop',
    footer_text TEXT DEFAULT 'جميع الحقوق محفوظة © 2026 VERSACE',
    aboud_url TEXT DEFAULT 'https://aboudweb.onrender.com',
    admin_username TEXT DEFAULT 'admin',
    admin_password_hash TEXT DEFAULT '$2b$10$k83OLkgrx.loL5OvqWZMqevxmoK1OtEibbLKCiLHrFLtAhXs5o916',
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;

-- Allow Public Read Access for All Tables
CREATE POLICY "Allow Public Read Collections" ON public.collections FOR SELECT USING (true);
CREATE POLICY "Allow Public Read Products" ON public.products FOR SELECT USING (true);
CREATE POLICY "Allow Public Read Reviews" ON public.reviews FOR SELECT USING (true);
CREATE POLICY "Allow Public Read Settings" ON public.settings FOR SELECT USING (true);

-- Allow Public/Anon Insert/Update/Delete (or handle via Service Role Key / Auth in API)
CREATE POLICY "Allow Full Access Collections" ON public.collections FOR ALL USING (true);
CREATE POLICY "Allow Full Access Products" ON public.products FOR ALL USING (true);
CREATE POLICY "Allow Full Access Reviews" ON public.reviews FOR ALL USING (true);
CREATE POLICY "Allow Full Access Settings" ON public.settings FOR ALL USING (true);

-- Seed Default Settings Record if Not Exists
INSERT INTO public.settings (id) VALUES (1) ON CONFLICT (id) DO NOTHING;

-- Seed Sample Collections
INSERT INTO public.collections (id, name, name_en, image, description, description_en, "order") VALUES
('col-1', 'بدلات السهرة والرسمية', 'Suits & Formal Wear', 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?q=80&w=800&auto=format&fit=crop', 'تصاميم إيطالية فاخرة للمناسبات الخاصة والاجتماعات الهامة.', 'Luxury Italian designs for special occasions and executive meetings.', 1),
('col-2', 'قمصان الحرير والقطن الفاخر', 'Luxury Silk & Cotton Shirts', 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?q=80&w=800&auto=format&fit=crop', 'أرقى أنواع القطن والحرير الطبيعي.', 'Finest Egyptian cotton and natural silk shirts.', 2),
('col-3', 'الأحذية والجلديات الإيطالية', 'Italian Shoes & Leatherware', 'https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?q=80&w=800&auto=format&fit=crop', 'مصنوعة يدوياً بكفاءة عالية وأجود أنواع الجلد الطبيعي.', 'Handcrafted with premium genuine leather.', 3),
('col-4', 'الإكسسوارات والساعات', 'Accessories & Timepieces', 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=800&auto=format&fit=crop', 'لمسات فاخرة تكتمل بها أناقة الرجل.', 'Exquisite details that complete a gentleman style.', 4)
ON CONFLICT (id) DO NOTHING;

-- Seed Sample Products
INSERT INTO public.products (id, name, name_en, price, offer_price, description, description_en, images, sizes, colors, category, collection_id, is_new, is_offer, available, "order") VALUES
('prod-1', 'بدلة توكسيدو سوداء كلاسيكية', 'Classic Black Tuxedo Suit', 1250, NULL, 'بدلة رسمية من الصوف الفاخر 100% مع ياقة ستان إيطالي وتفاصيل مطرزة بدقة.', 'Formal suit in 100% fine wool with Italian satin lapels and precision tailoring.', ARRAY['https://images.unsplash.com/photo-1594938298603-c8148c4dae35?q=80&w=800&auto=format&fit=crop', 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=800&auto=format&fit=crop'], ARRAY['48', '50', '52', '54', '56'], ARRAY['أسود', 'كحلي داكن'], 'بدلات', 'col-1', true, false, true, 1),
('prod-2', 'قميص حرير أسود بحبكات ذهبية', 'Black Silk Shirt with Gold Accents', 480, 390, 'قميص مصمم من الحرير الطبيعي بحبكات ذهبية مستوحاة من التراث الملكي الإيطالي.', 'Natural silk shirt with gold accents inspired by Italian heritage.', ARRAY['https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?q=80&w=800&auto=format&fit=crop', 'https://images.unsplash.com/photo-1620012253295-c15cc3e65df4?q=80&w=800&auto=format&fit=crop'], ARRAY['S', 'M', 'L', 'XL'], ARRAY['أسود / ذهبي', 'أبيض / ذهبي'], 'قمصان', 'col-2', true, true, true, 2),
('prod-3', 'حذاء لوفر جلد طبيعي مطرز', 'Embroidered Leather Loafer', 650, NULL, 'حذاء جلد طبيعي فاخر ببطانة مريحة وشعار معدني ذهبي مقاوم للخدش.', 'Genuine leather loafers with comfortable lining and scratch-resistant metallic crest.', ARRAY['https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?q=80&w=800&auto=format&fit=crop', 'https://images.unsplash.com/photo-1533867617858-e7b97e060509?q=80&w=800&auto=format&fit=crop'], ARRAY['41', '42', '43', '44', '45'], ARRAY['أسود', 'بني داكن'], 'أحذية', 'col-3', false, false, true, 3),
('prod-4', 'جاكيت جلدي فاخر بطبعة مدوزا', 'Luxury Leather Jacket', 1850, 1550, 'جاكيت جلد طبيعي بقصة عصرية ومبطن بالستان الحريري لحماية ودفء مثاليين.', 'Genuine leather jacket tailored modernly with satin silk lining.', ARRAY['https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=800&auto=format&fit=crop', 'https://images.unsplash.com/photo-1520975954732-35dd22299614?q=80&w=800&auto=format&fit=crop'], ARRAY['M', 'L', 'XL', 'XXL'], ARRAY['أسود'], 'جاكيتات', 'col-1', true, true, true, 4),
('prod-5', 'ساعة يد كلاسيكية إيطالية', 'Classic Italian Gold Watch', 2100, 1800, 'ساعة فاخرة بهيكل مقاوم للماء ومطلي بالذهب عيار 18 مع زجاج زفير لا يخدش.', 'Luxury timepiece with 18k gold plating, scratch-proof sapphire crystal.', ARRAY['https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=800&auto=format&fit=crop', 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?q=80&w=800&auto=format&fit=crop'], ARRAY['One Size'], ARRAY['ذهبي / أسود', 'فضي / أسود'], 'إكسسوارات', 'col-4', false, true, true, 5),
('prod-6', 'نظارة شمسية سوداء بإطار ذهبي', 'Black Sunglasses with Gold Frame', 320, NULL, 'نظارة شمسية فاخرة بتصميم مستقبلي حماية 100% من الأشعة فوق البنفسجية.', 'Luxury sunglasses featuring 100% UV protection and iconic design.', ARRAY['https://images.unsplash.com/photo-1511499767150-a48a237f0083?q=80&w=800&auto=format&fit=crop'], ARRAY['One Size'], ARRAY['أسود / ذهبي'], 'إكسسوارات', 'col-4', true, false, true, 6)
ON CONFLICT (id) DO NOTHING;

-- Seed Sample Reviews
INSERT INTO public.reviews (id, customer_name, comment, rating) VALUES
('rev-1', 'أحمد الإبراهيم', 'جودة البدلة تتجاوز التوقعات، القماش إيطالي أصيل وتعاملك مع الزبائن فاخر للغاية.', 5),
('rev-2', 'سامر الخالد', 'سرعة توصيل واهتمام بالتفاصيل، القميص الحريري رائع جداً ومريح في اللبس.', 5),
('rev-3', 'محمد العلي', 'تجربة تسوق ممتازة وأسعار مناسبة جداً للقطع الفاخرة.', 4)
ON CONFLICT (id) DO NOTHING;
