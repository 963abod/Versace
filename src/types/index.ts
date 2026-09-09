export interface Product {
  id: string;
  name: string;
  nameEn?: string;
  price: number;
  description: string;
  descriptionEn?: string;
  images: string[];
  sizes: string[];
  colors: string[];
  category: string;
  collectionId?: string;
  isNew: boolean;
  isOffer: boolean;
  offerPrice?: number;
  available: boolean;
  order: number;
  createdAt: string;
}

export interface Collection {
  id: string;
  name: string;
  nameEn?: string;
  image: string;
  description: string;
  descriptionEn?: string;
  order: number;
}

export interface Review {
  id: string;
  customerName: string;
  comment: string;
  rating: number; // 1-5
  createdAt: string;
}

export interface Settings {
  storeName: string;
  logoUrl: string;
  heroImage: string;
  heroTitle: string;
  heroTitleEn?: string;
  heroDescription: string;
  heroDescriptionEn?: string;
  whatsappNumber: string;
  phone: string;
  instagram: string;
  facebook: string;
  googleMaps: string;
  address: string;
  openingHours: string;
  aboutUs: string;
  aboutUsEn?: string;
  aboutUsImage: string;
  footerText: string;
  aboudUrl: string;
  adminPasswordHash?: string;
  adminUsername?: string;
}

export interface FilterOptions {
  search?: string;
  category?: string;
  collectionId?: string;
  size?: string;
  color?: string;
  minPrice?: number;
  maxPrice?: number;
  isNew?: boolean;
  isOffer?: boolean;
  availableOnly?: boolean;
  sortBy?: 'newest' | 'price-asc' | 'price-desc' | 'order';
}

export type Language = 'ar' | 'en';
