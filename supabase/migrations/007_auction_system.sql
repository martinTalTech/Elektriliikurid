-- ============================================================
-- Migratsioon 007: Oksjonisüsteem
-- Uued tabelid, veerud ja turvaline place_bid funktsioon
-- ============================================================

-- Uued veerud listings tabelisse
alter table listings
  add column if not exists bid_increment  numeric(10,2) default 1,
  add column if not exists current_bid    numeric(10,2),
  add column if not exists bid_count      integer       default 0;

-- Oksjoni kestuse valikuks uuenda check constraint
alter table listings
  drop constraint if exists listings_status_check;

alter table listings
  add constraint listings_status_check
  check (status in ('draft', 'pending_payment', 'active', 'expired', 'sold', 'completed'));

-- ============================================================
-- Pakkumised
-- ============================================================
create table if not exists bids (
  id         uuid      default uuid_generate_v4() primary key,
  listing_id uuid      references listings on delete cascade not null,
  user_id    uuid      references auth.users on delete cascade not null,
  amount     numeric(10,2)                                   not null,
  created_at timestamptz default now()                       not null
);

create index if not exists bids_listing_id_idx on bids (listing_id);
create index if not exists bids_listing_amount_idx on bids (listing_id, amount desc);

-- ============================================================
-- Oksjonikuulutuse kahjustused
-- ============================================================
create table if not exists auction_defects (
  id          uuid    default uuid_generate_v4() primary key,
  listing_id  uuid    references listings on delete cascade not null,
  description text    not null,
  "order"     integer default 0,
  created_at  timestamptz default now() not null
);

create table if not exists auction_defect_images (
  id        uuid    default uuid_generate_v4() primary key,
  defect_id uuid    references auction_defects on delete cascade not null,
  url       text    not null,
  "order"   integer default 0
);

-- ============================================================
-- RLS
-- ============================================================
alter table bids                  enable row level security;
alter table auction_defects       enable row level security;
alter table auction_defect_images enable row level security;

-- Pakkumised: kõik näevad, keegi ei saa otse lisada (ainult place_bid kaudu)
create policy "Pakkumised on avalikud"
  on bids for select using (true);

-- Kahjustused: kõik näevad, omanik haldab
create policy "Kahjustused on avalikud"
  on auction_defects for select using (true);

create policy "Omanik lisab kahjustusi"
  on auction_defects for insert
  with check (auth.uid() = (select user_id from listings where id = listing_id));

create policy "Omanik kustutab kahjustusi"
  on auction_defects for delete
  using (auth.uid() = (select user_id from listings where id = listing_id));

-- Kahjustuste pildid
create policy "Kahjustuse pildid on avalikud"
  on auction_defect_images for select using (true);

create policy "Omanik lisab kahjustuse pilte"
  on auction_defect_images for insert
  with check (
    auth.uid() = (
      select l.user_id from listings l
      join auction_defects d on d.listing_id = l.id
      where d.id = defect_id
    )
  );

create policy "Omanik kustutab kahjustuse pilte"
  on auction_defect_images for delete
  using (
    auth.uid() = (
      select l.user_id from listings l
      join auction_defects d on d.listing_id = l.id
      where d.id = defect_id
    )
  );

-- ============================================================
-- place_bid — turvaline pakkumise funktsioon
--
-- Kõik valideerimised ja uuendused toimuvad ÜHES transakcioonis
-- koos FOR UPDATE lukuga, mis välistab kahe samaaegse pakkumise
-- konflikti (race condition).
-- ============================================================
create or replace function public.place_bid(
  p_listing_id uuid,
  p_amount     numeric
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user_id       uuid;
  v_listing       listings%rowtype;
  v_min_bid       numeric;
  v_new_expires   timestamptz;
  v_extended      boolean := false;
  v_bid_id        uuid;
begin
  -- 1. Autentimine — auth.uid() tuleb JWT-st, ei saa võltsida
  v_user_id := auth.uid();
  if v_user_id is null then
    return jsonb_build_object('error', 'Pakkumiseks pead olema sisse logitud');
  end if;

  -- 2. Lukusta kuulutuse rida (FOR UPDATE väldib kahte samaaegset pakkumist)
  select * into v_listing
  from listings
  where id = p_listing_id
  for update;

  if not found then
    return jsonb_build_object('error', 'Kuulutust ei leitud');
  end if;

  -- 3. Kontrollid
  if v_listing.listing_type != 'auction' then
    return jsonb_build_object('error', 'See ei ole oksjonikuulutus');
  end if;

  if v_listing.status != 'active' then
    return jsonb_build_object('error', 'Oksjon ei ole aktiivne');
  end if;

  if v_listing.auction_ends_at is null or v_listing.auction_ends_at <= now() then
    return jsonb_build_object('error', 'Oksjon on lõppenud');
  end if;

  if v_listing.user_id = v_user_id then
    return jsonb_build_object('error', 'Sa ei saa oma oksjonil pakkuda');
  end if;

  -- 4. Minimaalne pakkumine
  if coalesce(v_listing.bid_count, 0) = 0 then
    -- Esimene pakkumine: peab olema >= alghind
    if p_amount < coalesce(v_listing.price, 0) then
      return jsonb_build_object(
        'error', 'Esimene pakkumine peab olema vähemalt ' ||
                 to_char(v_listing.price, 'FM999999990.00') || ' €'
      );
    end if;
  else
    -- Järgmised: peab olema >= praegune + samm
    v_min_bid := v_listing.current_bid + coalesce(v_listing.bid_increment, 1);
    if p_amount < v_min_bid then
      return jsonb_build_object(
        'error', 'Pakkumine peab olema vähemalt ' ||
                 to_char(v_min_bid, 'FM999999990.00') || ' €'
      );
    end if;
  end if;

  -- 5. Automaatne pikendus: kui oksjon lõpeb 5 minuti jooksul → +5 minutit
  v_new_expires := v_listing.auction_ends_at;
  if v_listing.auction_ends_at - now() < interval '5 minutes' then
    v_new_expires := now() + interval '5 minutes';
    v_extended := true;
  end if;

  -- 6. Lisa pakkumine
  insert into bids (listing_id, user_id, amount)
  values (p_listing_id, v_user_id, p_amount)
  returning id into v_bid_id;

  -- 7. Uuenda kuulutust atomaarselt (samas transakcioonis)
  update listings
  set
    current_bid     = p_amount,
    bid_count       = coalesce(bid_count, 0) + 1,
    auction_ends_at = v_new_expires
  where id = p_listing_id;

  return jsonb_build_object(
    'success',      true,
    'bid_id',       v_bid_id,
    'current_bid',  p_amount,
    'expires_at',   v_new_expires,
    'extended',     v_extended
  );
end;
$$;

-- Luba ainult sisselogitud kasutajatel funktsiooni kutsuda
revoke execute on function public.place_bid(uuid, numeric) from public, anon;
grant  execute on function public.place_bid(uuid, numeric) to authenticated;

-- ============================================================
-- Uuenda cron töö: lõpeta oksjonid (completed) vs müügikuulutused (expired)
-- ============================================================
select cron.unschedule('expire-listings') where exists (
  select 1 from cron.job where jobname = 'expire-listings'
);

select cron.schedule(
  'expire-listings',
  '* * * * *',  -- iga minut (täpsem oksjonite jaoks)
  $$
    -- Tavakuulutused → expired
    update listings
    set status = 'expired'
    where status = 'active'
      and listing_type != 'auction'
      and expires_at is not null
      and expires_at < now();

    -- Oksjonid → completed
    update listings
    set status = 'completed'
    where status = 'active'
      and listing_type = 'auction'
      and auction_ends_at is not null
      and auction_ends_at < now();
  $$
);
