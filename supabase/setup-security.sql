-- ============================================
-- elektriliikur.ee — Andmebaasi turvalisuse seadistamine
-- Jooksuta see Supabase SQL Editoris
-- ============================================

-- ==========================================
-- 1. PROFILES TABEL (kasutajate profiilid)
-- ==========================================
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT,
  phone TEXT,
  email TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Automaatne profiili loomine registreerimisel
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, name, phone, email)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', NEW.raw_user_meta_data->>'full_name'),
    NEW.raw_user_meta_data->>'phone',
    NEW.email
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Kustuta vana trigger kui eksisteerib
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Loo trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Täida olemasolevate kasutajate profiilid
INSERT INTO profiles (id, name, phone, email)
SELECT
  id,
  COALESCE(raw_user_meta_data->>'name', raw_user_meta_data->>'full_name'),
  raw_user_meta_data->>'phone',
  email
FROM auth.users
WHERE id NOT IN (SELECT id FROM profiles)
ON CONFLICT (id) DO NOTHING;

-- ==========================================
-- 2. ROW LEVEL SECURITY — PROFILES
-- ==========================================
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Kustuta vanad poliitikat kui eksisteerivad
DROP POLICY IF EXISTS "Profiles are viewable by everyone" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;

-- Kõik saavad profiile vaadata (müüja kontaktinfo jaoks)
CREATE POLICY "Profiles are viewable by everyone"
  ON profiles FOR SELECT
  USING (true);

-- Kasutaja saab ainult oma profiili muuta
CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Kasutaja saab oma profiili luua (varuks, kui trigger ei toimi)
CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- ==========================================
-- 3. ROW LEVEL SECURITY — LISTINGS
-- ==========================================
ALTER TABLE listings ENABLE ROW LEVEL SECURITY;

-- Kustuta vanad poliitikat
DROP POLICY IF EXISTS "Active listings are viewable by everyone" ON listings;
DROP POLICY IF EXISTS "Users can view own listings" ON listings;
DROP POLICY IF EXISTS "Users can create listings" ON listings;
DROP POLICY IF EXISTS "Users can update own listings" ON listings;
DROP POLICY IF EXISTS "Users can delete own listings" ON listings;

-- Aktiivsed kuulutused on kõigile nähtavad
CREATE POLICY "Active listings are viewable by everyone"
  ON listings FOR SELECT
  USING (status = 'active');

-- Kasutaja näeb ka oma mitteaktiivseid kuulutusi (draft, pending, expired)
CREATE POLICY "Users can view own listings"
  ON listings FOR SELECT
  USING (auth.uid() = user_id);

-- Sisselogitud kasutaja saab kuulutusi luua
CREATE POLICY "Users can create listings"
  ON listings FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Kasutaja saab oma kuulutusi muuta
CREATE POLICY "Users can update own listings"
  ON listings FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Kasutaja saab oma kuulutusi kustutada
CREATE POLICY "Users can delete own listings"
  ON listings FOR DELETE
  USING (auth.uid() = user_id);

-- ==========================================
-- 4. ROW LEVEL SECURITY — LISTING_IMAGES
-- ==========================================
ALTER TABLE listing_images ENABLE ROW LEVEL SECURITY;

-- Kustuta vanad poliitikat
DROP POLICY IF EXISTS "Listing images are viewable by everyone" ON listing_images;
DROP POLICY IF EXISTS "Users can manage own listing images" ON listing_images;
DROP POLICY IF EXISTS "Users can insert own listing images" ON listing_images;
DROP POLICY IF EXISTS "Users can delete own listing images" ON listing_images;

-- Kõik saavad pilte vaadata
CREATE POLICY "Listing images are viewable by everyone"
  ON listing_images FOR SELECT
  USING (true);

-- Kasutaja saab oma kuulutuste pilte lisada
CREATE POLICY "Users can insert own listing images"
  ON listing_images FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM listings WHERE id = listing_id AND user_id = auth.uid()
    )
  );

-- Kasutaja saab oma kuulutuste pilte kustutada
CREATE POLICY "Users can delete own listing images"
  ON listing_images FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM listings WHERE id = listing_id AND user_id = auth.uid()
    )
  );

-- ==========================================
-- 5. STORAGE — PILTIDE ÜLESLAADIMINE
-- ==========================================

-- Loo bucket kui pole olemas
INSERT INTO storage.buckets (id, name, public)
VALUES ('listing-images', 'listing-images', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Kustuta vanad poliitikat
DROP POLICY IF EXISTS "Anyone can view listing images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload listing images" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete own listing images" ON storage.objects;

-- Kõik saavad pilte vaadata
CREATE POLICY "Anyone can view listing images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'listing-images');

-- Sisselogitud kasutajad saavad pilte üles laadida
CREATE POLICY "Authenticated users can upload listing images"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'listing-images'
    AND auth.role() = 'authenticated'
  );

-- Kasutaja saab oma üleslaaditud pilte kustutada
CREATE POLICY "Users can delete own listing images storage"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'listing-images'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

-- ==========================================
-- 6. INDEKSID (kiirus)
-- ==========================================
CREATE INDEX IF NOT EXISTS idx_listings_status ON listings(status);
CREATE INDEX IF NOT EXISTS idx_listings_user_id ON listings(user_id);
CREATE INDEX IF NOT EXISTS idx_listings_vehicle_type ON listings(vehicle_type);
CREATE INDEX IF NOT EXISTS idx_listings_listing_type ON listings(listing_type);
CREATE INDEX IF NOT EXISTS idx_listings_created_at ON listings(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_listings_county ON listings(county);
CREATE INDEX IF NOT EXISTS idx_listings_price ON listings(price);
CREATE INDEX IF NOT EXISTS idx_listing_images_listing_id ON listing_images(listing_id);
CREATE INDEX IF NOT EXISTS idx_profiles_id ON profiles(id);

-- ==========================================
-- 7. UPDATED_AT AUTOMAATNE UUENDAMINE
-- ==========================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS listings_updated_at ON listings;
CREATE TRIGGER listings_updated_at
  BEFORE UPDATE ON listings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS profiles_updated_at ON profiles;
CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ==========================================
-- VALMIS!
-- ==========================================
-- Kontrolli tulemust:
SELECT tablename, policyname, permissive, roles, cmd
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, cmd;
