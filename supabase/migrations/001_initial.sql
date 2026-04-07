-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Profiles table (extends Supabase auth.users)
create table profiles (
  id uuid references auth.users on delete cascade primary key,
  email text,
  name text,
  phone text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Listings table
create table listings (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users on delete cascade not null,
  status text default 'pending_payment' check (status in ('draft', 'pending_payment', 'active', 'expired', 'sold')),
  vehicle_type text check (vehicle_type in ('scooter', 'cross')),
  brand text,
  model text,
  year integer,
  color text,
  motor_power_w integer,
  battery_capacity_wh integer,
  max_speed_kmh integer,
  range_km integer,
  mileage_km integer,
  charge_cycles integer,
  condition text check (condition in ('new', 'like_new', 'good', 'fair', 'poor')),
  price numeric(10,2),
  negotiable boolean default false,
  title text,
  description text,
  county text,
  city text,
  views_count integer default 0,
  featured boolean default false,
  payment_id text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  expires_at timestamp with time zone
);

-- Listing images
create table listing_images (
  id uuid default uuid_generate_v4() primary key,
  listing_id uuid references listings on delete cascade not null,
  url text not null,
  "order" integer default 0,
  is_primary boolean default false
);

-- Payments
create table payments (
  id uuid default uuid_generate_v4() primary key,
  listing_id uuid references listings on delete set null,
  user_id uuid references auth.users on delete set null,
  amount numeric(10,2),
  stripe_payment_id text,
  status text default 'pending',
  plan text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Row Level Security
alter table profiles enable row level security;
alter table listings enable row level security;
alter table listing_images enable row level security;
alter table payments enable row level security;

-- Profiles policies
create policy "Users can view own profile" on profiles for select using (auth.uid() = id);
create policy "Users can update own profile" on profiles for update using (auth.uid() = id);
create policy "Users can insert own profile" on profiles for insert with check (auth.uid() = id);

-- Listings policies
create policy "Anyone can view active listings" on listings for select using (status = 'active' or auth.uid() = user_id);
create policy "Users can insert own listings" on listings for insert with check (auth.uid() = user_id);
create policy "Users can update own listings" on listings for update using (auth.uid() = user_id);
create policy "Users can delete own listings" on listings for delete using (auth.uid() = user_id);

-- Listing images policies
create policy "Anyone can view images" on listing_images for select using (true);
create policy "Users can insert images for own listings" on listing_images for insert with check (
  auth.uid() = (select user_id from listings where id = listing_id)
);
create policy "Users can delete own listing images" on listing_images for delete using (
  auth.uid() = (select user_id from listings where id = listing_id)
);

-- Payments policies
create policy "Users can view own payments" on payments for select using (auth.uid() = user_id);

-- Trigger to create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, name, phone)
  values (new.id, new.email, new.raw_user_meta_data->>'name', new.raw_user_meta_data->>'phone');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
