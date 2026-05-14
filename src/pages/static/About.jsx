import { Zap, Mail, MapPin, Phone, Building2 } from 'lucide-react'
import { usePageTitle } from '../../hooks/usePageTitle'

export default function About() {
  usePageTitle('Meist')
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <div className="text-center mb-10">
        <Zap className="w-12 h-12 text-primary-600 fill-primary-600 mx-auto mb-4" />
        <h1 className="text-3xl font-bold">Meist</h1>
      </div>
      <div className="space-y-6 text-muted-light text-sm leading-relaxed">
        <p className="text-base">
          <strong className="text-white">elektriliikur.ee</strong> on Eesti esimene spetsialiseeritud platvorm kasutatud elektriliikurite — elektriliste tõukerataste, elektro-krossikate, mopeedide ja jalgrataste — ostu-müügiks.
        </p>
        <p>
          Meie eesmärk on muuta elektriliikurite järelturg läbipaistvamaks, lihtsamaks ja turvalisemaks. Usume, et igaühel peaks olema võimalus leida endale sobiv elektriline liikumisvahend taskukohase hinnaga.
        </p>

        <h2 className="text-lg font-semibold text-white mt-8">Miks elektriliikur.ee?</h2>
        <ul className="space-y-2 list-disc list-inside">
          <li>Ainult elektriliikurid — täpne otsing ilma mürata</li>
          <li>Detailsed tehnilised andmed (aku, mootor, ulatus)</li>
          <li>Turvaline registreeritud kasutajate kogukond</li>
          <li>Lihtne ja kiire kuulutuse lisamine</li>
        </ul>

        <div className="mt-10 p-6 bg-dark-light rounded-xl border border-surface-border space-y-3">
          <h2 className="text-lg font-semibold text-white flex items-center gap-2">
            <Building2 className="w-5 h-5 text-primary-500" /> Ettevõtte andmed
          </h2>
          <div className="space-y-2 text-sm">
            <p><span className="text-white font-medium">Ettevõte:</span> Nevicus OÜ</p>
            <div className="flex items-start gap-2">
              <MapPin className="w-4 h-4 text-primary-500 mt-0.5 flex-shrink-0" />
              <span>Vabaduse pst 164-4, Nõmme linnaosa, Tallinn, Harju maakond, 10917</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-primary-500 flex-shrink-0" />
              <a href="mailto:info@elektriliikur.ee" className="text-primary-400 hover:text-primary-300">info@elektriliikur.ee</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
