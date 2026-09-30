import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Zap, 
  Tv, 
  Building2, 
  Calendar, 
  ShieldCheck, 
  Calculator, 
  CheckCircle2, 
  ArrowRight,
  HelpCircle,
  Clock,
  Layers,
  Sparkles
} from 'lucide-react';

export default function HowItWorks() {
  const [activeRole, setActiveRole] = useState('client');
  const [faqOpen, setFaqOpen] = useState(null);

  const toggleFaq = (idx) => {
    setFaqOpen(faqOpen === idx ? null : idx);
  };

  const faqs = [
    {
      q: 'How does the duration pricing engine calculate costs?',
      a: 'The engine uses a tiered algorithm: 30 days = 1 month, 7 days = 1 week, and remaining days are charged daily. Lower tiers are capped so you never pay more than the higher tier (e.g. 6 days never exceeds the 1-week price).'
    },
    {
      q: 'How does FlashAds prevent double bookings?',
      a: 'When an advertiser approves a booking, our backend validates interval collision [startA < endB && startB < endA] inside a transaction. Approved bookings lock the calendar immediately.'
    },
    {
      q: 'Are all boards on FlashAds verified?',
      a: 'Yes. Every single board submitted by an owner is individually reviewed and approved by the FlashAds moderation team before becoming public.'
    },
    {
      q: 'Can digital LED screens be booked for specific time slots?',
      a: 'Yes! Digital DOOH screens can be scheduled by spot length (e.g. 10s, 15s) and frequency per hour.'
    }
  ];

  return (
    <div className="bg-slate-50 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-xs font-bold text-blue-700 mb-4">
            <Sparkles className="w-3.5 h-3.5 text-orange-500" />
            <span>Marketplace Mechanics</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight mb-4">
            How FlashAds Works
          </h1>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            The modern, transparent way to book outdoor and digital advertising inventory across Pune in under 5 minutes.
          </p>

          {/* Role Switcher */}
          <div className="mt-8 inline-flex p-1.5 rounded-2xl bg-white border border-slate-200 shadow-sm">
            <button
              onClick={() => setActiveRole('client')}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold transition-all ${
                activeRole === 'client'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Building2 className="w-4 h-4" />
              <span>I Want to Advertise (Business)</span>
            </button>
            <button
              onClick={() => setActiveRole('advertiser')}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold transition-all ${
                activeRole === 'advertiser'
                  ? 'bg-orange-500 text-white shadow-md'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Tv className="w-4 h-4" />
              <span>I Own Boards (Owner)</span>
            </button>
          </div>
        </div>

        {/* Step-by-Step Flow */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          {activeRole === 'client' ? (
            <>
              <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-sm relative">
                <span className="w-10 h-10 rounded-2xl bg-blue-600 text-white font-extrabold flex items-center justify-center text-sm mb-6">
                  01
                </span>
                <h3 className="text-lg font-bold text-slate-900 mb-2">Explore & Filter</h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-4">
                  Search across Pune's top junctions (Hinjewadi, FC Road, Viman Nagar, Kothrud). Compare traffic volume, dimensions, and live photos.
                </p>
                <div className="p-3 bg-slate-50 rounded-xl text-xs text-slate-500 font-medium">
                  ✓ Verified GPS coordinates with OpenStreetMap
                </div>
              </div>

              <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-sm relative">
                <span className="w-10 h-10 rounded-2xl bg-blue-600 text-white font-extrabold flex items-center justify-center text-sm mb-6">
                  02
                </span>
                <h3 className="text-lg font-bold text-slate-900 mb-2">Pick Dates & Live Quote</h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-4">
                  Choose your start and end dates. Our server instantly quotes the cheapest rate using automated daily, weekly, and monthly discounts.
                </p>
                <div className="p-3 bg-slate-50 rounded-xl text-xs text-slate-500 font-medium">
                  ✓ Duration price engine with automatic capping
                </div>
              </div>

              <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-sm relative">
                <span className="w-10 h-10 rounded-2xl bg-blue-600 text-white font-extrabold flex items-center justify-center text-sm mb-6">
                  03
                </span>
                <h3 className="text-lg font-bold text-slate-900 mb-2">Request & Lock Dates</h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-4">
                  Submit with 1-click. The board owner approves directly through their portal, locking your dates with 0 double bookings.
                </p>
                <div className="p-3 bg-slate-50 rounded-xl text-xs text-slate-500 font-medium">
                  ✓ In-app status tracking & direct owner messaging
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-sm relative">
                <span className="w-10 h-10 rounded-2xl bg-orange-500 text-white font-extrabold flex items-center justify-center text-sm mb-6">
                  01
                </span>
                <h3 className="text-lg font-bold text-slate-900 mb-2">Create Board Listing</h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-4">
                  Add photos, dimensions, traffic level, and set your own daily, weekly, and monthly rate cards in under 10 minutes.
                </p>
                <div className="p-3 bg-slate-50 rounded-xl text-xs text-slate-500 font-medium">
                  ✓ Multi-image Cloudinary CDN upload
                </div>
              </div>

              <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-sm relative">
                <span className="w-10 h-10 rounded-2xl bg-orange-500 text-white font-extrabold flex items-center justify-center text-sm mb-6">
                  02
                </span>
                <h3 className="text-lg font-bold text-slate-900 mb-2">Admin Fast Moderation</h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-4">
                  Our operations team reviews the listing to ensure legitimate details, putting your board in front of verified clients.
                </p>
                <div className="p-3 bg-slate-50 rounded-xl text-xs text-slate-500 font-medium">
                  ✓ Quality badge & public marketplace launch
                </div>
              </div>

              <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-sm relative">
                <span className="w-10 h-10 rounded-2xl bg-orange-500 text-white font-extrabold flex items-center justify-center text-sm mb-6">
                  03
                </span>
                <h3 className="text-lg font-bold text-slate-900 mb-2">Accept Booking Requests</h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-4">
                  Receive qualified client requests. Approve or reject with one button. The platform automatically blocks out booked dates.
                </p>
                <div className="p-3 bg-slate-50 rounded-xl text-xs text-slate-500 font-medium">
                  ✓ Automated calendar collision protection
                </div>
              </div>
            </>
          )}
        </div>

        {/* Pricing Engine Spotlight */}
        <div className="p-8 sm:p-12 rounded-3xl bg-slate-900 text-white shadow-2xl mb-20">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-bold mb-4">
              <Calculator className="w-3.5 h-3.5" />
              <span>Smart Duration Engine</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-4">
              How the Duration Pricing Engine Works
            </h2>
            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed mb-6">
              Instead of flat daily rates, FlashAds evaluates duration in days (D) and applies tiered month ($m$) and week ($w$) packs with automated remainder optimization:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-mono bg-slate-950 p-4 rounded-2xl border border-slate-800 mb-6">
              <div>
                <span className="text-slate-500 block">Months Pack</span>
                <span className="text-orange-400 font-bold">m = floor(D / 30)</span>
              </div>
              <div>
                <span className="text-slate-500 block">Weeks Pack</span>
                <span className="text-blue-400 font-bold">w = floor((D - 30m) / 7)</span>
              </div>
              <div>
                <span className="text-slate-500 block">Remainder Days</span>
                <span className="text-emerald-400 font-bold">r = D - 30m - 7w</span>
              </div>
            </div>

            <p className="text-xs text-slate-400">
              * Tier capping rule: 6 days at ₹1,000/day costs ₹6,000 (1 week price), saving advertisers from punitive daily multiples.
            </p>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <h3 className="text-2xl font-bold text-slate-900">Frequently Asked Questions</h3>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">Everything you need to know about booking outdoor media.</p>
          </div>

          <div className="space-y-4">
            {faqs.map((item, idx) => (
              <div key={idx} className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
                <button
                  type="button"
                  onClick={() => toggleFaq(idx)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 font-bold text-slate-900 text-sm hover:bg-slate-50 transition-colors"
                >
                  <span>{item.q}</span>
                  <span className="text-blue-600 shrink-0 text-lg">
                    {faqOpen === idx ? '−' : '+'}
                  </span>
                </button>
                {faqOpen === idx && (
                  <div className="p-5 pt-0 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 bg-slate-50/50">
                    {item.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
