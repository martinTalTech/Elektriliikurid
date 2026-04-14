export default function Privacy() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">Privaatsuspoliitika</h1>
      <div className="space-y-6 text-muted-light text-sm leading-relaxed">
        <section>
          <h2 className="text-lg font-semibold text-white mb-2">1. Kogutavad andmed</h2>
          <p>Kogume registreerimisel esitatud andmeid (nimi, email, telefon) ning kuulutuste sisu. Samuti kogume anonüümseid kasutusstatistikaid.</p>
        </section>
        <section>
          <h2 className="text-lg font-semibold text-white mb-2">2. Andmete kasutamine</h2>
          <p>Andmeid kasutatakse ainult platvormi toimimiseks — konto haldus, kuulutuste avaldamine, maksete töötlemine. Me ei müü ega jaga andmeid kolmandatele osapooltele.</p>
        </section>
        <section>
          <h2 className="text-lg font-semibold text-white mb-2">3. Kolmandad osapooled</h2>
          <p>Kasutame Supabase'i (andmebaas ja autentimine), Stripe'i (maksed) ja GitHub Pages'i (hostimine). Kõik järgivad GDPR nõudeid.</p>
        </section>
        <section>
          <h2 className="text-lg font-semibold text-white mb-2">4. Sinu õigused</h2>
          <p>Sul on õigus näha, muuta ja kustutada oma andmeid. Kontakteeru meiega: info@elektriliikurid.ee</p>
        </section>
        <p className="text-muted text-xs mt-8">Uuendatud: aprill 2026</p>
      </div>
    </div>
  )
}
