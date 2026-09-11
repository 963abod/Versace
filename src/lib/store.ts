import { Product, Collection, Review, Settings } from '@/types';
import { getSupabaseAdminClient } from '@/lib/supabase';

export interface StoreData {
  products: Product[];
  collections: Collection[];
  reviews: Review[];
  settings: Settings;
}

const INITIAL_DATA: StoreData = {
  settings: {
    storeName: 'VERSACE',
    logoUrl: '/images/versace-logo.png',
    heroImage:
      'https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=1600&auto=format&fit=crop',
    heroTitle: 'فخامة لا تُضاهى، أسلوب إيطالي أصيل',
    heroTitleEn: 'Unrivaled Luxury, Authentic Italian Style',
    heroDescription:
      'اكتشف التشكيلة الجديدة الفاخرة لعام 2026 المصممة للرجل العصري الأنيق.',
    heroDescriptionEn:
      'Discover the new luxury 2026 collection crafted for the modern gentleman.',
    whatsappNumber: '+963900000000',
    phone: '+963900000000',
    instagram: 'https://instagram.com/versace',
    facebook: 'https://facebook.com/versace',
    googleMaps: 'https://maps.google.com',
    address: 'شارع الفخامة الرئيسي، المزة، دمشق',
    openingHours: 'يومياً من 10:00 صباحاً حتى 11:00 مساءً',
    aboutUs:
      'تأسست دار الأزياء الفاخرة لتقديم أحدث صيحات الموضة العالمية للرجل العصري. نتميز بتوفير أرقى خامات الأقمشة والتصاميم المبتكرة التي تعكس شخصية الرجل الواثق.',
    aboutUsEn:
      'Established to deliver the finest international men fashion trends to the modern gentleman. We pride ourselves on offering top-quality fabrics and distinctive designs.',
    aboutUsImage:
      'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?q=80&w=1200&auto=format&fit=crop',
    footerText: 'جميع الحقوق محفوظة © 2026 VERSACE',
    aboudUrl: 'https://aboudweb.onrender.com',
    adminUsername: 'admin',
    adminPasswordHash:
      '$2b$10$k83OLkgrx.loL5OvqWZMqevxmoK1OtEibbLKCiLHrFLtAhXs5o916',
  },

  collections: [
    {
      id: 'col-1',
      name: 'بدلات السهرة والرسمية',
      nameEn: 'Suits & Formal Wear',
      image:
        'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?q=80&w=800&auto=format&fit=crop',
      description:
        'تصاميم إيطالية فاخرة للمناسبات الخاصة والاجتماعات الهامة.',
      descriptionEn:
        'Luxury Italian designs for special occasions and executive meetings.',
      order: 1,
    },
    {
      id: 'col-2',
      name: 'قمصان الحرير والقطن الفاخر',
      nameEn: 'Luxury Silk & Cotton Shirts',
      image:
        'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?q=80&w=800&auto=format&fit=crop',
      description: 'أرقى أنواع القطن والحرير الطبيعي.',
      descriptionEn: 'Finest Egyptian cotton and natural silk shirts.',
      order: 2,
    },
    {
      id: 'col-3',
      name: 'الأحذية والجلديات الإيطالية',
      nameEn: 'Italian Shoes & Leatherware',
      image:
        'https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?q=80&w=800&auto=format&fit=crop',
      description:
        'مصنوعة يدوياً بكفاءة عالية وأجود أنواع الجلد الطبيعي.',
      descriptionEn: 'Handcrafted with premium genuine leather.',
      order: 3,
    },
    {
      id: 'col-4',
      name: 'الإكسسوارات والساعات',
      nameEn: 'Accessories & Timepieces',
      image:
        'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=800&auto=format&fit=crop',
      description: 'لمسات فاخرة تكتمل بها أناقة الرجل.',
      descriptionEn: 'Exquisite details that complete a gentleman style.',
      order: 4,
    },
  ],

  products: [
    {
      id: 'prod-1',
      name: 'بدلة توكسيدو سوداء كلاسيكية',
      nameEn: 'Classic Black Tuxedo Suit',
      price: 1250,
      description:
        'بدلة رسمية من الصوف الفاخر 100% مع ياقة ستان إيطالي وتفاصيل مطرزة بدقة.',
      descriptionEn:
        'Formal suit in 100% fine wool with Italian satin lapels and precision tailoring.',
      images: [
        'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?q=80&w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=800&auto=format&fit=crop',
      ],
      sizes: ['48', '50', '52', '54', '56'],
      colors: ['أسود', 'كحلي داكن'],
      category: 'بدلات',
      collectionId: 'col-1',
      isNew: true,
      isOffer: false,
      available: true,
      order: 1,
      createdAt: new Date().toISOString(),
    },
    {
      id: 'prod-2',
      name: 'قميص حرير أسود بحبكات ذهبية',
      nameEn: 'Black Silk Shirt with Gold Accents',
      price: 480,
      description:
        'قميص مصمم من الحرير الطبيعي بحبكات ذهبية مستوحاة من التراث الملكي الإيطالي.',
      descriptionEn:
        'Natural silk shirt with gold accents inspired by Italian heritage.',
      images: [
        'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?q=80&w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1620012253295-c15cc3e65df4?q=80&w=800&auto=format&fit=crop',
      ],
      sizes: ['S', 'M', 'L', 'XL'],
      colors: ['أسود / ذهبي', 'أبيض / ذهبي'],
      category: 'قمصان',
      collectionId: 'col-2',
      isNew: true,
      isOffer: true,
      offerPrice: 390,
      available: true,
      order: 2,
      createdAt: new Date().toISOString(),
    },
    {
      id: 'prod-3',
      name: 'حذاء لوفر جلد طبيعي مطرز',
      nameEn: 'Embroidered Leather Loafer',
      price: 650,
      description:
        'حذاء جلد طبيعي فاخر ببطانة مريحة وشعار معدني ذهبي مقاوم للخدش.',
      descriptionEn:
        'Genuine leather loafers with comfortable lining and scratch-resistant metallic crest.',
      images: [
        'https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?q=80&w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1533867617858-e7b97e060509?q=80&w=800&auto=format&fit=crop',
      ],
      sizes: ['41', '42', '43', '44', '45'],
      colors: ['أسود', 'بني داكن'],
      category: 'أحذية',
      collectionId: 'col-3',
      isNew: false,
      isOffer: false,
      available: true,
      order: 3,
      createdAt: new Date(Date.now() - 86400000 * 10).toISOString(),
    },
    {
      id: 'prod-4',
      name: 'جاكيت جلدي فاخر بطبعة مدوزا',
      nameEn: 'Luxury Leather Jacket',
      price: 1850,
      description:
        'جاكيت جلد طبيعي بقصة عصرية ومبطن بالستان الحريري لحماية ودفء مثاليين.',
      descriptionEn:
        'Genuine leather jacket tailored modernly with satin silk lining.',
      images: [
        'https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1520975954732-35dd22299614?q=80&w=800&auto=format&fit=crop',
      ],
      sizes: ['M', 'L', 'XL', 'XXL'],
      colors: ['أسود'],
      category: 'جاكيتات',
      collectionId: 'col-1',
      isNew: true,
      isOffer: true,
      offerPrice: 1550,
      available: true,
      order: 4,
      createdAt: new Date().toISOString(),
    },
    {
      id: 'prod-5',
      name: 'ساعة يد كلاسيكية إيطالية',
      nameEn: 'Classic Italian Gold Watch',
      price: 2100,
      description:
        'ساعة فاخرة بهيكل مقاوم للماء ومطلي بالذهب عيار 18 مع زجاج زفير لا يخدش.',
      descriptionEn:
        'Luxury timepiece with 18k gold plating, scratch-proof sapphire crystal.',
      images: [
        'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1524805444758-089113d48a6d?q=80&w=800&auto=format&fit=crop',
      ],
      sizes: ['One Size'],
      colors: ['ذهبي / أسود', 'فضي / أسود'],
      category: 'إكسسوارات',
      collectionId: 'col-4',
      isNew: false,
      isOffer: true,
      offerPrice: 1800,
      available: true,
      order: 5,
      createdAt: new Date(Date.now() - 86400000 * 20).toISOString(),
    },
    {
      id: 'prod-6',
      name: 'نظارة شمسية سوداء بإطار ذهبي',
      nameEn: 'Black Sunglasses with Gold Frame',
      price: 320,
      description:
        'نظارة شمسية فاخرة بتصميم مستقبلي حماية 100% من الأشعة فوق البنفسجية.',
      descriptionEn:
        'Luxury sunglasses featuring 100% UV protection and iconic design.',
      images: [
        'https://images.unsplash.com/photo-1511499767150-a48a237f0083?q=80&w=800&auto=format&fit=crop',
      ],
      sizes: ['One Size'],
      colors: ['أسود / ذهبي'],
      category: 'إكسسوارات',
      collectionId: 'col-4',
      isNew: true,
      isOffer: false,
      available: true,
      order: 6,
      createdAt: new Date().toISOString(),
    },
  ],

  reviews: [
    {
      id: 'rev-1',
      customerName: 'أحمد الإبراهيم',
      comment:
        'جودة البدلة تتجاوز التوقعات، القماش إيطالي أصيل وتعاملك مع الزبائن فاخر للغاية.',
      rating: 5,
      createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    },
    {
      id: 'rev-2',
      customerName: 'سامر الخالد',
      comment:
        'سرعة توصيل واهتمام بالتفاصيل، القميص الحريري رائع جداً ومريح في اللبس.',
      rating: 5,
      createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    },
    {
      id: 'rev-3',
      customerName: 'محمد العلي',
      comment:
        'تجربة تسوق ممتازة وأسعار مناسبة جداً للقطع الفاخرة.',
      rating: 4,
      createdAt: new Date(Date.now() - 86400000 * 8).toISOString(),
    },
  ],
};

// In-memory fallback state (strictly no filesystem access)
const memoryStore: StoreData = JSON.parse(JSON.stringify(INITIAL_DATA));

export function getStoreData(): StoreData {
  return memoryStore;
}

// Map database snake_case to Product interface
function mapProductFromDb(p: Record<string, unknown>): Product {
  return {
    id: String(p.id),
    name: String(p.name),
    nameEn: p.name_en ? String(p.name_en) : undefined,
    price: Number(p.price),
    offerPrice:
      p.offer_price !== null && p.offer_price !== undefined
        ? Number(p.offer_price)
        : undefined,
    description: String(p.description || ''),
    descriptionEn: p.description_en ? String(p.description_en) : undefined,
    images: Array.isArray(p.images) ? (p.images as string[]) : [],
    sizes: Array.isArray(p.sizes) ? (p.sizes as string[]) : [],
    colors: Array.isArray(p.colors) ? (p.colors as string[]) : [],
    category: String(p.category || 'عام'),
    collectionId: p.collection_id ? String(p.collection_id) : undefined,
    isNew: Boolean(p.is_new),
    isOffer: Boolean(p.is_offer),
    available: p.available !== undefined ? Boolean(p.available) : true,
    order: Number(p.order || 1),
    createdAt: String(p.created_at || new Date().toISOString()),
  };
}

function mapProductToDb(
  p: Partial<Product>
): Record<string, unknown> {
  const row: Record<string, unknown> = {};

  if (p.id !== undefined) row.id = p.id;
  if (p.name !== undefined) row.name = p.name;
  if (p.nameEn !== undefined) row.name_en = p.nameEn;
  if (p.price !== undefined) row.price = p.price;
  if (p.offerPrice !== undefined) row.offer_price = p.offerPrice;
  if (p.description !== undefined) row.description = p.description;
  if (p.descriptionEn !== undefined) row.description_en = p.descriptionEn;
  if (p.images !== undefined) row.images = p.images;
  if (p.sizes !== undefined) row.sizes = p.sizes;
  if (p.colors !== undefined) row.colors = p.colors;
  if (p.category !== undefined) row.category = p.category;
  if (p.collectionId !== undefined) row.collection_id = p.collectionId;
  if (p.isNew !== undefined) row.is_new = p.isNew;
  if (p.isOffer !== undefined) row.is_offer = p.isOffer;
  if (p.available !== undefined) row.available = p.available;
  if (p.order !== undefined) row.order = p.order;
  if (p.createdAt !== undefined) row.created_at = p.createdAt;

  return row;
}

// Map database snake_case to Collection interface
function mapCollectionFromDb(
  c: Record<string, unknown>
): Collection {
  return {
    id: String(c.id),
    name: String(c.name),
    nameEn: c.name_en ? String(c.name_en) : undefined,
    image: String(c.image),
    description: String(c.description || ''),
    descriptionEn: c.description_en
      ? String(c.description_en)
      : undefined,
    order: Number(c.order || 1),
  };
}

function mapCollectionToDb(
  c: Partial<Collection>
): Record<string, unknown> {
  const row: Record<string, unknown> = {};

  if (c.id !== undefined) row.id = c.id;
  if (c.name !== undefined) row.name = c.name;
  if (c.nameEn !== undefined) row.name_en = c.nameEn;
  if (c.image !== undefined) row.image = c.image;
  if (c.description !== undefined) row.description = c.description;
  if (c.descriptionEn !== undefined)
    row.description_en = c.descriptionEn;
  if (c.order !== undefined) row.order = c.order;

  return row;
}

// Map database snake_case to Review interface
function mapReviewFromDb(
  r: Record<string, unknown>
): Review {
  return {
    id: String(r.id),
    customerName: String(r.customer_name),
    comment: String(r.comment),
    rating: Number(r.rating || 5),
    createdAt: String(
      r.created_at || new Date().toISOString()
    ),
  };
}

function mapReviewToDb(
  r: Partial<Review>
): Record<string, unknown> {
  const row: Record<string, unknown> = {};

  if (r.id !== undefined) row.id = r.id;
  if (r.customerName !== undefined)
    row.customer_name = r.customerName;
  if (r.comment !== undefined) row.comment = r.comment;
  if (r.rating !== undefined) row.rating = r.rating;
  if (r.createdAt !== undefined) row.created_at = r.createdAt;

  return row;
}

// Map database snake_case to Settings interface
function mapSettingsFromDb(
  s: Record<string, unknown>
): Settings {
  return {
    storeName: String(s.store_name || 'VERSACE'),
    logoUrl: String(
      s.logo_url || '/images/versace-logo.png'
    ),
    heroImage: String(
      s.hero_image ||
        'https://images.unsplash.com/photo-1441986300917-64674bd600d8'
    ),
    heroTitle: String(
      s.hero_title || 'فخامة لا تُضاهى، أسلوب إيطالي أصيل'
    ),
    heroTitleEn: String(
      s.hero_title_en ||
        'Unrivaled Luxury, Authentic Italian Style'
    ),
    heroDescription: String(s.hero_description || ''),
    heroDescriptionEn: String(s.hero_description_en || ''),
    whatsappNumber: String(
      s.whatsapp_number || '+963900000000'
    ),
    phone: String(s.phone || '+963900000000'),
    instagram: String(
      s.instagram || 'https://instagram.com/versace'
    ),
    facebook: String(
      s.facebook || 'https://facebook.com/versace'
    ),
    googleMaps: String(
      s.google_maps || 'https://maps.google.com'
    ),
    address: String(
      s.address || 'شارع الفخامة الرئيسي، المزة، دمشق'
    ),
    openingHours: String(
      s.opening_hours ||
        'يومياً من 10:00 صباحاً حتى 11:00 مساءً'
    ),
    aboutUs: String(s.about_us || ''),
    aboutUsEn: String(s.about_us_en || ''),
    aboutUsImage: String(
      s.about_us_image ||
        'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04'
    ),
    footerText: String(
      s.footer_text || 'جميع الحقوق محفوظة © 2026 VERSACE'
    ),
    aboudUrl: String(
      s.aboud_url || 'https://aboudweb.onrender.com'
    ),
    adminUsername: String(s.admin_username || 'admin'),
    adminPasswordHash: String(
      s.admin_password_hash ||
        '$2b$10$k83OLkgrx.loL5OvqWZMqevxmoK1OtEibbLKCiLHrFLtAhXs5o916'
    ),
  };
}

function mapSettingsToDb(
  s: Partial<Settings>
): Record<string, unknown> {
  const row: Record<string, unknown> = {};

  if (s.storeName !== undefined) row.store_name = s.storeName;
  if (s.logoUrl !== undefined) row.logo_url = s.logoUrl;
  if (s.heroImage !== undefined) row.hero_image = s.heroImage;
  if (s.heroTitle !== undefined) row.hero_title = s.heroTitle;
  if (s.heroTitleEn !== undefined)
    row.hero_title_en = s.heroTitleEn;
  if (s.heroDescription !== undefined)
    row.hero_description = s.heroDescription;
  if (s.heroDescriptionEn !== undefined)
    row.hero_description_en = s.heroDescriptionEn;
  if (s.whatsappNumber !== undefined)
    row.whatsapp_number = s.whatsappNumber;
  if (s.phone !== undefined) row.phone = s.phone;
  if (s.instagram !== undefined) row.instagram = s.instagram;
  if (s.facebook !== undefined) row.facebook = s.facebook;
  if (s.googleMaps !== undefined)
    row.google_maps = s.googleMaps;
  if (s.address !== undefined) row.address = s.address;
  if (s.openingHours !== undefined)
    row.opening_hours = s.openingHours;
  if (s.aboutUs !== undefined) row.about_us = s.aboutUs;
  if (s.aboutUsEn !== undefined) row.about_us_en = s.aboutUsEn;
  if (s.aboutUsImage !== undefined)
    row.about_us_image = s.aboutUsImage;
  if (s.footerText !== undefined)
    row.footer_text = s.footerText;
  if (s.aboudUrl !== undefined) row.aboud_url = s.aboudUrl;
  if (s.adminUsername !== undefined)
    row.admin_username = s.adminUsername;
  if (s.adminPasswordHash !== undefined)
    row.admin_password_hash = s.adminPasswordHash;

  return row;
}

// Supabase-enabled Store Functions

export async function getProductsAsync(): Promise<Product[]> {
  const supabase = getSupabaseAdminClient();

  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('order', { ascending: true });

      if (!error && data) {
        return data.map(mapProductFromDb);
      }

      if (error) {
        console.error(
          'Supabase getProductsAsync error:',
          JSON.stringify(error, null, 2)
        );
      }
    } catch (e) {
      console.error(
        'Supabase getProductsAsync failed:',
        e
      );
    }
  }

  return memoryStore.products;
}

export async function saveProductAsync(
  product: Product
): Promise<Product> {
  const supabase = getSupabaseAdminClient();

  if (supabase) {
    try {
      const row = mapProductToDb(product);

      const { error } = await supabase
        .from('products')
        .upsert(row);

      if (error) {
        console.error(
          'Supabase saveProductAsync error:',
          JSON.stringify(error, null, 2)
        );
        throw new Error(
          `Failed to save product: ${error.message}`
        );
      }
    } catch (e) {
      console.error(
        'Supabase saveProductAsync failed:',
        e
      );
      throw e;
    }
  }

  const index = memoryStore.products.findIndex(
    (p) => p.id === product.id
  );

  if (index >= 0) {
    memoryStore.products[index] = product;
  } else {
    memoryStore.products.push(product);
  }

  return product;
}

export async function deleteProductAsync(
  id: string
): Promise<boolean> {
  const supabase = getSupabaseAdminClient();

  if (supabase) {
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);

      if (error) {
        console.error(
          'Supabase deleteProductAsync error:',
          JSON.stringify(error, null, 2)
        );
        throw new Error(
          `Failed to delete product: ${error.message}`
        );
      }
    } catch (e) {
      console.error(
        'Supabase deleteProductAsync failed:',
        e
      );
      throw e;
    }
  }

  memoryStore.products = memoryStore.products.filter(
    (p) => p.id !== id
  );

  return true;
}

export async function getCollectionsAsync(): Promise<
  Collection[]
> {
  const supabase = getSupabaseAdminClient();

  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('collections')
        .select('*')
        .order('order', { ascending: true });

      if (!error && data) {
        return data.map(mapCollectionFromDb);
      }

      if (error) {
        console.error(
          'Supabase getCollectionsAsync error:',
          JSON.stringify(error, null, 2)
        );
      }
    } catch (e) {
      console.error(
        'Supabase getCollectionsAsync failed:',
        e
      );
    }
  }

  return memoryStore.collections;
}

export async function saveCollectionAsync(
  collection: Collection
): Promise<Collection> {
  const supabase = getSupabaseAdminClient();

  if (supabase) {
    try {
      const row = mapCollectionToDb(collection);

      const { error } = await supabase
        .from('collections')
        .upsert(row);

      if (error) {
        console.error(
          'Supabase saveCollectionAsync error:',
          JSON.stringify(error, null, 2)
        );
        throw new Error(
          `Failed to save collection: ${error.message}`
        );
      }
    } catch (e) {
      console.error(
        'Supabase saveCollectionAsync failed:',
        e
      );
      throw e;
    }
  }

  const index = memoryStore.collections.findIndex(
    (c) => c.id === collection.id
  );

  if (index >= 0) {
    memoryStore.collections[index] = collection;
  } else {
    memoryStore.collections.push(collection);
  }

  return collection;
}

export async function deleteCollectionAsync(
  id: string
): Promise<boolean> {
  const supabase = getSupabaseAdminClient();

  if (supabase) {
    try {
      const { error } = await supabase
        .from('collections')
        .delete()
        .eq('id', id);

      if (error) {
        console.error(
          'Supabase deleteCollectionAsync error:',
          JSON.stringify(error, null, 2)
        );
        throw new Error(
          `Failed to delete collection: ${error.message}`
        );
      }
    } catch (e) {
      console.error(
        'Supabase deleteCollectionAsync failed:',
        e
      );
      throw e;
    }
  }

  memoryStore.collections = memoryStore.collections.filter(
    (c) => c.id !== id
  );

  return true;
}

export async function getReviewsAsync(): Promise<Review[]> {
  const supabase = getSupabaseAdminClient();

  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('reviews')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data) {
        return data.map(mapReviewFromDb);
      }

      if (error) {
        console.error(
          'Supabase getReviewsAsync error:',
          JSON.stringify(error, null, 2)
        );
      }
    } catch (e) {
      console.error(
        'Supabase getReviewsAsync failed:',
        e
      );
    }
  }

  return memoryStore.reviews;
}

export async function saveReviewAsync(
  review: Review
): Promise<Review> {
  const supabase = getSupabaseAdminClient();

  if (supabase) {
    try {
      const row = mapReviewToDb(review);

      const { error } = await supabase
        .from('reviews')
        .upsert(row);

      if (error) {
        console.error(
          'Supabase saveReviewAsync error:',
          JSON.stringify(error, null, 2)
        );
        throw new Error(
          `Failed to save review: ${error.message}`
        );
      }
    } catch (e) {
      console.error(
        'Supabase saveReviewAsync failed:',
        e
      );
      throw e;
    }
  }

  const index = memoryStore.reviews.findIndex(
    (r) => r.id === review.id
  );

  if (index >= 0) {
    memoryStore.reviews[index] = review;
  } else {
    memoryStore.reviews.push(review);
  }

  return review;
}

export async function deleteReviewAsync(
  id: string
): Promise<boolean> {
  const supabase = getSupabaseAdminClient();

  if (supabase) {
    try {
      const { error } = await supabase
        .from('reviews')
        .delete()
        .eq('id', id);

      if (error) {
        console.error(
          'Supabase deleteReviewAsync error:',
          JSON.stringify(error, null, 2)
        );
        throw new Error(
          `Failed to delete review: ${error.message}`
        );
      }
    } catch (e) {
      console.error(
        'Supabase deleteReviewAsync failed:',
        e
      );
      throw e;
    }
  }

  memoryStore.reviews = memoryStore.reviews.filter(
    (r) => r.id !== id
  );

  return true;
}

export async function getSettingsAsync(): Promise<Settings> {
  const supabase = getSupabaseAdminClient();

  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('settings')
        .select('*')
        .limit(1)
        .maybeSingle();

      if (!error && data) {
        return mapSettingsFromDb(data);
      }

      if (error) {
        console.error(
          'Supabase getSettingsAsync error:',
          JSON.stringify(error, null, 2)
        );
      }
    } catch (e) {
      console.error(
        'Supabase getSettingsAsync failed:',
        e
      );
    }
  }

  return memoryStore.settings;
}

export async function saveSettingsAsync(
  settings: Settings
): Promise<Settings> {
  const supabase = getSupabaseAdminClient();

  if (supabase) {
    try {
      const row = {
        id: 1,
        ...mapSettingsToDb(settings),
      };

      const { error } = await supabase
        .from('settings')
        .upsert(row, { onConflict: 'id' });

      if (error) {
        console.error(
          'Supabase saveSettingsAsync error:',
          JSON.stringify(error, null, 2)
        );
        throw new Error(
          `Failed to save settings: ${error.message}`
        );
      }
    } catch (e) {
      console.error(
        'Supabase saveSettingsAsync failed:',
        e
      );
      throw e;
    }
  }

  memoryStore.settings = {
    ...memoryStore.settings,
    ...settings,
  };

  return memoryStore.settings;
        }
