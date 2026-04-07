import { Link } from 'react-router-dom'
import { Zap } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-16">
      <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <div className="flex items-center gap-1.5 font-bold text-xl text-white mb-3">
            <Zap className="w-5 h-5 fill-white" />
            <span>elektriliikurid</span>
          </div>
          <p className="text-sm text-gray-400">Eesti suurim kasutatud elektriliikurite turg.</p>
        </div>
        <div>
          <h3 className="font-semibold text-white mb-3">Kuulutused</h3>
          <ul className="space-y-2 text-sm">
            <li><Link to="/kuulutused?type=scooter" className="hover:text-black">Tõukerattad</Link></li>
            <li><Link to="/kuulutused?type=cross" className="hover:text-black">Elektro-krossikad</Link></li>
            <li><Link to="/lisa-kuulutus" className="hover:text-black">Lisa kuulutus</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="font-semibold text-white mb-3">Info</h3>
          <ul className="space-y-2 text-sm">
            <li><Link to="/meist" className="hover:text-black">Meist</Link></li>
            <li><Link to="/kkk" className="hover:text-black">KKK</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="font-semibold text-white mb-3">Õiguslik</h3>
          <ul className="space-y-2 text-sm">
            <li><Link to="/tingimused" className="hover:text-black">Kasutustingimused</Link></li>
            <li><Link to="/privaatsus" className="hover:text-black">Privaatsuspoliitika</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-gray-800 py-4 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} elektriliikurid.ee — Kõik õigused kaitstud
      </div>
    </footer>
  )
}
