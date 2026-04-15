export default function Privacy() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-white mb-2">Privaatsuspoliitika</h1>
      <p className="text-muted text-sm mb-8">Kehtib alates: aprill 2026</p>

      <div className="space-y-8 text-muted-light text-sm leading-relaxed">
        <section>
          <h2 className="text-lg font-semibold text-white mb-3">1. Vastutav töötleja</h2>
          <p>
            Vastutav töötleja on elektriliikurid.ee (edaspidi "Platvorm").<br />
            Kontakt: <a href="mailto:info@elektriliikur.ee" className="text-primary-400 hover:text-primary-300">info@elektriliikur.ee</a>
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-white mb-3">2. Kogutavad isikuandmed</h2>
          <p className="mb-2">Kogume järgmisi andmeid:</p>
          <ul className="list-disc list-inside space-y-1 ml-2">
            <li><strong className="text-white">Registreerimisel:</strong> nimi, e-posti aadress, telefoninumber (valikuline), parool (krüpteeritud)</li>
            <li><strong className="text-white">Kuulutuse loomisel:</strong> kuulutuse sisu, hind, asukoht, pildid</li>
            <li><strong className="text-white">Automaatselt:</strong> IP-aadress, brauseri tüüp, külastusaeg, vaadatud lehed (küpsiste kaudu)</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-white mb-3">3. Andmete töötlemise eesmärk ja õiguslik alus</h2>
          <table className="w-full text-xs border border-surface-border rounded-lg overflow-hidden">
            <thead>
              <tr className="bg-dark-light">
                <th className="text-left p-3 text-white font-medium">Eesmärk</th>
                <th className="text-left p-3 text-white font-medium">Õiguslik alus</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-border">
              <tr><td className="p-3">Konto loomine ja haldamine</td><td className="p-3">Lepingu täitmine</td></tr>
              <tr><td className="p-3">Kuulutuste avaldamine</td><td className="p-3">Lepingu täitmine</td></tr>
              <tr><td className="p-3">Maksete töötlemine</td><td className="p-3">Lepingu täitmine</td></tr>
              <tr><td className="p-3">E-posti teavitused</td><td className="p-3">Õigustatud huvi / nõusolek</td></tr>
              <tr><td className="p-3">Kasutusstatistika</td><td className="p-3">Nõusolek (küpsised)</td></tr>
              <tr><td className="p-3">Platvormi turvalisuse tagamine</td><td className="p-3">Õigustatud huvi</td></tr>
            </tbody>
          </table>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-white mb-3">4. Küpsised</h2>
          <p className="mb-2">Kasutame järgmisi küpsiseid:</p>
          <table className="w-full text-xs border border-surface-border rounded-lg overflow-hidden">
            <thead>
              <tr className="bg-dark-light">
                <th className="text-left p-3 text-white font-medium">Küpsis</th>
                <th className="text-left p-3 text-white font-medium">Eesmärk</th>
                <th className="text-left p-3 text-white font-medium">Tüüp</th>
                <th className="text-left p-3 text-white font-medium">Kehtivus</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-border">
              <tr><td className="p-3">sb-*-auth-token</td><td className="p-3">Sisselogimine (Supabase)</td><td className="p-3">Vajalik</td><td className="p-3">Sessioon</td></tr>
              <tr><td className="p-3">cookie-consent</td><td className="p-3">Küpsiste nõusoleku meeldejätmine</td><td className="p-3">Vajalik</td><td className="p-3">1 aasta</td></tr>
            </tbody>
          </table>
          <p className="mt-2">Analüütika küpsised aktiveeritakse ainult sinu nõusolekul.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-white mb-3">5. Andmete jagamine kolmandate osapooltega</h2>
          <p className="mb-2">Jagame andmeid järgmiste teenusepakkujatega:</p>
          <ul className="list-disc list-inside space-y-1 ml-2">
            <li><strong className="text-white">Supabase Inc.</strong> (USA) — andmebaas ja autentimine. Andmete edastamine USA-sse toimub standardsete lepingutingimuste (SCC) alusel.</li>
            <li><strong className="text-white">Stripe Inc.</strong> (USA) — maksete töötlemine. Stripe on PCI DSS sertifitseeritud.</li>
            <li><strong className="text-white">Zone Media OÜ</strong> (Eesti) — veebimajutus.</li>
          </ul>
          <p className="mt-2">Me ei müü ega jaga sinu isikuandmeid reklaamijatele ega muudele kolmandatele osapooltele.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-white mb-3">6. Andmete säilitamine</h2>
          <ul className="list-disc list-inside space-y-1 ml-2">
            <li>Kontoandmed — kuni konto kustutamiseni</li>
            <li>Kuulutused — kuni kuulutuse aegumiseni või kustutamiseni + 30 päeva varukoopias</li>
            <li>Makseandmed — 7 aastat (raamatupidamiskohustus)</li>
            <li>Logid — 90 päeva</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-white mb-3">7. Sinu õigused (GDPR)</h2>
          <p className="mb-2">Sul on õigus:</p>
          <ul className="list-disc list-inside space-y-1 ml-2">
            <li><strong className="text-white">Juurdepääs</strong> — küsida, milliseid andmeid me sinu kohta säilitame</li>
            <li><strong className="text-white">Parandamine</strong> — nõuda ebatäpsete andmete parandamist</li>
            <li><strong className="text-white">Kustutamine</strong> — nõuda oma andmete kustutamist ("õigus olla unustatud")</li>
            <li><strong className="text-white">Andmete ülekandmine</strong> — saada oma andmed masinloetavas formaadis</li>
            <li><strong className="text-white">Vastuväide</strong> — esitada vastuväide andmete töötlemisele</li>
            <li><strong className="text-white">Nõusoleku tagasivõtmine</strong> — võtta igal ajal tagasi küpsiste nõusolek</li>
          </ul>
          <p className="mt-3">
            Õiguste kasutamiseks kirjuta:{' '}
            <a href="mailto:info@elektriliikur.ee" className="text-primary-400 hover:text-primary-300">info@elektriliikur.ee</a>.
            Vastame 30 päeva jooksul.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-white mb-3">8. Andmete turvalisus</h2>
          <p>
            Kasutame andmete kaitsmiseks järgmisi meetmeid: HTTPS krüpteering, paroolide räsimine (bcrypt),
            Supabase Row Level Security, regulaarsed turvaauditid. Juurdepääs isikuandmetele on piiratud ainult
            volitatud isikutele.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-white mb-3">9. Kaebus</h2>
          <p>
            Kui leiad, et sinu andmeid on töödeldud ebaseaduslikult, on sul õigus esitada kaebus{' '}
            <a href="https://www.aki.ee" target="_blank" rel="noopener noreferrer" className="text-primary-400 hover:text-primary-300 underline">
              Andmekaitse Inspektsioonile
            </a>{' '}
            (Tatari 39, 10134 Tallinn, info@aki.ee).
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-white mb-3">10. Muudatused</h2>
          <p>
            Jätame endale õiguse käesolevat privaatsuspoliitikat muuta. Olulistest muudatustest teavitame
            registreeritud kasutajaid e-posti teel. Viimane uuendus: aprill 2026.
          </p>
        </section>
      </div>
    </div>
  )
}
