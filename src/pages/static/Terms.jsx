import { usePageTitle } from '../../hooks/usePageTitle'

export default function Terms() {
  usePageTitle('Kasutustingimused')
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-2">Kasutustingimused</h1>
      <p className="text-muted text-sm mb-10">Kehtib alates: mai 2026 | Nevicus OÜ</p>

      <div className="space-y-8 text-muted-light text-sm leading-relaxed">

        {/* 1 */}
        <section>
          <h2 className="text-lg font-semibold text-white mb-3">1. Ettevõtja andmed</h2>
          <p className="mb-2">Platvormi elektriliikur.ee haldab:</p>
          <ul className="space-y-1 ml-2">
            <li><strong className="text-white">Ettevõte:</strong> Nevicus OÜ</li>
            <li><strong className="text-white">Aadress:</strong> Vabaduse pst 164-4, Nõmme linnaosa, Tallinn, Harju maakond, 10917</li>
            <li><strong className="text-white">Telefon:</strong> <a href="tel:+3725181108" className="text-primary-400 hover:text-primary-300">+372 518 1108</a></li>
            <li><strong className="text-white">E-post:</strong> <a href="mailto:info@elektriliikur.ee" className="text-primary-400 hover:text-primary-300">info@elektriliikur.ee</a></li>
          </ul>
        </section>

        {/* 2 */}
        <section>
          <h2 className="text-lg font-semibold text-white mb-3">2. Platvormi olemus ja ostuprotsess</h2>
          <p className="mb-2">
            elektriliikur.ee on vahendusplatvorm, mis võimaldab kasutajatel avaldada ja otsida kasutatud elektriliikurite kuulutusi. Platvorm ei ole kaupade müüja — müügitehing toimub otse müüja ja ostja vahel.
          </p>
          <p className="mb-2">Kuulutuse avaldamise protsess:</p>
          <ol className="list-decimal list-inside space-y-1 ml-2">
            <li>Registreeru ja logi sisse</li>
            <li>Kliki „Lisa kuulutus" ja täida sõiduki andmed</li>
            <li>Vali kuulutuspakett (Basic / Standard / Premium)</li>
            <li>Tasu platvormi kasutustasu</li>
            <li>Kuulutus avaldatakse pärast makse kinnitust</li>
          </ol>
          <p className="mt-2">
            Kasutustingimused on kättesaadavad kodulehe jaluses rubriigis „Tingimused" ning need on tarbijale lihtsalt leitavad.
          </p>
        </section>

        {/* 3 */}
        <section>
          <h2 className="text-lg font-semibold text-white mb-3">3. Tellimuse kinnitamine</h2>
          <p>
            Pärast kuulutuspaketi eest tasumist saadetakse kasutajale automaatne e-posti kinnitus registreeritud e-posti aadressile. Kinnitus sisaldab tehingu üksikasju ja kuulutuse kehtivusaega.
          </p>
        </section>

        {/* 4 */}
        <section>
          <h2 className="text-lg font-semibold text-white mb-3">4. Hinnad</h2>
          <p className="mb-2">
            Kõik kuulutuste avaldamise paketitasud on esitatud eurodes koos käibemaksuga (kui kohaldub). Paketitasud:
          </p>
          <ul className="space-y-1 ml-2">
            <li><strong className="text-white">Basic:</strong> 2,99 € — kuulutus aktiivne 30 päeva</li>
            <li><strong className="text-white">Standard:</strong> 4,99 € — kuulutus aktiivne 60 päeva</li>
            <li><strong className="text-white">Premium:</strong> 9,99 € — kuulutus aktiivne 90 päeva + esiletõstmine</li>
            <li><strong className="text-white">Rent / Otsitakse / Oksjon:</strong> tasuta</li>
          </ul>
          <p className="mt-2">Müügihinnad kuulutustel määrab müüja ise — platvorm ei vastuta müüja esitatud hindade eest.</p>
        </section>

        {/* 5 */}
        <section>
          <h2 className="text-lg font-semibold text-white mb-3">5. Tooteinfo</h2>
          <p>
            Müüja on kohustatud esitama tõese ja detailse tooteinfo eesti keeles, sh sõiduki mark, mudel, aastakäik, tehniline seisukord, läbisõit ja puudused. Puuduliku või eksitava info esitamine on keelatud. Kui ostja teeb vale valiku puuduliku informatsiooni tõttu, on tal õigus nõuda müüjalt kahju hüvitamist.
          </p>
        </section>

        {/* 6 */}
        <section>
          <h2 className="text-lg font-semibold text-white mb-3">6. Makse ja kättetoimetamine</h2>
          <p className="mb-2">
            <strong className="text-white">Platvormi kasutustasu</strong> tasutakse veebis Stripe maksekeskkonna kaudu (kaardimakse, Apple Pay, Google Pay). Tasu arvestatakse kohe makse sooritamisel.
          </p>
          <p>
            <strong className="text-white">Kauba kättetoimetamine</strong> toimub müüja ja ostja vahelisel kokkuleppel — platvorm ei vastuta kättetoimetamise korralduse ega kulude eest. Kättetoimetamise tingimused (aeg, koht, kulud) lepitakse kokku otse müüja ja ostjaga.
          </p>
        </section>

        {/* 7 */}
        <section>
          <h2 className="text-lg font-semibold text-white mb-3">7. Taganemisõigus — platvormi kuulutuspakett</h2>
          <p className="mb-2">
            Vastavalt võlaõigusseaduse § 56 on tarbijal õigus taganeda platvormi kuulutuspaketi lepingust <strong className="text-white">14 päeva jooksul</strong> alates lepingu sõlmimisest, esitades taganemisavalduse e-posti aadressil{' '}
            <a href="mailto:info@elektriliikur.ee" className="text-primary-400 hover:text-primary-300">info@elektriliikur.ee</a>.
          </p>
          <p className="mb-2">
            <strong className="text-white">NB!</strong> Kui kuulutus on 14-päevase taganemisperioodi jooksul juba avaldatud (teenus on täielikult osutatud), kaotab tarbija taganemisõiguse vastavalt VÕS § 53 lg 4 p 1 — tingimusel, et tarbija on sellega eelnevalt nõustunud.
          </p>
          <p>
            Taganemisavalduse tüüpvormi leiad{' '}
            <a
              href="https://www.riigiteataja.ee/aktilisa/1280/2013/013/JMm11_lisa2.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary-400 hover:text-primary-300 underline"
            >
              siit (Justiitsministri määrus)
            </a>.
          </p>
        </section>

        {/* 8 */}
        <section>
          <h2 className="text-lg font-semibold text-white mb-3">8. Tagastamiskulud</h2>
          <p>
            Platvormi kuulutuspaketi taganemise korral kannab tagastamisega seotud kulud platvorm, kuna teenus osutatakse digitaalselt — füüsilisi tagastuskulusid ei teki. Tagasimakse teostatakse 14 päeva jooksul alates taganemisavalduse saamisest samale makseviisile, millega tasu tasuti.
          </p>
        </section>

        {/* 9 */}
        <section>
          <h2 className="text-lg font-semibold text-white mb-3">9. Kasutajate kohustused</h2>
          <ul className="list-disc list-inside space-y-1 ml-2">
            <li>Esitada tõeseid andmeid registreerimisel ja kuulutustes</li>
            <li>Mitte avaldada ebaseaduslikku, eksitavat ega solvavat sisu</li>
            <li>Mitte avaldada sama kuulutust korduvalt</li>
            <li>Täita Eesti seadusi kuulutuste sisu osas</li>
          </ul>
          <p className="mt-2">Reeglite rikkumisel on platvormil õigus konto sulgeda.</p>
        </section>

        {/* 10 */}
        <section>
          <h2 className="text-lg font-semibold text-white mb-3">10. Vastutuse piirang</h2>
          <p>
            elektriliikur.ee on vahendusplatvorm ega vastuta kuulutustes esitatud info õigsuse, kaupade seisukorra ega ostja ja müüja vaheliste tehingute eest. Platvorm ei ole kauplemistehingute osapool.
          </p>
        </section>

        {/* 11 */}
        <section>
          <h2 className="text-lg font-semibold text-white mb-3">11. Pretensiooni esitamine</h2>
          <p className="mb-2">
            Platvormi teenusega seotud pretensioonid esita e-posti aadressil{' '}
            <a href="mailto:info@elektriliikur.ee" className="text-primary-400 hover:text-primary-300">info@elektriliikur.ee</a>.
            Vastame kirjalikele kaebustele <strong className="text-white">15 tööpäeva</strong> jooksul.
          </p>
          <p>
            Kaupade osas (müüja ja ostja vaheline vaidlus) tuleb pretensioon esitada otse müüjale. Müüjal on seadusjärgne kohustus reageerida pretensiooni esitamise korral <strong className="text-white">15 päeva</strong> jooksul.
          </p>
        </section>

        {/* 12 */}
        <section>
          <h2 className="text-lg font-semibold text-white mb-3">12. Vaidluste lahendamine</h2>
          <p className="mb-2">
            Kui vaidlust ei õnnestu lahendada pooltevahelisel kokkuleppel, on tarbijal õigus pöörduda kohtuvälise vaidluste lahendamise organi poole:
          </p>
          <div className="p-4 bg-dark-light rounded-lg border border-surface-border">
            <p className="font-medium text-white mb-1">Tarbijakaitse ja Tehnilise Järelevalve Amet (TKTJA)</p>
            <p>Tarbijavaidluste komisjon</p>
            <p>Endla 10A, 10122 Tallinn</p>
            <p>
              <a href="https://www.ttja.ee" target="_blank" rel="noopener noreferrer" className="text-primary-400 hover:text-primary-300">www.ttja.ee</a>
              {' | '}
              <a href="mailto:info@ttja.ee" className="text-primary-400 hover:text-primary-300">info@ttja.ee</a>
            </p>
            <p className="text-muted text-xs mt-2">Komisjoni pädevuses on lahendada vaidlusi, mille väärtus on 30 € või rohkem. Kaebuse läbivaatamine on pooltele tasuta.</p>
          </div>
          <p className="mt-3">
            Euroopa Liidu veebipõhine vaidluste lahendamise platvorm:{' '}
            <a href="https://ec.europa.eu/consumers/odr" target="_blank" rel="noopener noreferrer" className="text-primary-400 hover:text-primary-300 underline">ec.europa.eu/consumers/odr</a>
          </p>
        </section>

        {/* 13 */}
        <section>
          <h2 className="text-lg font-semibold text-white mb-3">13. Isikuandmed</h2>
          <p>
            Isikuandmete töötlemise kohta vaata meie{' '}
            <a href="/#/privaatsus" className="text-primary-400 hover:text-primary-300">privaatsuspoliitikat</a>.
          </p>
        </section>

        {/* 14 */}
        <section>
          <h2 className="text-lg font-semibold text-white mb-3">14. Muudatused</h2>
          <p>
            Jätame endale õiguse kasutustingimusi muuta. Olulistest muudatustest teavitame registreeritud kasutajaid e-posti teel vähemalt 14 päeva ette.
          </p>
        </section>

        <p className="text-muted text-xs mt-8 pt-4 border-t border-surface-border">
          Nevicus OÜ | Vabaduse pst 164-4, Tallinn | info@elektriliikur.ee | Uuendatud: mai 2026
        </p>
      </div>
    </div>
  )
}
