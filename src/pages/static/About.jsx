import { Zap } from 'lucide-react'

export default function About() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <div className="text-center mb-10">
        <Zap className="w-12 h-12 text-primary-600 fill-primary-600 mx-auto mb-4" />
        <h1 className="text-3xl font-bold">Meist</h1>
      </div>
      <div className="prose prose-gray max-w-none space-y-6 text-gray-700">
        <p className="text-lg">
          <strong>elektriliikurid.ee</strong> on Eesti esimene spetsialiseeritud platvorm kasutatud elektriliikurite — elektriliste tõukerataste ja elektro-krossikate — ostu-müügiks.
        </p>
        <p>
          Meie eesmärk on muuta elektriliikurite järelturg läbipaistvamaks, lihtsamaks ja turvalisemaks. Usume, et igaühel peaks olema võimalus leida endale sobiv elektriline liikumisvahend taskukohase hinnaga.
        </p>
        <h2 className="text-xl font-semibold text-gray-900 mt-8">Miks elektriliikurid.ee?</h2>
        <ul className="space-y-2 list-disc list-inside">
          <li>Ainult elektriliikurid — täpne otsing ilma mürata</li>
          <li>Detailsed tehnilistud andmed (aku, mootor, ulatus)</li>
          <li>Turvaline registreeritud kasutajate kogukond</li>
          <li>Lihtne ja kiire kuulutuse lisamine</li>
        </ul>
        <p className="text-gray-500 text-sm mt-8">Kontakt: info@elektriliikurid.ee</p>
      </div>
    </div>
  )
}
