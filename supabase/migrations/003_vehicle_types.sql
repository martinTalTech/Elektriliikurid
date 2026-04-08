-- Add elektri rula and monoratas to vehicle_type constraint
alter table listings drop constraint if exists listings_vehicle_type_check;
alter table listings
  add constraint listings_vehicle_type_check
  check (vehicle_type in ('scooter', 'cross', 'mopeed', 'jalgratas', 'rula', 'monoratas'));
