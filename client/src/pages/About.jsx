import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Zap, 
  Target, 
  Users, 
  ShieldCheck, 
  MapPin, 
  Award, 
  Sparkles,
  ArrowRight
} from 'lucide-react';

export default function About() {
  return (
    <div className="bg-slate-50 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-50 border border-orange-200 text-xs font-bold text-orange-600 mb-4">
            <Zap className="w-3.5 h-3.5" />
            <span>Our Mission</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight mb-4">
            Democratizing Outdoor Advertising Across India
          </h1>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            FlashAds was founded with a single purpose: make booking billboards as transparent, fast, and reliable as booking an airline seat or hotel room.
          </p>
        </div>

        {/* Story Card */}
        <div className="p-8 sm:p-12 rounded-3xl bg-white border border-slate-200 shadow-sm mb-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-blue-600 block mb-2">
                The FlashAds Story
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-4">
                Born in Pune, Built for High-Impact Brands
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-4">
                For decades, outdoor advertising has been locked behind opaque phone calls, fragmented broker networks, handwritten diary bookings, and unpredictable rate markups. Small and medium businesses spent weeks just trying to discover if a hoarding on FC Road or Hinjewadi was free.
              </p>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-6">
                FlashAds eliminates these inefficiencies through a modern, two-sided digital marketplace. We give board owners an automated management system with zero double bookings, while enabling businesses to search, price, and request high-visibility advertising space in under 5 minutes.
              </p>

              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-100">
                <div>
                  <div className="text-2xl font-extrabold text-blue-600">100%</div>
                  <div className="text-xs text-slate-500">Admin-Moderated Listings</div>
                </div>
                <div>
                  <div className="text-2xl font-extrabold text-orange-500">&lt; 5 mins</div>
                  <div className="text-xs text-slate-500">Average Time to Request</div>
                </div>
              </div>
            </div>

            <div className="rounded-2xl overflow-hidden shadow-xl border border-slate-200 aspect-[4/3] bg-slate-900 relative">
              <img
                src="https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1000&q=80"
                alt="Digital billboard in city"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent flex items-end p-6">
                <div className="text-white">
                  <div className="text-xs font-semibold text-orange-400">Pune Tech Hub</div>
                  <div className="text-sm font-bold">Connecting Local Businesses with Premium OOH & DOOH</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Core Values */}
        <div className="mb-20">
          <div className="text-center max-w-xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600 block mb-1">
              What We Stand For
            </span>
            <h3 className="text-2xl sm:text-3xl font-bold text-slate-900">Our Core Principles</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-slate-900 mb-2">Absolute Transparency</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                No hidden broker commissions or surprise surcharges. What you see on the board rate card is what you pay.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center mb-4">
                <Zap className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-slate-900 mb-2">Technological Precision</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                From server-enforced availability calculations to OpenStreetMap coordinates, we engineer out human error and double bookings.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
                <Users className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-slate-900 mb-2">Fairness for All Sizes</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Whether booking a 3-day weekend promotion or a 6-month enterprise campaign, every business gets access to prime advertising space.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
