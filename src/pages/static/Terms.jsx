import { usePageTitle } from '../../hooks/usePageTitle'

export default function Terms() {
  usePageTitle('Kasutustingimused')
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">Kasutustingimused</h1>
      <div className="space-y-6 text-muted-light text-sm leading-relaxed">
        <section>
          <h2 className="text-lg font-semibold text-white mb-2">1. Üldine</h2>
          <p>Kasutades elektriliikurid.ee platvormi, nõustud käesolevate kasutustingimustega. Platvorm on mõeldud ainult elektriliikurite ostu-müügikuulutuste avaldamiseks.</p>
        </section>
        <section>
          <h2 className="text-lg font-semibold text-white mb-2">2. Kasutajate kohustused</h2>
          <p>Kasutaja kohustub esitama tõeseid andmeid, sh sõiduki tehnilist infot ja seisukorda. Valeandmete esitamine on keelatud ja võib kaasa tuua konto sulgemise.</p>
        </section>
        <section>
          <h2 className="text-lg font-semibold text-white mb-2">3. Kuulutused</h2>
          <p>Kuulutused peavad vastama Eesti seadustele. Platvormi haldajal on õigus eemaldada ebasobivaid kuulutusi. Avaldamistasu ei kuulu tagastamisele.</p>
        </section>
        <section>
          <h2 className="text-lg font-semibold text-white mb-2">4. Vastutuse piirang</h2>
          <p>elektriliikurid.ee on vahendusplatvorm ega vastuta kuulutustes esitatud info õigsuse ega ostja-müüja vaheliste tehingute eest.</p>
        </section>
        <p className="text-muted text-xs mt-8">Uuendatud: aprill 2026</p>
      </div>
    </div>
  )
}
