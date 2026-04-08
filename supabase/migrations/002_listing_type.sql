-- Add listing_type column
alter table listings
  add column if not exists listing_type text default 'sale'
  check (listing_type in ('sale', 'rent', 'auction', 'wanted'));

-- Add rent-specific columns (referenced in frontend but missing from schema)
alter table listings
  add column if not exists rent_price_day numeric(10,2),
  add column if not exists rent_min_days integer default 1,
  add column if not exists rent_available_from date,
  add column if not exists rent_available_to date;

-- Add auction end date column
alter table listings
  add column if not exists auction_ends_at timestamp with time zone;

-- Fix vehicle_type constraint to include all types used in the app
alter table listings drop constraint if exists listings_vehicle_type_check;
alter table listings
  add constraint listings_vehicle_type_check
  check (vehicle_type in ('scooter', 'cross', 'mopeed', 'jalgratas'));
