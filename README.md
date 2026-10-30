# Elektriliikurid.ee
 
**Eesti esimene turuplats ainult kasutatud elektriliikuritele** – elektritõukerattad, elektrirattad, mopeedid, krossikad ja rulad.
 
🔗 **Live:** [elektriliikurid.ee](https://elektriliikurid.ee)
 
![Avaleht](docs/screenshot-home.png)
 
## Probleem
 
Kasutatud elektritõukeratta või -ratta müümiseks ja ostmiseks on Eestis praegu kaks varianti: üldised kuulutusportaalid, kus elektriliikurid kaovad kõige muu sekka, või Facebooki grupid, kus puudub otsing, filtrid ja usaldus. Elektriliikuri puhul on ostjale olulised hoopis teised andmed kui tavalise ratta puhul: aku mahtuvus, laadimistsüklid, mootori võimsus, sõiduulatus.
 
## Lahendus
 
Spetsiaalne turuplats, kus:
 
- **kuulutus on ehitatud elektriliikuri järgi** – aku (Wh), laadimistsüklid, mootori võimsus (W), tippkiirus, sõiduulatus, läbisõit;
- **filtrid** sõiduki tüübi, margi, maakonna ja hinna järgi;
- **neli kuulutuse tüüpi** – müük, rent, oksjon ja „otsin";
- **tasuline avaldamine Stripe'i kaudu** (2,99 € / 4,99 € / 9,99 € paketid), rendi- ja oksjonikuulutused tasuta;
- kasutajakonto, profiil ja oma kuulutuste haldus.
## Tehnoloogia
 
| Kiht | Tööriistad |
|---|---|
| Frontend | React 18, Vite, React Router, Tailwind CSS |
| Andmebaas ja autentimine | Supabase (PostgreSQL, Auth, Storage), Row Level Security |
| Maksed | Stripe Checkout + webhook (Supabase Edge Functions, TypeScript/Deno) |
| Deploy | GitHub Actions → GitHub Pages |
| Testimine | Playwright |
 
### Arhitektuur lühidalt
 
- **Andmebaasi skeem** on versioonitud migratsioonidena (`supabase/migrations/`). Iga tabel on kaitstud RLS-poliitikatega – kasutaja näeb aktiivseid kuulutusi, aga muuta saab ainult enda omi.
- **Makse voog:** kasutaja valib paketi → Edge Function `create-checkout` loob Stripe'i sessiooni → pärast makset aktiveerib `stripe-webhook` kuulutuse ja määrab aegumiskuupäeva. Salajased võtmed on ainult serveri poolel.
- **Saladused** hoitakse GitHub Secretsis ja Supabase'i keskkonnamuutujates, mitte koodis.
## Meeskond
 
Projekti asutasid ja ehitasid **Marten Tsimolonskas** ([@matsnq](https://github.com/matsnq)) ja **Martin Kaaber** ([@martinTalTech](https://github.com/martinTalTech)) võrdsete partneritena. Töötasime kogu toote kallal koos – ideest ja ärimudelist kuni frontendi, andmebaasi ja maksete ehitamiseni.
 
## Käivitamine lokaalselt
 
```bash
npm install
cp .env.example .env   # lisa oma Supabase'i ja Stripe'i võtmed
npm run dev
```
 
Avaneb aadressil `http://localhost:5173`.
 
## Staatus
 
[nt. Live beetaversioon. Järgmised sammud: OÜ registreerimine, oma domeen ja hosting, esimesed päris kasutajad.]
