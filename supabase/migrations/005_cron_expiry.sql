-- Aktiveeri pg_cron laiendus (Supabase Pro plaanil vaikimisi saadaval)
create extension if not exists pg_cron;

-- Igatunnine töö: märgi aegunud kuulutused expired staatusesse
select cron.schedule(
  'expire-listings',
  '0 * * * *',  -- iga tunni alguses
  $$
    update listings
    set status = 'expired'
    where status = 'active'
      and expires_at is not null
      and expires_at < now();
  $$
);
