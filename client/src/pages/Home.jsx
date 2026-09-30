import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Search, 
  MapPin, 
  Calendar, 
  Zap, 
  ShieldCheck, 
  Tv, 
  TrendingUp, 
  Clock, 
  Layers, 
  ArrowRight, 
  CheckCircle2, 
  Star, 
  ChevronRight, 
  Sparkles, 
  Building2, 
  Eye, 
  Users, 
  Coins, 
  Filter,
  DollarSign
} from 'lucide-react';
import BoardCard from '../components/common/BoardCard';
import { mockBoards, boardCategories, puneAreas } from '../data/mockBoards';

export default function Home() {
  const navigate = useNavigate();
  const [searchArea, setSearchArea] = useState('All Areas');
  const [searchType, setSearchType] = useState('all');
  const [workTab, setWorkTab] = useState('client'); // 'client' | 'advertiser'

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchArea !== 'All Areas') params.append('area', searchArea);
    if (searchType !== 'all') params.append('type', searchType);
    navigate(`/explore?${params.toString()}`);
  };

  return (
    <div className="flex flex-col w-full overflow-hidden">
      
      {/* 1. HERO SECTION */}
      <section className="relative bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white pt-12 pb-24 lg:pt-20 lg:pb-32 overflow-hidden">
        {/* Ambient Glows */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none -z-10"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-orange-500/15 rounded-full blur-3xl pointer-events-none -z-10"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            
            {/* Pill Tag */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-800/90 border border-slate-700/80 text-xs font-semibold text-slate-200 mb-6 shadow-inner">
              <Sparkles className="w-4 h-4 text-orange-400" />
              <span>Pune's #1 Outdoor & Digital Billboard Marketplace</span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-tight mb-6">
              Find. Book. <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-indigo-300 to-orange-400">
                Advertise Across Pune.
              </span>
            </h1>

            <p className="text-slate-300 text-base sm:text-lg max-w-2xl mx-auto mb-10 leading-relaxed">
              Book hoardings, unipoles, and high-impact digital LED screens directly from board owners. Transparent duration pricing with backend-enforced zero double bookings.
            </p>

            {/* 2. SEARCH ADVERTISING SPACES WIDGET */}
            <div className="bg-white/95 backdrop-blur-xl p-4 sm:p-5 rounded-3xl shadow-2xl border border-white/20 text-slate-900 max-w-4xl mx-auto text-left">
              <form onSubmit={handleSearch} className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-3 items-center">
                
                {/* Location Select */}
                <div className="p-2.5 rounded-2xl bg-slate-50 border border-slate-200/80 hover:border-blue-500 transition-colors">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5 mb-1">
                    <MapPin className="w-3.5 h-3.5 text-orange-500" />
                    Pune Location
                  </label>
                  <select
                    value={searchArea}
                    onChange={(e) => setSearchArea(e.target.value)}
                    className="w-full bg-transparent text-sm font-semibold text-slate-800 focus:outline-none cursor-pointer"
                  >
                    {puneAreas.map((area) => (
                      <option key={area} value={area}>{area}</option>
                    ))}
                  </select>
                </div>

                {/* Board Type Select */}
                <div className="p-2.5 rounded-2xl bg-slate-50 border border-slate-200/80 hover:border-blue-500 transition-colors">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5 mb-1">
                    <Tv className="w-3.5 h-3.5 text-blue-600" />
                    Display Type
                  </label>
                  <select
                    value={searchType}
                    onChange={(e) => setSearchType(e.target.value)}
                    className="w-full bg-transparent text-sm font-semibold text-slate-800 focus:outline-none cursor-pointer"
                  >
                    <option value="all">All Board Types</option>
                    <option value="hoarding">Traditional Hoardings</option>
                    <option value="LED digital screen">Digital LED Screens</option>
                    <option value="unipole">Unipole Billboards</option>
                    <option value="gantry">Overhead Gantries</option>
                  </select>
                </div>

                {/* Duration Hint */}
                <div className="p-2.5 rounded-2xl bg-slate-50 border border-slate-200/80 hidden lg:block">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5 mb-1">
                    <Calendar className="w-3.5 h-3.5 text-emerald-600" />
                    Duration Pricing
                  </label>
                  <div className="text-xs font-semibold text-slate-700 truncate">
                    Daily, Weekly & Monthly Tiers
                  </div>
                </div>

                {/* Submit Search Button */}
                <button
                  type="submit"
                  className="w-full h-full min-h-[50px] flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-blue-600 to-orange-500 hover:from-blue-500 hover:to-orange-400 active:scale-[0.98] text-white font-bold text-sm shadow-lg shadow-orange-500/20 transition-all cursor-pointer"
                >
                  <Search className="w-4 h-4" />
                  <span>Search Boards</span>
                </button>
              </form>
            </div>

            {/* Quick Metrics Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-12 pt-8 border-t border-slate-800 text-center">
              <div>
                <div className="text-2xl sm:text-3xl font-extrabold text-white">100+</div>
                <div className="text-xs text-slate-400 mt-0.5">Verified Pune Boards</div>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-extrabold text-orange-400">&lt; 5 mins</div>
                <div className="text-xs text-slate-400 mt-0.5">Search to Booking</div>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-extrabold text-blue-400">0</div>
                <div className="text-xs text-slate-400 mt-0.5">Double Bookings</div>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-extrabold text-emerald-400">₹0</div>
                <div className="text-xs text-slate-400 mt-0.5">Middlemen Markups</div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 3. BOARD CATEGORIES */}
      <section className="py-20 bg-slate-50 border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-blue-600 block mb-1">
                Outdoor & Digital Inventory
              </span>
              <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                Explore Advertising Formats
              </h2>
            </div>
            <Link
              to="/explore"
              className="inline-flex items-center gap-1.5 text-sm font-bold text-blue-600 hover:text-blue-700"
            >
              <span>View All 100+ Boards</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {boardCategories.map((cat) => (
              <Link
                key={cat.id}
                to={`/explore?category=${cat.id}`}
                className="group relative rounded-3xl overflow-hidden bg-white border border-slate-200/80 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
              >
                <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
                  <img
                    src={cat.image}
                    alt={cat.name}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-black/20 to-transparent"></div>
                  <span className="absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-bold bg-white/90 text-slate-900 backdrop-blur-md">
                    {cat.count}
                  </span>
                  <div className="absolute bottom-3 left-4 right-4 text-white">
                    <h3 className="text-lg font-bold drop-shadow-sm">{cat.name}</h3>
                  </div>
                </div>

                <div className="p-4 flex-1 flex flex-col justify-between">
                  <p className="text-xs text-slate-600 leading-relaxed mb-3">
                    {cat.description}
                  </p>
                  <span className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 group-hover:text-orange-500 transition-colors">
                    <span>Browse inventory</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 4. FEATURED BOARDS */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-orange-500 mb-1">
                <Zap className="w-3.5 h-3.5" />
                <span>Prime Pune Locations</span>
              </div>
              <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                Featured Advertising Boards
              </h2>
              <p className="text-sm text-slate-500 mt-1">
                High-visibility placements with instant availability checks and transparent duration rates.
              </p>
            </div>

            <Link
              to="/explore"
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow-sm transition-all"
            >
              <span>Explore All Spaces</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {mockBoards.slice(0, 6).map((board) => (
              <BoardCard key={board.id} board={board} />
            ))}
          </div>
        </div>
      </section>

      {/* 5. HOW FLASHADS WORKS */}
      <section className="py-20 bg-slate-900 text-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-orange-400 block mb-2">
              Simple 3-Step Process
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-6">
              How FlashAds Works
            </h2>

            {/* Toggle Switch */}
            <div className="inline-flex p-1 rounded-2xl bg-slate-800 border border-slate-700/80">
              <button
                type="button"
                onClick={() => setWorkTab('client')}
                className={`px-5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  workTab === 'client'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                For Businesses / Clients
              </button>
              <button
                type="button"
                onClick={() => setWorkTab('advertiser')}
                className={`px-5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  workTab === 'advertiser'
                    ? 'bg-orange-500 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                For Board Owners
              </button>
            </div>
          </div>

          {/* Client Steps */}
          {workTab === 'client' ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="p-8 rounded-3xl bg-slate-800/60 border border-slate-700/70 relative">
                <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-400 flex items-center justify-center font-extrabold text-xl mb-6">
                  1
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Search & Compare</h3>
                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                  Browse verified hoardings and digital screens across Pune by area, dimensions, daily traffic count, and live calendar availability.
                </p>
              </div>

              <div className="p-8 rounded-3xl bg-slate-800/60 border border-slate-700/70 relative">
                <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-400 flex items-center justify-center font-extrabold text-xl mb-6">
                  2
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Pick Dates & Quote</h3>
                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                  Select your exact campaign dates. Our duration pricing engine calculates the best combination of monthly, weekly, and daily rates.
                </p>
              </div>

              <div className="p-8 rounded-3xl bg-slate-800/60 border border-slate-700/70 relative">
                <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-400 flex items-center justify-center font-extrabold text-xl mb-6">
                  3
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Book & Go Live</h3>
                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                  Submit a booking request with zero middlemen. The board owner approves directly, locking your dates with guaranteed exclusivity.
                </p>
              </div>
            </div>
          ) : (
            /* Board Owner Steps */
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="p-8 rounded-3xl bg-slate-800/60 border border-slate-700/70 relative">
                <div className="w-12 h-12 rounded-2xl bg-orange-500/10 text-orange-400 flex items-center justify-center font-extrabold text-xl mb-6">
                  1
                </div>
                <h3 className="text-lg font-bold text-white mb-2">List In 10 Minutes</h3>
                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                  Upload photos, set your dimensions, Pune location pin, and configure your daily, weekly, and monthly rate cards.
                </p>
              </div>

              <div className="p-8 rounded-3xl bg-slate-800/60 border border-slate-700/70 relative">
                <div className="w-12 h-12 rounded-2xl bg-orange-500/10 text-orange-400 flex items-center justify-center font-extrabold text-xl mb-6">
                  2
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Admin Fast Approval</h3>
                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                  Our operations team validates your listing for authenticity within hours, putting your board in front of hundreds of active advertisers.
                </p>
              </div>

              <div className="p-8 rounded-3xl bg-slate-800/60 border border-slate-700/70 relative">
                <div className="w-12 h-12 rounded-2xl bg-orange-500/10 text-orange-400 flex items-center justify-center font-extrabold text-xl mb-6">
                  3
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Approve & Fill Inventory</h3>
                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                  Receive direct booking requests on your dashboard. Say yes with 1-click and enjoy higher year-round occupancy.
                </p>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* 6. WHY FLASHADS */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600 block mb-2">
              Why FlashAds
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Solving Outdoor Advertising From the Ground Up
            </h2>
            <p className="text-sm text-slate-600 mt-2">
              No more vague phone calls, WhatsApp negotiation threads, or double-booked hoardings.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-6">
                <DollarSign className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Dynamic Duration Pricing</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Smart mathematical tier calculation automatically picks the cheapest combination of months, weeks, and days for your exact dates.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-2xl bg-orange-50 text-orange-600 flex items-center justify-center mb-6">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Zero Double Bookings</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Backend-enforced concurrency guarantees that overlapping dates cannot be booked simultaneously by two advertisers.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-6">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">100% Admin Verified</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Every listing is inspected for verified coordinates, clear high-resolution photos, and ownership legitimacy before going public.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 7. FOR ADVERTISERS & 8. FOR BUSINESSES */}
      <section className="py-20 bg-white border-t border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            {/* For Businesses / Clients */}
            <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-br from-blue-900 to-slate-900 text-white shadow-xl relative overflow-hidden">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-bold mb-6">
                <Building2 className="w-3.5 h-3.5" />
                <span>For Businesses & Brands</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold tracking-tight mb-4">
                Launch High-Impact Campaigns in Minutes
              </h3>
              <p className="text-slate-300 text-xs sm:text-sm mb-6 leading-relaxed">
                Whether you are an edtech institute on FC Road or a startup in Hinjewadi, discover prime billboards with transparent pricing and live date reservations.
              </p>

              <ul className="space-y-3 text-xs sm:text-sm text-slate-200 mb-8">
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-orange-400 shrink-0" />
                  <span>Instant quotes without waiting for broker callbacks</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-orange-400 shrink-0" />
                  <span>Filter by daily impressions, traffic level, and size</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-orange-400 shrink-0" />
                  <span>Track booking requests and live dates in one dashboard</span>
                </li>
              </ul>

              <Link
                to="/explore"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-500 hover:bg-blue-400 active:scale-95 text-white text-xs font-bold shadow-lg shadow-blue-500/30 transition-all"
              >
                <span>Find Boards to Book</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* For Board Owners / Advertisers */}
            <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900 to-orange-950 text-white shadow-xl relative overflow-hidden">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/20 text-orange-300 text-xs font-bold mb-6">
                <Tv className="w-3.5 h-3.5" />
                <span>For Board & Screen Owners</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold tracking-tight mb-4">
                Maximize Occupancy & Eliminate Idle Days
              </h3>
              <p className="text-slate-300 text-xs sm:text-sm mb-6 leading-relaxed">
                Turn your outdoor hoardings and LED screens into a 24/7 self-service digital storefront. Receive qualified requests and manage bookings seamlessly.
              </p>

              <ul className="space-y-3 text-xs sm:text-sm text-slate-200 mb-8">
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Zero broker commissions on your listings</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Calendar engine that automatically prevents overlap</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>1-click Approve / Reject with full schedule control</span>
                </li>
              </ul>

              <Link
                to="/register?role=advertiser"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-400 active:scale-95 text-white text-xs font-bold shadow-lg shadow-orange-500/30 transition-all"
              >
                <span>List Your Space Now</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

          </div>
        </div>
      </section>

      {/* 9. TESTIMONIALS */}
      <section className="py-20 bg-slate-50 border-t border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-orange-500 block mb-2">
              Trusted Across Pune
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              What Advertisers & Owners Say
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-1 text-amber-400 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400" />
                  ))}
                </div>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed italic mb-6">
                  "We booked a 15-day pre-admission campaign near Ferguson College in under 5 minutes. The transparent rate saved us at least ₹20,000 compared to traditional broker quotes."
                </p>
              </div>
              <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
                <div className="w-10 h-10 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-sm">
                  RK
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Rahul Kulkarni</h4>
                  <p className="text-[11px] text-slate-500">Director, Pune Academy of Sciences</p>
                </div>
              </div>
            </div>

            <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-1 text-amber-400 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400" />
                  ))}
                </div>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed italic mb-6">
                  "I manage 4 hoardings in Hinjewadi. FlashAds stopped the endless WhatsApp calls and double bookings. I get clear requests with exact dates and approved prices directly."
                </p>
              </div>
              <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
                <div className="w-10 h-10 rounded-full bg-orange-500 text-white font-bold flex items-center justify-center text-sm">
                  MD
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Meena Deshmukh</h4>
                  <p className="text-[11px] text-slate-500">Owner, Hinjewadi Prime Media</p>
                </div>
              </div>
            </div>

            <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-1 text-amber-400 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400" />
                  ))}
                </div>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed italic mb-6">
                  "Being able to see real photos, accurate dimensions, and exact GPS coordinates on Leaflet before spending money is a total game changer for Pune startup marketing."
                </p>
              </div>
              <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
                <div className="w-10 h-10 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center text-sm">
                  AS
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Amit Shinde</h4>
                  <p className="text-[11px] text-slate-500">Head of Growth, QuickDine</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
