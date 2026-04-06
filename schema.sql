-- ==========================================
-- SCRIPT DE CREATION DE LA BASE DE DONNEES (A executer dans l'editeur SQL de Supabase)
-- ==========================================

-- 1. Activer l'extension pgcrypto pour générer des UUIDs
create extension if not exists "pgcrypto";

-- ==========================================
-- TABLES
-- ==========================================

-- 2. Table `profiles` : Stocke les informations des utilisateurs
create table public.profiles (
  id uuid references auth.users on delete cascade not null primary key,
  full_name text,
  phone text,
  email text,
  loyalty_points integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. Table `categories` : Catégories des prestations (ex: Pose Gel, Nail Art)
create table public.categories (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  icon_name text,
  display_order integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 4. Table `services` : Les prestations proposées par le salon
create table public.services (
  id uuid default gen_random_uuid() primary key,
  category_id uuid references public.categories(id) on delete set null,
  name text not null,
  description text,
  price numeric not null,
  duration_minutes integer not null,
  image_url text,
  is_featured boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- ==========================================
-- BOUTIQUE & GALERIE (Nouveau)
-- ==========================================

-- 5. Table `products` : Produits en vente (Boutique)
create table public.products (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  description text,
  price numeric not null,
  stock_quantity integer default 0,
  image_url text,
  category text,
  brand text,
  is_featured boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 6. Table `gallery_items` : Photos de la galerie
create table public.gallery_items (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  description text,
  image_url text not null,
  category text,
  is_featured boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 7. Table `banners` : Bannières d'accueil
create table public.banners (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  subtitle text,
  image_url text not null,
  cta_label text,
  is_active boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 5. Table `bookings` : Les réservations de rendez-vous
create table public.bookings (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade default auth.uid(), -- Client qui réserve
  service_id uuid references public.services(id), -- Service réservé
  booking_date date not null, -- Date de la prestation
  booking_time time not null, -- Heure de la prestation
  status text default 'pending' check (status in ('pending', 'confirmed', 'cancelled', 'completed')), -- État de la réservation
  payment_method text check (payment_method in ('cash', 'orange_money', 'mtn_money', 'card')), -- Moyen de paiement
  payment_status text default 'unpaid' check (payment_status in ('unpaid', 'pending', 'paid', 'refunded')), -- Statut du paiement
  professional text check (professional in ('Samira', 'Gilbert pro', 'Divine')), -- Professionnel sélectionné
  total_price numeric not null, -- Prix final payé
  notes text, -- Notes spécifiques du client
  created_at timestamp with time zone default now()
);

-- 6. Table `payments` : Détails des transactions
create table public.payments (
  id uuid default gen_random_uuid() primary key,
  booking_id uuid references public.bookings(id) on delete cascade,
  user_id uuid references public.profiles(id) default auth.uid(),
  amount numeric not null,
  provider text not null, -- orange, mtn, cash, stripe
  external_reference text, -- ID de transaction fourni par l'opérateur
  phone_number text, -- Numéro utilisé pour le paiement mobile
  status text default 'pending',
  created_at timestamp with time zone default now()
);

-- ==========================================
-- SECURITE : ROW LEVEL SECURITY (RLS)
-- ==========================================

-- Activer RLS sur toutes les tables
alter table public.profiles enable row level security;
alter table public.categories enable row level security;
alter table public.services enable row level security;
alter table public.bookings enable row level security;
alter table public.products enable row level security;
alter table public.gallery_items enable row level security;
alter table public.banners enable row level security;
alter table public.payments enable row level security;

-- Politiques pour `profiles`
create policy "Users can view own profile" on public.profiles for select using ( auth.uid() = id );
create policy "Users can update own profile" on public.profiles for update using ( auth.uid() = id );

-- Politiques pour les données publiques (Catégories, Services, Produits, Galerie, Bannières)
create policy "Categories readable by everyone" on public.categories for select using ( true );
create policy "Services readable by everyone" on public.services for select using ( true );
create policy "Products readable by everyone" on public.products for select using ( true );
create policy "Gallery readable by everyone" on public.gallery_items for select using ( true );
create policy "Banners readable by everyone" on public.banners for select using ( true );

-- Politiques pour `bookings`
create policy "Users can view own bookings" on public.bookings for select using ( auth.uid() = user_id );
create policy "Users can insert own bookings" on public.bookings for insert with check ( auth.uid() = user_id );
create policy "Users can update own bookings" on public.bookings for update using ( auth.uid() = user_id );

-- Politiques pour `payments`
create policy "Users can view own payments" on public.payments for select using ( auth.uid() = user_id );
create policy "Users can insert own payments" on public.payments for insert with check ( auth.uid() = user_id );

-- ==========================================
-- TRIGGERS : CRÉATION AUTOMATIQUE DE PROFIL
-- ==========================================
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, email)
  values (new.id, new.raw_user_meta_data->>'full_name', new.email);
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
