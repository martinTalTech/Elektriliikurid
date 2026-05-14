-- ============================================
-- RLS: Row Level Security
-- ============================================

-- LISTINGS
alter table listings enable row level security;

-- Kõik saavad lugeda aktiivseid kuulutusi
create policy "Aktiivsed kuulutused on avalikud"
  on listings for select
  using (status = 'active');

-- Kasutaja näeb kõiki oma kuulutusi (ka pending, expired jne)
create policy "Kasutaja näeb oma kuulutusi"
  on listings for select
  using (auth.uid() = user_id);

-- Sisselogitud kasutaja saab lisada kuulutusi
create policy "Kasutaja lisab kuulutusi"
  on listings for insert
  with check (auth.uid() = user_id);

-- Kasutaja saab muuta ainult oma kuulutusi
create policy "Kasutaja muudab oma kuulutusi"
  on listings for update
  using (auth.uid() = user_id);

-- Kasutaja saab kustutada ainult oma kuulutusi
create policy "Kasutaja kustutab oma kuulutusi"
  on listings for delete
  using (auth.uid() = user_id);

-- ============================================
-- LISTING_IMAGES
alter table listing_images enable row level security;

-- Pildid on avalikud
create policy "Pildid on avalikud"
  on listing_images for select
  using (true);

-- Kasutaja lisab pilte oma kuulutusele
create policy "Kasutaja lisab pilte"
  on listing_images for insert
  with check (
    auth.uid() = (
      select user_id from listings where id = listing_id
    )
  );

-- Kasutaja kustutab oma kuulutuse pilte
create policy "Kasutaja kustutab pilte"
  on listing_images for delete
  using (
    auth.uid() = (
      select user_id from listings where id = listing_id
    )
  );

-- ============================================
-- PROFILES
alter table profiles enable row level security;

-- Profiilid on avalikud (nimi, telefon vajalik kuulutuste lehel)
create policy "Profiilid on avalikud"
  on profiles for select
  using (true);

-- Kasutaja haldab oma profiili
create policy "Kasutaja muudab oma profiili"
  on profiles for all
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- ============================================
-- PAYMENTS (ainult oma maksed nähtavad)
alter table payments enable row level security;

create policy "Kasutaja näeb oma makseid"
  on payments for select
  using (auth.uid() = user_id);
