-- ============================================
-- VERSACE STORE - SUPABASE SCHEMA
-- ============================================

create extension if not exists "pgcrypto";

-- ============================================
-- COLLECTIONS
-- ============================================

create table if not exists public.collections (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text,
  image text,
  created_at timestamptz not null default now()
);

-- ============================================
-- PRODUCTS
-- ============================================

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  price numeric(12,2) not null default 0,
  offer_price numeric(12,2),
  category text,
  collection_id uuid references public.collections(id) on delete set null,
  images text[] not null default '{}',
  sizes text[] not null default '{}',
  colors text[] not null default '{}',
  featured boolean not null default false,
  created_at timestamptz not null default now()
);

-- Ensure existing databases have the featured column
alter table public.products
add column if not exists featured boolean not null default false;

-- ============================================
-- REVIEWS
-- ============================================

create table if not exists public.reviews (
  id uuid primary key default gen_random_uuid(),
  customer_name text not null,
  rating integer not null check (rating between 1 and 5),
  comment text not null,
  approved boolean not null default true,
  created_at timestamptz not null default now()
);

-- ============================================
-- SETTINGS
-- ============================================

create table if not exists public.settings (
  id integer primary key,
  store_name text not null default 'Versace',
  store_description text,
  phone text,
  whatsapp text,
  instagram text,
  facebook text,
  address text,
  logo text,
  admin_username text,
  admin_password_hash text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ============================================
-- INDEXES
-- ============================================

create index if not exists products_collection_id_idx
  on public.products(collection_id);

create index if not exists products_category_idx
  on public.products(category);

create index if not exists products_featured_idx
  on public.products(featured);

create index if not exists reviews_approved_idx
  on public.reviews(approved);

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================

alter table public.collections enable row level security;
alter table public.products enable row level security;
alter table public.reviews enable row level security;
alter table public.settings enable row level security;

drop policy if exists "Allow Full Access Collections" on public.collections;
drop policy if exists "Allow Full Access Products" on public.products;
drop policy if exists "Allow Full Access Reviews" on public.reviews;
drop policy if exists "Allow Full Access Settings" on public.settings;

drop policy if exists "Public Read Collections" on public.collections;
drop policy if exists "Public Read Products" on public.products;
drop policy if exists "Public Read Reviews" on public.reviews;
drop policy if exists "Public Read Settings" on public.settings;

-- ============================================
-- PUBLIC READ ONLY
-- ============================================

create policy "Public Read Collections"
on public.collections
for select
to anon, authenticated
using (true);

create policy "Public Read Products"
on public.products
for select
to anon, authenticated
using (true);

create policy "Public Read Reviews"
on public.reviews
for select
to anon, authenticated
using (true);

create policy "Public Read Settings"
on public.settings
for select
to anon, authenticated
using (true);

-- ============================================
-- STORAGE
-- ============================================

insert into storage.buckets (id, name, public)
values ('products', 'products', true)
on conflict (id)
do update set public = true;

drop policy if exists "Public Read Product Images" on storage.objects;

create policy "Public Read Product Images"
on storage.objects
for select
to public
using (bucket_id = 'products');

-- ============================================
-- DEFAULT SETTINGS
-- ============================================

insert into public.settings (
  id,
  store_name,
  store_description
)
values (
  1,
  'Versace',
  'Luxury Men''s Fashion'
)
on conflict (id) do nothing;
