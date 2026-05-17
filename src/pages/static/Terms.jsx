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
          <h2 className="text-lg font-semibold text-white mb-3">2. Platvormi olemus</h2>
          <p className="mb-2">
            elektriliikur.ee on vahendusplatvorm (edaspidi „Platvorm"), mida haldab Nevicus OÜ (edaspidi „Nevicus"). Platvorm võimaldab kasutajatel avaldada ja otsida elektriliikurite müügi-, rendi- ja oksjonikuulutusi.
          </p>
          <p className="mb-2">
            <strong className="text-white">Nevicus ei ole müügi- ega renditehingute osapool.</strong> Nevicus tegutseb üksnes vahendajana, pakkudes platvormi, lepingute haldust ja renditeenuse puhul deposiidihaldust. Tehingud toimuvad otse müüja/rendileandja ja ostja/rentija vahel.
          </p>
          <p>
            Platvormi kasutamisega kinnitab kasutaja, et on vähemalt <strong className="text-white">18-aastane teovõimeline isik</strong>, on tutvunud käesolevate tingimustega ning nõustub nendega.
          </p>
        </section>

        {/* 3 */}
        <section>
          <h2 className="text-lg font-semibold text-white mb-3">3. Kuulutuste liigid ja avaldamise protsess</h2>
          <p className="mb-2">Platvormil on neli kuulutuse liiki:</p>
          <ul className="list-disc list-inside space-y-1 ml-2 mb-3">
            <li><strong className="text-white">Müük</strong> — kasutaja müüb elektriliikurit</li>
            <li><strong className="text-white">Rent</strong> — kasutaja annab elektriliikurit rendile (vt punkt 7)</li>
            <li><strong className="text-white">Oksjon</strong> — enampakkumine; pakkumisi saavad teha registreeritud kasutajad</li>
            <li><strong className="text-white">Otsitakse</strong> — kasutaja otsib konkreetset elektriliikurit</li>
          </ul>
          <p className="mb-2">Müügikuulutuse avaldamise protsess:</p>
          <ol className="list-decimal list-inside space-y-1 ml-2">
            <li>Registreeru ja logi sisse</li>
            <li>Kliki „Lisa kuulutus" ja täida sõiduki andmed</li>
            <li>Vali kuulutuspakett (Basic / Standard / Premium)</li>
            <li>Tasu platvormi kasutustasu</li>
            <li>Kuulutus avaldatakse pärast makse kinnitust</li>
            <li>Automaatne e-posti kinnitus saadetakse registreeritud aadressile</li>
          </ol>
        </section>

        {/* 4 */}
        <section>
          <h2 className="text-lg font-semibold text-white mb-3">4. Hinnad ja tasud</h2>
          <p className="mb-2">Kõik platvormi tasud on esitatud eurodes koos käibemaksuga (kui kohaldub):</p>
          <ul className="space-y-1 ml-2 mb-3">
            <li><strong className="text-white">Basic:</strong> 2,99 € — kuulutus aktiivne 30 päeva</li>
            <li><strong className="text-white">Standard:</strong> 4,99 € — kuulutus aktiivne 60 päeva</li>
            <li><strong className="text-white">Premium:</strong> 9,99 € — kuulutus aktiivne 90 päeva + esiletõstmine</li>
            <li><strong className="text-white">Rent / Otsitakse / Oksjon:</strong> tasuta</li>
          </ul>
          <p>Müügi- ja rendihinnad kuulutustel määrab kasutaja ise — Nevicus ei vastuta kasutajate esitatud hindade eest.</p>
        </section>

        {/* 5 */}
        <section>
          <h2 className="text-lg font-semibold text-white mb-3">5. Tooteinfo kohustus</h2>
          <p className="mb-2">
            Kuulutuse avaldaja on kohustatud esitama tõese ja detailse tooteinfo eesti keeles, sh sõiduki mark, mudel, aastakäik, tehniline seisukord, läbisõit ja kõik teadaolevad puudused.
          </p>
          <p>
            Puuduliku või eksitava info esitamine on keelatud. Kui ostja teeb vale valiku puuduliku informatsiooni tõttu, on tal õigus nõuda müüjalt kahju hüvitamist. Nevicus ei kontrolli kuulutuste sisu õigsust.
          </p>
        </section>

        {/* 6 */}
        <section>
          <h2 className="text-lg font-semibold text-white mb-3">6. Makse ja kättetoimetamine</h2>
          <p className="mb-2">
            <strong className="text-white">Platvormi kasutustasu</strong> tasutakse veebis Stripe maksekeskkonna kaudu (kaardimakse, Apple Pay, Google Pay). Tasu arvestatakse kohe makse sooritamisel.
          </p>
          <p>
            <strong className="text-white">Kauba üleandmine</strong> toimub müüja ja ostja vahelisel kokkuleppel — Nevicus ei vastuta üleandmise korralduse ega kulude eest. Tingimused (aeg, koht, kulud) lepitakse kokku otse tehingupoolte vahel.
          </p>
        </section>

        {/* 7 */}
        <section>
          <h2 className="text-lg font-semibold text-white mb-3">7. Rentimistehingud ja deposiidihaldus</h2>
          <p className="mb-2">
            Renditeenuse puhul tegutseb Nevicus vahendajana rendileandja ja rentija vahel. Rendilepingu tingimused lepitakse kokku poolte vahel platvormi kaudu. Nevicus pakub järgmisi lisateenuseid:
          </p>
          <ul className="list-disc list-inside space-y-1 ml-2 mb-3">
            <li>rendilepingu malli ja dokumentatsiooni pakkumine</li>
            <li>deposiidi vastuvõtmine, hoidmine ja vabastamine</li>
            <li>automaatsed meeldetuletused rendiperioodi lõpu lähenedes</li>
            <li>vaidluste korral deposiidi jagamisotsuse tegemine esitatud tõendite põhjal</li>
          </ul>
          <p className="mb-2"><strong className="text-white">Deposiidi haldamine:</strong></p>
          <ul className="list-disc list-inside space-y-1 ml-2">
            <li>Rentija tasub deposiidi platvormi kaudu Nevicuse määratud kontole</li>
            <li>Nevicus hoiab deposiiti eraldi kliendikontol kuni rendiperioodi lõpuni</li>
            <li>Deposiit vabastatakse rentijale täies ulatuses, kui seade tagastatakse lepingus sätestatud seisukorras ja tähtajal</li>
            <li>Deposiit vabastatakse osaliselt või täielikult rendileandjale dokumenteeritud kahjustuste korral</li>
            <li>Mõlemal poolel on õigus esitada nõudeid <strong className="text-white">24 tunni jooksul</strong> pärast seadme tagastamist</li>
            <li>Nevicus teeb deposiidi jagamise otsuse <strong className="text-white">72 tunni jooksul</strong> pärast nõuete esitamise tähtaja lõppu</li>
          </ul>
          <p className="mt-2">
            Rendileandja kinnitab platvormi kasutamisega, et seade kuulub talle õiguslikult ja on vaba kolmandate isikute nõuetest. Rentija kinnitab, et kasutab seadet vastavalt kehtivale õigusele.
          </p>
        </section>

        {/* 8 */}
        <section>
          <h2 className="text-lg font-semibold text-white mb-3">8. Taganemisõigus — platvormi kuulutuspakett</h2>
          <p className="mb-2">
            Vastavalt võlaõigusseaduse § 56 on tarbijal õigus taganeda platvormi kuulutuspaketi lepingust <strong className="text-white">14 päeva jooksul</strong> alates lepingu sõlmimisest, esitades taganemisavalduse e-posti aadressil{' '}
            <a href="mailto:info@elektriliikur.ee" className="text-primary-400 hover:text-primary-300">info@elektriliikur.ee</a>.
          </p>
          <p className="mb-2">
            <strong className="text-white">NB!</strong> Kui kuulutus on 14-päevase taganemisperioodi jooksul juba avaldatud (teenus on täielikult osutatud), kaotab tarbija taganemisõiguse vastavalt VÕS § 53 lg 4 p 1 — tingimusel, et tarbija on sellega eelnevalt nõustunud.
          </p>
          <p>
            Taganemisavalduse tüüpvormi leiad{' '}
            <a href="https://www.riigiteataja.ee/aktilisa/1280/2013/013/JMm11_lisa2.pdf" target="_blank" rel="noopener noreferrer" className="text-primary-400 hover:text-primary-300 underline">
              siit (Justiitsministri määrus)
            </a>.
          </p>
        </section>

        {/* 9 */}
        <section>
          <h2 className="text-lg font-semibold text-white mb-3">9. Tagastamiskulud</h2>
          <p>
            Platvormi kuulutuspaketi taganemise korral kannab tagastamisega seotud kulud Nevicus, kuna teenus osutatakse digitaalselt — füüsilisi tagastuskulusid ei teki. Tagasimakse teostatakse 14 päeva jooksul alates taganemisavalduse saamisest samale makseviisile, millega tasu tasuti.
          </p>
        </section>

        {/* 10 */}
        <section>
          <h2 className="text-lg font-semibold text-white mb-3">10. Kasutajate kohustused ja kinnitused</h2>
          <p className="mb-2">Platvormi kasutamisega kinnitab kasutaja, et:</p>
          <ul className="list-disc list-inside space-y-1 ml-2">
            <li>on vähemalt 18-aastane teovõimeline isik</li>
            <li>esitab tõeseid andmeid registreerimisel ja kuulutustes</li>
            <li>on teadlik, et Nevicus tegutseb üksnes vahendajana</li>
            <li>ei avalda ebaseaduslikku, eksitavat ega solvavat sisu</li>
            <li>ei avalda sama kuulutust korduvalt</li>
            <li>täidab Eesti seadusi kuulutuste sisu osas</li>
          </ul>
          <p className="mt-2">Reeglite rikkumisel on Nevicusel õigus konto sulgeda.</p>
        </section>

        {/* 11 */}
        <section>
          <h2 className="text-lg font-semibold text-white mb-3">11. Vastutuse piirang</h2>
          <p className="mb-2">Nevicus vastutab üksnes käesolevates tingimustes sätestatud kohustuste täitmise eest. Nevicus ei vastuta:</p>
          <ul className="list-disc list-inside space-y-1 ml-2">
            <li>müügi- või rendilepingu täitmise või täitmata jätmise eest kasutajate poolt</li>
            <li>seadme kahjustuste, varguse, kadumise ega nendest tulenevate kahjude eest</li>
            <li>kasutajate poolt esitatud valeandmete eest</li>
            <li>vääramatu jõu (force majeure) asjaoludest tingitud tagajärgede eest</li>
            <li>seadmete tehnilise seisukorra eest</li>
          </ul>
          <p className="mt-2">
            Nevicuse maksimaalne vastutus renditeenuse vaidluste puhul on piiratud sama tehingu raames hoitava deposiidi summaga.
          </p>
        </section>

        {/* 12 */}
        <section>
          <h2 className="text-lg font-semibold text-white mb-3">12. Pretensiooni esitamine</h2>
          <p className="mb-2">
            Platvormi teenusega seotud pretensioonid esita e-posti aadressil{' '}
            <a href="mailto:info@elektriliikur.ee" className="text-primary-400 hover:text-primary-300">info@elektriliikur.ee</a>.
            Vastame kirjalikele kaebustele <strong className="text-white">15 tööpäeva</strong> jooksul.
          </p>
          <p>
            Kaupade osas (müüja ja ostja vaheline vaidlus) tuleb pretensioon esitada otse müüjale. Müüjal on seadusjärgne kohustus reageerida <strong className="text-white">15 päeva</strong> jooksul.
          </p>
        </section>

        {/* 13 */}
        <section>
          <h2 className="text-lg font-semibold text-white mb-3">13. Vaidluste lahendamine</h2>
          <p className="mb-2">
            Kasutajatevahelisi vaidlusi püütakse lahendada Nevicuse vahendamisel. Kui vaidlust ei õnnestu lahendada pooltevahelisel kokkuleppel, on õigus pöörduda:
          </p>
          <div className="p-4 bg-dark-light rounded-lg border border-surface-border mb-3">
            <p className="font-medium text-white mb-1">Tarbijakaitse ja Tehnilise Järelevalve Amet (TKTJA)</p>
            <p>Tarbijavaidluste komisjon — Endla 10A, 10122 Tallinn</p>
            <p>
              <a href="https://www.ttja.ee" target="_blank" rel="noopener noreferrer" className="text-primary-400 hover:text-primary-300">www.ttja.ee</a>
              {' | '}
              <a href="mailto:info@ttja.ee" className="text-primary-400 hover:text-primary-300">info@ttja.ee</a>
            </p>
            <p className="text-muted text-xs mt-2">Tasuta. Pädevuses vaidlused väärtusega 30 € või rohkem.</p>
          </div>
          <p className="mb-2">Ärivaidluste korral: <strong className="text-white">Harju Maakohus</strong>.</p>
          <p>
            EL veebipõhine vaidluste lahendamise platvorm:{' '}
            <a href="https://ec.europa.eu/consumers/odr" target="_blank" rel="noopener noreferrer" className="text-primary-400 hover:text-primary-300 underline">ec.europa.eu/consumers/odr</a>
          </p>
          <p className="mt-2">Käesolevatele tingimustele kohaldatakse Eesti Vabariigi õigust.</p>
        </section>

        {/* 14 */}
        <section>
          <h2 className="text-lg font-semibold text-white mb-3">14. Isikuandmed</h2>
          <p>
            Isikuandmete töötlemise kohta vaata meie{' '}
            <a href="/#/privaatsus" className="text-primary-400 hover:text-primary-300">privaatsuspoliitikat</a>.
          </p>
        </section>

        {/* 15 */}
        <section>
          <h2 className="text-lg font-semibold text-white mb-3">15. Tingimuste muutmine</h2>
          <p>
            Nevicusel on õigus kasutustingimusi muuta, teavitades registreeritud kasutajaid e-posti teel vähemalt <strong className="text-white">14 päeva</strong> ette.
          </p>
        </section>

        <p className="text-muted text-xs mt-8 pt-4 border-t border-surface-border">
          Nevicus OÜ | Vabaduse pst 164-4, Tallinn | info@elektriliikur.ee | +372 518 1108 | Uuendatud: mai 2026
        </p>
      </div>
    </div>
  )
}
