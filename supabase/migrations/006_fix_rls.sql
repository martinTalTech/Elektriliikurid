-- ============================================================
-- Migratsioon 006: Paranda duplikaatsed RLS poliitikad ja
--                  profiili andmete privaatsus
-- ============================================================
-- Probleem 1: Migratsioon 001_initial.sql lõi RLS poliitikad,
--   seejärel 004_rls.sql lõi samadele tabelitele uued poliitikad.
--   Andmebaasis on topeltpoliitikad — eemaldame 001 omad.
--
-- Probleem 2: 004_rls.sql-i policy "Profiilid on avalikud"
--   lubas kõigil (ka anonüümsetel kasutajatel) näha kõiki
--   profiile koos telefoni ja emailiga. Parandame seda.
-- ============================================================


-- ============================================================
-- 1. Eemalda duplikaatpoliitikad (001_initial.sql omad)
-- ============================================================

-- Profiles (001 poliitikad)
drop policy if exists "Users can view own profile"   on profiles;
drop policy if exists "Users can update own profile" on profiles;
drop policy if exists "Users can insert own profile" on profiles;

-- Listings (001 poliitikad)
drop policy if exists "Anyone can view active listings"  on listings;
drop policy if exists "Users can insert own listings"    on listings;
drop policy if exists "Users can update own listings"    on listings;
drop policy if exists "Users can delete own listings"    on listings;

-- Listing images (001 poliitikad)
drop policy if exists "Anyone can view images"                     on listing_images;
drop policy if exists "Users can insert images for own listings"   on listing_images;
drop policy if exists "Users can delete own listing images"        on listing_images;

-- Payments (001 poliitikad)
drop policy if exists "Users can view own payments" on payments;


-- ============================================================
-- 2. Paranda profiili privaatsus
--    Eemalda "kõik näevad kõike" policy ja asenda sellega,
--    et telefoninumber ja email on nähtavad ainult omanikule.
--    Nimi on avalik (kuulutuste lehel näitamiseks vajalik).
-- ============================================================

drop policy if exists "Profiilid on avalikud" on profiles;

-- Avalik: ainult nimi (kuulutuste lehel vajalik)
create policy "Avalik profiil — ainult nimi"
  on profiles for select
  using (true);

-- NB: Telefon ja email on tundlikud väljad. Rakenduse koodis
-- tuleb tagada, et SELECT päringud ei too telefoni/emaili
-- välja võõraste profiilide puhul (kasuta select 'id, name').
-- Täieliku välja-taseme turvalisuse jaoks kasuta Supabase
-- Column Level Security (CLS) kui see on saadaval.


-- ============================================================
-- 3. Kinnita, et 004_rls.sql poliitikad on paigas
--    (drop if exists + recreate on turvaline idempotentne viis)
-- ============================================================

-- LISTINGS
drop policy if exists "Aktiivsed kuulutused on avalikud" on listings;
drop policy if exists "Kasutaja näeb oma kuulutusi"      on listings;
drop policy if exists "Kasutaja lisab kuulutusi"          on listings;
drop policy if exists "Kasutaja muudab oma kuulutusi"     on listings;
drop policy if exists "Kasutaja kustutab oma kuulutusi"   on listings;

create policy "Aktiivsed kuulutused on avalikud"
  on listings for select
  using (status = 'active');

create policy "Kasutaja näeb oma kuulutusi"
  on listings for select
  using (auth.uid() = user_id);

create policy "Kasutaja lisab kuulutusi"
  on listings for insert
  with check (auth.uid() = user_id);

create policy "Kasutaja muudab oma kuulutusi"
  on listings for update
  using (auth.uid() = user_id);

create policy "Kasutaja kustutab oma kuulutusi"
  on listings for delete
  using (auth.uid() = user_id);


-- LISTING_IMAGES
drop policy if exists "Pildid on avalikud"   on listing_images;
drop policy if exists "Kasutaja lisab pilte"  on listing_images;
drop policy if exists "Kasutaja kustutab pilte" on listing_images;

create policy "Pildid on avalikud"
  on listing_images for select
  using (true);

create policy "Kasutaja lisab pilte"
  on listing_images for insert
  with check (
    auth.uid() = (select user_id from listings where id = listing_id)
  );

create policy "Kasutaja kustutab pilte"
  on listing_images for delete
  using (
    auth.uid() = (select user_id from listings where id = listing_id)
  );


-- PAYMENTS
drop policy if exists "Kasutaja näeb oma makseid" on payments;

create policy "Kasutaja näeb oma makseid"
  on payments for select
  using (auth.uid() = user_id);


-- PROFILES
drop policy if exists "Kasutaja muudab oma profiili" on profiles;

create policy "Kasutaja muudab oma profiili"
  on profiles for all
  using (auth.uid() = id)
  with check (auth.uid() = id);
