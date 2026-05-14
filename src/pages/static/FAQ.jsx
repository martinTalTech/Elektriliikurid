import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { usePageTitle } from '../../hooks/usePageTitle'

const FAQS = [
  { q: 'Kuidas lisada kuulutus?', a: 'Kliki "Lisa kuulutus" nupul, registreeru või logi sisse, täida mitmeastmeline vorm ja tasu väike avaldamistasu Stripe kaudu.' },
  { q: 'Kui kaua kuulutus aktiivsena püsib?', a: 'Standard pakett (2.99€) — 30 päeva. Premium pakett (5.99€) — 60 päeva koos esiletõstmisega.' },
  { q: 'Kas kontaktandmed on avalikud?', a: 'Ei. Müüja kontaktandmeid näevad ainult registreerunud ja sisse logitud kasutajad.' },
  { q: 'Kas saan kuulutust muuta?', a: 'Jah, oma profiilis saad kõiki oma kuulutusi muuta ja kustutada.' },
  { q: 'Milliseid liikureid saan müüa?', a: 'Platvorml saab müüa elektrilis tõukerattaid ja elektro-krossikaid. Muid sõidukeid lisada ei saa.' },
  { q: 'Kas maks on turvaline?', a: 'Jah, kõik maksed toimuvad läbi Stripe\'i — maailma ühe usaldusväärsema makseteenusepakkuja.' },
]

export default function FAQ() {
  usePageTitle('KKK')
  const [open, setOpen] = useState(null)
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-center mb-10">Korduma kippuvad küsimused</h1>
      <div className="space-y-2">
        {FAQS.map((faq, i) => (
          <div key={i} className="card overflow-hidden">
            <button onClick={() => setOpen(open === i ? null : i)} className="flex items-center justify-between w-full p-5 text-left">
              <span className="font-medium text-white">{faq.q}</span>
              <ChevronDown className={`w-5 h-5 text-muted flex-shrink-0 ml-4 transition-transform ${open === i ? 'rotate-180' : ''}`} />
            </button>
            {open === i && <div className="px-5 pb-5 text-muted-light text-sm leading-relaxed">{faq.a}</div>}
          </div>
        ))}
      </div>
    </div>
  )
}
