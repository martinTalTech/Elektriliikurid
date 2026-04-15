import { Routes, Route } from 'react-router-dom'
import ScrollToTop from './components/ScrollToTop'
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'
import CookieConsent from './components/CookieConsent'
import Home from './pages/Home'
import Listings from './pages/Listings'
import ListingDetail from './pages/ListingDetail'
import CreateListing from './pages/CreateListing'
import Profile from './pages/Profile'
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import ForgotPassword from './pages/auth/ForgotPassword'
import ResetPassword from './pages/auth/ResetPassword'
import About from './pages/static/About'
import FAQ from './pages/static/FAQ'
import Terms from './pages/static/Terms'
import Privacy from './pages/static/Privacy'

export default function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <ScrollToTop />
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/kuulutused" element={<Listings />} />
          <Route path="/kuulutused/:id" element={<ListingDetail />} />
          <Route path="/lisa-kuulutus" element={<CreateListing />} />
          <Route path="/profiil" element={<Profile />} />
          <Route path="/logi-sisse" element={<Login />} />
          <Route path="/registreeru" element={<Register />} />
          <Route path="/unustasin-parooli" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/meist" element={<About />} />
          <Route path="/kkk" element={<FAQ />} />
          <Route path="/tingimused" element={<Terms />} />
          <Route path="/privaatsus" element={<Privacy />} />
        </Routes>
      </main>
      <Footer />
      <CookieConsent />
    </div>
  )
}
