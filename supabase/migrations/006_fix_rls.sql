

drop policy if exists "Users can view own profile"   on profiles;
drop policy if exists "Users can update own profile" on profiles;
drop policy if exists "Users can insert own profile" on profiles;


drop policy if exists "Anyone can view active listings"  on listings;
drop policy if exists "Users can insert own listings"    on listings;
drop policy if exists "Users can update own listings"    on listings;
drop policy if exists "Users can delete own listings"    on listings;

drop policy if exists "Anyone can view images"                     on listing_images;
drop policy if exists "Users can insert images for own listings"   on listing_images;
drop policy if exists "Users can delete own listing images"        on listing_images;

drop policy if exists "Users can view own payments" on payments;

drop policy if exists "Profiilid on avalikud" on profiles;


create policy "Avalik profiil — ainult nimi"
  on profiles for select
  using (true);

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



drop policy if exists "Kasutaja näeb oma makseid" on payments;

create policy "Kasutaja näeb oma makseid"
  on payments for select
  using (auth.uid() = user_id);

drop policy if exists "Kasutaja muudab oma profiili" on profiles;

create policy "Kasutaja muudab oma profiili"
  on profiles for all
  using (auth.uid() = id)
  with check (auth.uid() = id);
