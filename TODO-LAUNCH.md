# elektriliikur.ee — Launch Checklist

## Äri / juriidiline
- [ ] OÜ asutamine (e-äriregister)
- [ ] Ärikonto avamine (pangakonto OÜ nimele)
- [ ] Domeeni ost — elektriliikur.ee (zone.ee / veebimajutus.ee)
- [ ] Google Workspace — info@elektriliikur.ee business email
- [ ] Kasutustingimused leht (praegu link olemas, sisu puudu)
- [ ] Privaatsuspoliitika leht (GDPR-kohustuslik, küpsiste info)
- [ ] Äritingimused — teenustasu, vahendustasu struktuur

## Tehniline / infrastruktuur
- [ ] Hosting — GitHub Pages → päris hosting (Vercel/Netlify), oma domeen + HTTPS
- [ ] Domeeni seadistamine — DNS, SSL sertifikaat
- [ ] Supabase Pro plaan — tasuta plaanil on piirangud (limiidid, pause after inactivity)
- [ ] SMTP seadistamine — oma domeenilt emailid (Resend/SendGrid), mitte @supabase.io
- [ ] Stripe live mode — päris maksete vastuvõtmine (vajab OÜ andmeid)
- [ ] Google OAuth — business Google konto + OAuth credentials
- [ ] Piltide optimeerimine — Supabase Storage limiidid, piltide kompressimine üleslaadil

## Funktsionaalsus (puudu)
- [ ] Kuulutuse muutmine/kustutamine — kasutaja saab oma kuulutusi hallata
- [ ] Piltide üleslaadimine — mitu pilti kuulutuse kohta, galerii vaade
- [ ] Otsing — täistekstiotsing kuulutuste seast
- [ ] Sõnumisüsteem — ostja-müüja vaheline suhtlus
- [ ] Oksjonisüsteem — pakkumiste tegemine, taimer, automaatne lõpetamine
- [ ] Rendisüsteem — kuupäevade valik, broneerimine, maksegraafik
- [ ] Kasutajaprofiil — avatar, reiting/tagasiside, aktiivsed kuulutused
- [ ] Admin paneel — kuulutuste modereerimine, kasutajate haldus
- [ ] Emaili teavitused — uus sõnum, pakkumine, kuulutuse aegumine

## SEO / turundus
- [ ] Meta tagid — Open Graph, Twitter cards igale lehele
- [ ] Sitemap.xml + robots.txt
- [ ] Google Analytics / Plausible
- [ ] Google Search Console — indekseerimine
- [ ] Sotsiaalmeedia kontod — Facebook, Instagram
- [ ] Favicon ja PWA manifest — ikoonid, mobile app-like kogemus

## Enne live'i
- [ ] Testimine — kõik vood läbi testida (registreerimine → kuulutuse loomine → maksmine)
- [ ] Mobiilivaade — kõik lehed responsiivsed
- [ ] Error handling — 404 leht, veateated kasutajasõbralikud
- [ ] Rate limiting — spämmikaitse kuulutuste loomisel
- [ ] Andmebaasi RLS — Supabase Row Level Security reeglid (turvalisus!)
