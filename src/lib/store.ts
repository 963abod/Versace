import fs from 'fs';
import path from 'path';
import { Product, Collection, Review, Settings } from '@/types';

interface StoreData {
  products: Product[];
  collections: Collection[];
  reviews: Review[];
  settings: Settings;
}

function getDataFilePath(): string {
  if (process.env.DATA_DIR) {
    return path.join(process.env.DATA_DIR, 'store.json');
  }
  return path.join(process.cwd(), 'src', 'data', 'store.json');
}

const INITIAL_DATA: StoreData = {
  settings: {
    storeName: 'VERSACE',
    logoUrl: '/images/versace-logo.png',
    heroImage: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=1600&auto=format&fit=crop',
    heroTitle: 'فخامة لا تُضاهى، أسلوب إيطالي أصيل',
    heroTitleEn: 'Unrivaled Luxury, Authentic Italian Style',
    heroDescription: 'اكتشف التشكيلة الجديدة الفاخرة لعام 2026 المصممة للرجل العصري الأنيق.',
    heroDescriptionEn: 'Discover the new luxury 2026 collection crafted for the modern gentleman.',
    whatsappNumber: '+963900000000',
    phone: '+963900000000',
    instagram: 'https://instagram.com/versace',
    facebook: 'https://facebook.com/versace',
    googleMaps: 'https://maps.google.com',
    address: 'شارع الفخامة الرئيسي، المزة، دمشق',
    openingHours: 'يومياً من 10:00 صباحاً حتى 11:00 مساءً',
    aboutUs: 'تأسست دار الأزياء الفاخرة لتقديم أحدث صيحات الموضة العالمية للرجل العصري. نتميز بتوفير أرقى خامات الأقمشة والتصاميم المبتكرة التي تعكس شخصية الرجل الواثق.',
    aboutUsEn: 'Established to deliver the finest international men fashion trends to the modern gentleman. We pride ourselves on offering top-quality fabrics and distinctive designs.',
    aboutUsImage: 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?q=80&w=1200&auto=format&fit=crop',
    footerText: 'جميع الحقوق محفوظة © 2026 VERSACE',
    aboudUrl: 'https://aboudweb.onrender.com',
    adminUsername: 'admin',
    adminPasswordHash: '$2b$10$k83OLkgrx.loL5OvqWZMqevxmoK1OtEibbLKCiLHrFLtAhXs5o916',
  },
  collections: [
    {
      id: 'col-1',
      name: 'بدلات السهرة والرسمية',
      nameEn: 'Suits & Formal Wear',
      image: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?q=80&w=800&auto=format&fit=crop',
      description: 'تصاميم إيطالية فاخرة للمناسبات الخاصة والاجتماعات الهامة.',
      descriptionEn: 'Luxury Italian designs for special occasions and executive meetings.',
      order: 1,
    },
    {
      id: 'col-2',
      name: 'قمصان الحرير والقطن الفاخر',
      nameEn: 'Luxury Silk & Cotton Shirts',
      image: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?q=80&w=800&auto=format&fit=crop',
      description: 'أرقى أنواع القطن والحرير الطبيعي.',
      descriptionEn: 'Finest Egyptian cotton and natural silk shirts.',
      order: 2,
    },
    {
      id: 'col-3',
      name: 'الأحذية والجلديات الإيطالية',
      nameEn: 'Italian Shoes & Leatherware',
      image: 'https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?q=80&w=800&auto=format&fit=crop',
      description: 'مصنوعة يدوياً بكفاءة عالية وأجود أنواع الجلد الطبيعي.',
      descriptionEn: 'Handcrafted with premium genuine leather.',
      order: 3,
    },
    {
      id: 'col-4',
      name: 'الإكسسوارات والساعات',
      nameEn: 'Accessories & Timepieces',
      image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=800&auto=format&fit=crop',
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
      description: 'بدلة رسمية من الصوف الفاخر 100% مع ياقة ستان إيطالي وتفاصيل مطرزة بدقة.',
      descriptionEn: 'Formal suit in 100% fine wool with Italian satin lapels and precision tailoring.',
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
      description: 'قميص مصمم من الحرير الطبيعي بحبكات ذهبية مستوحاة من التراث الملكي الإيطالي.',
      descriptionEn: 'Natural silk shirt with gold accents inspired by Italian heritage.',
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
      description: 'حذاء جلد طبيعي فاخر ببطانة مريحة وشعار معدني ذهبي مقاوم للخدش.',
      descriptionEn: 'Genuine leather loafers with comfortable lining and scratch-resistant metallic crest.',
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
      description: 'جاكيت جلد طبيعي بقصة عصرية ومبطن بالستان الحريري لحماية ودفء مثاليين.',
      descriptionEn: 'Genuine leather jacket tailored modernly with satin silk lining.',
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
      description: 'ساعة فاخرة بهيكل مقاوم للماء ومطلي بالذهب عيار 18 مع زجاج زفير لا يخدش.',
      descriptionEn: 'Luxury timepiece with 18k gold plating, scratch-proof sapphire crystal.',
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
      description: 'نظارة شمسية فاخرة بتصميم مستقبلي حماية 100% من الأشعة فوق البنفسجية.',
      descriptionEn: 'Luxury sunglasses featuring 100% UV protection and iconic design.',
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
      comment: 'جودة البدلة تتجاوز التوقعات، القماش إيطالي أصيل وتعاملك مع الزبائن فاخر للغاية.',
      rating: 5,
      createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    },
    {
      id: 'rev-2',
      customerName: 'سامر الخالد',
      comment: 'سرعة توصيل واهتمام بالتفاصيل، القميص الحريري رائع جداً ومريح في اللبس.',
      rating: 5,
      createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    },
    {
      id: 'rev-3',
      customerName: 'محمد العلي',
      comment: 'تجربة تسوق ممتازة وأسعار مناسبة جداً للقطع الفاخرة.',
      rating: 4,
      createdAt: new Date(Date.now() - 86400000 * 8).toISOString(),
    },
  ],
};

export function getStoreData(): StoreData {
  try {
    const filePath = getDataFilePath();
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, JSON.stringify(INITIAL_DATA, null, 2), 'utf-8');
      return INITIAL_DATA;
    }

    const fileContent = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(fileContent) as StoreData;
  } catch (error) {
    console.error('Error reading store data:', error);
    return INITIAL_DATA;
  }
}

export function saveStoreData(data: StoreData): void {
  try {
    const filePath = getDataFilePath();
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
  } catch (error) {
    console.error('Error saving store data:', error);
  }
}
